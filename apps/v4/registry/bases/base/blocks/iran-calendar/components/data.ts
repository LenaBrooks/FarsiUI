"use client"

import * as React from "react"

import { calendarYearUrls } from "./cdn"
import type { CalendarOccasion, YearOccasionsFile } from "./types"

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
    return cleaned === fa
      ? item
      : { ...item, title: { ...item.title, fa: cleaned } }
  })
}

async function fetchYearFile(url: string): Promise<CalendarOccasion[]> {
  const res = await fetch(url)
  if (!res.ok) return []
  const data = (await res.json()) as YearOccasionsFile
  return withCleanTitles(data.items ?? [])
}

export function useIranCalendarYearData(year: number) {
  const [holidays, setHolidays] = React.useState<CalendarOccasion[]>([])
  const [events, setEvents] = React.useState<CalendarOccasion[]>([])
  const [availableYears, setAvailableYears] = React.useState<number[]>([year])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let cancelled = false
    const urls = calendarYearUrls(year)

    async function load() {
      setLoading(true)
      try {
        const [holidaysItems, eventsItems, metaRes] = await Promise.all([
          fetchYearFile(urls.holidays),
          fetchYearFile(urls.events),
          fetch(urls.meta),
        ])
        if (cancelled) return
        setHolidays(holidaysItems)
        setEvents(eventsItems)
        if (metaRes.ok) {
          const meta = (await metaRes.json()) as { years?: number[] }
          if (Array.isArray(meta.years) && meta.years.length > 0) {
            setAvailableYears([...meta.years].sort((a, b) => b - a))
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [year])

  const getOccasionsForMonth = React.useCallback(
    (month: number) => {
      const prefix = `${year}-${String(month).padStart(2, "0")}-`
      return [...holidays, ...events]
        .filter((item) => item.date.startsWith(prefix))
        .sort((a, b) =>
          a.date === b.date
            ? Number(b.isHoliday) - Number(a.isHoliday) ||
              a.id.localeCompare(b.id)
            : a.date.localeCompare(b.date)
        )
    },
    [year, holidays, events]
  )

  const isHolidayDate = React.useCallback(
    (date: string) => holidays.some((item) => item.date === date),
    [holidays]
  )

  return {
    availableYears,
    loading,
    getOccasionsForMonth,
    isHolidayDate,
    hasYearData: holidays.length > 0 || events.length > 0,
  }
}
