"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { usePersianMockData } from "@/lib/chart-live"
import {
  chartBarContainerClassName,
  chartBarMockConfig,
  formatChartNumber,
} from "@/lib/chart-fa"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/registry/new-york-v4/ui/chart"

export default function StackedBarChartDemo() {
  const data = usePersianMockData(6, 823)

  return (
    <ChartContainer
      config={chartBarMockConfig}
      className={chartBarContainerClassName}
    >
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ top: 20, right: 8, left: 0, bottom: 5 }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="label" reversed tickMargin={8} />
        <YAxis
          orientation="right"
          width={52}
          tickMargin={12}
          tickFormatter={formatChartNumber}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="x"
          stackId="a"
          fill="var(--color-x)"
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey="y"
          stackId="a"
          fill="var(--color-y)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  )
}
