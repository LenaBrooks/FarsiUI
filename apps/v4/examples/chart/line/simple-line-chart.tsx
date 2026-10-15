"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

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

export default function SimpleLineChartDemo() {
  const data = useSalesData(26213)
  useLineSalesCaption()

  return (
    <LineShell>
      <ChartContainer config={lineSalesConfig} className={LINE_CHART_CLASS}>
        <LineChart
          accessibilityLayer
          data={data}
          margin={{ top: 18, right: 8, left: 2, bottom: 4 }}
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
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={CHART_TOMAN_AXIS_WIDTH}
            tick={TomanAxisTick}
          />
          <ChartTooltip
            cursor={LINE_TOOLTIP_CURSOR}
            content={<LineSalesTooltipContent />}
          />
          <Line
            type="monotone"
            dataKey="online"
            name="online"
            stroke="var(--color-online)"
            strokeWidth={2.25}
            dot={{
              r: 3,
              strokeWidth: 2,
              stroke: "var(--background)",
              fill: "var(--color-online)",
            }}
            activeDot={{
              r: 5,
              strokeWidth: 2,
              stroke: "var(--background)",
              fill: "var(--color-online)",
            }}
            animationDuration={650}
          />
          <Line
            type="monotone"
            dataKey="store"
            name="store"
            stroke="var(--color-store)"
            strokeWidth={2.75}
            dot={{
              r: 3.5,
              strokeWidth: 2,
              stroke: "var(--background)",
              fill: "var(--color-store)",
            }}
            activeDot={{
              r: 6,
              strokeWidth: 2,
              stroke: "var(--background)",
              fill: "var(--color-store)",
            }}
            animationDuration={700}
          />
        </LineChart>
      </ChartContainer>
    </LineShell>
  )
}
