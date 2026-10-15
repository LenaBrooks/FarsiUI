"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  type TooltipContentProps,
  type TooltipIndex,
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
  CANDLE_DOWN,
  CANDLE_UP,
  candleRangeKey,
  CandlestickShape,
  formatToman,
  generateNaturalCandles,
  JalaliDayTick,
  macd,
  rsi,
  StockCandleTooltip,
  timestampToDay,
} from "./stock-shared"

const candles = generateNaturalCandles(56, 9012)
const closes = candles.map((c) => c.close)
const rsiVals = rsi(closes, 14)
const { macdLine, signal, hist } = macd(closes)

const data = candles.map((c, i) => ({
  ...c,
  rsi: rsiVals[i],
  macd: macdLine[i],
  signal: signal[i],
  hist: hist[i],
}))

const lows = data.map((c) => c.low)
const highs = data.map((c) => c.high)
const priceMin = Math.min(...lows)
const priceMax = Math.max(...highs)
const pad = (priceMax - priceMin) * 0.06
const domainMin = Math.floor((priceMin - pad) / 2_000) * 2_000
const domainMax = Math.ceil((priceMax + pad) / 2_000) * 2_000

const last = data[data.length - 1]!

const candleConfig = {
  candle: { label: "شمع", color: CANDLE_UP },
} satisfies ChartConfig

const rsiConfig = {
  rsi: { label: "RSI", color: CHART_BAR_COLORS[3] },
} satisfies ChartConfig

const macdConfig = {
  macd: { label: "MACD", color: CHART_BAR_COLORS[0] },
  signal: { label: "سیگنال", color: CHART_BAR_COLORS[1] },
  hist: { label: "هیستوگرام", color: CANDLE_UP },
} satisfies ChartConfig

function DayCandleTooltip(props: TooltipContentProps) {
  return <StockCandleTooltip {...props} dayLabel compact />
}

function RsiTooltip({ active, payload }: TooltipContentProps) {
  if (!(active && payload?.length)) return null
  const row = payload[0]?.payload as (typeof data)[number] | undefined
  if (!row || row.rsi == null) return null
  return (
    <div
      className="rounded-lg border bg-background px-3 py-2 text-xs shadow-xl font-sans"
      dir="rtl"
    >
      <p className="font-medium">{timestampToDay(row.time)}</p>
      <p className="text-muted-foreground mt-1">
        RSI:{" "}
        <span className="text-foreground">
          {toPersianDigits(row.rsi.toFixed(1))}
        </span>
      </p>
    </div>
  )
}

function MacdTooltip({ active, payload }: TooltipContentProps) {
  if (!(active && payload?.length)) return null
  const row = payload[0]?.payload as (typeof data)[number] | undefined
  if (!row || row.macd == null) return null
  return (
    <div
      className="min-w-[8rem] rounded-lg border bg-background px-3 py-2 text-xs shadow-xl font-sans"
      dir="rtl"
    >
      <p className="mb-1 font-medium">{timestampToDay(row.time)}</p>
      <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-muted-foreground">
        <span>MACD</span>
        <span className="text-end text-foreground">
          {toPersianDigits(row.macd.toFixed(0))}
        </span>
        {row.signal != null ? (
          <>
            <span>سیگنال</span>
            <span className="text-end text-foreground">
              {toPersianDigits(row.signal.toFixed(0))}
            </span>
          </>
        ) : null}
      </div>
    </div>
  )
}

export default function CandlestickIndicatorsDemo({
  defaultIndex,
}: {
  defaultIndex?: TooltipIndex
}) {
  useChartCaption(() => <>کندل همراه با RSI و MACD</>)

  return (
    <div className="w-full max-w-[760px] overflow-hidden rounded-xl border border-border/60 bg-background font-sans">
      <div className="flex flex-wrap items-end justify-between gap-2 border-b border-border/50 px-4 py-2.5">
        <div>
          <p className="text-sm font-medium">کندل + اندیکاتور · شپنا</p>
          <p className="text-muted-foreground text-[11px]">
            آخرین قیمت {formatToman(last.close)}
          </p>
        </div>
        <div className="flex gap-3 text-[11px]">
          <span>
            RSI{" "}
            <strong>
              {last.rsi != null ? toPersianDigits(last.rsi.toFixed(0)) : "—"}
            </strong>
          </span>
          <span>
            MACD{" "}
            <strong>
              {last.macd != null ? toPersianDigits(last.macd.toFixed(0)) : "—"}
            </strong>
          </span>
        </div>
      </div>

      <ChartContainer
        config={candleConfig}
        className={`${chartBarContainerClassName} max-h-[240px] max-w-none`}
      >
        <BarChart
          accessibilityLayer
          data={data}
          margin={{ top: 12, right: 4, left: 4, bottom: 0 }}
          barCategoryGap="1%"
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="time" hide />
          <YAxis
            orientation="right"
            width={CHART_TOMAN_AXIS_WIDTH}
            tickMargin={6}
            domain={[domainMin, domainMax]}
            tickCount={3}
            axisLine={false}
            tickLine={false}
            tick={TomanAxisTick}
          />
          <ChartTooltip defaultIndex={defaultIndex} content={DayCandleTooltip} />
          <Bar
            dataKey={candleRangeKey}
            shape={CandlestickShape}
            isAnimationActive={false}
          />
        </BarChart>
      </ChartContainer>

      <div className="border-t border-border/40 px-4 py-1.5">
        <p className="text-muted-foreground text-[10px]">RSI (۱۴)</p>
      </div>
      <ChartContainer
        config={rsiConfig}
        className={`${chartBarContainerClassName} max-h-[110px] max-w-none`}
      >
        <ComposedChart
          accessibilityLayer
          data={data}
          margin={{ top: 4, right: 8, left: 4, bottom: 0 }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="time" hide />
          <YAxis
            orientation="right"
            width={40}
            domain={[0, 100]}
            ticks={[30, 70]}
            tickFormatter={(v) => toPersianDigits(String(v))}
            axisLine={false}
            tickLine={false}
          />
          <ChartTooltip content={RsiTooltip} />
          <Line
            type="monotone"
            dataKey="rsi"
            stroke={CHART_BAR_COLORS[3]}
            strokeWidth={1.5}
            dot={false}
            connectNulls
            isAnimationActive={false}
          />
        </ComposedChart>
      </ChartContainer>

      <div className="border-t border-border/40 px-4 py-1.5">
        <p className="text-muted-foreground text-[10px]">MACD (۱۲، ۲۶، ۹)</p>
      </div>
      <ChartContainer
        config={macdConfig}
        className={`${chartBarContainerClassName} max-h-[130px] max-w-none`}
      >
        <ComposedChart
          accessibilityLayer
          data={data}
          margin={{ top: 4, right: 8, left: 4, bottom: 4 }}
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
            width={40}
            tickCount={3}
            tickFormatter={(v) => toPersianDigits(String(Math.round(v / 1000)))}
            axisLine={false}
            tickLine={false}
          />
          <ChartTooltip content={MacdTooltip} />
          <Bar dataKey="hist" isAnimationActive={false}>
            {data.map((row, i) => (
              <Cell
                key={i}
                fill={(row.hist ?? 0) >= 0 ? CANDLE_UP : CANDLE_DOWN}
                fillOpacity={0.7}
              />
            ))}
          </Bar>
          <Line
            type="monotone"
            dataKey="macd"
            stroke={CHART_BAR_COLORS[0]}
            strokeWidth={1.5}
            dot={false}
            connectNulls
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="signal"
            stroke={CHART_BAR_COLORS[1]}
            strokeWidth={1.25}
            dot={false}
            connectNulls
            isAnimationActive={false}
          />
        </ComposedChart>
      </ChartContainer>
    </div>
  )
}
