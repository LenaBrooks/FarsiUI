/**
 * Rename chart2 demo ids/files to kebab-case of Recharts index keys.
 * English titles stay exactly as Recharts `name`.
 * Path: examples/chart2/{category}/{kebab-key}.tsx
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")
const indexesDir = path.join(root, "scripts/recharts-indexes")
const catalogPath = path.join(root, "lib/chart2-examples.json")
const demosPath = path.join(root, "lib/chart2-demos.ts")
const examplesRoot = path.join(root, "examples/chart2")
const syncPath = path.join(root, "scripts/sync-chart2-catalog.mjs")

const CATEGORIES = [
  { id: "line", title: "خطی", en: "LineChart", folder: "LineChart" },
  { id: "area", title: "ناحیه‌ای", en: "AreaChart", folder: "AreaChart" },
  { id: "bar", title: "میله‌ای", en: "BarChart", folder: "BarChart" },
  { id: "composed", title: "ترکیبی", en: "ComposedChart", folder: "ComposedChart" },
  { id: "scatter", title: "پراکندگی", en: "ScatterChart", folder: "ScatterChart" },
  { id: "pie", title: "دایره‌ای", en: "PieChart", folder: "PieChart" },
  { id: "radar", title: "راداری", en: "RadarChart", folder: "RadarChart" },
  { id: "radial-bar", title: "میله شعاعی", en: "RadialBarChart", folder: "RadialBarChart" },
  { id: "treemap", title: "درخت‌نقشه", en: "TreeMap", folder: "TreeMap" },
  { id: "sunburst", title: "خورشیدسان", en: "SunburstChart", folder: "SunburstChart" },
  { id: "tooltip", title: "تولتیپ", en: "Tooltip", folder: "Tooltip" },
  { id: "legend", title: "راهنما", en: "Legend", folder: "Legend" },
  { id: "responsive", title: "واکنش‌گرا", en: "ResponsiveContainer", folder: "ResponsiveContainer" },
]

const oldCatalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"))
const faByEn = new Map(oldCatalog.examples.map((e) => [e.en, e.title]))

function toKebab(name) {
  return name
    .replace(/Example$/, "")
    .replace(/Demo$/, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase()
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

function parseIndex(folder) {
  const text = fs.readFileSync(path.join(indexesDir, `${folder}.ts`), "utf8")
  const items = []
  const re = /(\w+)\s*:\s*\{[\s\S]*?name:\s*'([^']+)'/g
  let m
  while ((m = re.exec(text))) items.push({ key: m[1], en: m[2] })
  return items
}

const catalog = {
  categories: CATEGORIES.map(({ id, title, en }) => ({ id, title, en })),
  examples: [],
}

const idByKey = {}
const usedIds = new Set()
let renameCount = 0
const missing = []

for (const cat of CATEGORIES) {
  for (const { key, en } of parseIndex(cat.folder)) {
    let id = toKebab(key)
    if (usedIds.has(id)) id = `${cat.id}-${id}`
    if (usedIds.has(id)) throw new Error(`id collision: ${id} (${key})`)
    usedIds.add(id)
    idByKey[key] = id

    const oldId = oldCatalog.examples.find(
      (e) => e.category === cat.id && e.en === en
    )?.id

    const dir = path.join(examplesRoot, cat.id)
    fs.mkdirSync(dir, { recursive: true })
    const newFile = path.join(dir, `${id}.tsx`)

    if (oldId && oldId !== id) {
      const oldFile = path.join(dir, `${oldId}.tsx`)
      if (fs.existsSync(oldFile)) {
        if (fs.existsSync(newFile)) {
          fs.unlinkSync(oldFile)
          console.warn(`removed duplicate old ${cat.id}/${oldId}.tsx (kept ${id})`)
        } else {
          fs.renameSync(oldFile, newFile)
          console.log(`rename ${cat.id}/${oldId}.tsx -> ${id}.tsx`)
        }
        renameCount++
      } else if (!fs.existsSync(newFile)) {
        missing.push(`${cat.id}/${id}.tsx (was ${oldId}, key ${key})`)
      }
    } else if (!fs.existsSync(newFile)) {
      missing.push(`${cat.id}/${id}.tsx (key ${key})`)
    }

    catalog.examples.push({
      id,
      title: faByEn.get(en) || `نمودار ${en}`,
      en,
      category: cat.id,
    })
  }
}

if (missing.length) {
  console.error("MISSING FILES:")
  for (const m of missing) console.error(" ", m)
  process.exit(1)
}

fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + "\n")

fs.writeFileSync(
  demosPath,
  `import type { ComponentType } from "react"

export type Chart2DemoLoader = () => Promise<{
  default: ComponentType<Record<string, unknown>>
}>

/** Relative to apps/v4 — use with fs from the view RSC page. */
export const chart2DemoSourcePath: Record<string, string> = {
${catalog.examples
  .map((e) => `  "${e.id}": "examples/chart2/${e.category}/${e.id}.tsx",`)
  .join("\n")}
}

export const chart2DemoLoaders: Record<string, Chart2DemoLoader> = {
${catalog.examples
  .map(
    (e) =>
      `  "${e.id}": () => import("@/examples/chart2/${e.category}/${e.id}"),`
  )
  .join("\n")}
}

export function getChart2DemoSourcePath(id: string) {
  return chart2DemoSourcePath[id]
}

export function getChart2DemoLoader(id: string) {
  return chart2DemoLoaders[id]
}
`
)

if (fs.existsSync(syncPath)) {
  let sync = fs.readFileSync(syncPath, "utf8")
  const entries = Object.entries(idByKey)
    .map(([k, v]) => `  ${k}: "${v}",`)
    .join("\n")
  const nextBlock = `const ID_BY_KEY = {\n${entries}\n}`
  if (/const ID_BY_KEY = \{[\s\S]*?\n\}/.test(sync)) {
    sync = sync.replace(/const ID_BY_KEY = \{[\s\S]*?\n\}/, nextBlock)
    fs.writeFileSync(syncPath, sync)
    console.log("updated sync-chart2-catalog.mjs ID_BY_KEY")
  }
}

console.log(`\nDone: ${catalog.examples.length} examples, ${renameCount} renames`)
for (const e of catalog.examples.slice(0, 8)) {
  console.log(`  ${e.en}  =>  ${e.id}`)
}
