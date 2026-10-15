import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../examples/Chart")

function walk(dir) {
  const out = []
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) out.push(...walk(p))
    else if (p.endsWith(".tsx")) out.push(p)
  }
  return out
}

let n = 0
for (const file of walk(root)) {
  let code = fs.readFileSync(file, "utf8")
  const colorsMatch = code.match(/^const chartColors = \[[^\]]+\];\s*\n?/m)
  const colors = colorsMatch ? colorsMatch[0] : ""
  code = code.replace(/^const chartColors = \[[^\]]+\];\s*\n?/m, "")
  code = code.replace(/^\/\/ @ts-nocheck[^\n]*\n+/m, "")
  code = code.replace(/^["']use client["'];?\s*\n+/m, "")

  const next =
    "// @ts-nocheck — adapted from Recharts upstream for recharts@3.8\n" +
    '"use client"\n\n' +
    colors +
    code.trimStart()

  fs.writeFileSync(file, next)
  n++
}
console.log("reordered", n)
