import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const YEAR = 1392
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
  ["سفندا", 12],
]

function reverseFa(title) {
  return title
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .reverse()
    .join(" ")
    .replace(/\s{2,}/g, " ")
    .trim()
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
  return reverseFa(stripHolidayMark(s))
    .replace(/[قش]\.?\s*ه\.?\s*\d+/g, "")
    .replace(/\b\d{2,4}\b/g, "")
    .replace(/ش\.?\s*ه\.?/g, "")
    .replace(/ق\.?\s*ه\.?/g, "")
    .replace(/سال قبل از هجرت\s*\d*/g, "")
    .replace(/["'«»]/g, " ")
    .replace(/\s*علیه\s*السلام\s*/g, " ")
    .replace(/\s{2,}/g, " ")
    .replace(/^[\s\-–—.|]+|[\s\-–—.|]+$/g, "")
    .trim()
}

// Allow OCR-split weekdays: ج معه, پ نج شنبه, چ هار شنبه, س ه شنبه, دو شنبه, …
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
    if (rows.length && !/^--\s*\d+\s+of\s+\d+/.test(line) && !/^تقویم/.test(line)) {
      rows[rows.length - 1].raw += " " + line
    }
    continue
  }
  const day = Number(m[1])
  const tok = m[2]
  if (tok !== '"' && tok !== "'" && tok !== "«" && tok !== "»") {
    const hit = MONTH_ALIASES.find(([k]) => tok.includes(k))
    if (!hit) continue
    month = hit[1]
  }
  if (month == null) continue
  rows.push({ month, day, raw: line.slice(m[0].length).trim() })
}

const holDates = new Set(
  JSON.parse(fs.readFileSync(holidaysPath, "utf8")).items.map((i) => i.date)
)

const events = []
let e = 0
for (const row of rows) {
  const date = `${YEAR}-${String(row.month).padStart(2, "0")}-${String(row.day).padStart(2, "0")}`
  // Skip pure holiday rows; keep non-holiday text on shared days via strip
  let title = cleanTitle(row.raw)
  if (/تعطیل/.test(row.raw)) {
    // Drop holiday-only rows; if leftover text after strip is useful, keep as event
    if (holDates.has(date) && title.length < 12) continue
  }
  if (title.length < 6 || title.length > 90) continue
  if (!/[\u0600-\u06FF]{3,}/.test(title)) continue
  if (
    /^(?:لاولیا|لثانیا|الاولی|الثانیه|بیعر|مضان|لحجه|شعب|رجب|صفر|محرم)/.test(
      title
    )
  )
    continue
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
      sample: events.slice(0, 10).map((x) => `${x.date} ${x.title.fa}`),
      shahrivar: events
        .filter((x) => x.date.startsWith(`${YEAR}-06-`))
        .slice(0, 5)
        .map((x) => `${x.date} ${x.title.fa}`),
    },
    null,
    2
  )
)
