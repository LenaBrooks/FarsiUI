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

import { useChart2Caption } from "@/components/chart2-live"
import {
  chart2BarContainerClassName,
  toPersianDigits,
} from "@/lib/chart2-fa"
import { between, random } from "@/lib/chart2-mock-data"
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

const chartConfig = {
  bid: { label: "خرید", color: CANDLE_UP },
  ask: { label: "فروش", color: CANDLE_DOWN },
} satisfies ChartConfig

function DepthTooltip({ active, payload }: TooltipContentProps) {
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
          <span style={{ color: CANDLE_UP }}>خرید تجمعی</span>
          <span className="text-foreground">{formatVolume(row.bid)}</span>
        </p>
      ) : null}
      {row.ask != null ? (
        <p className="text-muted-foreground mt-1 flex justify-between gap-4">
          <span style={{ color: CANDLE_DOWN }}>فروش تجمعی</span>
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
  const gid = React.useId().replace(/:/g, "")
  useChart2Caption(() => <>سفارش‌های خرید و فروش در سطوح قیمت</>)

  return (
    <div className="w-full max-w-[760px] overflow-hidden rounded-xl border border-border/60 bg-background font-sans">
      <div className="flex flex-wrap items-end justify-between gap-2 border-b border-border/50 px-4 py-2.5">
        <div>
          <p className="text-sm font-medium">عمق بازار · شپنا</p>
          <p className="text-muted-foreground text-[11px]">
            قیمت میانی {formatMoneyOneLine(mid)}
          </p>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-[2px]" style={{ background: CANDLE_UP }} />
            خرید
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-[2px]" style={{ background: CANDLE_DOWN }} />
            فروش
          </span>
        </div>
      </div>
      <ChartContainer
        config={chartConfig}
        className={`${chart2BarContainerClassName} max-h-[380px] max-w-none`}
      >
        <AreaChart
          accessibilityLayer
          data={data}
          margin={{ top: 16, right: 8, left: 4, bottom: 4 }}
        >
          <defs>
            <linearGradient id={`${gid}-bid`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CANDLE_UP} stopOpacity={0.45} />
              <stop offset="100%" stopColor={CANDLE_UP} stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id={`${gid}-ask`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CANDLE_DOWN} stopOpacity={0.45} />
              <stop offset="100%" stopColor={CANDLE_DOWN} stopOpacity={0.05} />
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
            tickFormatter={(v) => toPersianDigits(String(Math.round(v / 1000))) + "هـ"}
            axisLine={false}
            tickLine={false}
          />
          <ChartTooltip defaultIndex={defaultIndex} content={DepthTooltip} />
          <Area
            type="stepAfter"
            dataKey="bid"
            stroke={CANDLE_UP}
            strokeWidth={2}
            fill={`url(#${gid}-bid)`}
            connectNulls={false}
            isAnimationActive={false}
          />
          <Area
            type="stepAfter"
            dataKey="ask"
            stroke={CANDLE_DOWN}
            strokeWidth={2}
            fill={`url(#${gid}-ask)`}
            connectNulls={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}
