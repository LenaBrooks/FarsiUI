"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

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

export default function AreaChartDemo({
  isAnimationActive = true,
}: {
  isAnimationActive?: boolean
}) {
  const data = usePersianMockData(6, 598905)

  return (
    <ChartContainer config={chart2MockConfig} className={chart2ContainerClassName}>
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{ top: 10, right: 8, left: 0, bottom: 5 }}
      >
        <defs>
          <linearGradient id="chart2AreaX" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-x)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-x)" stopOpacity={0.05} />
          </linearGradient>
          <linearGradient id="chart2AreaY" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-y)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-y)" stopOpacity={0.05} />
          </linearGradient>
        </defs>
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
        <Area
          type="monotone"
          dataKey="x"
          stroke="var(--color-x)"
          fill="url(#chart2AreaX)"
          fillOpacity={1}
          isAnimationActive={isAnimationActive}
          animationBegin={200}
          animationDuration={1300}
        />
        <Area
          type="monotone"
          dataKey="y"
          stroke="var(--color-y)"
          fill="url(#chart2AreaY)"
          fillOpacity={1}
          isAnimationActive={isAnimationActive}
        />
      </AreaChart>
    </ChartContainer>
  )
}
