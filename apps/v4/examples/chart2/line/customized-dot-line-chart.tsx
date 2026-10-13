"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import type { DotItemDotProps } from "recharts"

import { CHART2_BAR_COLORS } from "@/lib/chart2-fa"
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

const HAPPY_THRESHOLD = 200_000_000

/** Face + features as separate fills — works in light & dark (no black underlay). */
function CustomizedDot(props: DotItemDotProps) {
  const { cx, cy, value } = props
  if (cx == null || cy == null) return <g />

  const happy = Number(value) > HAPPY_THRESHOLD
  const face = happy ? CHART2_BAR_COLORS[2] : CHART2_BAR_COLORS[1]
  // Features follow the card/plot surface so they never read as a black disc.
  const feature = "var(--background)"

  return (
    <g>
      <circle cx={cx} cy={cy} r={10} fill={face} />
      <circle cx={cx - 3.2} cy={cy - 2.2} r={1.35} fill={feature} />
      <circle cx={cx + 3.2} cy={cy - 2.2} r={1.35} fill={feature} />
      {happy ? (
        <path
          d={`M ${cx - 4} ${cy + 2.2} Q ${cx} ${cy + 5.5} ${cx + 4} ${cy + 2.2}`}
          fill="none"
          stroke={feature}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      ) : (
        <path
          d={`M ${cx - 4} ${cy + 4.2} Q ${cx} ${cy + 1.2} ${cx + 4} ${cy + 4.2}`}
          fill="none"
          stroke={feature}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      )}
    </g>
  )
}

export default function CustomizedDotLineChartDemo() {
  const data = useSalesData(22213)
  useLineSalesCaption("نقطهٔ سفارشی")

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
            strokeWidth={2.5}
            dot={CustomizedDot}
          />
          <Line
            type="monotone"
            dataKey="online"
            name="online"
            stroke="var(--color-online)"
            strokeWidth={2.25}
          />
        </LineChart>
      </ChartContainer>
    </LineShell>
  )
}
