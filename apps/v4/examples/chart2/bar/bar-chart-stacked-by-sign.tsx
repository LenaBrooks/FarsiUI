"use client"

import { Bar, BarChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from "recharts"

import {
  FA_CHART,
  FA_MONTHS,
  chart2ContainerClassName,
  formatChart2Number,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

const data = [
  { name: FA_MONTHS[0], uv: 4000, pv: 2400 },
  { name: FA_MONTHS[1], uv: -3000, pv: 1398 },
  { name: FA_MONTHS[2], uv: -2000, pv: -9800 },
  { name: FA_MONTHS[3], uv: 2780, pv: 3908 },
  { name: FA_MONTHS[4], uv: -1890, pv: 4800 },
  { name: FA_MONTHS[5], uv: 2390, pv: -3800 },
  { name: "مهر", uv: 3490, pv: 4300 },
]

const chartConfig = {
  pv: { label: FA_CHART.online, color: "var(--chart-1)" },
  uv: { label: FA_CHART.store, color: "var(--chart-2)" },
} satisfies ChartConfig

export default function BarChartStackedBySignDemo() {
  return (
    <ChartContainer config={chartConfig} className={chart2ContainerClassName}>
      <BarChart
        accessibilityLayer
        data={data}
        stackOffset="sign"
        margin={{ top: 25, right: 8, left: 0, bottom: 5 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis dataKey="name" reversed tickMargin={8} />
        <YAxis
          orientation="right"
          width={56}
          tickMargin={10}
          tickFormatter={formatChart2Number}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <ReferenceLine y={0} stroke="var(--border)" />
        <Bar dataKey="pv" stackId="stack" fill="var(--color-pv)" />
        <Bar dataKey="uv" stackId="stack" fill="var(--color-uv)" />
      </BarChart>
    </ChartContainer>
  )
}
