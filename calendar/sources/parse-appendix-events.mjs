import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const YEAR = Number(process.argv[2] || 1396)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const normPath = path.join(__dirname, `Calendar-${YEAR}.norm.txt`)
const outDir = path.join(__dirname, "..", "years", String(YEAR))
const holidaysPath = path.join(outDir, "holidays.json")

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

function spaceFa(s) {
  // Insert spaces before common Persian word starts in concatenated OCR
  return s
    .replace(/([اآأإء-ی])(روز|سالروز|شهادت|ولادت|وفات|آغاز|تأسیس|گشایش|تشکیل|انفجار|حمله|کشف|اشغال|تبعید|ابلاغ|اجرای|معرفی|بمباران|فتح|شکست)/g, "$1 $2")
    .replace(/(روز)([اآأإء-ی])/g, "$1 $2")
    .replace(/\s{2,}/g, " ")
    .trim()
}

const holDates = new Set(
  JSON.parse(fs.readFileSync(holidaysPath, "utf8")).items.map((i) => i.date)
)

const text = fs.readFileSync(normPath, "utf8")
const start = text.search(/(?:جدول\s*ضمیمه|ضمیمه\s*جدول)/)
const appendix = start >= 0 ? text.slice(start) : text
const monthAlt = Object.keys(MONTHS).join("|")
const re = new RegExp(
  `(\\d{1,2})\\s*(${monthAlt})\\s*([^\\n\\r]*)`,
  "g"
)

const items = []
let m
let i = 0
while ((m = re.exec(appendix))) {
  const day = Number(m[1])
  const month = MONTHS[m[2]]
  if (!month || day < 1 || day > 31) continue
  const date = `${YEAR}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  if (holDates.has(date)) continue
  let title = m[3]
    .replace(/\(.*?\)/g, " ")
    .replace(/برابر\s*با/g, " ")
    .replace(/[٠-۹0-9]+/g, " ")
    .replace(/[قش]\.?\s*ه\.?/g, " ")
    .replace(/[-–—]/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim()
  title = spaceFa(title)
  if (title.length < 6 || title.length > 100) continue
  if (!/[\u0600-\u06FF]{3,}/.test(title)) continue
  i++
  items.push({
    id: `${YEAR}-evt-${String(i).padStart(3, "0")}`,
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
  source: `calendar.ut.ac.ir Calendar-${YEAR}.pdf appendix table (جدول ضمیمه); main day-table OCR was too corrupted for auto events`,
  coverage: "observances-from-ut-calendar-pdf-appendix",
  items,
}

fs.mkdirSync(outDir, { recursive: true })
fs.writeFileSync(
  path.join(outDir, "events.json"),
  JSON.stringify(eventFile, null, 2) + "\n"
)
console.log(
  JSON.stringify(
    {
      events: items.length,
      sample: items.slice(0, 8).map((x) => `${x.date} ${x.title.fa}`),
    },
    null,
    2
  )
)
