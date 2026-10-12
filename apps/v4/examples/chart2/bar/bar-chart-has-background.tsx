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

export default function BarChartHasBackgroundDemo({
  defaultIndex,
}: {
  defaultIndex?: number
}) {
  const data = usePersianMockData(6, 2387)

  return (
    <ChartContainer config={chart2MockConfig} className={chart2ContainerClassName}>
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ top: 25, right: 8, left: 0, bottom: 5 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis dataKey="label" reversed tickMargin={8} />
        <YAxis
          orientation="right"
          width={52}
          tickMargin={12}
          tickFormatter={formatChart2Number}
        />
        <ChartTooltip
          defaultIndex={defaultIndex}
          content={<ChartTooltipContent />}
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="x" fill="var(--color-x)" background={{ fill: "var(--muted)" }} radius={[4, 4, 0, 0]} />
        <Bar dataKey="z" fill="var(--color-z)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}
