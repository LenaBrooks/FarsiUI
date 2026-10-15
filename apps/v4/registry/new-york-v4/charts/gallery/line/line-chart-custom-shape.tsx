"use client"

import { CartesianGrid, Curve, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  CHART_TOMAN_AXIS_WIDTH,
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
  useLineSalesCaption,
  useSalesData,
} from "./line-fa-shared"

function OpacityFadeShape(props: Record<string, unknown>) {
  const { animationElapsedTime = 1, isEntrance = false, ...rest } = props as {
    animationElapsedTime?: number
    isEntrance?: boolean
  } & Record<string, unknown>
  const opacity = isEntrance ? animationElapsedTime : 1
  return <Curve {...rest} strokeOpacity={opacity} />
}

export default function LineAnimatesOpacityDemo() {
  const data = useSalesData(100)
  useLineSalesCaption("انیمیشن شفافیت")

  return (
    <LineShell>
      <ChartContainer config={lineSalesConfig} className={LINE_CHART_CLASS}>
        <LineChart
          accessibilityLayer
          data={data}
          margin={{ top: 18, right: 12, left: 4, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            reversed
            tickLine={false}
            axisLine={false}
            tickMargin={12}
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
            type="monotone"
            dataKey="store"
            name="store"
            stroke="var(--color-store)"
            strokeWidth={3}
            shape={OpacityFadeShape}
            animationDuration={500}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </LineShell>
  )
}
