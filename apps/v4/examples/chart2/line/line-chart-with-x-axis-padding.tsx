"use client"

import { usePersianMockData } from "@/components/chart2-live"
import { CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis } from "recharts"

import {
  chart2ContainerClassName,
  chart2MockConfig,
  formatChart2Number,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/registry/new-york-v4/ui/chart"

export default function LineChartWithXAxisPaddingDemo() {
  const data = usePersianMockData(6, 248213)
  return (
    <ChartContainer config={chart2MockConfig} className={chart2ContainerClassName}>
      <LineChart accessibilityLayer data={data}>
        <CartesianGrid />
        <XAxis
          dataKey="label"
          reversed
          padding={{ left: 30, right: 100 }}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
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
          activeDot={{ r: 8 }}
        />
        <Line
          type="monotone"
          dataKey="y"
          stroke="var(--color-y)"
          strokeWidth={2}
        />
      </LineChart>
    </ChartContainer>
  )
}
