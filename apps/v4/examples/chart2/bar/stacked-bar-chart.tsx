"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

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

export default function StackedBarChartDemo() {
  const data = usePersianMockData(6, 823)

  return (
    <ChartContainer config={chart2MockConfig} className={chart2ContainerClassName}>
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ top: 20, right: 8, left: 0, bottom: 5 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis dataKey="label" reversed tickMargin={8} />
        <YAxis
          orientation="right"
          width={52}
          tickMargin={12}
          tickFormatter={formatChart2Number}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="x" stackId="a" fill="var(--color-x)" radius={[0, 0, 0, 0]} />
        <Bar dataKey="y" stackId="a" fill="var(--color-y)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}
