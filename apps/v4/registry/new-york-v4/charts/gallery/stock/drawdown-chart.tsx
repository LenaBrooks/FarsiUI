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

import { useChartCaption } from "@/registry/new-york-v4/lib/chart-live"
import { useMarketNeon } from "@/registry/new-york-v4/lib/use-market-neon"
import { CHART_TOMAN_AXIS_WIDTH } from "@/lib/chart-locale"
import { TomanAxisTick } from "@/lib/chart-toman-tick"
import {
  chartAreaGradientStops,
  chartBarContainerClassName,
  chartNeonGlowProps,
  chartNeonOverflowClassName,
  CHART_BAR_COLORS,
  MARKET_DOWN,
  MARKET_UP,
  toPersianDigits,
} from "@/lib/chart-fa"
import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

import {
  CANDLE_DOWN,
  CANDLE_UP,
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

export default function DrawdownChartDemo({
  defaultIndex,
}: {
  defaultIndex?: TooltipIndex
}) {
  const neon = useMarketNeon()
  const gid = React.useId().replace(/:/g, "")
  const equityColor = neon ? MARKET_UP : CHART_BAR_COLORS[0]
  const drawdownColor = neon ? MARKET_DOWN : CANDLE_DOWN
  const upColor = neon ? MARKET_UP : CANDLE_UP
  const downColor = neon ? MARKET_DOWN : CANDLE_DOWN
  const equityGlow = neon ? chartNeonGlowProps(equityColor) : null
  const ddGlow = neon ? chartNeonGlowProps(drawdownColor) : null
  const ddStops = chartAreaGradientStops(drawdownColor, {
    startOpacity: neon ? 0.05 : 0.05,
    endOpacity: neon ? 0.36 : 0.4,
  })

  const chartConfig = {
    equity: { label: "ارزش", color: equityColor },
    drawdown: { label: "افت", color: drawdownColor },
  } satisfies ChartConfig

  useChartCaption(() => <>افت ارزش پرتفوی نسبت به سقف قبلی</>)

  function renderDdTooltip({ active, payload }: TooltipContentProps) {
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
          <span className="text-end" style={{ color: drawdownColor }}>
            {formatPctChange(row.drawdown)}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[760px] space-y-3 font-sans">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border/60 bg-background px-3.5 py-3">
          <p className="text-muted-foreground text-[11px]">ارزش فعلی</p>
          <p className="mt-0.5 fa-num text-sm font-semibold">
            {formatMoneyOneLine(lastEquity)}
          </p>
        </div>
        <div className="rounded-xl border border-border/60 bg-background px-3.5 py-3">
          <p className="text-muted-foreground text-[11px]">بازدهی دوره</p>
          <p
            className="mt-0.5 text-sm font-semibold"
            style={{ color: totalReturn >= 0 ? upColor : downColor }}
          >
            {formatPctChange(totalReturn)}
          </p>
        </div>
        <div className="rounded-xl border border-border/60 bg-background px-3.5 py-3">
          <p className="text-muted-foreground text-[11px]">بیشینه افت</p>
          <p
            className="mt-0.5 text-sm font-semibold"
            style={{ color: drawdownColor }}
          >
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
          className={cn(
            `${chartBarContainerClassName} max-h-[220px] max-w-none`,
            neon && chartNeonOverflowClassName
          )}
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
            <ChartTooltip
              defaultIndex={defaultIndex}
              content={renderDdTooltip}
            />
            <Line
              type="monotone"
              dataKey="equity"
              stroke={equityColor}
              strokeWidth={equityGlow?.strokeWidth ?? 2}
              dot={false}
              isAnimationActive={false}
              style={equityGlow?.style}
              className={equityGlow?.className}
            />
          </ComposedChart>
        </ChartContainer>

        <ChartContainer
          config={chartConfig}
          className={cn(
            `${chartBarContainerClassName} max-h-[160px] max-w-none border-t border-border/40`,
            neon && chartNeonOverflowClassName
          )}
        >
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{ top: 8, right: 8, left: 4, bottom: 4 }}
          >
            <defs>
              <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                {ddStops.map((s) => (
                  <stop
                    key={s.offset}
                    offset={s.offset}
                    stopColor={s.stopColor}
                    stopOpacity={s.stopOpacity}
                  />
                ))}
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
            <ChartTooltip content={renderDdTooltip} />
            <Area
              type="monotone"
              dataKey="drawdown"
              stroke={drawdownColor}
              strokeWidth={ddGlow?.strokeWidth ?? 1.5}
              fill={`url(#${gid})`}
              isAnimationActive={false}
              style={ddGlow?.style}
              className={ddGlow?.className}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  )
}
