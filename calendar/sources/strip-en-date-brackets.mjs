import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "years")

/** Trailing / mid-title date annotations glued by Time.ir, e.g. [30 September] or [1 ذوالقعده] */
const DATE_BRACKET_RE =
  /\[[\d۰-۹]+\s*(?:[A-Za-z][A-Za-z\s.]*|[\u0600-\u06FF][\u0600-\u06FF\s]*)\]/g

const TRAILING_EN_MONTH_RE =
  /\s*(?:January|February|March|April|May|June|July|August|September|October|November|December)\b/gi

function cleanTitle(fa) {
  return fa
    .replace(DATE_BRACKET_RE, "")
    .replace(TRAILING_EN_MONTH_RE, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s*([،؛])\s*/g, "$1 ")
    .trim()
}

let files = 0
let items = 0
const samples = []

for (const year of fs.readdirSync(root)) {
  for (const name of ["events.json", "holidays.json"]) {
    const filePath = path.join(root, year, name)
    if (!fs.existsSync(filePath)) continue
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"))
    let changed = false
    for (const it of data.items ?? []) {
      const fa = it.title?.fa
      if (typeof fa !== "string") continue
      const next = cleanTitle(fa)
      if (next && next !== fa) {
        if (samples.length < 12) {
          samples.push(`${year}: ${JSON.stringify(fa)} => ${JSON.stringify(next)}`)
        }
        it.title.fa = next
        items++
        changed = true
      }
    }
    if (changed) {
      if (typeof data.dataVersion === "string" && data.year === 1405) {
        data.dataVersion = "1405.2.3"
      }
      files++
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n")
    }
  }
}

console.log(JSON.stringify({ files, items, samples }, null, 2))
