"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import { FA_CHART, FA_MONTHS } from "@/lib/chart-locale"
import { CHART_BAR_COLORS } from "@/lib/chart-fa"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

export const description = "یک نمودار دایره‌ای با بخش‌های انباشته"

const desktopData = [
  { month: "january", store: 186, fill: "var(--color-january)" },
  { month: "february", store: 305, fill: "var(--color-february)" },
  { month: "march", store: 237, fill: "var(--color-march)" },
  { month: "april", store: 173, fill: "var(--color-april)" },
  { month: "may", store: 209, fill: "var(--color-may)" },
]

const mobileData = [
  { month: "january", online: 80, fill: "var(--color-january)" },
  { month: "february", online: 200, fill: "var(--color-february)" },
  { month: "march", online: 120, fill: "var(--color-march)" },
  { month: "april", online: 190, fill: "var(--color-april)" },
  { month: "may", online: 130, fill: "var(--color-may)" },
]

const chartConfig = {
  sales: {
    label: FA_CHART.sales,
  },
  store: {
    label: FA_CHART.store,
  },
  online: {
    label: FA_CHART.online,
  },
  january: {
    label: FA_MONTHS[0],
    color: CHART_BAR_COLORS[0],
  },
  february: {
    label: FA_MONTHS[1],
    color: CHART_BAR_COLORS[1],
  },
  march: {
    label: FA_MONTHS[2],
    color: CHART_BAR_COLORS[2],
  },
  april: {
    label: FA_MONTHS[3],
    color: CHART_BAR_COLORS[3],
  },
  may: {
    label: FA_MONTHS[4],
    color: CHART_BAR_COLORS[4],
  },
} satisfies ChartConfig

export default function ChartPieStacked() {
  return (
    <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelKey="sales"
                  nameKey="month"
                  indicator="line"
                  labelFormatter={(_, payload) => {
                    return chartConfig[
                      payload?.[0].dataKey as keyof typeof chartConfig
                    ].label
                  }}
                />
              }
            />
            <Pie data={desktopData} dataKey="store" outerRadius={60} />
            <Pie
              data={mobileData}
              dataKey="online"
              innerRadius={70}
              outerRadius={90}
            />
          </PieChart>
        </ChartContainer>
      )
}
