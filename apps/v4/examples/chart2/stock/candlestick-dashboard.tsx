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

import { useChart2Caption } from "@/components/chart2-live"
import { CHART_TOMAN_AXIS_WIDTH, formatToman } from "@/lib/chart-locale"
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
  ChartTooltip,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

import {
  CANDLE_DOWN,
  CANDLE_UP,
  candleRangeKey,
  CandlestickShape,
  JalaliDayTick,
  StockCandleTooltip,
} from "./stock-shared"

type CandleRow = MarketCandle & { vol: number }

function generateNaturalCandles(
  length = 28,
  seed = 2141,
  startPrice = 2_420_000,
  startTime = Date.UTC(2025, 8, 1)
): CandleRow[] {
  const gen = random(seed)
  const candles: CandleRow[] = []
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
    candles.push({ time, open, close, low, high, volume, vol: volume })
    lastClose = close
  }

  return candles
}

const data = generateNaturalCandles()
const last = data[data.length - 1]!
const dayChange = ((last.close - last.open) / last.open) * 100
const dayUp = dayChange >= 0

const lows = data.map((c) => c.low)
const highs = data.map((c) => c.high)
const priceMin = Math.min(...lows)
const priceMax = Math.max(...highs)
const pad = (priceMax - priceMin) * 0.08 || priceMin * 0.01
const domainMin = Math.floor((priceMin - pad) / 5_000) * 5_000
const domainMax = Math.ceil((priceMax + pad) / 5_000) * 5_000

const chartConfig = {
  candle: { label: "شمع", color: CANDLE_UP },
  vol: { label: "حجم", color: CHART2_BAR_COLORS[4] },
} satisfies ChartConfig

function formatMoney(value: number) {
  return formatToman(value, { compact: true }).replace(/ /g, "\u00A0")
}

function formatPct(value: number) {
  const sign = value > 0 ? "+" : ""
  return `${sign}${toPersianDigits(value.toFixed(1))}٪`
}

function DayCandleTooltip(props: TooltipContentProps) {
  return <StockCandleTooltip {...props} dayLabel compact />
}

function ChangeBadge({
  value,
  good,
}: {
  value: number
  good: boolean
}) {
  return (
    <span
      className="shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-medium"
      style={{
        color: good ? CANDLE_UP : CANDLE_DOWN,
        background: good ? `${CANDLE_UP}18` : `${CANDLE_DOWN}18`,
      }}
    >
      {formatPct(value)}
    </span>
  )
}

export default function CandlestickDashboardDemo({
  defaultIndex,
}: {
  defaultIndex?: TooltipIndex
}) {
  useChart2Caption(() => (
    <>کندل داشبوردی شپنا — هدر نماد، قیمت و نوار حجم</>
  ))

  return (
    <div className="w-full max-w-[760px] font-sans">
      <div className="overflow-hidden rounded-xl border border-border/60 bg-background">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border/50 px-4 py-3">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold tracking-tight">شپنا</p>
              <ChangeBadge value={dayChange} good={dayUp} />
            </div>
            <p className="text-muted-foreground mt-0.5 text-[11px]">
              پالایش نفت اصفهان
            </p>
          </div>
          <div className="text-end">
            <p className="fa-num whitespace-nowrap text-lg font-semibold">
              {formatMoney(last.close)}
            </p>
            <p className="text-muted-foreground text-[11px]">آخرین قیمت</p>
          </div>
        </div>

        <ChartContainer
          config={chartConfig}
          className={`${chart2BarContainerClassName} max-h-[340px] max-w-none`}
        >
          <BarChart
            accessibilityLayer
            data={data}
            margin={{ top: 16, right: 8, left: 4, bottom: 4 }}
            barCategoryGap="2%"
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              reversed
              tickMargin={10}
              minTickGap={48}
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

        <div className="border-t border-border/50 px-2 pb-2 pt-1">
          <p className="text-muted-foreground mb-1 px-2 text-[10px] font-medium">
            حجم معاملات
          </p>
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[52px] w-full max-w-none font-sans"
          >
            <BarChart
              data={data}
              margin={{ top: 0, right: 8, left: 4, bottom: 0 }}
              barCategoryGap="8%"
            >
              <XAxis dataKey="time" reversed hide />
              <YAxis hide domain={[0, "auto"]} />
              <Bar
                dataKey="vol"
                fill={CHART2_BAR_COLORS[4]}
                fillOpacity={0.75}
                radius={[2, 2, 0, 0]}
                isAnimationActive={false}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  )
}
