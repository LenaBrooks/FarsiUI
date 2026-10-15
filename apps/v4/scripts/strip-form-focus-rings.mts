/**
 * Strip focus ring / ring-offset utilities from form-control cn-* rules
 * across registry/styles/style-*.css (all design systems).
 *
 * Keeps focus-visible:border-ring and aria-invalid rings.
 */
import fs from "node:fs"
import path from "node:path"

const stylesDir = path.join(process.cwd(), "registry/styles")

const FORM_SELECTOR =
  /^\s*\.cn-(?:input(?:-otp(?:-slot|-group)?)?|textarea|select-trigger|native-select|combobox-(?:chips|trigger)|checkbox(?:-aria)?|radio-group-item(?:-aria)?|switch(?:-aria)?|field-label|input-group|button-group|questionnaire-choice)\b/

const STRIP = [
  /\bfocus-visible:ring-\[[^\]]+\]\s*/g,
  /\bfocus-visible:ring-\d+\s*/g,
  /\bfocus-visible:ring-ring\/\d+\s*/g,
  /\bfocus-visible:ring-offset-\d+\s*/g,
  /\bfocus-visible:ring-offset-background\s*/g,
  /\bfocus-within:ring-\[[^\]]+\]\s*/g,
  /\bfocus-within:ring-\d+\s*/g,
  /\bfocus-within:ring-ring\/\d+\s*/g,
  /\bfocus-within:ring-offset-\d+\s*/g,
  /\bfocus-within:ring-offset-background\s*/g,
  /\bhas-focus:ring-\[[^\]]+\]\s*/g,
  /\bhas-focus:ring-\d+\s*/g,
  /\bhas-focus:ring-ring\/\d+\s*/g,
  /\bhas-focus:ring-offset-\d+\s*/g,
  /\bhas-focus:ring-offset-background\s*/g,
  /\bdata-\[active=true\]:ring-\[[^\]]+\]\s*/g,
  /\bdata-\[active=true\]:ring-\d+\s*/g,
  /\bdata-\[active=true\]:ring-ring\/\d+\s*/g,
  /\bdata-\[active=true\]:ring-offset-\d+\s*/g,
  /\bdata-\[active=true\]:ring-offset-background\s*/g,
  /\bdata-focus-visible:ring-\[[^\]]+\]\s*/g,
  /\bdata-focus-visible:ring-\d+\s*/g,
  /\bdata-focus-visible:ring-ring\/\d+\s*/g,
  /\bdata-focus-visible:ring-offset-\d+\s*/g,
  /\bdata-focus-visible:ring-offset-background\s*/g,
  /\bhas-\[\[data-slot=input-group-control\]:focus-visible\]:ring-\[[^\]]+\]\s*/g,
  /\bhas-\[\[data-slot=input-group-control\]:focus-visible\]:ring-\d+\s*/g,
  /\bhas-\[\[data-slot=input-group-control\]:focus-visible\]:ring-ring\/\d+\s*/g,
  /\bhas-\[>\[data-slot=field\]\]:has-\[:focus-visible\]:ring-\d+\s*/g,
  /\bhas-\[>\[data-slot=field\]\]:has-\[:focus-visible\]:ring-ring\/\d+\s*/g,
  /\bhas-\[>input:focus-visible\]:ring-\d+\s*/g,
  /\bhas-\[>input:focus-visible\]:ring-ring\/\d+\s*/g,
]

function stripLine(line: string) {
  let next = line
  for (const re of STRIP) next = next.replace(re, "")
  return next.replace(/ {2,}/g, " ").replace(/@apply /g, "@apply ")
}

const files = fs
  .readdirSync(stylesDir)
  .filter((f) => f.startsWith("style-") && f.endsWith(".css"))

let total = 0

for (const file of files) {
  const full = path.join(stylesDir, file)
  const src = fs.readFileSync(full, "utf8")
  const lines = src.split("\n")
  let inFormBlock = false
  let brace = 0
  let changed = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!
    if (!inFormBlock && FORM_SELECTOR.test(line)) {
      inFormBlock = true
      brace = 0
    }
    if (inFormBlock) {
      const stripped = stripLine(line)
      if (stripped !== line) {
        lines[i] = stripped
        changed++
      }
      for (const ch of line) {
        if (ch === "{") brace++
        if (ch === "}") brace--
      }
      if (brace <= 0 && line.includes("}")) {
        inFormBlock = false
      }
    }
  }

  if (changed > 0) {
    fs.writeFileSync(full, lines.join("\n"))
    total += changed
    console.log(`${file}: ${changed} lines`)
  } else {
    console.log(`${file}: unchanged`)
  }
}

console.log(`Done. ${total} line(s) updated across ${files.length} styles.`)
