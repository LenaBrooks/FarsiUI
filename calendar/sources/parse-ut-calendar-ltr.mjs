import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const YEAR = Number(process.argv[2] || 1393)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const normPath = path.join(__dirname, `Calendar-${YEAR}.norm.txt`)
const outDir = path.join(__dirname, "..", "years", String(YEAR))
const holidaysPath = path.join(outDir, "holidays.json")

const MONTH_ALIASES = [
  ["فروردین", 1],
  ["ینفرورد", 1],
  ["اردیبهشت", 2],
  ["بهشتارد", 2],
  ["خرداد", 3],
  ["تیر", 4],
  ["مرداد", 5],
  ["شهریور", 6],
  ["مهر", 7],
  ["آبان", 8],
  ["آذر", 9],
  ["دی", 10],
  ["بهمن", 11],
  ["اسفند", 12],
  ["اسفن", 12],
  ["سفندا", 12],
]

// OCR sometimes splits فروردین as "فر" + "وردین"
function resolveMonth(tok) {
  const hit = MONTH_ALIASES.find(([k]) => tok.includes(k))
  if (hit) return hit[1]
  if (tok === "فر" || tok === "وردین") return 1
  return null
}

function stripHolidayMark(s) {
  return s
    .replace(/\)\s*\(\s*تعطیل\s*\)/g, "")
    .replace(/\(\s*تعطیل\s*\)/g, "")
    .replace(/\)\s*تعطیل\s*\(/g, "")
    .replace(/تعطیل\s*به\s*/g, "")
    .replace(/تعطیل/g, "")
    .replace(/[()]/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim()
}

function cleanTitle(s) {
  return stripHolidayMark(s)
    // Only strip standalone ق.ه / ش.ه tokens, never letters inside words like شهادت
    .replace(/(?:^|\s)[قش]\.?\s*ه\.?(?:\s*\d+)?(?=\s|$)/g, " ")
    .replace(/\b\d{2,4}\b/g, "")
    .replace(/سال قبل از هجرت\s*\d*/g, "")
    .replace(/["'«»]/g, " ")
    .replace(/\s*علیه\s*السلام\s*/g, " ")
    // Drop leading gregorian/hijri day crumbs like "7 7 روز …"
    .replace(/^(?:\d{1,2}\s+){1,4}(?=[\u0600-\u06FF])/, "")
    .replace(/\s{2,}/g, " ")
    .replace(/^[\s\-–—.|]+|[\s\-–—.|]+$/g, "")
    .trim()
}

const dayRowRe =
  /^(?:پ\s*ن\s*ج\s*شنبه|چ\s*ه\s*ا\s*ر\s*شنبه|س\s*ه\s*شنبه|دو\s*شنبه|یک\s*شنبه|شنبه|ج\s*م\s*ع\s*ه)\s+(\d{1,2})\s+(\S+)/

const norm = fs.readFileSync(normPath, "utf8")
const lines = norm
  .split(/\r?\n/)
  .map((l) => l.replace(/\t+/g, " ").replace(/\s+/g, " ").trim())
  .filter(Boolean)

let month = null
const rows = []

for (const line of lines) {
  const m = line.match(dayRowRe)
  if (!m) {
    if (
      rows.length &&
      !/^--\s*\d+\s+of\s+\d+/.test(line) &&
      !/^تقویم/.test(line) &&
      !/^جدول/.test(line)
    ) {
      rows[rows.length - 1].raw += " " + line
    }
    continue
  }
  const day = Number(m[1])
  const tok = m[2]
  if (tok !== '"' && tok !== "'" && tok !== "«" && tok !== "»") {
    const resolved = resolveMonth(tok)
    if (resolved == null) continue
    month = resolved
  }
  if (month == null) continue
  rows.push({ month, day, raw: line.slice(m[0].length).trim() })
}

const events = []
let e = 0
for (const row of rows) {
  // Holidays are curated separately; skip rows marked تعطیل
  if (/تعطیل/.test(row.raw)) continue
  const date = `${YEAR}-${String(row.month).padStart(2, "0")}-${String(row.day).padStart(2, "0")}`
  const title = cleanTitle(row.raw)
  if (title.length < 6 || title.length > 90) continue
  if (!/[\u0600-\u06FF]{3,}/.test(title)) continue
  if (
    /^(?:لاولیا|لثانیا|الاولی|الثانیه|بیعر|مضان|لحجه|شعب|رجب|صفر|محرم|جمادی|شوال)/.test(
      title
    )
  )
    continue
  // Drop leftover calendar scaffolding (hijri/greg month crumbs only)
  if (/^\d+\s/.test(title) && title.length < 20) continue
  e++
  events.push({
    id: `${YEAR}-evt-${String(e).padStart(3, "0")}`,
    date,
    title: { fa: title },
    isHoliday: false,
    categories: ["observance"],
  })
}

const eventFile = {
  year: YEAR,
  schemaVersion: 1,
  dataVersion: `${YEAR}.1.0`,
  source: `calendar.ut.ac.ir Calendar-${YEAR}.pdf non-holiday occasions auto-parsed`,
  coverage: "observances-from-ut-calendar-pdf",
  items: events,
}

fs.mkdirSync(outDir, { recursive: true })
fs.writeFileSync(
  path.join(outDir, "events.json"),
  JSON.stringify(eventFile, null, 2) + "\n"
)
console.log(
  JSON.stringify(
    {
      rows: rows.length,
      events: events.length,
      months: [...new Set(rows.map((r) => r.month))].sort((a, b) => a - b),
      sample: events.slice(0, 8).map((x) => `${x.date} ${x.title.fa}`),
    },
    null,
    2
  )
)
