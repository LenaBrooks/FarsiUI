"use client"

import type { ReactNode } from "react"
import {
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
  type TooltipIndex,
} from "recharts"

import {
  CHART_BAR_COLORS,
  formatChartNumber,
  toPersianDigits,
} from "@/lib/chart-fa"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

const HOURS = Array.from({ length: 24 }, (_, i) => toPersianDigits(String(i)))

const VALUES_01 = [
  170, 180, 150, 120, 200, 300, 400, 200, 100, 150, 160, 170, 180, 144, 166,
  145, 150, 170, 180, 165, 130, 140, 170, 180,
]

const VALUES_02 = [
  160, 180, 150, 120, 200, 300, 100, 200, 100, 150, 160, 160, 180, 144, 166,
  145, 150, 160, 180, 165, 130, 140, 160, 180,
]

const data01 = HOURS.map((hour, i) => ({
  hour,
  index: 1,
  value: VALUES_01[i]!,
}))

const data02 = HOURS.map((hour, i) => ({
  hour,
  index: 1,
  value: VALUES_02[i]!,
}))

const DAYS = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنج‌شنبه",
  "جمعه",
] as const

const chartConfig = {
  value: { label: "مقدار", color: CHART_BAR_COLORS[0] },
} satisfies ChartConfig

const zDomain = [
  0,
  Math.max(Math.max(...VALUES_01), Math.max(...VALUES_02)),
] as [number, number]

/** اندازهٔ حباب — محدود تا از ردیف نزند */
const BUBBLE_RANGE: [number, number] = [20, 90]

function BubbleAxes({ showXTicks = false }: { showXTicks?: boolean }) {
  return (
    <>
      <XAxis
        type="category"
        dataKey="hour"
        name="ساعت"
        reversed
        interval={0}
        tick={
          showXTicks
            ? { fontSize: 10, fontFamily: "var(--font-sans)" }
            : false
        }
        tickLine={false}
        axisLine={false}
        height={showXTicks ? 22 : 1}
      />
      <YAxis
        type="number"
        dataKey="index"
        domain={[0, 2]}
        width={1}
        orientation="right"
        tick={false}
        tickLine={false}
        axisLine={false}
      />
      <ZAxis
        type="number"
        dataKey="value"
        domain={zDomain}
        range={BUBBLE_RANGE}
      />
    </>
  )
}

function DayChart({
  children,
  tall,
}: {
  children: ReactNode
  tall?: boolean
}) {
  return (
    <ChartContainer
      config={chartConfig}
      className="!aspect-auto w-full max-w-none overflow-hidden font-sans text-xs"
      style={{ height: tall ? 78 : 58 }}
    >
      <ScatterChart
        accessibilityLayer
        margin={{ top: 6, right: 4, bottom: tall ? 4 : 2, left: 4 }}
      >
        {children}
      </ScatterChart>
    </ChartContainer>
  )
}

export default function BubbleChartDemo({
  defaultIndex,
}: {
  defaultIndex?: TooltipIndex
}) {
  const rows: Array<{
    day: string
    data: typeof data01
    showXTicks?: boolean
  }> = [
    { day: DAYS[0], data: data01 },
    { day: DAYS[1], data: data02 },
    { day: DAYS[2], data: data01 },
    { day: DAYS[3], data: data02 },
    { day: DAYS[4], data: data01 },
    { day: DAYS[5], data: data02 },
    { day: DAYS[6], data: data01, showXTicks: true },
  ]

  return (
    <div className="w-full max-w-[900px] font-sans" dir="rtl">
      {rows.map((row, i) => (
        <div
          key={row.day}
          className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 overflow-hidden"
        >
          <span className="w-14 shrink-0 text-end text-[11px] leading-none text-muted-foreground">
            {row.day}
          </span>
          <DayChart tall={row.showXTicks}>
            <BubbleAxes showXTicks={Boolean(row.showXTicks)} />
            <Scatter
              data={row.data}
              fill={CHART_BAR_COLORS[i % CHART_BAR_COLORS.length]}
              fillOpacity={0.9}
            />
            <ChartTooltip
              defaultIndex={i === 0 ? defaultIndex : undefined}
              content={
                <ChartTooltipContent
                  labelKey="hour"
                  formatter={(value) => formatChartNumber(value as number)}
                  labelFormatter={(_, payload) => {
                    const hour = payload?.[0]?.payload?.hour
                    return hour != null ? `ساعت ${hour}` : ""
                  }}
                />
              }
            />
          </DayChart>
        </div>
      ))}
    </div>
  )
}
