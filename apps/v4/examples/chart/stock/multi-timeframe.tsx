"use client"

import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts"

import { useChartCaption } from "@/components/chart-live"
import { CHART_TOMAN_AXIS_WIDTH } from "@/lib/chart-locale"
import { TomanAxisTick } from "@/lib/chart-toman-tick"
import {
  chartBarContainerClassName,
  CHART_BAR_COLORS,
  toPersianDigits,
} from "@/lib/chart-fa"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

import {
  ChangeBadge,
  formatMoneyOneLine,
  formatToman,
  generateNaturalCandles,
  JalaliDayTick,
  timestampToDay,
} from "./stock-shared"

type TfPoint = { time: number; close: number }

function aggregateWeekly(daily: TfPoint[]): TfPoint[] {
  const out: TfPoint[] = []
  for (let i = 0; i < daily.length; i += 5) {
    const slice = daily.slice(i, i + 5)
    const last = slice[slice.length - 1]!
    out.push({ time: last.time, close: last.close })
  }
  return out
}

function aggregateMonthly(daily: TfPoint[]): TfPoint[] {
  const out: TfPoint[] = []
  for (let i = 0; i < daily.length; i += 20) {
    const slice = daily.slice(i, i + 20)
    const last = slice[slice.length - 1]!
    out.push({ time: last.time, close: last.close })
  }
  return out
}

const dailyRaw = generateNaturalCandles(80, 1204).map((c) => ({
  time: c.time,
  close: c.close,
}))
const frames = [
  {
    id: "d",
    label: "روزانه",
    color: CHART_BAR_COLORS[0],
    data: dailyRaw,
  },
  {
    id: "w",
    label: "هفتگی",
    color: CHART_BAR_COLORS[2],
    data: aggregateWeekly(dailyRaw),
  },
  {
    id: "m",
    label: "ماهانه",
    color: CHART_BAR_COLORS[1],
    data: aggregateMonthly(dailyRaw),
  },
] as const

function TfTooltip({ active, payload }: TooltipContentProps) {
  if (!(active && payload?.length)) return null
  const row = payload[0]?.payload as TfPoint | undefined
  if (!row) return null
  return (
    <div
      className="rounded-lg border bg-background px-3 py-2 text-xs shadow-xl font-sans"
      dir="rtl"
    >
      <p className="font-medium">{timestampToDay(row.time)}</p>
      <p className="text-muted-foreground mt-1">
        {formatToman(row.close)}
      </p>
    </div>
  )
}

function FrameChart({
  label,
  color,
  data,
}: {
  label: string
  color: string
  data: TfPoint[]
}) {
  const first = data[0]!
  const last = data[data.length - 1]!
  const change = ((last.close - first.close) / first.close) * 100
  const config = {
    close: { label: "قیمت", color },
  } satisfies ChartConfig

  const prices = data.map((d) => d.close)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const pad = (max - min) * 0.1 || min * 0.01

  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-background">
      <div className="flex items-center justify-between border-b border-border/50 px-3.5 py-2">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-[2px]" style={{ background: color }} />
          <p className="text-sm font-medium">{label}</p>
          <ChangeBadge value={change} good={change >= 0} />
        </div>
        <p className="fa-num text-[12px] font-semibold">
          {formatMoneyOneLine(last.close)}
        </p>
      </div>
      <ChartContainer
        config={config}
        className={`${chartBarContainerClassName} max-h-[180px] max-w-none`}
      >
        <LineChart
          accessibilityLayer
          data={data}
          margin={{ top: 10, right: 6, left: 2, bottom: 2 }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            reversed
            tickMargin={8}
            minTickGap={48}
            tick={JalaliDayTick}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            orientation="right"
            width={CHART_TOMAN_AXIS_WIDTH}
            tickMargin={4}
            domain={[min - pad, max + pad]}
            tickCount={3}
            axisLine={false}
            tickLine={false}
            tick={TomanAxisTick}
          />
          <ChartTooltip content={TfTooltip} />
          <Line
            type="monotone"
            dataKey="close"
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  )
}

export default function MultiTimeframeDemo() {
  useChartCaption(() => <>همان نماد در بازه‌های روزانه، هفتگی و ماهانه</>)

  return (
    <div className="w-full max-w-[760px] space-y-3 font-sans">
      <div className="flex items-center justify-between px-0.5">
        <p className="text-sm font-medium">شپنا · چند بازه</p>
        <p className="text-muted-foreground text-[11px]">
          {toPersianDigits(String(dailyRaw.length))} روز پایه
        </p>
      </div>
      {frames.map((f) => (
        <FrameChart
          key={f.id}
          label={f.label}
          color={f.color}
          data={f.data}
        />
      ))}
    </div>
  )
}
