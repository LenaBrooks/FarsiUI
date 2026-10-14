"use client"

/**
 * Live Binance-style candlestick — same shell as realtime-mountain-chart.
 * Ticks update the forming candle; a new candle opens on an interval.
 */

import * as React from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  XAxis,
  YAxis,
} from "recharts"

import { useChart2ToolbarStart } from "@/components/chart2-live"
import { CHART_TOMAN_AXIS_WIDTH } from "@/lib/chart-locale"
import { TomanAxisTick } from "@/lib/chart-toman-tick"
import {
  chart2BarContainerClassName,
  chart2DashedGridClassName,
  toPersianDigits,
} from "@/lib/chart2-fa"
import type { MarketCandle } from "@/lib/chart2-mock-data"
import { Button } from "@/registry/new-york-v4/ui/button"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

import {
  CANDLE_DOWN,
  CANDLE_UP,
  ChangeBadge,
  candleColor,
  candleRangeKey,
  CandlestickShape,
  formatMoneyOneLine,
  formatToman,
  isBullish,
} from "./stock-shared"

const WINDOW = 40
const TICK_MS = 160
const CANDLE_MS = 3_200
const START_PRICE = 2_420_000
/** Max abs drift per tick — keeps forming candle smooth. */
const TICK_VOL = 0.00028
/** How fast momentum fades toward 0. */
const MOMENTUM_DECAY = 0.86

function timestampToClock(timestamp: number) {
  const date = new Date(timestamp)
  const h = String(date.getHours()).padStart(2, "0")
  const m = String(date.getMinutes()).padStart(2, "0")
  const s = String(date.getSeconds()).padStart(2, "0")
  return toPersianDigits(`${h}:${m}:${s}`)
}

function stepPrice(prev: number, momentum: number) {
  const shock = (Math.random() - 0.5) * TICK_VOL
  const nextMomentum = momentum * MOMENTUM_DECAY + shock
  const next = Math.max(10_000, Math.round(prev * (1 + nextMomentum)))
  return { price: next, momentum: nextMomentum }
}

function openCandle(time: number, open: number): MarketCandle {
  return {
    time,
    open,
    close: open,
    high: open,
    low: open,
    volume: Math.round(4_000 + Math.random() * 3_500),
  }
}

function applyTick(
  candle: MarketCandle,
  nextClose: number,
  volumeStep: number
): MarketCandle {
  return {
    ...candle,
    close: nextClose,
    high: Math.max(candle.high, nextClose),
    low: Math.min(candle.low, nextClose),
    volume: candle.volume + volumeStep,
  }
}

function seedCandles(length: number, startPrice: number, endTime: number) {
  const candles: MarketCandle[] = []
  let price = startPrice
  let momentum = 0
  const ticksPerCandle = Math.max(8, Math.round(CANDLE_MS / TICK_MS))
  const startTime = endTime - (length - 1) * CANDLE_MS

  for (let i = 0; i < length; i++) {
    const time = startTime + i * CANDLE_MS
    let candle = openCandle(time, price)
    for (let t = 0; t < ticksPerCandle; t++) {
      const stepped = stepPrice(candle.close, momentum)
      momentum = stepped.momentum
      candle = applyTick(
        candle,
        stepped.price,
        Math.round(180 + Math.random() * 420)
      )
    }
    candles.push(candle)
    price = candle.close
  }
  return candles
}

function stickyDomain(
  min: number,
  max: number,
  prev: { min: number; max: number } | null
) {
  const span = Math.max(max - min, min * 0.004)
  const pad = span * 0.2
  const targetMin = min - pad
  const targetMax = max + pad
  let nextMin = targetMin
  let nextMax = targetMax
  if (prev) {
    // Expand right away; ease back when range shrinks (less Y-axis jump).
    nextMin = Math.min(prev.min, targetMin)
    nextMax = Math.max(prev.max, targetMax)
    if (prev.min < targetMin) {
      nextMin = prev.min + (targetMin - prev.min) * 0.06
    }
    if (prev.max > targetMax) {
      nextMax = prev.max + (targetMax - prev.max) * 0.06
    }
  }
  return {
    min: Math.floor(nextMin / 500) * 500,
    max: Math.ceil(nextMax / 500) * 500,
  }
}

function LiveCandleTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload?: MarketCandle }>
}) {
  if (!(active && payload?.length)) return null
  const entry = payload[0]?.payload
  if (!entry) return null
  const bullish = isBullish(entry)
  const changePct =
    entry.open === 0 ? 0 : ((entry.close - entry.open) / entry.open) * 100
  return (
    <div
      className="min-w-[9rem] rounded-lg border bg-background px-3 py-2.5 text-xs shadow-xl font-sans"
      dir="rtl"
    >
      <div className="mb-2 flex items-center gap-2">
        <span
          className="size-2.5 shrink-0 rounded-[2px]"
          style={{ background: candleColor(entry) }}
          aria-hidden
        />
        <p className="font-medium leading-none">
          زمان: {timestampToClock(entry.time)}
        </p>
      </div>
      <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-muted-foreground">
        <span>باز</span>
        <span className="text-end text-foreground">
          {formatToman(entry.open)}
        </span>
        <span>بسته</span>
        <span className="text-end text-foreground">
          {formatToman(entry.close)}
        </span>
        <span>کمینه</span>
        <span className="text-end text-foreground">
          {formatToman(entry.low)}
        </span>
        <span>بیشینه</span>
        <span className="text-end text-foreground">
          {formatToman(entry.high)}
        </span>
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

const priceConfig = {
  candle: { label: "کندل", color: CANDLE_UP },
} satisfies ChartConfig

const volumeConfig = {
  volume: { label: "حجم", color: CANDLE_UP },
} satisfies ChartConfig

export default function RealtimeCandlestickDemo() {
  const [running, setRunning] = React.useState(true)
  const [data, setData] = React.useState<MarketCandle[]>(() =>
    seedCandles(WINDOW, START_PRICE, Date.now())
  )
  const candleStartedAt = React.useRef(Date.now())
  const momentumRef = React.useRef(0)
  const domainRef = React.useRef<{ min: number; max: number } | null>(null)

  React.useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => {
      const now = Date.now()
      setData((prev) => {
        const last = prev[prev.length - 1]
        if (!last) return prev

        if (now - candleStartedAt.current >= CANDLE_MS) {
          candleStartedAt.current = now
          // Continue from last close — no jump on candle open.
          const next = openCandle(last.time + CANDLE_MS, last.close)
          const nextData = [...prev, next]
          return nextData.length > WINDOW
            ? nextData.slice(nextData.length - WINDOW)
            : nextData
        }

        const stepped = stepPrice(last.close, momentumRef.current)
        momentumRef.current = stepped.momentum
        const nextData = [...prev]
        nextData[nextData.length - 1] = applyTick(
          last,
          stepped.price,
          Math.round(90 + Math.random() * 220)
        )
        return nextData
      })
    }, TICK_MS)
    return () => window.clearInterval(id)
  }, [running])

  useChart2ToolbarStart(
    () => (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-7 gap-1.5 px-2 text-[12px] text-muted-foreground"
        onClick={() => setRunning((v) => !v)}
      >
        <span
          className={
            running
              ? "size-1.5 shrink-0 animate-pulse rounded-full"
              : "size-1.5 shrink-0 rounded-full bg-muted-foreground/50"
          }
          style={running ? { background: CANDLE_UP } : undefined}
          aria-hidden
        />
        {running ? "زنده" : "توقف"}
      </Button>
    ),
    [running]
  )

  const first = data[0]
  const last = data[data.length - 1]
  const change =
    first && last ? ((last.close - first.open) / first.open) * 100 : 0
  const up = change >= 0
  const sessionUp = last ? isBullish(last) : true

  const lows = data.map((c) => c.low)
  const highs = data.map((c) => c.high)
  const priceMin = Math.min(...lows)
  const priceMax = Math.max(...highs)
  const domain = stickyDomain(priceMin, priceMax, domainRef.current)
  domainRef.current = domain
  const domainMin = domain.min
  const domainMax = domain.max

  return (
    <div className="w-full max-w-[760px] font-sans">
      <div className="overflow-hidden rounded-xl border border-border/60 bg-background">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border/50 px-4 py-3">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold tracking-tight">شپنا</p>
              <ChangeBadge value={change} good={up} />
              {running ? (
                <span className="text-muted-foreground flex items-center gap-1 text-[10px]">
                  <span
                    className="size-1.5 animate-pulse rounded-full"
                    style={{ background: sessionUp ? CANDLE_UP : CANDLE_DOWN }}
                  />
                  زنده
                </span>
              ) : (
                <span className="text-muted-foreground text-[10px]">متوقف</span>
              )}
            </div>
            <p className="text-muted-foreground mt-0.5 text-[11px]">
              کندل زنده · سبک بایننس · پنجرهٔ{" "}
              {toPersianDigits(String(WINDOW))} شمع
            </p>
          </div>
          <div className="text-end">
            <p
              className="fa-num whitespace-nowrap text-lg font-semibold"
              style={{ color: sessionUp ? CANDLE_UP : CANDLE_DOWN }}
            >
              {last ? formatMoneyOneLine(last.close) : "—"}
            </p>
            <p className="text-muted-foreground text-[11px]">
              {last
                ? `O ${formatToman(last.open)} · H ${formatToman(last.high)} · L ${formatToman(last.low)}`
                : "قیمت لحظه‌ای"}
            </p>
          </div>
        </div>

        <ChartContainer
          config={priceConfig}
          className={`${chart2BarContainerClassName} max-h-[300px] max-w-none`}
        >
          <BarChart
            accessibilityLayer
            data={data}
            syncId="live-candle"
            margin={{ top: 14, right: 8, left: 4, bottom: 0 }}
            barCategoryGap="8%"
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="time" reversed hide />
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
              cursor={{ fill: "var(--muted)", fillOpacity: 0.16 }}
              content={LiveCandleTooltip}
            />
          </BarChart>
        </ChartContainer>

        <ChartContainer
          config={volumeConfig}
          className={`aspect-5/1 h-auto max-h-[88px] w-full max-w-none font-sans text-xs ${chart2DashedGridClassName}`}
        >
          <BarChart
            accessibilityLayer
            data={data}
            syncId="live-candle"
            margin={{ top: 4, right: 8, left: 4, bottom: 8 }}
            barCategoryGap="12%"
          >
            <XAxis
              dataKey="time"
              reversed
              tickMargin={6}
              minTickGap={40}
              tickFormatter={timestampToClock}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide domain={[0, "dataMax"]} />
            <Bar dataKey="volume" isAnimationActive={false} radius={[2, 2, 0, 0]}>
              {data.map((candle) => (
                <Cell
                  key={candle.time}
                  fill={candleColor(candle)}
                  fillOpacity={0.55}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  )
}
