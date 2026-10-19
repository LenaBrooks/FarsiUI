import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const year = Number(process.argv[2] || 1384)
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const eventsPath = path.join(root, "years", String(year), "events.json")
const holidaysPath = path.join(root, "years", String(year), "holidays.json")

function clean(t) {
  let s = String(t)
  if (s.length > 120) s = s.slice(0, 120)
  s = s.replace(/[قش]\.?\s*ه\.?\s*\d+/g, "")
  s = s.replace(/ش\.?\s*ه\.?/g, "").replace(/ق\.?\s*ه\.?/g, "")
  s = s.replace(/سال قبل از هجرت\s*\d*/g, "")
  s = s.replace(/["'«»]/g, " ")
  s = s.replace(/\s*علیه\s*السلام\s*/g, " ")
  s = s.replace(/\s{2,}/g, " ").replace(/^[\s\-–—.|]+|[\s\-–—.|]+$/g, "").trim()
  return s
}

const data = JSON.parse(fs.readFileSync(eventsPath, "utf8"))
const holDates = new Set(
  JSON.parse(fs.readFileSync(holidaysPath, "utf8")).items.map((i) => i.date)
)

data.source = `calendar.ut.ac.ir Calendar-${year}.pdf non-holiday occasions auto-parsed`
data.dataVersion = `${year}.1.0`
data.items = data.items
  .map((it) => ({
    ...it,
    isHoliday: false,
    title: { fa: clean(it.title.fa) },
  }))
  .filter((it) => it.title.fa.length > 2 && it.title.fa.length < 90)
  .filter((it) => {
    const junk =
      /روز ملی شدن صنعت نفت|برگزاری انتخابات|قیام مردم تبریز|مجلس خبرگان|تأسیس بنیاد/.test(
        it.title.fa
      )
    return !(junk && holDates.has(it.date))
  })
  .map((it, i) => ({
    ...it,
    id: `${year}-evt-${String(i + 1).padStart(3, "0")}`,
  }))

fs.writeFileSync(eventsPath, JSON.stringify(data, null, 2) + "\n")
console.log("events", data.items.length)
console.log(
  data.items
    .slice(0, 6)
    .map((x) => `${x.date} ${x.title.fa}`)
    .join("\n")
)
