"use client"

import * as React from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  type TooltipContentProps,
  type TooltipIndex,
} from "recharts"

import { useChartCaption } from "@/registry/new-york-v4/lib/chart-live"
import { useMarketNeon } from "@/registry/new-york-v4/lib/use-market-neon"
import {
  MARKET_DOWN,
  MARKET_UP,
  chartAreaGradientStops,
  chartBarContainerClassName,
  chartNeonGlowProps,
  chartNeonOverflowClassName,
  toPersianDigits,
} from "@/lib/chart-fa"
import { between, random } from "@/lib/chart-mock-data"
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
  formatToman,
  formatVolume,
} from "./stock-shared"

type DepthRow = {
  price: number
  bid: number | null
  ask: number | null
}

function buildDepth(seed = 77, mid = 2_420_000, levels = 18): DepthRow[] {
  const gen = random(seed)
  const step = 4_000
  const bids: DepthRow[] = []
  const asks: DepthRow[] = []
  let bidCum = 0
  let askCum = 0

  for (let i = levels; i >= 1; i--) {
    bidCum += between(gen, 2_000, 18_000)
    bids.push({ price: mid - i * step, bid: bidCum, ask: null })
  }
  for (let i = 1; i <= levels; i++) {
    askCum += between(gen, 2_000, 18_000)
    asks.push({ price: mid + i * step, bid: null, ask: askCum })
  }
  return [...bids, { price: mid, bid: bidCum, ask: askCum }, ...asks]
}

const mid = 2_420_000
const data = buildDepth()

function DepthTooltip({
  active,
  payload,
  up,
  down,
}: TooltipContentProps & { up: string; down: string }) {
  if (!(active && payload?.length)) return null
  const row = payload[0]?.payload as DepthRow | undefined
  if (!row) return null
  return (
    <div
      className="min-w-[9rem] rounded-lg border bg-background px-3 py-2.5 text-xs shadow-xl font-sans"
      dir="rtl"
    >
      <p className="mb-1.5 font-medium">{formatToman(row.price)}</p>
      {row.bid != null ? (
        <p className="text-muted-foreground flex justify-between gap-4">
          <span style={{ color: up }}>خرید تجمعی</span>
          <span className="text-foreground">{formatVolume(row.bid)}</span>
        </p>
      ) : null}
      {row.ask != null ? (
        <p className="text-muted-foreground mt-1 flex justify-between gap-4">
          <span style={{ color: down }}>فروش تجمعی</span>
          <span className="text-foreground">{formatVolume(row.ask)}</span>
        </p>
      ) : null}
    </div>
  )
}

export default function OrderBookDepthDemo({
  defaultIndex,
}: {
  defaultIndex?: TooltipIndex
}) {
  const neon = useMarketNeon()
  const gid = React.useId().replace(/:/g, "")
  const up = neon ? MARKET_UP : CANDLE_UP
  const down = neon ? MARKET_DOWN : CANDLE_DOWN
  const glowUp = neon ? chartNeonGlowProps(up) : null
  const glowDown = neon ? chartNeonGlowProps(down) : null
  const bidStops = chartAreaGradientStops(up, {
    startOpacity: neon ? 0.32 : 0.45,
    endOpacity: neon ? 0 : 0.05,
  })
  const askStops = chartAreaGradientStops(down, {
    startOpacity: neon ? 0.32 : 0.45,
    endOpacity: neon ? 0 : 0.05,
  })

  const chartConfig = {
    bid: { label: "خرید", color: up },
    ask: { label: "فروش", color: down },
  } satisfies ChartConfig

  useChartCaption(() => <>سفارش‌های خرید و فروش در سطوح قیمت</>)

  return (
    <div className="w-full max-w-[760px] overflow-hidden rounded-xl border border-border/60 bg-transparent font-sans">
      <div className="flex flex-wrap items-end justify-between gap-2 border-b border-border/50 px-4 py-2.5">
        <div>
          <p className="text-sm font-medium">عمق بازار · شپنا</p>
          <p className="text-muted-foreground text-[11px]">
            قیمت میانی {formatMoneyOneLine(mid)}
          </p>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-[2px]" style={{ background: up }} />
            خرید
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="size-2 rounded-[2px]"
              style={{ background: down }}
            />
            فروش
          </span>
        </div>
      </div>
      <ChartContainer
        config={chartConfig}
        className={cn(
          chartBarContainerClassName,
          "max-h-[380px] max-w-none",
          neon && chartNeonOverflowClassName
        )}
      >
        <AreaChart
          accessibilityLayer
          data={data}
          margin={{ top: 16, right: 8, left: 4, bottom: 4 }}
        >
          <defs>
            <linearGradient id={`${gid}-bid`} x1="0" y1="0" x2="0" y2="1">
              {bidStops.map((s) => (
                <stop
                  key={s.offset}
                  offset={s.offset}
                  stopColor={s.stopColor}
                  stopOpacity={s.stopOpacity}
                />
              ))}
            </linearGradient>
            <linearGradient id={`${gid}-ask`} x1="0" y1="0" x2="0" y2="1">
              {askStops.map((s) => (
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
            dataKey="price"
            reversed
            tickMargin={10}
            minTickGap={40}
            tickFormatter={(v) => toPersianDigits((v / 1_000_000).toFixed(2))}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            orientation="right"
            width={52}
            tickMargin={6}
            tickFormatter={(v) =>
              toPersianDigits(String(Math.round(v / 1000))) + "هـ"
            }
            axisLine={false}
            tickLine={false}
          />
          <ChartTooltip
            defaultIndex={defaultIndex}
            content={(props) => (
              <DepthTooltip {...props} up={up} down={down} />
            )}
          />
          <Area
            type="stepAfter"
            dataKey="bid"
            stroke={up}
            strokeWidth={glowUp?.strokeWidth ?? 2}
            fill={`url(#${gid}-bid)`}
            connectNulls={false}
            isAnimationActive={false}
            style={glowUp?.style}
            className={glowUp?.className}
          />
          <Area
            type="stepAfter"
            dataKey="ask"
            stroke={down}
            strokeWidth={glowDown?.strokeWidth ?? 2}
            fill={`url(#${gid}-ask)`}
            connectNulls={false}
            isAnimationActive={false}
            style={glowDown?.style}
            className={glowDown?.className}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}
