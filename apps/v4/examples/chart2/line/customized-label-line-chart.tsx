"use client"

import { usePersianMockData } from "@/components/chart2-live"
import { CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis } from "recharts"
import type { LabelProps,
  XAxisTickContentProps } from "recharts"

import {
  chart2ContainerClassName,
  chart2MockConfig,
  formatChart2Number,
  toPersianDigits,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/registry/new-york-v4/ui/chart"

function CustomizedLabel({ x, y, stroke, value }: LabelProps) {
  return (
    <text
      x={x}
      y={y}
      dy={-4}
      fill={stroke}
      fontSize={10}
      textAnchor="middle"
      fontFamily="var(--font-sans)"
    >
      {formatChart2Number(Number(value))}
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
        {toPersianDigits(String(payload.value))}
      </text>
    </g>
  )
}

export default function CustomizedLabelLineChartDemo() {
  const data = usePersianMockData(6, 2213)
  return (
    <ChartContainer config={chart2MockConfig} className={chart2ContainerClassName}>
      <LineChart
        accessibilityLayer
        data={data}
        margin={{ top: 20, right: 16, left: 16, bottom: 12 }}
      >
        <CartesianGrid />
        <XAxis
          dataKey="label"
          reversed
          height={60}
          tick={CustomizedAxisTick}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          orientation="right"
          width={48}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={formatChart2Number}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          type="monotone"
          dataKey="x"
          stroke="var(--color-x)"
          strokeWidth={2}
          label={CustomizedLabel}
        />
        <Line type="monotone" dataKey="y" stroke="var(--color-y)" strokeWidth={2} />
      </LineChart>
    </ChartContainer>
  )
}
