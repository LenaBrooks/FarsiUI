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

export default function BiaxialLineChartDemo() {
  const data = useSalesData(231)
  useLineSalesCaption("دو‌محوره")

  return (
    <LineShell>
      <ChartContainer config={lineSalesConfig} className={LINE_CHART_CLASS}>
        <LineChart
          accessibilityLayer
          data={data}
          margin={{ top: 18, right: 8, left: 8, bottom: 4 }}
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
            yAxisId="store"
            orientation="right"
            width={CHART_TOMAN_AXIS_WIDTH}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={TomanAxisTick}
          />
          <YAxis
            yAxisId="online"
            orientation="left"
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
            yAxisId="store"
            type="monotone"
            dataKey="store"
            name="store"
            stroke="var(--color-store)"
            strokeWidth={2.75}
            activeDot={{ r: 6, strokeWidth: 2, stroke: "var(--background)" }}
          />
          <Line
            yAxisId="online"
            type="monotone"
            dataKey="online"
            name="online"
            stroke="var(--color-online)"
            strokeWidth={2.25}
            activeDot={{ r: 5, strokeWidth: 2, stroke: "var(--background)" }}
          />
        </LineChart>
      </ChartContainer>
    </LineShell>
  )
}
