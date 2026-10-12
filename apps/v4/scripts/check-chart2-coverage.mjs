import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")
const catalog = JSON.parse(
  fs.readFileSync(path.join(root, "lib/chart2-examples.json"), "utf8")
)
const demos = fs.readFileSync(path.join(root, "lib/chart2-demos.ts"), "utf8")
const ids = [...demos.matchAll(/"([^"]+)": \(\) => import/g)].map((m) => m[1])
const cat = catalog.examples.map((e) => e.id)
const missing = cat.filter((id) => !ids.includes(id))
const extra = ids.filter((id) => !cat.includes(id))
const missingFiles = cat.filter((id) => {
  const ex = catalog.examples.find((e) => e.id === id)
  const p = path.join(root, "examples/chart2", ex.category, `${id}.tsx`)
  return !fs.existsSync(p)
})

console.log("catalog", cat.length)
console.log("loaders", ids.length)
console.log("missing loaders", missing)
console.log("extra loaders", extra)
console.log("missing files", missingFiles)
for (const c of catalog.categories) {
  const n = catalog.examples.filter((e) => e.category === c.id).length
  console.log(`${c.id}: ${n}`)
}
