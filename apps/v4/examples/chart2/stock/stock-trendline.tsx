"use client"

import {
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
import { between, random } from "@/lib/chart2-mock-data"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

import {
  CANDLE_UP,
  ChangeBadge,
  formatMoneyOneLine,
  formatToman,
  JalaliDayTick,
  timestampToDay,
} from "./stock-shared"

const SMA_PERIOD = 7
const PRICE_COLOR = CHART2_BAR_COLORS[0]
const SMA_COLOR = CHART2_BAR_COLORS[3]
const SMA_LABEL = `میانگین ${toPersianDigits(SMA_PERIOD)} دوره`

type TrendRow = { time: number; close: number; sma?: number }

function generateCloseSeries(
  length = 40,
  seed = 314,
  startPrice = 2_420_000,
  startTime = Date.UTC(2025, 8, 1)
): TrendRow[] {
  const gen = random(seed)
  const dayMs = 24 * 60 * 60 * 1000
  let price = startPrice
  const raw: TrendRow[] = []
  for (let i = 0; i < length; i++) {
    const drift = between(gen, -14, 16) / 10_000
    const shock = between(gen, 0, 100) > 90 ? between(gen, -30, 30) / 10_000 : 0
    price = Math.max(10_000, Math.round(price * (1 + drift + shock)))
    raw.push({ time: startTime + i * dayMs, close: price })
  }
  return raw.map((row, i, arr) => {
    if (i < SMA_PERIOD - 1) return { ...row, sma: undefined }
    const slice = arr.slice(i - SMA_PERIOD + 1, i + 1)
    const sma = slice.reduce((sum, item) => sum + item.close, 0) / SMA_PERIOD
    return { ...row, sma: Math.round(sma) }
  })
}

const data = generateCloseSeries()
const first = data[0]!
const last = data[data.length - 1]!
const change = ((last.close - first.close) / first.close) * 100
const up = change >= 0

const closes = data.map((d) => d.close)
const priceMin = Math.min(...closes)
const priceMax = Math.max(...closes)
const pad = (priceMax - priceMin) * 0.08 || priceMin * 0.01
const domainMin = Math.floor((priceMin - pad) / 5_000) * 5_000
const domainMax = Math.ceil((priceMax + pad) / 5_000) * 5_000

const chartConfig = {
  close: { label: "قیمت پایانی", color: PRICE_COLOR },
  sma: { label: SMA_LABEL, color: SMA_COLOR },
} satisfies ChartConfig

function TrendTooltip({ active, payload }: TooltipContentProps) {
  if (!(active && payload?.length)) return null
  const row = payload[0]?.payload as TrendRow | undefined
  if (!row) return null
  return (
    <div
      className="min-w-[10rem] rounded-lg border bg-background px-3 py-2.5 text-xs shadow-xl font-sans"
      dir="rtl"
    >
      <p className="mb-2 font-medium">{timestampToDay(row.time)}</p>
      <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span
            className="size-1.5 rounded-full"
            style={{ background: PRICE_COLOR }}
          />
          پایانی
        </span>
        <span className="text-end text-foreground">
          {formatToman(row.close)}
        </span>
        {row.sma != null ? (
          <>
            <span className="flex items-center gap-1.5">
              <span
                className="size-1.5 rounded-full"
                style={{ background: SMA_COLOR }}
              />
              میانگین
            </span>
            <span className="text-end text-foreground">
              {formatToman(row.sma)}
            </span>
          </>
        ) : null}
      </div>
    </div>
  )
}

export default function StockTrendlineDemo({
  defaultIndex,
}: {
  defaultIndex?: TooltipIndex
}) {
  useChart2Caption(() => (
    <>خط روند با میانگین متحرک {toPersianDigits(SMA_PERIOD)} دوره‌ای</>
  ))

  return (
    <div className="w-full max-w-[760px] font-sans">
      <div className="overflow-hidden rounded-xl border border-border/60 bg-background">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border/50 px-4 py-3">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold tracking-tight">شپنا</p>
              <ChangeBadge value={change} good={up} />
            </div>
            <p className="text-muted-foreground mt-0.5 text-[11px]">
              قیمت + {SMA_LABEL}
            </p>
          </div>
          <div className="text-end">
            <p className="whitespace-nowrap text-lg font-semibold tracking-tight">
              {formatMoneyOneLine(last.close)}
            </p>
            <p className="text-muted-foreground text-[11px]">
              {last.sma != null
                ? `میانگین ${formatMoneyOneLine(last.sma)}`
                : "آخرین قیمت"}
            </p>
          </div>
        </div>

        <div className="flex gap-4 px-4 pt-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span
              className="size-2 rounded-[2px]"
              style={{ background: PRICE_COLOR }}
            />
            قیمت پایانی
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="h-0.5 w-3 rounded-full"
              style={{
                background: SMA_COLOR,
                backgroundImage: `repeating-linear-gradient(90deg, ${SMA_COLOR} 0 3px, transparent 3px 6px)`,
              }}
            />
            {SMA_LABEL}
          </span>
        </div>

        <ChartContainer
          config={chartConfig}
          className={`${chart2BarContainerClassName} max-h-[340px] max-w-none`}
        >
          <ComposedChart
            accessibilityLayer
            data={data}
            margin={{ top: 12, right: 8, left: 4, bottom: 4 }}
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
              tickCount={4}
              axisLine={false}
              tickLine={false}
              tick={TomanAxisTick}
            />
            <ChartTooltip
              cursor={{ stroke: PRICE_COLOR, strokeOpacity: 0.35 }}
              defaultIndex={defaultIndex}
              content={TrendTooltip}
            />
            <Line
              type="monotone"
              dataKey="close"
              name="قیمت پایانی"
              stroke={up ? CANDLE_UP : PRICE_COLOR}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="sma"
              name={SMA_LABEL}
              stroke={SMA_COLOR}
              strokeWidth={2}
              strokeDasharray="5 4"
              dot={false}
              connectNulls
              isAnimationActive={false}
            />
          </ComposedChart>
        </ChartContainer>
      </div>
    </div>
  )
}
