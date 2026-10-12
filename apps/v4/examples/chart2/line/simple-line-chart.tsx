"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import { usePersianMockData } from "@/components/chart2-live"
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

export default function SimpleLineChartDemo() {
  const data = usePersianMockData(6, 26213)

  return (
    <ChartContainer config={chart2MockConfig} className={chart2ContainerClassName}>
      <LineChart
        accessibilityLayer
        data={data}
        margin={{ top: 5, right: 8, left: 0, bottom: 5 }}
      >
        <CartesianGrid />
        <XAxis dataKey="label" reversed tickMargin={8} />
        <YAxis
          orientation="right"
          width={52}
          tickMargin={12}
          tickFormatter={formatChart2Number}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line dataKey="x" stroke="var(--color-x)" />
        <Line dataKey="y" stroke="var(--color-y)" />
      </LineChart>
    </ChartContainer>
  )
}
