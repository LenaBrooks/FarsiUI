"use client"

import { useMemo } from "react"

import { useChart2RandomSeed } from "@/components/chart2-live"

import {
  CalendarHeatmap,
  generateCalendarHeatData,
} from "./heatmap-shared"

/** GitHub-like emerald ramp via a vivid chart token. */
export default function HeatmapCalendarEmeraldDemo() {
  const seed = useChart2RandomSeed(9107)
  const data = useMemo(() => generateCalendarHeatData(365, seed), [seed])

  return (
    <CalendarHeatmap
      data={data}
      unit="کامیت"
      color="#30a14e"
      days={365}
      caption="پالت زمردی گیت‌هاب‌مانند — مناسب تم روشن و تیره"
    />
  )
}
