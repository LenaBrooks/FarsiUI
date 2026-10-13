"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
  type TooltipIndex,
} from "recharts"

import { useChart2Caption } from "@/components/chart2-live"
import { chart2BarContainerClassName } from "@/lib/chart2-fa"
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
  timestampToCategoryLabel,
} from "./stock-shared"

type CategoryCandle = MarketCandle & { label: string }

const data: CategoryCandle[] = generateMockMarketData(
  48,
  606,
  100,
  1768145757834
).map((candle) => ({
  ...candle,
  label: timestampToCategoryLabel(candle.time),
}))

const newsLabel = data[Math.floor(data.length * 0.45)]!.label

const chartConfig = {
  candle: { label: "شمع", color: BINANCE_CANDLE_UP },
} satisfies ChartConfig

export default function CandlestickCategoryDemo({
  defaultIndex,
}: {
  defaultIndex?: TooltipIndex
}) {
  useChart2Caption(
    () => <>محور X دسته‌ای با برچسب تاریخ/ساعت و خط مرجع «انتشار خبر»</>
  )

  return (
    <div className="w-full max-w-[700px] font-sans">
      <ChartContainer config={chartConfig} className={chart2BarContainerClassName}>
        <BarChart
          accessibilityLayer
          data={data}
          margin={{ top: 28, right: 8, bottom: 8, left: 0 }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            type="category"
            reversed
            tickMargin={8}
            minTickGap={40}
            interval="preserveStartEnd"
            tick={{ fontSize: 10 }}
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
          <ReferenceLine
            x={newsLabel}
            stroke="var(--chart-2)"
            strokeDasharray="4 3"
            label={{
              value: "انتشار خبر",
              position: "insideTopLeft",
              fill: "var(--chart-2)",
              fontSize: 11,
              fontFamily: "var(--font-sans)",
            }}
          />
          <Bar
            name="قیمت"
            dataKey={candleRangeKey}
            shape={CandlestickShape}
            isAnimationActive={false}
          />
          <ChartTooltip
            defaultIndex={defaultIndex}
            content={<StockCandleTooltip labelKey="label" />}
          />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
