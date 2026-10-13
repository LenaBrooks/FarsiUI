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
  formatToman,
  generateNaturalCandles,
  JalaliDayTick,
  sma,
  stdev,
  timestampToDay,
} from "./stock-shared"

const PERIOD = 20
const MULT = 2
const candles = generateNaturalCandles(60, 6612)
const closes = candles.map((c) => c.close)
const mid = sma(closes, PERIOD)
const sd = stdev(closes, PERIOD)

const data = candles.map((c, i) => {
  const m = mid[i]
  const s = sd[i]
  return {
    time: c.time,
    close: c.close,
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

const chartConfig = {
  close: { label: "قیمت", color: CHART2_BAR_COLORS[0] },
  mid: { label: "میانگین", color: CHART2_BAR_COLORS[3] },
  upper: { label: "باند بالا", color: CHART2_BAR_COLORS[1] },
  lower: { label: "باند پایین", color: CHART2_BAR_COLORS[1] },
} satisfies ChartConfig

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
  const gid = React.useId().replace(/:/g, "")
  useChart2Caption(
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
        className={`${chart2BarContainerClassName} max-h-[400px] max-w-none`}
      >
        <ComposedChart
          accessibilityLayer
          data={data}
          margin={{ top: 16, right: 8, left: 4, bottom: 4 }}
        >
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={CHART2_BAR_COLORS[1]}
                stopOpacity={0.22}
              />
              <stop
                offset="100%"
                stopColor={CHART2_BAR_COLORS[1]}
                stopOpacity={0.04}
              />
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
            stroke={CHART2_BAR_COLORS[1]}
            strokeWidth={1}
            strokeOpacity={0.7}
            dot={false}
            connectNulls
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="lower"
            stroke={CHART2_BAR_COLORS[1]}
            strokeWidth={1}
            strokeOpacity={0.7}
            dot={false}
            connectNulls
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="mid"
            stroke={CHART2_BAR_COLORS[3]}
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={false}
            connectNulls
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="close"
            stroke={CHART2_BAR_COLORS[0]}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ChartContainer>
    </div>
  )
}
