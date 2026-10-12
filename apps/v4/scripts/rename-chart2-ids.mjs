/**
 * Rename chart2 example ids to `{category}-{short}` (e.g. line-simple)
 * and update files + demos map accordingly.
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")
const catalogPath = path.join(root, "lib/chart2-examples.json")
const demosPath = path.join(root, "lib/chart2-demos.ts")
const examplesRoot = path.join(root, "examples/chart2")

const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"))

function toShortId(category, oldId) {
  let s = oldId
  // drop trailing -chart / -charts
  s = s.replace(/-charts?$/i, "")
  // drop category token anywhere as whole segment
  const cat = category.replace(/-/g, "[-]?")
  s = s
    .split("-")
    .filter((part) => part && part !== category && part !== "chart" && part !== "charts")
    .join("-")
  // special: radial-bar category segments
  if (category === "radial-bar") {
    s = oldId
      .replace(/-charts?$/i, "")
      .replace(/^radial-bar-chart-?/, "")
      .replace(/^radial-bar-/, "")
      .replace(/^simple-radial-bar$/, "simple")
      .replace(/-click-to-focus-legend$/, "-click-focus-legend")
    if (!s || s === oldId) {
      s = oldId
        .replace(/-charts?$/i, "")
        .split("-")
        .filter((p) => !["radial", "bar", "chart"].includes(p))
        .join("-")
    }
  }
  if (!s) s = "default"
  return `${category}-${s}`
}

const renames = []
const used = new Set()

for (const ex of catalog.examples) {
  const next = toShortId(ex.category, ex.id)
  let id = next
  let i = 2
  while (used.has(id)) {
    id = `${next}-${i++}`
  }
  used.add(id)
  if (id !== ex.id) {
    renames.push({ from: ex.id, to: id, category: ex.category })
  }
  ex.id = id
}

// rename files on disk
for (const { from, to, category } of renames) {
  const dir = path.join(examplesRoot, category)
  const fromPath = path.join(dir, `${from}.tsx`)
  const toPath = path.join(dir, `${to}.tsx`)
  if (fs.existsSync(fromPath)) {
    fs.renameSync(fromPath, toPath)
    console.log(`file ${category}/${from}.tsx -> ${to}.tsx`)
  } else {
    console.warn(`missing file ${fromPath}`)
  }
}

fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + "\n")

// rebuild demos map from catalog + files
const demoEntries = catalog.examples.map((ex) => ({
  id: ex.id,
  importPath: `@/examples/chart2/${ex.category}/${ex.id}`,
  sourcePath: `examples/chart2/${ex.category}/${ex.id}.tsx`,
}))

const demosTs = `import type { ComponentType } from "react"

export type Chart2DemoLoader = () => Promise<{
  default: ComponentType<Record<string, unknown>>
}>

/** Relative to apps/v4 — use with fs from the view RSC page. */
export const chart2DemoSourcePath: Record<string, string> = {
${demoEntries.map((e) => `  "${e.id}": "${e.sourcePath}",`).join("\n")}
}

export const chart2DemoLoaders: Record<string, Chart2DemoLoader> = {
${demoEntries
  .map((e) => `  "${e.id}": () => import("${e.importPath}"),`)
  .join("\n")}
}

export function getChart2DemoSourcePath(id: string) {
  return chart2DemoSourcePath[id]
}

export function getChart2DemoLoader(id: string) {
  return chart2DemoLoaders[id]
}
`

fs.writeFileSync(demosPath, demosTs)

console.log(`\nrenamed ${renames.length} ids`)
console.log(
  renames
    .filter((r) => r.category === "line")
    .map((r) => `${r.from} -> ${r.to}`)
    .join("\n")
)
