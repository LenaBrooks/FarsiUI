/**
 * Import unique shadcn /charts demos into chart2 gallery (skip obvious duplicates).
 * Usage: node apps/v4/scripts/import-shadcn-charts-to-gallery.mjs
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")
const srcDir = path.join(root, "registry/new-york-v4/charts")
const examplesRoot = path.join(root, "examples/chart2")
const catalogPath = path.join(root, "lib/chart2-examples.json")
const demosPath = path.join(root, "lib/chart2-demos.ts")

/** Only keep charts that add a distinct pattern vs existing gallery. */
const IMPORTS = [
  {
    src: "chart-area-interactive.tsx",
    id: "area-interactive",
    category: "area",
    title: "ناحیه‌ای تعاملی",
    en: "Interactive Area",
  },
  {
    src: "chart-area-step.tsx",
    id: "area-step",
    category: "area",
    title: "ناحیه‌ای پله‌ای",
    en: "Step Area",
  },
  {
    src: "chart-area-gradient.tsx",
    id: "area-gradient",
    category: "area",
    title: "ناحیه‌ای با گرادیان",
    en: "Gradient Area",
  },
  {
    src: "chart-bar-interactive.tsx",
    id: "bar-interactive",
    category: "bar",
    title: "میله‌ای تعاملی",
    en: "Interactive Bar",
  },
  {
    src: "chart-bar-horizontal.tsx",
    id: "bar-horizontal",
    category: "bar",
    title: "میله‌ای افقی",
    en: "Horizontal Bar",
  },
  {
    src: "chart-bar-active.tsx",
    id: "bar-active",
    category: "bar",
    title: "میله فعال",
    en: "Active Bar",
  },
  {
    src: "chart-line-interactive.tsx",
    id: "line-interactive",
    category: "line",
    title: "خطی تعاملی",
    en: "Interactive Line",
  },
  {
    src: "chart-line-step.tsx",
    id: "line-step",
    category: "line",
    title: "خطی پله‌ای",
    en: "Step Line",
  },
  {
    src: "chart-pie-donut-text.tsx",
    id: "pie-donut-text",
    category: "pie",
    title: "دونات با متن مرکزی",
    en: "Donut with Text",
  },
  {
    src: "chart-pie-interactive.tsx",
    id: "pie-interactive",
    category: "pie",
    title: "دایره‌ای تعاملی",
    en: "Interactive Pie",
  },
  {
    src: "chart-pie-stacked.tsx",
    id: "pie-stacked",
    category: "pie",
    title: "دایره‌ای انباشته",
    en: "Stacked Pie",
  },
  {
    src: "chart-radar-lines-only.tsx",
    id: "radar-lines-only",
    category: "radar",
    title: "راداری فقط خط",
    en: "Radar Lines Only",
  },
  {
    src: "chart-radar-icons.tsx",
    id: "radar-icons",
    category: "radar",
    title: "راداری با آیکون",
    en: "Radar Icons",
  },
  {
    src: "chart-radar-multiple.tsx",
    id: "radar-multiple",
    category: "radar",
    title: "راداری چندسری",
    en: "Radar Multiple",
  },
  {
    src: "chart-radial-text.tsx",
    id: "radial-text",
    category: "radial-bar",
    title: "میله شعاعی با متن",
    en: "Radial Text",
  },
  {
    src: "chart-radial-shape.tsx",
    id: "radial-shape",
    category: "radial-bar",
    title: "میله شعاعی با شکل",
    en: "Radial Shape",
  },
  {
    src: "chart-radial-stacked.tsx",
    id: "radial-stacked",
    category: "radial-bar",
    title: "میله شعاعی انباشته",
    en: "Radial Stacked",
  },
  {
    src: "chart-tooltip-advanced.tsx",
    id: "tooltip-advanced",
    category: "tooltip",
    title: "تولتیپ پیشرفته",
    en: "Advanced Tooltip",
  },
]

function stripCardChrome(source) {
  let s = source
  // Only the card import line(s) — do not span earlier imports.
  s = s.replace(
    /^import\s*\{[^}]*\}\s*from\s*"@\/registry\/new-york-v4\/ui\/card"\s*\n/m,
    ""
  )
  // Drop marketing chrome; keep interactive controls inside former headers.
  s = s.replace(/<CardTitle>[\s\S]*?<\/CardTitle>\s*/g, "")
  s = s.replace(/<CardDescription>[\s\S]*?<\/CardDescription>\s*/g, "")
  s = s.replace(/<CardFooter[\s\S]*?<\/CardFooter>\s*/g, "")
  s = s.replace(/<CardHeader\b/g, "<div")
  s = s.replace(/<\/CardHeader>/g, "</div>")
  s = s.replace(/<CardContent\b[^>]*>\s*/g, "")
  s = s.replace(/<\/CardContent>\s*/g, "")
  // Keep a width-bearing wrapper so ChartContainer aspect-video does not collapse.
  s = s.replace(/<Card\b([^>]*)>/g, (_, attrs) => {
    if (/\bclassName=/.test(attrs)) {
      return `<div${attrs.replace(/className="([^"]*)"/, 'className="w-full $1"')}>`
    }
    return `<div${attrs} className="w-full">`
  })
  s = s.replace(/<\/Card>/g, "</div>")
  s = s.replace(/export function (\w+)/, "export default function $1")
  return s
}

function rebuildDemosTs(examples) {
  const paths = examples
    .map(
      (e) =>
        `  "${e.id}": "examples/chart2/${e.category}/${e.id}.tsx",`
    )
    .join("\n")
  const loaders = examples
    .map(
      (e) =>
        `  "${e.id}": () => import("@/examples/chart2/${e.category}/${e.id}"),`
    )
    .join("\n")

  return `import type { ComponentType } from "react"

export type Chart2DemoLoader = () => Promise<{
  default: ComponentType<Record<string, unknown>>
}>

/** Relative to apps/v4 — use with fs from the view RSC page. */
export const chart2DemoSourcePath: Record<string, string> = {
${paths}
}

export const chart2DemoLoaders: Record<string, Chart2DemoLoader> = {
${loaders}
}

export function getChart2DemoSourcePath(id: string) {
  return chart2DemoSourcePath[id]
}

export function getChart2DemoLoader(id: string) {
  return chart2DemoLoaders[id]
}
`
}

const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"))
const existingIds = new Set(catalog.examples.map((e) => e.id))
let added = 0

for (const item of IMPORTS) {
  if (existingIds.has(item.id)) {
    console.log(`skip existing ${item.id}`)
    continue
  }
  const from = path.join(srcDir, item.src)
  if (!fs.existsSync(from)) {
    console.warn(`missing source ${item.src}`)
    continue
  }
  const raw = fs.readFileSync(from, "utf8")
  const out = stripCardChrome(raw)
  const dir = path.join(examplesRoot, item.category)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, `${item.id}.tsx`), out, "utf8")

  // Insert after last example of same category (or append)
  let insertAt = catalog.examples.length
  for (let i = catalog.examples.length - 1; i >= 0; i--) {
    if (catalog.examples[i].category === item.category) {
      insertAt = i + 1
      break
    }
  }
  catalog.examples.splice(insertAt, 0, {
    id: item.id,
    title: item.title,
    en: item.en,
    category: item.category,
  })
  existingIds.add(item.id)
  added++
  console.log(`+ ${item.category}/${item.id}`)
}

fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + "\n", "utf8")
fs.writeFileSync(demosPath, rebuildDemosTs(catalog.examples), "utf8")
console.log(`Done. Added ${added} charts. Catalog + demos updated.`)
