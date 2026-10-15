"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import type { LabelProps, XAxisTickContentProps } from "recharts"

import {
  CHART_TOMAN_AXIS_WIDTH,
  formatToman,
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

function CustomizedLabel({ x, y, stroke, value, index }: LabelProps) {
  if (x == null || y == null || value == null) return null
  const px = Number(x)
  const py = Number(y)
  if (!Number.isFinite(px) || !Number.isFinite(py)) return null

  // Alternate above/below so labels stay clear of the stroke and neighbors.
  const above = typeof index !== "number" || index % 2 === 0
  const dy = above ? -14 : 18

  return (
    <text
      x={px}
      y={py}
      dy={dy}
      fill={stroke}
      fontSize={10}
      textAnchor="middle"
      fontFamily="var(--font-sans)"
      className="tracking-[0]"
      style={{
        paintOrder: "stroke",
        stroke: "var(--background)",
        strokeWidth: 3,
        strokeLinejoin: "round",
      }}
    >
      {formatToman(Number(value), { compact: true, suffix: false })}
    </text>
  )
}

function CustomizedAxisTick({ x, y, payload, fill }: XAxisTickContentProps) {
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="end"
        fill={fill}
        transform="rotate(-35)"
        fontFamily="var(--font-sans)"
      >
        {String(payload.value)}
      </text>
    </g>
  )
}

export default function CustomizedLabelLineChartDemo() {
  const data = useSalesData(2213)
  useLineSalesCaption("برچسب سفارشی")

  return (
    <LineShell>
      <ChartContainer config={lineSalesConfig} className={LINE_CHART_CLASS}>
        <LineChart
          accessibilityLayer
          data={data}
          margin={{ top: 28, right: 16, left: 16, bottom: 12 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            reversed
            height={60}
            tick={CustomizedAxisTick}
            tickLine={false}
            axisLine={false}
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
            label={CustomizedLabel}
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
