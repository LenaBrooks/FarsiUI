"use client"

import { useMemo } from "react"

import { useChart2RandomSeed } from "@/components/chart2-live"
import { CHART2_BAR_COLORS } from "@/lib/chart2-fa"

import {
  CalendarHeatmap,
  generateCalendarHeatData,
} from "./heatmap-shared"

/** تقویم با سبز نرم پالت chart2. */
export default function HeatmapCalendarEmeraldDemo() {
  const seed = useChart2RandomSeed(9107)
  const data = useMemo(() => generateCalendarHeatData(365, seed), [seed])

  return (
    <CalendarHeatmap
      data={data}
      unit="کامیت"
      color={CHART2_BAR_COLORS[2]}
      days={365}
      caption="پالت سبز نرم chart2 — مناسب تم روشن و تیره"
    />
  )
}
