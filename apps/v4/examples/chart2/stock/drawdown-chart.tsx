"use client"

import * as React from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ComposedChart,
  XAxis,
  YAxis,
  type TooltipContentProps,
  type TooltipIndex,
} from "recharts"

import { useChart2Caption } from "@/components/chart2-live"
import { CHART_TOMAN_AXIS_WIDTH } from "@/lib/chart-locale"
import { TomanAxisTick } from "@/lib/chart-toman-tick"
import {
  chart2BarContainerClassName,
  CHART2_BAR_COLORS,
  toPersianDigits,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

import {
  CANDLE_DOWN,
  formatMoneyOneLine,
  formatPctChange,
  generateNaturalCandles,
  JalaliDayTick,
  runningDrawdown,
  timestampToDay,
} from "./stock-shared"

const candles = generateNaturalCandles(48, 8801, 10_000_000)
const closes = candles.map((c) => c.close)
const dd = runningDrawdown(closes)
const data = candles.map((c, i) => ({
  time: c.time,
  equity: c.close,
  drawdown: dd[i]!,
}))

const maxDd = Math.min(...dd)
const lastEquity = data[data.length - 1]!.equity
const firstEquity = data[0]!.equity
const totalReturn = ((lastEquity - firstEquity) / firstEquity) * 100

const chartConfig = {
  equity: { label: "ارزش", color: CHART2_BAR_COLORS[0] },
  drawdown: { label: "افت", color: CANDLE_DOWN },
} satisfies ChartConfig

function DdTooltip({ active, payload }: TooltipContentProps) {
  if (!(active && payload?.length)) return null
  const row = payload[0]?.payload as (typeof data)[number] | undefined
  if (!row) return null
  return (
    <div
      className="min-w-[9rem] rounded-lg border bg-background px-3 py-2.5 text-xs shadow-xl font-sans"
      dir="rtl"
    >
      <p className="mb-1.5 font-medium">{timestampToDay(row.time)}</p>
      <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-muted-foreground">
        <span>ارزش</span>
        <span className="text-end text-foreground">
          {formatMoneyOneLine(row.equity)}
        </span>
        <span>افت از سقف</span>
        <span className="text-end" style={{ color: CANDLE_DOWN }}>
          {formatPctChange(row.drawdown)}
        </span>
      </div>
    </div>
  )
}

export default function DrawdownChartDemo({
  defaultIndex,
}: {
  defaultIndex?: TooltipIndex
}) {
  const gid = React.useId().replace(/:/g, "")
  useChart2Caption(() => <>افت ارزش پرتفوی نسبت به سقف قبلی</>)

  return (
    <div className="w-full max-w-[760px] space-y-3 font-sans">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border/60 bg-background px-3.5 py-3">
          <p className="text-muted-foreground text-[11px]">ارزش فعلی</p>
          <p className="mt-0.5 text-sm font-semibold tracking-tight">
            {formatMoneyOneLine(lastEquity)}
          </p>
        </div>
        <div className="rounded-xl border border-border/60 bg-background px-3.5 py-3">
          <p className="text-muted-foreground text-[11px]">بازدهی دوره</p>
          <p
            className="mt-0.5 text-sm font-semibold"
            style={{ color: totalReturn >= 0 ? "#5a9e7a" : CANDLE_DOWN }}
          >
            {formatPctChange(totalReturn)}
          </p>
        </div>
        <div className="rounded-xl border border-border/60 bg-background px-3.5 py-3">
          <p className="text-muted-foreground text-[11px]">بیشینه افت</p>
          <p className="mt-0.5 text-sm font-semibold" style={{ color: CANDLE_DOWN }}>
            {formatPctChange(maxDd)}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/60 bg-background">
        <div className="border-b border-border/50 px-4 py-2.5">
          <p className="text-sm font-medium">ارزش و افت سرمایه</p>
        </div>
        <ChartContainer
          config={chartConfig}
          className={`${chart2BarContainerClassName} max-h-[220px] max-w-none`}
        >
          <ComposedChart
            accessibilityLayer
            data={data}
            margin={{ top: 12, right: 8, left: 4, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="time" hide />
            <YAxis
              orientation="right"
              width={CHART_TOMAN_AXIS_WIDTH}
              tickMargin={6}
              tickCount={3}
              axisLine={false}
              tickLine={false}
              tick={TomanAxisTick}
            />
            <ChartTooltip defaultIndex={defaultIndex} content={DdTooltip} />
            <Line
              type="monotone"
              dataKey="equity"
              stroke={CHART2_BAR_COLORS[0]}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ChartContainer>

        <ChartContainer
          config={chartConfig}
          className={`${chart2BarContainerClassName} max-h-[160px] max-w-none border-t border-border/40`}
        >
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{ top: 8, right: 8, left: 4, bottom: 4 }}
          >
            <defs>
              <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CANDLE_DOWN} stopOpacity={0.05} />
                <stop offset="100%" stopColor={CANDLE_DOWN} stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              reversed
              tickMargin={8}
              minTickGap={40}
              tick={JalaliDayTick}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              orientation="right"
              width={48}
              tickMargin={6}
              domain={[Math.floor(maxDd - 1), 0]}
              tickCount={3}
              tickFormatter={(v) => toPersianDigits(`${v.toFixed(0)}٪`)}
              axisLine={false}
              tickLine={false}
            />
            <ChartTooltip content={DdTooltip} />
            <Area
              type="monotone"
              dataKey="drawdown"
              stroke={CANDLE_DOWN}
              strokeWidth={1.5}
              fill={`url(#${gid})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  )
}
