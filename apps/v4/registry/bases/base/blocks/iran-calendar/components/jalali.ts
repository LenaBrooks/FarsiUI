import {
  CalendarDate,
  GregorianCalendar,
  IslamicUmalquraCalendar,
  PersianCalendar,
  getDayOfWeek,
  getLocalTimeZone,
  toCalendar,
  today,
} from "@internationalized/date"

export const JALALI_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
] as const

export const WEEKDAYS_SHORT = ["ش", "ی", "د", "س", "چ", "پ", "ج"] as const

export const WEEKDAYS_LONG = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنجشنبه",
  "جمعه",
] as const

const HIJRI_MONTHS = [
  "محرم",
  "صفر",
  "ربیع‌الاول",
  "ربیع‌الثانی",
  "جمادی‌الاولی",
  "جمادی‌الثانیه",
  "رجب",
  "شعبان",
  "رمضان",
  "شوال",
  "ذی‌القعده",
  "ذی‌الحجه",
] as const

const GREGORIAN_MONTHS_EN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const

const persian = new PersianCalendar()
const gregorian = new GregorianCalendar()
const hijri = new IslamicUmalquraCalendar()

export type JalaliYMD = { year: number; month: number; day: number }

export function pad2(n: number) {
  return String(n).padStart(2, "0")
}

export function toJalaliDateString({ year, month, day }: JalaliYMD) {
  return `${year}-${pad2(month)}-${pad2(day)}`
}

export function jalaliCalendarDate({ year, month, day }: JalaliYMD) {
  return new CalendarDate(persian, year, month, day)
}

export function todayJalali(): JalaliYMD {
  const date = toCalendar(today(getLocalTimeZone()), persian)
  return { year: date.year, month: date.month, day: date.day }
}

export function daysInJalaliMonth(year: number, month: number) {
  return persian.getDaysInMonth(jalaliCalendarDate({ year, month, day: 1 }))
}

/** Saturday-first index 0..6 for fa-IR. */
export function jalaliWeekdayIndex(ymd: JalaliYMD) {
  return getDayOfWeek(jalaliCalendarDate(ymd), "fa-IR")
}

export function isFriday(ymd: JalaliYMD) {
  return jalaliWeekdayIndex(ymd) === 6
}

export function addJalaliMonths(ymd: JalaliYMD, delta: number): JalaliYMD {
  let year = ymd.year
  let month = ymd.month + delta
  while (month > 12) {
    month -= 12
    year += 1
  }
  while (month < 1) {
    month += 12
    year -= 1
  }
  const maxDay = daysInJalaliMonth(year, month)
  return { year, month, day: Math.min(ymd.day, maxDay) }
}

export function formatJalaliLong(ymd: JalaliYMD) {
  const weekday = WEEKDAYS_LONG[jalaliWeekdayIndex(ymd)]
  return `${weekday} - ${ymd.day} ${JALALI_MONTHS[ymd.month - 1]} ${ymd.year}`
}

export function formatJalaliSlash(ymd: JalaliYMD) {
  return `${ymd.year}/${pad2(ymd.month)}/${pad2(ymd.day)}`
}

export function toGregorian(ymd: JalaliYMD) {
  const g = toCalendar(jalaliCalendarDate(ymd), gregorian)
  return { year: g.year, month: g.month, day: g.day }
}

export function toHijri(ymd: JalaliYMD) {
  const h = toCalendar(jalaliCalendarDate(ymd), hijri)
  return { year: h.year, month: h.month, day: h.day }
}

export function formatGregorianLong(ymd: JalaliYMD) {
  const g = toGregorian(ymd)
  const weekdayEn = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone: "Asia/Tehran",
  }).format(jalaliCalendarDate(ymd).toDate("Asia/Tehran"))
  return {
    slash: `${g.year}-${pad2(g.month)}-${pad2(g.day)}`,
    line: `${weekdayEn} - ${GREGORIAN_MONTHS_EN[g.month - 1]} ${g.day}, ${g.year}`,
  }
}

const HIJRI_WEEKDAYS = [
  "السبت",
  "الاحد",
  "الاثنین",
  "الثلاثاء",
  "الاربعاء",
  "الخمیس",
  "الجمعه",
] as const

export function formatHijriLong(ymd: JalaliYMD) {
  const h = toHijri(ymd)
  const weekday = HIJRI_WEEKDAYS[jalaliWeekdayIndex(ymd)]
  return {
    slash: `${h.year}/${pad2(h.month)}/${pad2(h.day)}`,
    line: `${weekday} - ${pad2(h.day)} ${HIJRI_MONTHS[h.month - 1]} ${h.year}`,
    monthName: HIJRI_MONTHS[h.month - 1],
    ...h,
  }
}

/** Western zodiac label in Persian, from Gregorian date. */
export function getZodiacFa(ymd: JalaliYMD): { name: string; symbol: string } {
  const { month, day } = toGregorian(ymd)
  const md = month * 100 + day
  if (md >= 321 && md <= 419) return { name: "حمل", symbol: "♈" }
  if (md >= 420 && md <= 520) return { name: "ثور", symbol: "♉" }
  if (md >= 521 && md <= 620) return { name: "جوزا", symbol: "♊" }
  if (md >= 621 && md <= 722) return { name: "سرطان", symbol: "♋" }
  if (md >= 723 && md <= 822) return { name: "اسد", symbol: "♌" }
  if (md >= 823 && md <= 922) return { name: "سنبله", symbol: "♍" }
  if (md >= 923 && md <= 1022) return { name: "میزان", symbol: "♎" }
  if (md >= 1023 && md <= 1121) return { name: "عقرب", symbol: "♏" }
  if (md >= 1122 && md <= 1221) return { name: "قوس", symbol: "♐" }
  if (md >= 1222 || md <= 119) return { name: "جدی", symbol: "♑" }
  if (md >= 120 && md <= 218) return { name: "دلو", symbol: "♒" }
  return { name: "حوت", symbol: "♓" }
}

export function monthGregorianRangeLabel(year: number, month: number) {
  const start = toGregorian({ year, month, day: 1 })
  const end = toGregorian({
    year,
    month,
    day: daysInJalaliMonth(year, month),
  })
  if (start.month === end.month) {
    return `${GREGORIAN_MONTHS_EN[start.month - 1]} ${start.year}`
  }
  if (start.year === end.year) {
    return `${GREGORIAN_MONTHS_EN[start.month - 1]} - ${GREGORIAN_MONTHS_EN[end.month - 1]} ${start.year}`
  }
  return `${GREGORIAN_MONTHS_EN[start.month - 1]} ${start.year} - ${GREGORIAN_MONTHS_EN[end.month - 1]} ${end.year}`
}

export function monthHijriRangeLabel(year: number, month: number) {
  const start = toHijri({ year, month, day: 1 })
  const end = toHijri({
    year,
    month,
    day: daysInJalaliMonth(year, month),
  })
  const startName = HIJRI_MONTHS[start.month - 1]
  const endName = HIJRI_MONTHS[end.month - 1]
  if (start.month === end.month && start.year === end.year) {
    return `${startName} ${start.year}`
  }
  if (start.year === end.year) {
    return `${startName} - ${endName} ${start.year}`
  }
  return `${startName} ${start.year} - ${endName} ${end.year}`
}

export function dayParts(ymd: JalaliYMD) {
  const g = toGregorian(ymd)
  const h = toHijri(ymd)
  return {
    jalaliDay: ymd.day,
    gregorianDay: g.day,
    hijriDay: h.day,
  }
}

export type MonthCell = {
  ymd: JalaliYMD
  date: string
  inMonth: boolean
}

export function buildMonthGrid(year: number, month: number): MonthCell[] {
  const days = daysInJalaliMonth(year, month)
  const offset = jalaliWeekdayIndex({ year, month, day: 1 })
  const prev = addJalaliMonths({ year, month, day: 1 }, -1)
  const prevDays = daysInJalaliMonth(prev.year, prev.month)
  const cells: MonthCell[] = []

  for (let i = offset - 1; i >= 0; i--) {
    const day = prevDays - i
    const ymd = { year: prev.year, month: prev.month, day }
    cells.push({
      ymd,
      date: toJalaliDateString(ymd),
      inMonth: false,
    })
  }

  for (let day = 1; day <= days; day++) {
    const ymd = { year, month, day }
    cells.push({
      ymd,
      date: toJalaliDateString(ymd),
      inMonth: true,
    })
  }

  const next = addJalaliMonths({ year, month, day: 1 }, 1)
  let nextDay = 1
  while (cells.length % 7 !== 0) {
    const ymd = { year: next.year, month: next.month, day: nextDay }
    cells.push({
      ymd,
      date: toJalaliDateString(ymd),
      inMonth: false,
    })
    nextDay += 1
  }

  return cells
}
