"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { usePersianMockData } from "@/components/chart2-live"
import {
  chart2AreaContainerClassName,
  chart2BarMockConfig,
  formatChart2Number,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/registry/new-york-v4/ui/chart"

export default function StackedAreaChartDemo() {
  const data = usePersianMockData(6, 351905)

  return (
    <ChartContainer config={chart2BarMockConfig} className={chart2AreaContainerClassName}>
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{ top: 20, right: 8, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" reversed tickMargin={8} />
        <YAxis
          orientation="right"
          width={52}
          tickMargin={12}
          tickFormatter={formatChart2Number}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          type="monotone"
          dataKey="x"
          stackId="1"
          stroke="var(--color-x)"
          fill="var(--color-x)"
          fillOpacity={0.7}
        />
        <Area
          type="monotone"
          dataKey="y"
          stackId="1"
          stroke="var(--color-y)"
          fill="var(--color-y)"
          fillOpacity={0.7}
        />
        <Area
          type="monotone"
          dataKey="z"
          stackId="1"
          stroke="var(--color-z)"
          fill="var(--color-z)"
          fillOpacity={0.7}
        />
      </AreaChart>
    </ChartContainer>
  )
}
