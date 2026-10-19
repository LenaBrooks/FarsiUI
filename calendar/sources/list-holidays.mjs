import fs from "node:fs"

const year = process.argv[2] || "1386"
const norm = fs.readFileSync(
  new URL(`./Calendar-${year}.norm.txt`, import.meta.url),
  "utf8"
)
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
const names = Object.keys(MONTHS)
const lines = norm
  .split(/\n/)
  .map((l) => l.replace(/\t+/g, " ").replace(/\s+/g, " ").trim())
  .filter(Boolean)

const dayRe =
  /^(?:شنبه|یک\s*شنبه|دو\s*شنبه|سه\s*شنبه|چهار\s*شنبه|پنج\s*شنبه|جمعه)\s+(\d{1,2})\s+(\S+)/

let month = null
let last = null
const holidays = []

for (const line of lines) {
  for (const n of names) {
    if (line.includes(`1 ${n}`) || line.includes(`1${n}`)) {
      // month header rows sometimes
    }
  }
  const m = line.match(dayRe)
  if (m) {
    const day = Number(m[1])
    const tok = m[2]
    if (tok !== '"' && tok !== "'") {
      for (const n of names) {
        if (tok === n || tok.startsWith(n)) {
          month = MONTHS[n]
          break
        }
      }
    }
    last = month != null ? { month, day } : last
    if (month != null && /تعطیل/.test(line)) {
      holidays.push({
        date: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        line: line.slice(0, 220),
      })
    }
  } else if (/تعطیل/.test(line) && last) {
    holidays.push({
      date: `${year}-${String(last.month).padStart(2, "0")}-${String(last.day).padStart(2, "0")}`,
      line: line.slice(0, 220),
      cont: true,
    })
  }
}

console.log(JSON.stringify(holidays, null, 2))
