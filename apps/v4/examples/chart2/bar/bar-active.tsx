"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts"
import type { BarShapeProps } from "recharts/types/cartesian/Bar"

import { FA_CHART } from "@/lib/chart-locale"
import { CHART2_BAR_COLORS } from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

export const description = "یک نمودار میله‌ای با میله فعال"

const chartData = [
  { province: "tehran", sales: 187, fill: "var(--color-tehran)" },
  { province: "isfahan", sales: 200, fill: "var(--color-isfahan)" },
  { province: "fars", sales: 275, fill: "var(--color-fars)" },
  { province: "khorasan", sales: 173, fill: "var(--color-khorasan)" },
  { province: "other", sales: 90, fill: "var(--color-other)" },
]

const chartConfig = {
  sales: {
    label: FA_CHART.sales,
  },
  tehran: {
    label: FA_CHART.tehran,
    color: CHART2_BAR_COLORS[0],
  },
  isfahan: {
    label: FA_CHART.isfahan,
    color: CHART2_BAR_COLORS[1],
  },
  fars: {
    label: FA_CHART.fars,
    color: CHART2_BAR_COLORS[2],
  },
  khorasan: {
    label: FA_CHART.khorasan,
    color: CHART2_BAR_COLORS[3],
  },
  other: {
    label: FA_CHART.other,
    color: CHART2_BAR_COLORS[4],
  },
} satisfies ChartConfig

const ACTIVE_INDEX = 2

export default function ChartBarActive() {
  return (
    <ChartContainer config={chartConfig} dir="ltr">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="province"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="sales"
              strokeWidth={2}
              radius={8}
              shape={({ index, ...props }: BarShapeProps) =>
                index === ACTIVE_INDEX ? (
                  <Rectangle
                    {...props}
                    fillOpacity={0.8}
                    stroke={props.payload.fill}
                    strokeDasharray={4}
                    strokeDashoffset={4}
                  />
                ) : (
                  <Rectangle {...props} />
                )
              }
            />
          </BarChart>
        </ChartContainer>
      )
}
