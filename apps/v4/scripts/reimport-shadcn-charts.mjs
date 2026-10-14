import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { spawnSync } from "node:child_process"

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")
const catalogPath = path.join(root, "lib/chart2-examples.json")
const importScript = path.join(root, "scripts/import-shadcn-charts-to-gallery.mjs")
const examplesRoot = path.join(root, "examples/chart2")

const importSrc = fs.readFileSync(importScript, "utf8")
const ids = [...importSrc.matchAll(/id:\s*"([^"]+)"/g)].map((m) => m[1])

const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"))
const before = catalog.examples.length
catalog.examples = catalog.examples.filter((e) => !ids.includes(e.id))
fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + "\n")
console.log(`removed ${before - catalog.examples.length} catalog entries`)

for (const id of ids) {
  for (const cat of [
    "area",
    "bar",
    "line",
    "pie",
    "radar",
    "radial-bar",
    "tooltip",
  ]) {
    const p = path.join(examplesRoot, cat, `${id}.tsx`)
    if (fs.existsSync(p)) fs.unlinkSync(p)
  }
}

const result = spawnSync(process.execPath, [importScript], {
  stdio: "inherit",
})
process.exit(result.status ?? 1)
