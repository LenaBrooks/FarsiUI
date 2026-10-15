"use client"

import * as React from "react"
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
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
  MARKET_MUTE,
  MARKET_UP,
  toPersianDigits,
} from "@/lib/chart-fa"
import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

import { between, random } from "@/lib/chart-mock-data"

import {
  formatToman,
  JalaliDayTick,
  sma,
  stdev,
  timestampToDay,
} from "./stock-shared"

const PERIOD = 20
const MULT = 2

/**
 * قیمت با فازهای مشخص (روند، ریزش، رالی، خنثی) تا باند بولینگر جمع/باز شود
 * و خط قیمت صاف نماند.
 */
function generateBbSeries(length = 80, seed = 7721, startPrice = 2_380_000) {
  const gen = random(seed)
  const dayMs = 24 * 60 * 60 * 1000
  const startTime = Date.UTC(2025, 8, 1)
  const points: { time: number; close: number }[] = []
  let price = startPrice

  for (let i = 0; i < length; i++) {
    const t = i / Math.max(length - 1, 1)
    let drift: number
    let noiseScale: number
    if (t < 0.18) {
      drift = 0.006
      noiseScale = 0.008
    } else if (t < 0.32) {
      drift = -0.014
      noiseScale = 0.016
    } else if (t < 0.55) {
      drift = 0.011
      noiseScale = 0.012
    } else if (t < 0.72) {
      drift = between(gen, -3, 3) / 1000
      noiseScale = 0.006
    } else {
      drift = 0.008
      noiseScale = 0.014
    }
    const noise = between(gen, -100, 100) / 100 * noiseScale
    const shock =
      between(gen, 0, 100) > 90 ? between(gen, -35, 35) / 1000 : 0
    price = Math.max(
      800_000,
      Math.round(price * (1 + drift + noise + shock))
    )
    points.push({ time: startTime + i * dayMs, close: price })
  }
  return points
}

const series = generateBbSeries()
const closes = series.map((p) => p.close)
const mid = sma(closes, PERIOD)
const sd = stdev(closes, PERIOD)

const data = series.map((p, i) => {
  const m = mid[i]
  const s = sd[i]
  return {
    time: p.time,
    close: p.close,
    mid: m,
    upper: m != null && s != null ? m + MULT * s : null,
    lower: m != null && s != null ? m - MULT * s : null,
    bandTop: m != null && s != null ? MULT * s * 2 : null,
  }
})

const priced = data.filter((d) => d.upper != null && d.lower != null)
const priceMin = Math.min(...priced.map((d) => d.lower!))
const priceMax = Math.max(...priced.map((d) => d.upper!))
const pad = (priceMax - priceMin) * 0.06
const domainMin = Math.floor((priceMin - pad) / 2_000) * 2_000
const domainMax = Math.ceil((priceMax + pad) / 2_000) * 2_000

function BbTooltip({ active, payload }: TooltipContentProps) {
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
        <span>قیمت</span>
        <span className="text-end text-foreground">{formatToman(row.close)}</span>
        {row.mid != null ? (
          <>
            <span>میانگین</span>
            <span className="text-end text-foreground">
              {formatToman(Math.round(row.mid))}
            </span>
            <span>باند بالا</span>
            <span className="text-end text-foreground">
              {formatToman(Math.round(row.upper!))}
            </span>
            <span>باند پایین</span>
            <span className="text-end text-foreground">
              {formatToman(Math.round(row.lower!))}
            </span>
          </>
        ) : null}
      </div>
    </div>
  )
}

export default function BollingerBandsDemo({
  defaultIndex,
}: {
  defaultIndex?: TooltipIndex
}) {
  const neon = useMarketNeon()
  const gid = React.useId().replace(/:/g, "")
  const priceColor = neon ? MARKET_UP : CHART_BAR_COLORS[0]
  const midColor = neon ? MARKET_MUTE : CHART_BAR_COLORS[3]
  const bandColor = neon ? MARKET_DOWN : CHART_BAR_COLORS[1]
  const priceGlow = neon ? chartNeonGlowProps(priceColor) : null
  const bandStops = chartAreaGradientStops(bandColor, {
    startOpacity: neon ? 0.18 : 0.22,
    endOpacity: neon ? 0.04 : 0.04,
  })

  const chartConfig = {
    close: { label: "قیمت", color: priceColor },
    mid: { label: "میانگین", color: midColor },
    upper: { label: "باند بالا", color: bandColor },
    lower: { label: "باند پایین", color: bandColor },
  } satisfies ChartConfig

  useChartCaption(
    () => (
      <>
        باند بولینگر · SMA {toPersianDigits(String(PERIOD))} ±{" "}
        {toPersianDigits(String(MULT))}σ
      </>
    )
  )

  return (
    <div className="w-full max-w-[760px] overflow-hidden rounded-xl border border-border/60 bg-background font-sans">
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-2.5">
        <p className="text-sm font-medium">باندهای بولینگر · شپنا</p>
        <p className="text-muted-foreground text-[11px]">
          نوسان و محدودهٔ احتمالی
        </p>
      </div>
      <ChartContainer
        config={chartConfig}
        className={cn(
          `${chartBarContainerClassName} max-h-[400px] max-w-none`,
          neon && chartNeonOverflowClassName
        )}
      >
        <ComposedChart
          accessibilityLayer
          data={data}
          margin={{ top: 16, right: 8, left: 4, bottom: 4 }}
        >
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              {bandStops.map((s) => (
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
            tickMargin={10}
            minTickGap={40}
            tick={JalaliDayTick}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            orientation="right"
            width={CHART_TOMAN_AXIS_WIDTH}
            tickMargin={6}
            domain={[domainMin, domainMax]}
            tickCount={4}
            axisLine={false}
            tickLine={false}
            tick={TomanAxisTick}
          />
          <ChartTooltip defaultIndex={defaultIndex} content={BbTooltip} />
          <Area
            type="monotone"
            dataKey="lower"
            stackId="band"
            stroke="none"
            fill="transparent"
            connectNulls
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="bandTop"
            stackId="band"
            stroke="none"
            fill={`url(#${gid})`}
            connectNulls
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="upper"
            stroke={bandColor}
            strokeWidth={1}
            strokeOpacity={0.7}
            dot={false}
            connectNulls
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="lower"
            stroke={bandColor}
            strokeWidth={1}
            strokeOpacity={0.7}
            dot={false}
            connectNulls
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="mid"
            stroke={midColor}
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={false}
            connectNulls
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="close"
            stroke={priceColor}
            strokeWidth={priceGlow?.strokeWidth ?? 2}
            dot={false}
            isAnimationActive={false}
            style={priceGlow?.style}
            className={priceGlow?.className}
          />
        </ComposedChart>
      </ChartContainer>
    </div>
  )
}
