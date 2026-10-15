import fs from "node:fs"
import path from "node:path"

const root = path.join(process.cwd(), "registry")
const names = new Set([
  "input.tsx",
  "textarea.tsx",
  "select.tsx",
  "checkbox.tsx",
  "radio-group.tsx",
  "switch.tsx",
  "native-select.tsx",
  "input-otp.tsx",
  "input-group.tsx",
  "combobox.tsx",
])

const strip = [
  /focus-visible:ring-(?!0\b)\d+\s*/g,
  /focus-visible:ring-ring\/\d+\s*/g,
  /focus-visible:ring-offset-\d+\s*/g,
  /focus-visible:ring-offset-background\s*/g,
  /focus-within:ring-(?!0\b)\d+\s*/g,
  /focus-within:ring-ring\/\d+\s*/g,
  /data-\[active=true\]:ring-(?!0\b)\d+\s*/g,
  /data-\[active=true\]:ring-ring\/\d+\s*/g,
  /data-\[active=true\]:ring-offset-\d+\s*/g,
  /data-\[active=true\]:ring-offset-background\s*/g,
  /has-\[\[data-slot=input-group-control\]:focus-visible\]:ring-(?!0\b)\d+\s*/g,
  /has-\[\[data-slot=input-group-control\]:focus-visible\]:ring-ring\/\d+\s*/g,
]

function walk(dir: string, out: string[] = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) walk(p, out)
    else if (names.has(ent.name) && path.basename(dir) === "ui") out.push(p)
  }
  return out
}

const files = walk(root)
let n = 0
for (const f of files) {
  let c = fs.readFileSync(f, "utf8")
  const o = c
  for (const re of strip) c = c.replace(re, "")
  // Keep intentional focus-visible:ring-0; restore if we accidentally emptied doubles
  c = c.replace(/ {2,}/g, " ")
  if (c !== o) {
    fs.writeFileSync(f, c)
    n++
    console.log(path.relative(root, f))
  }
}
console.log(`updated ${n} / ${files.length}`)
