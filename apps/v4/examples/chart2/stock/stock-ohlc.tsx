"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  type BarShapeProps,
  type TooltipContentProps,
  type TooltipIndex,
} from "recharts"

import { chart2ContainerClassName } from "@/lib/chart2-fa"
import {
  generateMockMarketData,
  type MarketCandle,
} from "@/lib/chart2-mock-data"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

import {
  candleColor,
  formatToman,
  formatTomanTick,
  timestampToMinutes,
} from "./stock-shared"

const data: ReadonlyArray<MarketCandle> = generateMockMarketData(
  60,
  2048,
  100,
  1768145757834
)

const chartConfig = {
  ohlc: { label: "OHLC", color: "var(--chart-1)" },
} satisfies ChartConfig

/** میلهٔ OHLC کلاسیک: خط عمودی H–L و تیک افقی باز/بسته. */
function OhlcBar(props: BarShapeProps) {
  const {
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    // @ts-expect-error payload fields from MarketCandle
    open,
    // @ts-expect-error payload fields from MarketCandle
    close,
    // @ts-expect-error payload fields from MarketCandle
    low,
    // @ts-expect-error payload fields from MarketCandle
    high,
  } = props

  if (high === low) return null

  const color = candleColor({ open, close })
  const cx = Number(x) + Number(width) / 2
  const scale = Number(height) / (high - low)
  const yHigh = Number(y)
  const yLow = Number(y) + Number(height)
  const yOpen = yHigh + (high - open) * scale
  const yClose = yHigh + (high - close) * scale
  const tick = Math.max(4, Number(width) * 0.45)

  return (
    <g stroke={color} strokeWidth={1.5} fill="none">
      <line x1={cx} x2={cx} y1={yHigh} y2={yLow} />
      <line x1={cx - tick} x2={cx} y1={yOpen} y2={yOpen} />
      <line x1={cx} x2={cx + tick} y1={yClose} y2={yClose} />
    </g>
  )
}

function TooltipContent(props: TooltipContentProps) {
  const { active, payload } = props
  if (!(active && payload?.length)) return null
  const entry = payload[0]?.payload as MarketCandle | undefined
  if (!entry) return null
  return (
    <div className="rounded-lg border bg-background px-3 py-2 text-xs shadow-xl font-sans">
      <p className="mb-1 font-medium">زمان: {timestampToMinutes(entry.time)}</p>
      <p className="text-muted-foreground">باز: {formatToman(entry.open)}</p>
      <p className="text-muted-foreground">بسته: {formatToman(entry.close)}</p>
      <p className="text-muted-foreground">کمینه: {formatToman(entry.low)}</p>
      <p className="text-muted-foreground">بیشینه: {formatToman(entry.high)}</p>
    </div>
  )
}

export default function StockOhlcDemo({
  defaultIndex,
}: {
  defaultIndex?: TooltipIndex
}) {
  return (
    <ChartContainer config={chartConfig} className={chart2ContainerClassName}>
      <BarChart
        accessibilityLayer
        data={data as MarketCandle[]}
        margin={{ top: 12, right: 8, bottom: 8, left: 0 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="time"
          reversed
          tickMargin={8}
          tickFormatter={timestampToMinutes}
          minTickGap={28}
        />
        <YAxis
          orientation="right"
          width={56}
          tickMargin={10}
          domain={["dataMin - 1", "dataMax + 1"]}
          tickFormatter={formatTomanTick}
          label={{
            value: "تومان",
            angle: 90,
            position: "insideRight",
            style: { fontFamily: "var(--font-sans)", fontSize: 11 },
            fill: "var(--muted-foreground)",
          }}
        />
        <Bar
          dataKey={(d: MarketCandle) => [d.low, d.high]}
          shape={OhlcBar}
          isAnimationActive={false}
        />
        <ChartTooltip content={TooltipContent} defaultIndex={defaultIndex} />
      </BarChart>
    </ChartContainer>
  )
}
