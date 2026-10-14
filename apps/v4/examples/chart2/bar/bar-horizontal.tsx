"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
  formatPersianMonthTick,
  FA_CHART,
  FA_MONTHS,
} from "@/lib/chart-locale"
import { CHART2_BAR_COLORS } from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

export const description = "یک نمودار میله‌ای افقی"

const chartData = [
  { month: FA_MONTHS[0], store: 186 },
  { month: FA_MONTHS[1], store: 305 },
  { month: FA_MONTHS[2], store: 237 },
  { month: FA_MONTHS[3], store: 73 },
  { month: FA_MONTHS[4], store: 209 },
  { month: FA_MONTHS[5], store: 214 },
]

const chartConfig = {
  store: {
    label: FA_CHART.store,
    color: CHART2_BAR_COLORS[0],
  },
} satisfies ChartConfig

export default function ChartBarHorizontal() {
  // Recharts vertical layout needs LTR geometry so Y ticks stay outside bars.
  return (
    <ChartContainer config={chartConfig} dir="ltr">
      <BarChart
        accessibilityLayer
        data={chartData}
        layout="vertical"
        margin={{
          left: 8,
          right: 12,
          top: 4,
          bottom: 4,
        }}
      >
        <XAxis type="number" dataKey="store" hide />
        <YAxis
          dataKey="month"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          width={78}
          tickFormatter={formatPersianMonthTick}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey="store" fill="var(--color-store)" radius={5} />
      </BarChart>
    </ChartContainer>
  )
}
