"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  CHART2_BAR_COLORS,
  FA_CHART,
  FA_MONTHS,
  chart2AreaContainerClassName,
  formatChart2Number,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

const data = FA_MONTHS.map((name, i) => ({
  name,
  uv: [4000, 3000, 2000, 2780, 1890, 2390][i]!,
}))

const chartConfig = {
  uv: {
    label: FA_CHART.store,
    color: CHART2_BAR_COLORS[2],
  },
} satisfies ChartConfig

export default function AreaCustomAnimationDemo() {
  return (
    <ChartContainer config={chartConfig} className={chart2AreaContainerClassName}>
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{ top: 10, right: 8, left: 0, bottom: 5 }}
      >
        <defs>
          <linearGradient id="chart2AreaCustomAnim" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-uv)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-uv)" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" reversed tickMargin={8} />
        <YAxis
          orientation="right"
          width={52}
          tickMargin={12}
          tickFormatter={formatChart2Number}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          type="monotone"
          dataKey="uv"
          stroke="var(--color-uv)"
          fill="url(#chart2AreaCustomAnim)"
          animationDuration={900}
          isAnimationActive
        />
      </AreaChart>
    </ChartContainer>
  )
}
