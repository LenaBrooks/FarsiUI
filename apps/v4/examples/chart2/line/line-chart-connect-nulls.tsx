"use client"

import type { ReactNode } from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import { CHART2_BAR_COLORS } from "@/lib/chart2-fa"
import {
  CHART_TOMAN_AXIS_WIDTH,
  FA_CHART,
  FA_MONTHS,
  formatPersianMonthTick,
  formatToman,
} from "@/lib/chart-locale"
import { TomanAxisTick } from "@/lib/chart-toman-tick"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"
import { useChart2Caption } from "@/components/chart2-live"

import { LINE_TOOLTIP_CURSOR } from "./line-fa-shared"

const data = [
  { month: FA_MONTHS[0], store: 186_000_000 },
  { month: FA_MONTHS[1], store: 305_000_000 },
  { month: FA_MONTHS[2], store: 237_000_000 },
  { month: FA_MONTHS[3] },
  { month: FA_MONTHS[4], store: 209_000_000 },
  { month: FA_MONTHS[5], store: 214_000_000 },
  { month: "مهر", store: 260_000_000 },
]

const chartConfig = {
  store: {
    label: FA_CHART.store,
    color: CHART2_BAR_COLORS[0],
  },
} satisfies ChartConfig

function BaseChart({ children }: { children: ReactNode }) {
  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-[1.618] h-auto w-full max-w-[700px] max-h-[30vh] font-sans [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-muted-foreground/32 dark:[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-muted-foreground/38"
    >
      <LineChart
        accessibilityLayer
        data={data}
        margin={{ top: 18, right: 12, left: 4, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          reversed
          tickLine={false}
          axisLine={false}
          tickMargin={10}
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
          cursor={LINE_TOOLTIP_CURSOR}
          content={
            <ChartTooltipContent
              className="min-w-[11rem]"
              labelFormatter={(label) => (
                <span className="text-muted-foreground">ماه {label}</span>
              )}
              formatter={(value) => (
                <div className="flex w-full flex-1 items-center justify-between gap-6">
                  <span className="text-muted-foreground">{FA_CHART.store}</span>
                  <span className="font-medium tracking-[0]">
                    {value == null
                      ? "—"
                      : formatToman(Number(value), { compact: true })}
                  </span>
                </div>
              )}
            />
          }
        />
        {children}
      </LineChart>
    </ChartContainer>
  )
}

export default function LineChartConnectNullsDemo() {
  useChart2Caption(
    () => "اتصال مقادیر تهی · فروش حضوری · بازهٔ شمسی",
    []
  )

  return (
    <div dir="rtl" className="flex w-full max-w-[700px] flex-col gap-4 font-sans">
      <p className="text-[11px] text-muted-foreground">بدون اتصال تهی</p>
      <BaseChart>
        <Line
          type="monotone"
          dataKey="store"
          stroke="var(--color-store)"
          strokeWidth={2.5}
          dot={{ r: 3, strokeWidth: 2, stroke: "var(--background)" }}
        />
      </BaseChart>
      <p className="text-[11px] text-muted-foreground">با اتصال تهی</p>
      <BaseChart>
        <Line
          connectNulls
          type="monotone"
          dataKey="store"
          stroke="var(--color-store)"
          strokeWidth={2.5}
          dot={{ r: 3, strokeWidth: 2, stroke: "var(--background)" }}
        />
      </BaseChart>
    </div>
  )
}
