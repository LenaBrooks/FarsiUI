"use client"

import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

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

export const description = "یک نمودار راداری فقط با خطوط"

const chartData = [
  { month: FA_MONTHS[0], store: 186, online: 160 },
  { month: FA_MONTHS[1], store: 185, online: 170 },
  { month: FA_MONTHS[2], store: 207, online: 180 },
  { month: FA_MONTHS[3], store: 173, online: 160 },
  { month: FA_MONTHS[4], store: 160, online: 190 },
  { month: FA_MONTHS[5], store: 174, online: 204 },
]

const chartConfig = {
  store: {
    label: FA_CHART.store,
    color: CHART2_BAR_COLORS[0],
  },
  online: {
    label: FA_CHART.online,
    color: CHART2_BAR_COLORS[1],
  },
} satisfies ChartConfig

export default function ChartRadarLinesOnly() {
  return (
    <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <PolarAngleAxis
              dataKey="month"
              tickFormatter={formatPersianMonthTick}
            />
            <PolarGrid radialLines={false} />
            <Radar
              dataKey="store"
              fill="var(--color-store)"
              fillOpacity={0}
              stroke="var(--color-store)"
              strokeWidth={2}
            />
            <Radar
              dataKey="online"
              fill="var(--color-online)"
              fillOpacity={0}
              stroke="var(--color-online)"
              strokeWidth={2}
            />
          </RadarChart>
        </ChartContainer>
      )
}
