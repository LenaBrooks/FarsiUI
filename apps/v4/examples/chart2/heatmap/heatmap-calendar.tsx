"use client"

import { useMemo } from "react"

import { useChart2RandomSeed } from "@/components/chart2-live"

import {
  CalendarHeatmap,
  generateCalendarHeatData,
} from "./heatmap-shared"

/** Sample Nowruz / early Farvardin holidays (Gregorian keys). */
const SAMPLE_HOLIDAYS = [
  "2026-03-21",
  "2026-03-22",
  "2026-03-23",
  "2026-03-24",
  "2026-04-01",
]

export default function HeatmapCalendarDemo() {
  const seed = useChart2RandomSeed(4201)
  const data = useMemo(() => generateCalendarHeatData(365, seed), [seed])

  return (
    <CalendarHeatmap
      data={data}
      unit="سفارش"
      holidays={SAMPLE_HOLIDAYS}
      color="var(--chart-1)"
      caption="تقویم یک‌ساله شمسی — هفته از شنبه، ماه‌های جلالی، حاشیهٔ قرمز برای تعطیل"
    />
  )
}
