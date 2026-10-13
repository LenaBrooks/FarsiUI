"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
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

type PricePoint = { time: number; close: number }

function generateCloseSeries(
  length = 36,
  seed = 901,
  startPrice = 2_420_000,
  startTime = Date.UTC(2025, 8, 1)
): PricePoint[] {
  const gen = random(seed)
  const dayMs = 24 * 60 * 60 * 1000
  let price = startPrice
  const rows: PricePoint[] = []
  for (let i = 0; i < length; i++) {
    const drift = between(gen, -12, 14) / 10_000
    price = Math.max(10_000, Math.round(price * (1 + drift)))
    rows.push({ time: startTime + i * dayMs, close: price })
  }
  return rows
}

const data = generateCloseSeries()
const first = data[0]!
const last = data[data.length - 1]!
const change = ((last.close - first.close) / first.close) * 100
const up = change >= 0
const LINE = CHART2_BAR_COLORS[0]

const closes = data.map((d) => d.close)
const priceMin = Math.min(...closes)
const priceMax = Math.max(...closes)
const pad = (priceMax - priceMin) * 0.08 || priceMin * 0.01
const domainMin = Math.floor((priceMin - pad) / 5_000) * 5_000
const domainMax = Math.ceil((priceMax + pad) / 5_000) * 5_000

const chartConfig = {
  close: { label: "قیمت پایانی", color: LINE },
} satisfies ChartConfig

function PriceTooltip({ active, payload }: TooltipContentProps) {
  if (!(active && payload?.length)) return null
  const row = payload[0]?.payload as PricePoint | undefined
  if (!row) return null
  return (
    <div
      className="min-w-[8.5rem] rounded-lg border bg-background px-3 py-2.5 text-xs shadow-xl font-sans"
      dir="rtl"
    >
      <p className="mb-1.5 font-medium">{timestampToDay(row.time)}</p>
      <p className="text-muted-foreground flex justify-between gap-4">
        <span>پایانی</span>
        <span className="text-foreground">{formatToman(row.close)}</span>
      </p>
    </div>
  )
}

export default function StockLineDemo({
  defaultIndex,
}: {
  defaultIndex?: TooltipIndex
}) {
  useChart2Caption(() => <>خط قیمت روزانه شپنا — تم داشبورد</>)

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
              خط قیمت پایانی
            </p>
          </div>
          <div className="text-end">
            <p className="whitespace-nowrap text-lg font-semibold tracking-tight">
              {formatMoneyOneLine(last.close)}
            </p>
            <p className="text-muted-foreground text-[11px]">آخرین قیمت</p>
          </div>
        </div>

        <ChartContainer
          config={chartConfig}
          className={`${chart2BarContainerClassName} max-h-[340px] max-w-none`}
        >
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{ top: 16, right: 8, left: 4, bottom: 4 }}
          >
            <defs>
              <linearGradient id="stock-line-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={LINE} stopOpacity={0.35} />
                <stop offset="100%" stopColor={LINE} stopOpacity={0.02} />
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
            <ChartTooltip
              cursor={{ stroke: LINE, strokeOpacity: 0.35 }}
              defaultIndex={defaultIndex}
              content={PriceTooltip}
            />
            <Area
              type="monotone"
              dataKey="close"
              stroke={up ? CANDLE_UP : LINE}
              strokeWidth={2}
              fill="url(#stock-line-fill)"
              dot={false}
              activeDot={{ r: 3, fill: LINE }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  )
}
