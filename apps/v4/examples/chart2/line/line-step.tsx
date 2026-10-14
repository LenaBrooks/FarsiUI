"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

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

export const description = "یک نمودار خطی پله‌ای"

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

export default function ChartLineStep() {
  return (
    <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={formatPersianMonthTick}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="store"
              type="step"
              stroke="var(--color-store)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      )
}
