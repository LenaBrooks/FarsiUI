"use client"

import { useMemo } from "react"

import { useChartRandomSeed } from "@/registry/new-york-v4/lib/chart-live"
import { CHART_BAR_COLORS } from "@/lib/chart-fa"

import {
  CalendarHeatmap,
  generateCalendarHeatData,
} from "./heatmap-shared"

/** تقویم با سبز نرم پالت chart. */
export default function HeatmapCalendarEmeraldDemo() {
  const seed = useChartRandomSeed(9107)
  const data = useMemo(() => generateCalendarHeatData(365, seed), [seed])

  return (
    <CalendarHeatmap
      data={data}
      unit="کامیت"
      color={CHART_BAR_COLORS[2]}
      days={365}
      caption="پالت سبز نرم chart — مناسب تم روشن و تیره"
    />
  )
}
