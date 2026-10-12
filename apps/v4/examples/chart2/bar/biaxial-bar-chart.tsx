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

export default function BiaxialBarChartDemo() {
  const data = usePersianMockData(6, 823)

  return (
    <ChartContainer config={chart2MockConfig} className={chart2ContainerClassName}>
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ top: 20, right: 8, left: 8, bottom: 5 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis dataKey="label" reversed tickMargin={8} />
        <YAxis
          yAxisId="left"
          orientation="left"
          width={48}
          tickMargin={8}
          tickFormatter={formatChart2Number}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          width={48}
          tickMargin={8}
          tickFormatter={formatChart2Number}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar yAxisId="left" dataKey="x" fill="var(--color-x)" radius={[4, 4, 0, 0]} />
        <Bar yAxisId="right" dataKey="y" fill="var(--color-y)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}
