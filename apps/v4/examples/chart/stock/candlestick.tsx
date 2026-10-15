"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  type TooltipContentProps,
  type TooltipIndex,
} from "recharts"

import { CHART_TOMAN_AXIS_WIDTH } from "@/lib/chart-locale"
import { TomanAxisTick } from "@/lib/chart-toman-tick"
import { chartBarContainerClassName } from "@/lib/chart-fa"
import {
  between,
  random,
  type MarketCandle,
} from "@/lib/chart-mock-data"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

import {
  CANDLE_UP,
  candleRangeKey,
  CandlestickShape,
  JalaliDayTick,
  StockCandleTooltip,
} from "./stock-shared"

/** سری روزانه با نوسان درصدی — شبیه نمودار واقعی بورس/تومان. */
function generateNaturalCandles(
  length = 24,
  seed = 2141,
  startPrice = 2_420_000,
  startTime = Date.UTC(2025, 8, 1)
): MarketCandle[] {
  const gen = random(seed)
  const candles: MarketCandle[] = []
  const dayMs = 24 * 60 * 60 * 1000
  let lastClose = startPrice

  for (let i = 0; i < length; i++) {
    const time = startTime + i * dayMs
    const open = lastClose
    const drift = between(gen, -14, 16) / 10_000
    const shock = between(gen, 0, 100) > 88 ? between(gen, -35, 35) / 10_000 : 0
    const close = Math.max(10_000, Math.round(open * (1 + drift + shock)))
    const bodyTop = Math.max(open, close)
    const bodyBottom = Math.min(open, close)
    const upperWick = Math.round(bodyTop * (between(gen, 8, 70) / 10_000))
    const lowerWick = Math.round(bodyBottom * (between(gen, 8, 70) / 10_000))
    const high = bodyTop + upperWick
    const low = Math.max(1_000, bodyBottom - lowerWick)
    const volume = between(gen, 12_000, 95_000)
    candles.push({ time, open, close, low, high, volume })
    lastClose = close
  }

  return candles
}

const data = generateNaturalCandles()

const lows = data.map((c) => c.low)
const highs = data.map((c) => c.high)
const priceMin = Math.min(...lows)
const priceMax = Math.max(...highs)
const pad = (priceMax - priceMin) * 0.06 || priceMin * 0.01
const domainMin = Math.floor((priceMin - pad) / 2_000) * 2_000
const domainMax = Math.ceil((priceMax + pad) / 2_000) * 2_000

const chartConfig = {
  candle: { label: "شمع", color: CANDLE_UP },
} satisfies ChartConfig

function DayCandleTooltip(props: TooltipContentProps) {
  return <StockCandleTooltip {...props} dayLabel compact />
}

export default function CandlestickDemo({
  defaultIndex,
}: {
  defaultIndex?: TooltipIndex
}) {
  return (
    <ChartContainer
      config={chartConfig}
      className={`${chartBarContainerClassName} max-h-[400px]`}
    >
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ top: 16, right: 4, left: 4, bottom: 4 }}
        barCategoryGap="1%"
      >
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
          tickCount={5}
          axisLine={false}
          tickLine={false}
          tick={TomanAxisTick}
        />
        <Bar
          name="قیمت"
          dataKey={candleRangeKey}
          shape={CandlestickShape}
          isAnimationActive={false}
        />
        <ChartTooltip
          cursor={{ fill: "var(--muted)", fillOpacity: 0.18 }}
          content={DayCandleTooltip}
          defaultIndex={defaultIndex}
        />
      </BarChart>
    </ChartContainer>
  )
}
