import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../examples/chart2")

function walk(dir) {
  const out = []
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) out.push(...walk(p))
    else if (p.endsWith(".tsx")) out.push(p)
  }
  return out
}

const COLORS =
  'const chartColors = ["var(--chart-1)","var(--chart-2)","var(--chart-3)","var(--chart-4)","var(--chart-5)"];'

let n = 0
for (const file of walk(root)) {
  let code = fs.readFileSync(file, "utf8")
  const orig = code

  // Replace d3-shape curve with built-in monotone
  if (code.includes("d3-shape") || code.includes("curveCardinal")) {
    code = code.replace(/import\s*\{[^}]*\}\s*from\s*['"]d3-shape['"]\s*;?\n?/g, "")
    code = code.replace(/const\s+cardinal\s*=\s*curveCardinal\.tension\([^)]*\)\s*;?\n?/g, "")
    code = code.replace(/type=\{cardinal\}/g, 'type="monotone"')
  }

  // Ensure "use client" is first, then ts-nocheck, then chartColors if needed
  const needsColors = code.includes("chartColors")
  code = code.replace(/^const chartColors = \[[^\]]+\];\s*\n?/m, "")
  code = code.replace(/^\/\/ @ts-nocheck[^\n]*\n/m, "")
  code = code.replace(/^["']use client["'];?\s*\n+/m, "")

  const header = [
    '"use client"',
    "",
    "// @ts-nocheck — adapted from Recharts upstream examples for recharts@3.8",
    needsColors ? COLORS : null,
    "",
  ]
    .filter((x) => x !== null)
    .join("\n")

  code = `${header}\n${code.trimStart()}`

  // Collapse excess blank lines at top
  code = code.replace(/("use client"\n(?:\/\/[^\n]*\n)?(?:const chartColors[^\n]*\n)?)\n+/, "$1\n")

  if (code !== orig) {
    fs.writeFileSync(file, code)
    n++
    console.log("clean", path.relative(root, file))
  }
}
console.log("cleaned", n)
