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

export default function DashedLineChartDemo() {
  const data = usePersianMockData(6, 22133)
  return (
    <ChartContainer config={chart2MockConfig} className={chart2ContainerClassName}>
      <LineChart
        accessibilityLayer
        data={data}
        margin={{ top: 12, right: 8, left: 8, bottom: 8 }}
      >
        <CartesianGrid />
        <XAxis
          dataKey="label"
          reversed
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
          strokeDasharray="5 5"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="y"
          stroke="var(--color-y)"
          strokeWidth={2}
          strokeDasharray="3 4 5 2"
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  )
}
