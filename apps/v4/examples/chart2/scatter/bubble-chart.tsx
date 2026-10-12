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
  formatChart2Number,
  toPersianDigits,
} from "@/lib/chart2-fa"
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
  value: { label: "مقدار", color: "var(--chart-1)" },
} satisfies ChartConfig

const domain = [
  0,
  Math.max(
    Math.max(...VALUES_01),
    Math.max(...VALUES_02)
  ),
] as [number, number]

const range = [16, 225] as const
const margin = { top: 6, right: 4, bottom: 0, left: 4 }

function BubbleAxes({ showXTicks = false }: { showXTicks?: boolean }) {
  return (
    <>
      <XAxis
        type="category"
        dataKey="hour"
        name="ساعت"
        reversed
        interval={0}
        tick={showXTicks ? { fontSize: 10, fontFamily: "var(--font-sans)" } : { fontSize: 0 }}
        tickLine={{ transform: "translate(0, -6)" }}
      />
      <YAxis
        type="number"
        dataKey="index"
        height={10}
        width={1}
        orientation="right"
        tick={false}
        tickLine={false}
        axisLine={false}
      />
      <ZAxis type="number" dataKey="value" domain={domain} range={range} />
    </>
  )
}

function DayChart({ children }: { children: ReactNode }) {
  return (
    <ChartContainer
      config={chartConfig}
      className="h-[56px] w-full aspect-auto font-sans text-xs"
    >
      <ScatterChart accessibilityLayer margin={margin}>
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
  const rows: Array<{ day: string; data: typeof data01; showXTicks?: boolean }> = [
    { day: DAYS[0], data: data01 },
    { day: DAYS[1], data: data02 },
    { day: DAYS[2], data: data01 },
    { day: DAYS[3], data: data02 },
    { day: DAYS[4], data: data01 },
    { day: DAYS[5], data: data02 },
    { day: DAYS[6], data: data01, showXTicks: true },
  ]

  return (
    <div className="w-full max-w-[900px] space-y-0 font-sans" dir="ltr">
      {rows.map((row, i) => (
        <div
          key={row.day}
          className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2"
        >
          <DayChart>
            <BubbleAxes showXTicks={row.showXTicks} />
            <Scatter data={row.data} fill="var(--color-value)" />
            <ChartTooltip
              defaultIndex={i === 0 ? defaultIndex : undefined}
              content={
                <ChartTooltipContent
                  labelKey="hour"
                  formatter={(value) => formatChart2Number(value as number)}
                  labelFormatter={(_, payload) => {
                    const hour = payload?.[0]?.payload?.hour
                    return hour != null ? `ساعت ${hour}` : ""
                  }}
                />
              }
            />
          </DayChart>
          <span className="text-muted-foreground whitespace-nowrap text-[11px] leading-none">
            {row.day}
          </span>
        </div>
      ))}
    </div>
  )
}
