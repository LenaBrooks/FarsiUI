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
import { chart2ContainerClassName } from "@/lib/chart2-fa"
import {
  generateMockMarketData,
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
  BINANCE_CANDLE_UP,
  candleRangeKey,
  CandlestickShape,
  formatToman,
  formatTomanTick,
  timestampToMinutes,
} from "./stock-shared"

const SMA_PERIOD = 7

const raw = generateMockMarketData(70, 808, 100, 1768145757834)
const data = raw.map((candle, i, arr) => {
  if (i < SMA_PERIOD - 1) {
    return { ...candle, sma: undefined as number | undefined }
  }
  const slice = arr.slice(i - SMA_PERIOD + 1, i + 1)
  const sma = slice.reduce((sum, item) => sum + item.close, 0) / SMA_PERIOD
  return { ...candle, sma: +sma.toFixed(2) }
})

const chartConfig = {
  candle: { label: "کندل", color: BINANCE_CANDLE_UP },
  sma: { label: `میانگین ${SMA_PERIOD} دوره`, color: "var(--chart-4)" },
} satisfies ChartConfig

function CandleLineTooltip({ active, payload }: TooltipContentProps) {
  if (!(active && payload?.length)) return null
  const entry = payload[0]?.payload as
    | (MarketCandle & { sma?: number })
    | undefined
  if (!entry) return null
  return (
    <div className="rounded-lg border bg-background px-3 py-2 text-xs shadow-xl font-sans">
      <p className="mb-1 font-medium">زمان: {timestampToMinutes(entry.time)}</p>
      <p className="text-muted-foreground">باز: {formatToman(entry.open)}</p>
      <p className="text-muted-foreground">بسته: {formatToman(entry.close)}</p>
      <p className="text-muted-foreground">کمینه: {formatToman(entry.low)}</p>
      <p className="text-muted-foreground">بیشینه: {formatToman(entry.high)}</p>
      {entry.sma != null ? (
        <p className="text-muted-foreground mt-1">
          {chartConfig.sma.label}: {formatToman(entry.sma)}
        </p>
      ) : null}
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
      کندل به‌همراه میانگین متحرک {SMA_PERIOD} دوره‌ای — مشابه{" "}
      <span dir="ltr">Candlestick + Line</span>
    </>
  ))

  return (
    <div className="w-full max-w-[700px] font-sans">
      <ChartContainer config={chartConfig} className={chart2ContainerClassName}>
        <ComposedChart
          accessibilityLayer
          data={data as Array<MarketCandle & { sma?: number }>}
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
          <ChartTooltip
            defaultIndex={defaultIndex}
            content={CandleLineTooltip}
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey={candleRangeKey}
            name="کندل"
            shape={CandlestickShape}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="sma"
            name={chartConfig.sma.label}
            stroke="var(--color-sma)"
            strokeWidth={2}
            dot={false}
            connectNulls
          />
        </ComposedChart>
      </ChartContainer>
    </div>
  )
}
