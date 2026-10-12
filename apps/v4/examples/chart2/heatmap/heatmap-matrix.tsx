"use client"

import { useMemo } from "react"

import { useChart2RandomSeed } from "@/components/chart2-live"

import {
  FA_WEEKDAYS_FULL,
  generateMatrixHeatData,
  MatrixHeatmap,
} from "./heatmap-shared"

const HOURS = Array.from({ length: 24 }, (_, i) => String(i))

export default function HeatmapMatrixDemo() {
  const seed = useChart2RandomSeed(7703)
  const values = useMemo(() => generateMatrixHeatData(7, 24, seed), [seed])

  return (
    <MatrixHeatmap
      rows={[...FA_WEEKDAYS_FULL]}
      cols={HOURS}
      values={values}
      color="var(--chart-2)"
      caption="ماتریس روز × ساعت — ستون‌ها از راست به چپ (۰ تا ۲۳)"
    />
  )
}
