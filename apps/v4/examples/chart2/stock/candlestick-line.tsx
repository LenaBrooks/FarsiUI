"use client"

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  type TooltipContentProps,
  type TooltipIndex,
} from "recharts"

import { useChart2Caption } from "@/components/chart2-live"
import {
  CHART_TOMAN_AXIS_WIDTH,
  formatToman as formatTomanLocale,
} from "@/lib/chart-locale"
import { TomanAxisTick } from "@/lib/chart-toman-tick"
import {
  chart2BarContainerClassName,
  CHART2_BAR_COLORS,
  toPersianDigits,
} from "@/lib/chart2-fa"
import {
  between,
  random,
  type MarketCandle,
} from "@/lib/chart2-mock-data"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

import {
  CANDLE_UP,
  candleColor,
  candleRangeKey,
  CandlestickShape,
  isBullish,
  JalaliDayTick,
  timestampToDay,
} from "./stock-shared"

/** قیمت کامل با جداکننده — برای تمایز OHLC در تولتیپ. */
function formatPrice(value: number) {
  return formatTomanLocale(Math.round(value), {
    compact: false,
    suffix: true,
  })
}

const SMA_PERIOD = 7
const SMA_COLOR = CHART2_BAR_COLORS[3]
const SMA_LABEL = `میانگین ${toPersianDigits(SMA_PERIOD)} دوره`

type CandleWithSma = MarketCandle & { sma?: number }

function generateNaturalCandles(
  length = 36,
  seed = 909,
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

const raw = generateNaturalCandles()
const data: CandleWithSma[] = raw.map((candle, i, arr) => {
  if (i < SMA_PERIOD - 1) {
    return { ...candle, sma: undefined }
  }
  const slice = arr.slice(i - SMA_PERIOD + 1, i + 1)
  const sma = slice.reduce((sum, item) => sum + item.close, 0) / SMA_PERIOD
  return { ...candle, sma: Math.round(sma) }
})

const lows = data.map((c) => c.low)
const highs = data.map((c) => c.high)
const priceMin = Math.min(...lows)
const priceMax = Math.max(...highs)
const pad = (priceMax - priceMin) * 0.06 || priceMin * 0.01
const domainMin = Math.floor((priceMin - pad) / 2_000) * 2_000
const domainMax = Math.ceil((priceMax + pad) / 2_000) * 2_000

const chartConfig = {
  candle: { label: "کندل", color: CANDLE_UP },
  sma: { label: SMA_LABEL, color: SMA_COLOR },
} satisfies ChartConfig

function CandleLineTooltip({ active, payload }: TooltipContentProps) {
  if (!(active && payload?.length)) return null
  const entry = payload[0]?.payload as CandleWithSma | undefined
  if (!entry) return null
  const changePct =
    entry.open === 0 ? 0 : ((entry.close - entry.open) / entry.open) * 100
  const bullish = isBullish(entry)

  return (
    <div className="min-w-[10.5rem] rounded-lg border bg-background px-3 py-2.5 text-xs shadow-xl font-sans">
      <div className="mb-2 flex items-center gap-2">
        <span
          className="size-2.5 shrink-0 rounded-[2px]"
          style={{ background: candleColor(entry) }}
          aria-hidden
        />
        <p className="font-medium leading-none">
          تاریخ: {timestampToDay(entry.time)}
        </p>
      </div>
      <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-muted-foreground">
        <span>باز</span>
        <span className="text-end text-foreground">{formatPrice(entry.open)}</span>
        <span>بسته</span>
        <span className="text-end text-foreground">{formatPrice(entry.close)}</span>
        <span>کمینه</span>
        <span className="text-end text-foreground">{formatPrice(entry.low)}</span>
        <span>بیشینه</span>
        <span className="text-end text-foreground">{formatPrice(entry.high)}</span>
        {entry.sma != null ? (
          <>
            <span className="flex items-center gap-1.5">
              <span
                className="size-1.5 rounded-full"
                style={{ background: SMA_COLOR }}
                aria-hidden
              />
              میانگین
            </span>
            <span className="text-end text-foreground">
              {formatPrice(entry.sma)}
            </span>
          </>
        ) : null}
      </div>
      <p
        className="mt-2 border-t pt-1.5 text-end"
        style={{ color: candleColor(entry) }}
      >
        {bullish ? "+" : ""}
        {toPersianDigits(changePct.toFixed(2))}٪
      </p>
    </div>
  )
}

export default function CandlestickLineDemo({
  defaultIndex,
}: {
  defaultIndex?: TooltipIndex
}) {
  useChart2Caption(() => (
    <>
      کندل به‌همراه میانگین متحرک {toPersianDigits(SMA_PERIOD)} دوره‌ای
    </>
  ))

  return (
    <ChartContainer
      config={chartConfig}
      className={`${chart2BarContainerClassName} max-h-[400px]`}
    >
      <ComposedChart
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
          minTickGap={36}
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
        <ChartTooltip
          cursor={{ fill: "var(--muted)", fillOpacity: 0.18 }}
          defaultIndex={defaultIndex}
          content={CandleLineTooltip}
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey={candleRangeKey}
          name="کندل"
          shape={CandlestickShape}
          isAnimationActive={false}
          legendType="none"
        />
        <Line
          type="monotone"
          dataKey="sma"
          name={SMA_LABEL}
          stroke={SMA_COLOR}
          strokeWidth={2}
          dot={false}
          connectNulls
          isAnimationActive={false}
        />
      </ComposedChart>
    </ChartContainer>
  )
}
