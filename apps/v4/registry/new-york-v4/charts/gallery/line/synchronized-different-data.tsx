"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import { useChartCaption } from "@/registry/new-york-v4/lib/chart-live"
import { JalaliDayMonthTick } from "@/lib/chart-jalali-tick"
import {
  CHART_TOMAN_AXIS_WIDTH,
  formatJalaliDate,
  formatToman,
} from "@/lib/chart-locale"
import { TomanAxisTick } from "@/lib/chart-toman-tick"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

import { LINE_SOFT_COLORS, LINE_TOOLTIP_CURSOR } from "./line-fa-shared"

type DailyPoint = { date: string; value: number }

function isoDate(dayOffset: number): string {
  const d = new Date(Date.UTC(2024, 0, 1 + dayOffset))
  return d.toISOString().slice(0, 10)
}

const dailyData: DailyPoint[] = Array.from({ length: 30 }, (_, i) => ({
  date: isoDate(i),
  value: Math.round(
    (50 + 30 * Math.sin(i / 3) + (i % 7) * 2) * 1_000_000
  ),
}))

const weeklyData: DailyPoint[] = dailyData.filter((_, i) => i % 5 === 0)

const MAX_DISTANCE_MS = 2 * 24 * 60 * 60 * 1000

/**
 * Snap to the nearest date in this chart, but only if it is within two days.
 */
export const closestDate = (
  ticks: Array<{ value: unknown }>,
  data: { activeLabel?: unknown }
) => {
  const hovered = Date.parse(String(data.activeLabel))
  if (Number.isNaN(hovered)) {
    return -1
  }
  let bestIndex = -1
  let bestDistance = Infinity
  ticks.forEach((tick, index) => {
    const distance = Math.abs(Date.parse(String(tick.value)) - hovered)
    if (distance < bestDistance) {
      bestDistance = distance
      bestIndex = index
    }
  })
  return bestDistance <= MAX_DISTANCE_MS ? bestIndex : -1
}

const chartConfig = {
  value: {
    label: "فروش روزانه",
    color: LINE_SOFT_COLORS[0],
  },
} satisfies ChartConfig

const syncClassName =
  "aspect-[1.618] h-auto w-full max-w-[700px] max-h-[25vh] font-sans [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-muted-foreground/32 dark:[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-muted-foreground/38"

function TooltipDate(value: unknown) {
  return formatJalaliDate(String(value), {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function SyncPanel({
  data,
  name,
}: {
  data: DailyPoint[]
  name: string
}) {
  return (
    <ChartContainer config={chartConfig} className={syncClassName}>
      <LineChart
        accessibilityLayer
        data={data}
        syncId="differentData"
        syncMethod={closestDate}
        margin={{ top: 18, right: 12, left: 4, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          reversed
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={JalaliDayMonthTick}
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
              labelFormatter={TooltipDate}
              formatter={(value) => (
                <div className="flex w-full flex-1 items-center justify-between gap-6">
                  <span className="text-muted-foreground">{name}</span>
                  <span className="font-medium tracking-[0]">
                    {formatToman(Number(value), { compact: true })}
                  </span>
                </div>
              )}
            />
          }
        />
        <Line
          type="monotone"
          dataKey="value"
          name={name}
          stroke="var(--color-value)"
          strokeWidth={2.5}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  )
}

export default function SynchronizedDifferentDataDemo() {
  useChartCaption(() => "همگام با دادهٔ متفاوت · تاریخ شمسی · تومان", [])

  return (
    <div dir="rtl" className="flex w-full max-w-[700px] flex-col gap-3 font-sans">
      <SyncPanel data={dailyData} name="خوانش روزانه" />
      <SyncPanel data={weeklyData} name="هر پنج روز" />
    </div>
  )
}
