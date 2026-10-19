import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createRequire } from "node:module"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)

const YEAR = Number(process.argv[2] || 1383)
const pdfPath =
  process.argv[3] || path.join(__dirname, `Calendar-${YEAR}.pdf`)
const outDir = path.join(__dirname, "..", "years", String(YEAR))

const MONTHS = {
  فروردین: 1,
  اردیبهشت: 2,
  خرداد: 3,
  تیر: 4,
  مرداد: 5,
  شهریور: 6,
  مهر: 7,
  آبان: 8,
  آذر: 9,
  دی: 10,
  بهمن: 11,
  اسفند: 12,
}
const MONTH_NAMES = Object.keys(MONTHS)
const HIJRI_MONTHS = new Set([
  "محرم",
  "صفر",
  "ربیع",
  "ربيع",
  "جمادی",
  "جمادي",
  "رجب",
  "شعبان",
  "رمضان",
  "شوال",
  "ذیقعده",
  "ذی‌قعده",
  "ذوالحجه",
  "ذیالحجه",
  "ذی",
  "قعده",
  "الحجه",
  "الاول",
  "الثانی",
  "الثاني",
  "الاولی",
  "الأول",
])
const G_MONTHS = new Set([
  "ژانویه",
  "فوریه",
  "مارس",
  "آوریل",
  "مه",
  "ژوئن",
  "ژوئیه",
  "اوت",
  "سپتامبر",
  "اکتبر",
  "نوامبر",
  "دسامبر",
])

function normalizeArabic(s) {
  let t = s.normalize("NFKC")
  t = t.replace(/[\u064B-\u065F]/g, "")
  t = t.replace(/\u064A/g, "\u06CC").replace(/\u0643/g, "\u06A9")
  t = t.replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
  t = t.replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06F0))
  t = t.replace(/ـ/g, "")
  return t
}

function reverseFa(title) {
  const parts = title.trim().split(/\s+/).filter(Boolean)
  return parts
    .reverse()
    .join(" ")
    .replace(/\s+([).])/g, "$1")
    .replace(/([(])\s+/g, "$1")
    .replace(/\s+-\s+/g, " - ")
    .replace(/\s{2,}/g, " ")
    .trim()
}

function stripHolidayMark(s) {
  return s
    .replace(/\)\s*\(\s*تعطیل\s*\)/g, "")
    .replace(/\(\s*تعطیل\s*\)/g, "")
    .replace(/\)\s*تعطیل\s*\(/g, "")
    .replace(/تعطیل/g, "")
    .replace(/[()]/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim()
}

function categorizeHoliday(title) {
  if (/نوروز|طبیعت|جمهوری|خمینی|خرداد|انقلاب|نفت/.test(title)) {
    return ["national"]
  }
  return ["religious"]
}

async function extractText(file) {
  // pdf-parse installed in temp; fall back to sibling txt
  try {
    const { PDFParse } = require(
      path.join(process.env.TEMP || "/tmp", "pdf-extract-farsiui", "node_modules", "pdf-parse")
    )
    const parser = new PDFParse({ data: fs.readFileSync(file) })
    const result = await parser.getText()
    return result.text
  } catch {
    const txt = path.join(__dirname, `Calendar-${YEAR}.txt`)
    if (fs.existsSync(txt)) return fs.readFileSync(txt, "utf8")
    throw new Error("Cannot load pdf-parse and no .txt fallback")
  }
}

function parseRows(norm) {
  const lines = norm
    .split(/\r?\n/)
    .map((l) => l.replace(/\t+/g, " ").replace(/\s+/g, " ").trim())
    .filter(Boolean)

  const monthRe = new RegExp(`(${MONTH_NAMES.join("|")})`)
  const dayRowRe =
    /^(شنبه(?: یک| سه| پنج| چهار)?|یکشنبه|دوشنبه|سه ?شنبه|چهارشنبه|پنج ?شنبه|جمعه)\s+(\d{1,2})\s+(\S+)/

  let month = null
  const rows = []

  for (const line of lines) {
    const m = line.match(dayRowRe)
    if (!m) {
      if (month != null && rows.length && /تعطیل|علیه|سلام|شهادت|ولادت|عید/.test(line)) {
        rows[rows.length - 1].raw += " " + line
      }
      continue
    }
    const dayNum = Number(m[2])
    const monthTok = m[3]
    if (!(monthTok === '"' || monthTok === "'" || monthTok === "«" || monthTok === "»")) {
      const mm = monthTok.match(monthRe)
      if (!mm) continue
      month = MONTHS[mm[1]]
    }
    if (month == null) continue
    rows.push({ month, day: dayNum, raw: line.slice(m[0].length).trim() })
  }
  return rows
}

function splitOccasions(raw) {
  const tokens = raw.split(/\s+/)
  let i = 0
  while (i < tokens.length) {
    const t = tokens[i]
    if (
      /^\d+$/.test(t) ||
      t === '"' ||
      HIJRI_MONTHS.has(t) ||
      G_MONTHS.has(t) ||
      t === "هـ" ||
      t === "." ||
      t === "ق" ||
      t === "ش" ||
      t === "و"
    ) {
      i++
      continue
    }
    break
  }
  const body = tokens.slice(i).join(" ")
  if (!body.trim()) return []
  const chunks = body.split(/\s+-\s+/)
  return chunks
    .map((c) => {
      const isHoliday = /تعطیل/.test(c)
      let title = reverseFa(stripHolidayMark(c))
      title = title.replace(/^[\d\s.،,-]+/, "").trim()
      return { title, isHoliday }
    })
    .filter((x) => x.title.length > 2)
}

async function main() {
  const text = await extractText(pdfPath)
  const norm = normalizeArabic(text)
  fs.writeFileSync(path.join(__dirname, `Calendar-${YEAR}.norm.txt`), norm)

  const rows = parseRows(norm)
  const holidays = []
  const events = []
  let h = 0
  let e = 0

  for (const row of rows) {
    for (const o of splitOccasions(row.raw)) {
      const date = `${YEAR}-${String(row.month).padStart(2, "0")}-${String(row.day).padStart(2, "0")}`
      if (o.isHoliday) {
        h++
        holidays.push({
          id: `${YEAR}-h-${String(h).padStart(3, "0")}`,
          date,
          title: { fa: o.title },
          isHoliday: true,
          categories: categorizeHoliday(o.title),
        })
      } else {
        e++
        events.push({
          id: `${YEAR}-evt-${String(e).padStart(3, "0")}`,
          date,
          title: { fa: o.title },
          isHoliday: false,
          categories: ["observance"],
        })
      }
    }
  }

  // Deduplicate identical date+title
  const dedupe = (items) => {
    const seen = new Set()
    return items.filter((item) => {
      const key = `${item.date}|${item.title.fa}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }

  const holidayFile = {
    year: YEAR,
    schemaVersion: 1,
    dataVersion: `${YEAR}.1.0`,
    source: `calendar.ut.ac.ir Calendar-${YEAR}.pdf (OCR/text extract; RTL titles reversed)`,
    coverage: "national+religious",
    notes: [
      "Parsed automatically from UT Calendar PDF. Title word order may need light manual polish.",
      "Page 1 notes Shawwal may differ by 1 day from official announcement vs UT extraction.",
    ],
    items: dedupe(holidays),
  }
  const eventFile = {
    year: YEAR,
    schemaVersion: 1,
    dataVersion: `${YEAR}.1.0`,
    source: `calendar.ut.ac.ir Calendar-${YEAR}.pdf (non-holiday occasions)`,
    coverage: "observances-from-ut-calendar-pdf",
    items: dedupe(events),
  }

  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(
    path.join(outDir, "holidays.json"),
    JSON.stringify(holidayFile, null, 2) + "\n"
  )
  fs.writeFileSync(
    path.join(outDir, "events.json"),
    JSON.stringify(eventFile, null, 2) + "\n"
  )

  console.log(
    JSON.stringify(
      {
        year: YEAR,
        rows: rows.length,
        holidays: holidayFile.items.length,
        events: eventFile.items.length,
        holidayDates: holidayFile.items.map((x) => `${x.date} ${x.title.fa}`),
      },
      null,
      2
    )
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
