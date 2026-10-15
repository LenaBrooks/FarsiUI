"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { usePersianMockData } from "@/components/chart-live"
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

export default function BarChartHasBackgroundDemo({
  defaultIndex,
}: {
  defaultIndex?: number
}) {
  const data = usePersianMockData(6, 2387)

  return (
    <ChartContainer
      config={chartBarMockConfig}
      className={chartBarContainerClassName}
    >
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ top: 25, right: 8, left: 0, bottom: 5 }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="label" reversed tickMargin={8} />
        <YAxis
          orientation="right"
          width={52}
          tickMargin={12}
          tickFormatter={formatChartNumber}
        />
        <ChartTooltip
          defaultIndex={defaultIndex}
          content={<ChartTooltipContent />}
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="x"
          fill="var(--color-x)"
          background={{ fill: "var(--muted)" }}
          radius={[4, 4, 0, 0]}
        />
        <Bar dataKey="z" fill="var(--color-z)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}
