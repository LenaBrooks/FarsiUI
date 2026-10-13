"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  CHART_TOMAN_AXIS_WIDTH,
  FA_CHART,
  formatPersianMonthTick,
} from "@/lib/chart-locale"
import { TomanAxisTick } from "@/lib/chart-toman-tick"
import {
  CHART2_BAR_COLORS,
  chart2BarContainerClassName,
} from "@/lib/chart2-fa"
import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

import {
  LineSalesTooltipContent,
  useSalesData,
} from "../line/line-fa-shared"

const barSalesConfig = {
  store: {
    label: FA_CHART.store,
    color: CHART2_BAR_COLORS[0],
  },
  online: {
    label: FA_CHART.online,
    color: CHART2_BAR_COLORS[1],
  },
} satisfies ChartConfig

const BAR_CHART_CLASS = cn(chart2BarContainerClassName, "max-w-none")

const BAR_TOOLTIP_CURSOR = {
  fill: "color-mix(in oklab, var(--foreground) 6%, transparent)",
} as const

export default function SimpleBarChartDemo() {
  const data = useSalesData(823)

  return (
    <div dir="rtl" className="flex w-full max-w-[700px] flex-col gap-2.5 font-sans">
      <ChartContainer config={barSalesConfig} className={BAR_CHART_CLASS}>
        <BarChart
          accessibilityLayer
          data={data}
          barCategoryGap="22%"
          barGap={5}
          margin={{ top: 18, right: 8, left: 2, bottom: 4 }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            reversed
            tickLine={false}
            axisLine={false}
            tickMargin={12}
            tickFormatter={formatPersianMonthTick}
          />
          <YAxis
            orientation="right"
            width={CHART_TOMAN_AXIS_WIDTH}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={TomanAxisTick}
          />
          <ChartTooltip
            cursor={BAR_TOOLTIP_CURSOR}
            content={<LineSalesTooltipContent />}
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="store"
            name="store"
            fill="var(--color-store)"
            radius={[5, 5, 0, 0]}
            maxBarSize={32}
          />
          <Bar
            dataKey="online"
            name="online"
            fill="var(--color-online)"
            radius={[5, 5, 0, 0]}
            maxBarSize={32}
          />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
