"use client"

import { useMemo } from "react"

import { useChartRandomSeed } from "@/components/chart-live"
import { CHART_BAR_COLORS } from "@/lib/chart-fa"

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
  const seed = useChartRandomSeed(4201)
  const data = useMemo(() => generateCalendarHeatData(365, seed), [seed])

  return (
    <CalendarHeatmap
      data={data}
      unit="سفارش"
      holidays={SAMPLE_HOLIDAYS}
      color={CHART_BAR_COLORS[0]}
      caption="تقویم یک‌ساله شمسی — هفته از شنبه، ماه‌های جلالی، حاشیهٔ قرمز برای تعطیل"
    />
  )
}
