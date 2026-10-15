"use client"

import { useMemo } from "react"

import { useChartRandomSeed } from "@/registry/new-york-v4/lib/chart-live"
import { CHART_BAR_COLORS } from "@/lib/chart-fa"

import {
  FA_WEEKDAYS_FULL,
  generateMatrixHeatData,
  MatrixHeatmap,
} from "./heatmap-shared"

const HOURS = Array.from({ length: 24 }, (_, i) => String(i))

export default function HeatmapMatrixDemo() {
  const seed = useChartRandomSeed(7703)
  const values = useMemo(() => generateMatrixHeatData(7, 24, seed), [seed])

  return (
    <MatrixHeatmap
      rows={[...FA_WEEKDAYS_FULL]}
      cols={HOURS}
      values={values}
      color={CHART_BAR_COLORS[0]}
      caption="ماتریس روز × ساعت — ستون‌ها از راست به چپ (۰ تا ۲۳)"
    />
  )
}
