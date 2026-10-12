"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
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
  BINANCE_CANDLE_UP,
  candleRangeKey,
  CandlestickShape,
  formatTomanTick,
  StockCandleTooltip,
  timestampToMinutes,
} from "./stock-shared"

const data: ReadonlyArray<MarketCandle> = generateMockMarketData(
  100,
  1337,
  100,
  1768145757834
)

const chartConfig = {
  candle: { label: "شمع", color: BINANCE_CANDLE_UP },
} satisfies ChartConfig

export default function CandlestickDemo({
  defaultIndex,
}: {
  defaultIndex?: TooltipIndex
}) {
  return (
    <ChartContainer config={chartConfig} className={chart2ContainerClassName}>
      <BarChart accessibilityLayer data={data as MarketCandle[]}>
        <XAxis
          dataKey="time"
          reversed
          tickMargin={8}
          tickFormatter={timestampToMinutes}
          minTickGap={32}
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
        <CartesianGrid vertical={false} />
        <Bar
          name="قیمت"
          dataKey={candleRangeKey}
          shape={CandlestickShape}
          isAnimationActive={false}
        />
        <ChartTooltip
          content={StockCandleTooltip}
          defaultIndex={defaultIndex}
        />
      </BarChart>
    </ChartContainer>
  )
}
