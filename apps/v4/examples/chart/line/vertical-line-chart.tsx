"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import { TomanXAxisTick } from "@/lib/chart-toman-tick"
import {
  ChartContainer,
  ChartTooltip,
} from "@/registry/new-york-v4/ui/chart"

import {
  LINE_TOOLTIP_CURSOR,
  LineSalesTooltipContent,
  LineShell,
  VERTICAL_LINE_CHART_CLASS,
  lineSalesConfig,
  useLineSalesCaption,
  useSalesData,
} from "./line-fa-shared"

export default function VerticalLineChartDemo(props: {
  isAnimationActive?: boolean
}) {
  const data = useSalesData(294213)
  useLineSalesCaption("عمودی")

  return (
    <LineShell className="max-w-[460px]">
      <ChartContainer
        config={lineSalesConfig}
        className={VERTICAL_LINE_CHART_CLASS}
      >
        <LineChart
          accessibilityLayer
          layout="vertical"
          data={data}
          margin={{ top: 8, right: 4, left: 8, bottom: 4 }}
        >
          {/* Horizontal bands through each month row (same Y as dots / labels). */}
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            type="number"
            height={46}
            tickCount={4}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            // No axis padding — ticks and point X share the same scale.
            padding={{ left: 0, right: 0 }}
            tick={TomanXAxisTick}
          />
          <YAxis
            dataKey="month"
            type="category"
            orientation="right"
            width={68}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            interval={0}
            // No band padding — month labels stay centered on each point row.
            padding={{ top: 0, bottom: 0 }}
          />
          <ChartTooltip
            cursor={LINE_TOOLTIP_CURSOR}
            content={<LineSalesTooltipContent />}
          />
          <Line
            type="linear"
            dataKey="store"
            name="store"
            stroke="var(--color-store)"
            strokeWidth={2.5}
            dot={{
              r: 3.5,
              strokeWidth: 2,
              stroke: "var(--background)",
              fill: "var(--color-store)",
            }}
            activeDot={{
              r: 5.5,
              strokeWidth: 2,
              stroke: "var(--background)",
              fill: "var(--color-store)",
            }}
            isAnimationActive={props.isAnimationActive}
          />
          <Line
            type="linear"
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
            isAnimationActive={props.isAnimationActive}
          />
        </LineChart>
      </ChartContainer>
    </LineShell>
  )
}
