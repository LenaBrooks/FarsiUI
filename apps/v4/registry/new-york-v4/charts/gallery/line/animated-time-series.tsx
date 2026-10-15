"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import { useChartRandomSeed } from "@/lib/chart-live"
import {
  CHART_TOMAN_AXIS_WIDTH,
  FA_MONTHS_FULL,
  formatPersianMonthTick,
} from "@/lib/chart-locale"
import { TomanAxisTick } from "@/lib/chart-toman-tick"
import {
  ChartContainer,
  ChartTooltip,
} from "@/registry/new-york-v4/ui/chart"

import {
  LINE_CHART_CLASS,
  LINE_TOOLTIP_CURSOR,
  LineSalesTooltipContent,
  LineShell,
  lineSalesConfig,
  scaleSales,
  useLineSalesCaption,
  type SalesPoint,
} from "./line-fa-shared"

const WINDOW = 6
const DATA_LENGTH = 12

function buildYear(seed: number): SalesPoint[] {
  const base = scaleSales(seed, 6)
  const second = scaleSales(seed ^ 0x9e3779b9, 6)
  return [
    ...base,
    ...second.map((row, i) => ({
      ...row,
      month: FA_MONTHS_FULL[i + 6] ?? row.month,
    })),
  ]
}

function getCircularWindowData(
  allData: SalesPoint[],
  windowStart: number
): SalesPoint[] {
  return Array.from({ length: WINDOW }, (_, index) => {
    return allData[(windowStart + index) % DATA_LENGTH]!
  })
}

export default function LineAnimatedTimeSeriesDemo() {
  const seed = useChartRandomSeed(90)
  const allData = React.useMemo(() => buildYear(seed), [seed])
  const [windowStart, setWindowStart] = React.useState(0)

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setWindowStart((s) => (s + 1) % DATA_LENGTH)
    }, 800)
    return () => window.clearInterval(id)
  }, [])

  const data = getCircularWindowData(allData, windowStart)
  useLineSalesCaption("سری زمانی متحرک")

  return (
    <LineShell>
      <ChartContainer
        config={lineSalesConfig}
        className={`${LINE_CHART_CLASS} max-w-[600px]`}
      >
        <LineChart
          accessibilityLayer
          data={data}
          margin={{ top: 16, right: 12, left: 4, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            reversed
            allowDataOverflow
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tickFormatter={formatPersianMonthTick}
          />
          <YAxis
            orientation="right"
            width={CHART_TOMAN_AXIS_WIDTH}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={TomanAxisTick}
          />
          <ChartTooltip
            cursor={LINE_TOOLTIP_CURSOR}
            content={<LineSalesTooltipContent />}
          />
          <Line
            dataKey="online"
            name="online"
            stroke="var(--color-online)"
            strokeWidth={2.25}
            animationDuration={800}
            isAnimationActive
            dot={false}
          />
          <Line
            dataKey="store"
            name="store"
            stroke="var(--color-store)"
            strokeWidth={2.75}
            animationDuration={800}
            isAnimationActive
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </LineShell>
  )
}
