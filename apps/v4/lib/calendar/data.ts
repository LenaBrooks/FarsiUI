import events1383 from "../../../../calendar/years/1383/events.json"
import holidays1383 from "../../../../calendar/years/1383/holidays.json"
import events1384 from "../../../../calendar/years/1384/events.json"
import holidays1384 from "../../../../calendar/years/1384/holidays.json"
import events1385 from "../../../../calendar/years/1385/events.json"
import holidays1385 from "../../../../calendar/years/1385/holidays.json"
import events1386 from "../../../../calendar/years/1386/events.json"
import holidays1386 from "../../../../calendar/years/1386/holidays.json"
import events1387 from "../../../../calendar/years/1387/events.json"
import holidays1387 from "../../../../calendar/years/1387/holidays.json"
import events1388 from "../../../../calendar/years/1388/events.json"
import holidays1388 from "../../../../calendar/years/1388/holidays.json"
import events1389 from "../../../../calendar/years/1389/events.json"
import holidays1389 from "../../../../calendar/years/1389/holidays.json"
import events1390 from "../../../../calendar/years/1390/events.json"
import holidays1390 from "../../../../calendar/years/1390/holidays.json"
import events1391 from "../../../../calendar/years/1391/events.json"
import holidays1391 from "../../../../calendar/years/1391/holidays.json"
import events1392 from "../../../../calendar/years/1392/events.json"
import holidays1392 from "../../../../calendar/years/1392/holidays.json"
import events1393 from "../../../../calendar/years/1393/events.json"
import holidays1393 from "../../../../calendar/years/1393/holidays.json"
import events1394 from "../../../../calendar/years/1394/events.json"
import holidays1394 from "../../../../calendar/years/1394/holidays.json"
import events1395 from "../../../../calendar/years/1395/events.json"
import holidays1395 from "../../../../calendar/years/1395/holidays.json"
import events1396 from "../../../../calendar/years/1396/events.json"
import holidays1396 from "../../../../calendar/years/1396/holidays.json"
import events1397 from "../../../../calendar/years/1397/events.json"
import holidays1397 from "../../../../calendar/years/1397/holidays.json"
import events1398 from "../../../../calendar/years/1398/events.json"
import holidays1398 from "../../../../calendar/years/1398/holidays.json"
import events1399 from "../../../../calendar/years/1399/events.json"
import holidays1399 from "../../../../calendar/years/1399/holidays.json"
import events1400 from "../../../../calendar/years/1400/events.json"
import holidays1400 from "../../../../calendar/years/1400/holidays.json"
import events1401 from "../../../../calendar/years/1401/events.json"
import holidays1401 from "../../../../calendar/years/1401/holidays.json"
import events1402 from "../../../../calendar/years/1402/events.json"
import holidays1402 from "../../../../calendar/years/1402/holidays.json"
import events1403 from "../../../../calendar/years/1403/events.json"
import holidays1403 from "../../../../calendar/years/1403/holidays.json"
import events1404 from "../../../../calendar/years/1404/events.json"
import holidays1404 from "../../../../calendar/years/1404/holidays.json"
import events1405 from "../../../../calendar/years/1405/events.json"
import holidays1405 from "../../../../calendar/years/1405/holidays.json"

import type { CalendarOccasion, YearOccasionsFile } from "./types"

const YEAR_DATA: Record<
  number,
  { holidays: YearOccasionsFile; events: YearOccasionsFile }
> = {
  1383: {
    holidays: holidays1383 as YearOccasionsFile,
    events: events1383 as YearOccasionsFile,
  },
  1384: {
    holidays: holidays1384 as YearOccasionsFile,
    events: events1384 as YearOccasionsFile,
  },
  1385: {
    holidays: holidays1385 as YearOccasionsFile,
    events: events1385 as YearOccasionsFile,
  },
  1386: {
    holidays: holidays1386 as YearOccasionsFile,
    events: events1386 as YearOccasionsFile,
  },
  1387: {
    holidays: holidays1387 as YearOccasionsFile,
    events: events1387 as YearOccasionsFile,
  },
  1388: {
    holidays: holidays1388 as YearOccasionsFile,
    events: events1388 as YearOccasionsFile,
  },
  1389: {
    holidays: holidays1389 as YearOccasionsFile,
    events: events1389 as YearOccasionsFile,
  },
  1390: {
    holidays: holidays1390 as YearOccasionsFile,
    events: events1390 as YearOccasionsFile,
  },
  1391: {
    holidays: holidays1391 as YearOccasionsFile,
    events: events1391 as YearOccasionsFile,
  },
  1392: {
    holidays: holidays1392 as YearOccasionsFile,
    events: events1392 as YearOccasionsFile,
  },
  1393: {
    holidays: holidays1393 as YearOccasionsFile,
    events: events1393 as YearOccasionsFile,
  },
  1394: {
    holidays: holidays1394 as YearOccasionsFile,
    events: events1394 as YearOccasionsFile,
  },
  1395: {
    holidays: holidays1395 as YearOccasionsFile,
    events: events1395 as YearOccasionsFile,
  },
  1396: {
    holidays: holidays1396 as YearOccasionsFile,
    events: events1396 as YearOccasionsFile,
  },
  1397: {
    holidays: holidays1397 as YearOccasionsFile,
    events: events1397 as YearOccasionsFile,
  },
  1398: {
    holidays: holidays1398 as YearOccasionsFile,
    events: events1398 as YearOccasionsFile,
  },
  1399: {
    holidays: holidays1399 as YearOccasionsFile,
    events: events1399 as YearOccasionsFile,
  },
  1400: {
    holidays: holidays1400 as YearOccasionsFile,
    events: events1400 as YearOccasionsFile,
  },
  1401: {
    holidays: holidays1401 as YearOccasionsFile,
    events: events1401 as YearOccasionsFile,
  },
  1402: {
    holidays: holidays1402 as YearOccasionsFile,
    events: events1402 as YearOccasionsFile,
  },
  1403: {
    holidays: holidays1403 as YearOccasionsFile,
    events: events1403 as YearOccasionsFile,
  },
  1404: {
    holidays: holidays1404 as YearOccasionsFile,
    events: events1404 as YearOccasionsFile,
  },
  1405: {
    holidays: holidays1405 as YearOccasionsFile,
    events: events1405 as YearOccasionsFile,
  },
}

export const CALENDAR_AVAILABLE_YEARS = Object.keys(YEAR_DATA)
  .map(Number)
  .sort((a, b) => a - b)

/** Strip glued Gregorian/Hijri date annotations from occasion titles (e.g. [30 September]). */
export function cleanOccasionTitleFa(title: string): string {
  return title
    .replace(
      /\[[\d۰-۹]+\s*(?:[A-Za-z][A-Za-z\s.]*|[\u0600-\u06FF][\u0600-\u06FF\s]*)\]/g,
      ""
    )
    .replace(
      /\s*(?:January|February|March|April|May|June|July|August|September|October|November|December)\b/gi,
      ""
    )
    .replace(/\s{2,}/g, " ")
    .trim()
}

function withCleanTitles(items: CalendarOccasion[]): CalendarOccasion[] {
  return items.map((item) => {
    const fa = item.title?.fa
    if (typeof fa !== "string") return item
    const cleaned = cleanOccasionTitleFa(fa)
    return cleaned === fa ? item : { ...item, title: { ...item.title, fa: cleaned } }
  })
}

export function getYearHolidays(year: number): CalendarOccasion[] {
  return withCleanTitles(YEAR_DATA[year]?.holidays.items ?? [])
}

export function getYearEvents(year: number): CalendarOccasion[] {
  return withCleanTitles(YEAR_DATA[year]?.events.items ?? [])
}

export function getOccasionsForDate(
  year: number,
  date: string
): CalendarOccasion[] {
  const holidays = getYearHolidays(year).filter((item) => item.date === date)
  const events = getYearEvents(year).filter((item) => item.date === date)
  return [...holidays, ...events]
}

export function getOccasionsForMonth(
  year: number,
  month: number
): CalendarOccasion[] {
  const prefix = `${year}-${String(month).padStart(2, "0")}-`
  const holidays = getYearHolidays(year).filter((item) =>
    item.date.startsWith(prefix)
  )
  const events = getYearEvents(year).filter((item) =>
    item.date.startsWith(prefix)
  )
  return [...holidays, ...events].sort((a, b) =>
    a.date === b.date
      ? Number(b.isHoliday) - Number(a.isHoliday) || a.id.localeCompare(b.id)
      : a.date.localeCompare(b.date)
  )
}

export function isHolidayDate(year: number, date: string): boolean {
  return getYearHolidays(year).some((item) => item.date === date)
}
