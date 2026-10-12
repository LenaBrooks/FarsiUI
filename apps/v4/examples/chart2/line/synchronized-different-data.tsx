"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import { formatJalaliDate } from "@/lib/chart-locale"
import { formatChart2Number } from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

type DailyPoint = { date: string; value: number }

function isoDate(dayOffset: number): string {
  const d = new Date(Date.UTC(2024, 0, 1 + dayOffset))
  return d.toISOString().slice(0, 10)
}

const dailyData: DailyPoint[] = Array.from({ length: 30 }, (_, i) => ({
  date: isoDate(i),
  value: Math.round(50 + 30 * Math.sin(i / 3) + (i % 7) * 2),
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
    label: "مقدار",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

const syncClassName =
  "aspect-[1.618] h-auto w-full max-w-[700px] max-h-[25vh] font-sans"

function TickDate(value: unknown) {
  return formatJalaliDate(String(value), { month: "short", day: "numeric" })
}

function TooltipDate(value: unknown) {
  return formatJalaliDate(String(value), {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default function SynchronizedDifferentDataDemo() {
  return (
    <div className="flex w-full flex-col gap-3">
      <ChartContainer config={chartConfig} className={syncClassName}>
        <LineChart
          accessibilityLayer
          data={dailyData}
          syncId="differentData"
          syncMethod={closestDate}
          margin={{ top: 10, right: 12, left: 12, bottom: 0 }}
        >
          <CartesianGrid />
          <XAxis
            dataKey="date"
            reversed
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={TickDate}
          />
          <YAxis
            orientation="right"
            width={48}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={formatChart2Number}
          />
          <ChartTooltip
            content={<ChartTooltipContent labelFormatter={TooltipDate} />}
          />
          <Line
            type="monotone"
            dataKey="value"
            name="خوانش روزانه"
            stroke="var(--color-value)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ChartContainer>

      <ChartContainer config={chartConfig} className={syncClassName}>
        <LineChart
          accessibilityLayer
          data={weeklyData}
          syncId="differentData"
          syncMethod={closestDate}
          margin={{ top: 10, right: 12, left: 12, bottom: 0 }}
        >
          <CartesianGrid />
          <XAxis
            dataKey="date"
            reversed
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={TickDate}
          />
          <YAxis
            orientation="right"
            width={48}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={formatChart2Number}
          />
          <ChartTooltip
            content={<ChartTooltipContent labelFormatter={TooltipDate} />}
          />
          <Line
            type="monotone"
            dataKey="value"
            name="هر پنج روز"
            stroke="var(--color-value)"
            strokeWidth={2}
          />
        </LineChart>
      </ChartContainer>
    </div>
  )
}
