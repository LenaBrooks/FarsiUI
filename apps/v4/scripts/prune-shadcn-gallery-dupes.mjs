/**
 * Drop redundant shadcn gallery imports (micro variants / overlaps).
 * Usage: node apps/v4/scripts/prune-shadcn-gallery-dupes.mjs
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")

/** Distinctive demos to keep in /charts gallery. */
const KEEP = new Set([
  "area-interactive",
  "area-step",
  "area-gradient",
  "bar-interactive",
  "bar-horizontal",
  "bar-active",
  "line-interactive",
  "line-step",
  "pie-donut-text",
  "pie-interactive",
  "pie-stacked",
  "radar-multiple",
  "radar-icons",
  "radar-lines-only",
  "radial-stacked",
  "radial-text",
  "radial-shape",
  "tooltip-advanced",
])

const ALL_IMPORTED = [
  "area-interactive",
  "area-step",
  "area-icons",
  "area-gradient",
  "area-axes",
  "bar-interactive",
  "bar-horizontal",
  "bar-label",
  "bar-active",
  "line-interactive",
  "line-step",
  "line-dots-colors",
  "pie-donut",
  "pie-donut-active",
  "pie-donut-text",
  "pie-separator-none",
  "pie-interactive",
  "pie-stacked",
  "pie-label-list",
  "radar-dots",
  "radar-lines-only",
  "radar-grid-circle",
  "radar-grid-circle-fill",
  "radar-grid-fill",
  "radar-grid-none",
  "radar-icons",
  "radar-multiple",
  "radar-legend",
  "radial-label",
  "radial-grid",
  "radial-text",
  "radial-shape",
  "radial-stacked",
  "tooltip-indicator-line",
  "tooltip-indicator-none",
  "tooltip-label-formatter",
  "tooltip-formatter",
  "tooltip-icons",
  "tooltip-advanced",
]

const CATEGORY = {
  "area-icons": "area",
  "area-axes": "area",
  "bar-label": "bar",
  "line-dots-colors": "line",
  "pie-donut": "pie",
  "pie-donut-active": "pie",
  "pie-separator-none": "pie",
  "pie-label-list": "pie",
  "radar-dots": "radar",
  "radar-grid-circle": "radar",
  "radar-grid-circle-fill": "radar",
  "radar-grid-fill": "radar",
  "radar-grid-none": "radar",
  "radar-legend": "radar",
  "radial-label": "radial-bar",
  "radial-grid": "radial-bar",
  "tooltip-indicator-line": "tooltip",
  "tooltip-indicator-none": "tooltip",
  "tooltip-label-formatter": "tooltip",
  "tooltip-formatter": "tooltip",
  "tooltip-icons": "tooltip",
}

const REMOVE = ALL_IMPORTED.filter((id) => !KEEP.has(id))

const catalogPath = path.join(root, "lib/Chart-examples.json")
const demosPath = path.join(root, "lib/Chart-demos.ts")
const importScriptPath = path.join(
  root,
  "scripts/import-shadcn-charts-to-gallery.mjs"
)

const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"))
const before = catalog.examples.length
catalog.examples = catalog.examples.filter((e) => !REMOVE.includes(e.id))
fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + "\n")

let demos = fs.readFileSync(demosPath, "utf8")
for (const id of REMOVE) {
  demos = demos.replace(new RegExp(`^\\s*"${id}":.*\\n`, "gm"), "")
}
fs.writeFileSync(demosPath, demos)

const deleted = []
for (const id of REMOVE) {
  const cat = CATEGORY[id]
  if (!cat) continue
  const file = path.join(root, "examples/Chart", cat, `${id}.tsx`)
  if (fs.existsSync(file)) {
    fs.unlinkSync(file)
    deleted.push(path.relative(root, file))
  }
}

// Slim IMPORTS in the import script to the kept set only.
let importSrc = fs.readFileSync(importScriptPath, "utf8")
const keepComment = `/** Only keep charts that add a distinct pattern vs existing gallery. */`
const start = importSrc.indexOf("const IMPORTS = [")
const end = importSrc.indexOf("\n]", start)
if (start === -1 || end === -1) {
  throw new Error("Could not locate IMPORTS array in import script")
}

const keptEntries = [
  ["chart-area-interactive.tsx", "area-interactive", "area", "ناحیه‌ای تعاملی", "Interactive Area"],
  ["chart-area-step.tsx", "area-step", "area", "ناحیه‌ای پله‌ای", "Step Area"],
  ["chart-area-gradient.tsx", "area-gradient", "area", "ناحیه‌ای با گرادیان", "Gradient Area"],
  ["chart-bar-interactive.tsx", "bar-interactive", "bar", "میله‌ای تعاملی", "Interactive Bar"],
  ["chart-bar-horizontal.tsx", "bar-horizontal", "bar", "میله‌ای افقی", "Horizontal Bar"],
  ["chart-bar-active.tsx", "bar-active", "bar", "میله فعال", "Active Bar"],
  ["chart-line-interactive.tsx", "line-interactive", "line", "خطی تعاملی", "Interactive Line"],
  ["chart-line-step.tsx", "line-step", "line", "خطی پله‌ای", "Step Line"],
  ["chart-pie-donut-text.tsx", "pie-donut-text", "pie", "دونات با متن مرکزی", "Donut with Text"],
  ["chart-pie-interactive.tsx", "pie-interactive", "pie", "دایره‌ای تعاملی", "Interactive Pie"],
  ["chart-pie-stacked.tsx", "pie-stacked", "pie", "دایره‌ای انباشته", "Stacked Pie"],
  ["chart-radar-lines-only.tsx", "radar-lines-only", "radar", "راداری فقط خط", "Radar Lines Only"],
  ["chart-radar-icons.tsx", "radar-icons", "radar", "راداری با آیکون", "Radar Icons"],
  ["chart-radar-multiple.tsx", "radar-multiple", "radar", "راداری چندسری", "Radar Multiple"],
  ["chart-radial-text.tsx", "radial-text", "radial-bar", "میله شعاعی با متن", "Radial Text"],
  ["chart-radial-shape.tsx", "radial-shape", "radial-bar", "میله شعاعی با شکل", "Radial Shape"],
  ["chart-radial-stacked.tsx", "radial-stacked", "radial-bar", "میله شعاعی انباشته", "Radial Stacked"],
  ["chart-tooltip-advanced.tsx", "tooltip-advanced", "tooltip", "تولتیپ پیشرفته", "Advanced Tooltip"],
]

const importsBody = keptEntries
  .map(
    ([src, id, category, title, en]) => `  {
    src: "${src}",
    id: "${id}",
    category: "${category}",
    title: "${title}",
    en: "${en}",
  },`
  )
  .join("\n")

importSrc =
  importSrc.slice(0, start) +
  `const IMPORTS = [\n${importsBody}\n]` +
  importSrc.slice(end + 2)

if (!importSrc.includes(keepComment)) {
  importSrc = importSrc.replace(
    "const IMPORTS = [",
    `${keepComment}\nconst IMPORTS = [`
  )
}
fs.writeFileSync(importScriptPath, importSrc)

console.log(
  JSON.stringify(
    {
      removedCount: REMOVE.length,
      keptCount: KEEP.size,
      kept: [...KEEP],
      removed: REMOVE,
      catalogBefore: before,
      catalogAfter: catalog.examples.length,
      deleted,
    },
    null,
    2
  )
)
