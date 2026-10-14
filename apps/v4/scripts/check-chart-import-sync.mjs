import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")
const catalog = JSON.parse(
  fs.readFileSync(path.join(root, "lib/chart2-examples.json"), "utf8")
)
const demos = fs.readFileSync(path.join(root, "lib/chart2-demos.ts"), "utf8")
const pathIds = [...demos.matchAll(/"([^"]+)": "examples\/chart2\//g)].map(
  (m) => m[1]
)
const missing = catalog.examples.filter((e) => !pathIds.includes(e.id))
const orphanFiles = []
for (const e of catalog.examples) {
  const p = path.join(root, "examples/chart2", e.category, `${e.id}.tsx`)
  if (!fs.existsSync(p)) orphanFiles.push(e.id)
}
console.log({
  examples: catalog.examples.length,
  demoPaths: pathIds.length,
  missingFromDemos: missing.map((e) => e.id),
  missingFiles: orphanFiles,
})
