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
    <LineShell className="max-w-[320px]">
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
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            height={44}
            tickCount={4}
            tickLine={false}
            axisLine={false}
            tickMargin={6}
            padding={{ left: 0, right: 0 }}
            tick={TomanXAxisTick}
          />
          <YAxis
            dataKey="month"
            type="category"
            orientation="right"
            width={72}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            interval={0}
            padding={{ top: 0, bottom: 0 }}
          />
          <ChartTooltip
            cursor={LINE_TOOLTIP_CURSOR}
            content={<LineSalesTooltipContent />}
          />
          <Line
            dataKey="store"
            name="store"
            stroke="var(--color-store)"
            strokeWidth={2.5}
            isAnimationActive={props.isAnimationActive}
          />
          <Line
            dataKey="online"
            name="online"
            stroke="var(--color-online)"
            strokeWidth={2.25}
            isAnimationActive={props.isAnimationActive}
          />
        </LineChart>
      </ChartContainer>
    </LineShell>
  )
}
