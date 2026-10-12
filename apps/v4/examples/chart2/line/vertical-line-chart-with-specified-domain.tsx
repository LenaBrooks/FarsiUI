"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  FA_CHART,
  FA_MONTHS,
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
  { name: FA_MONTHS[1], uv: 3000, pv: 1398 },
  { name: FA_MONTHS[2], uv: 2000, pv: 9800 },
  { name: FA_MONTHS[3], uv: 2780, pv: 3908 },
  { name: FA_MONTHS[4], uv: 1890, pv: 4800 },
  { name: FA_MONTHS[5], uv: 2390, pv: 3800 },
  { name: "مهر", uv: 3490, pv: 4300 },
]

const chartConfig = {
  pv: { label: FA_CHART.online, color: "var(--chart-1)" },
  uv: { label: FA_CHART.store, color: "var(--chart-2)" },
} satisfies ChartConfig

export default function VerticalLineChartWithSpecifiedDomainDemo(props: {
  isAnimationActive?: boolean
}) {
  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-[1/1.618] h-auto w-full max-w-[320px] max-h-[70vh] overflow-visible font-sans"
    >
      <LineChart
        accessibilityLayer
        layout="vertical"
        data={data}
        margin={{ top: 12, right: 8, left: 12, bottom: 12 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          type="number"
          domain={[0, "dataMax + 1000"]}
          height={52}
          tickLine={false}
          axisLine={false}
          tickMargin={18}
          padding={{ left: 28, right: 20 }}
          tick={{ dy: 4 }}
          tickFormatter={formatChart2Number}
        />
        <YAxis
          dataKey="name"
          type="category"
          orientation="right"
          width={96}
          tickLine={false}
          axisLine={false}
          tickMargin={18}
          tick={{ dx: 4 }}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          dataKey="pv"
          stroke="var(--color-pv)"
          isAnimationActive={props.isAnimationActive}
        />
        <Line
          dataKey="uv"
          stroke="var(--color-uv)"
          isAnimationActive={props.isAnimationActive}
        />
      </LineChart>
    </ChartContainer>
  )
}
