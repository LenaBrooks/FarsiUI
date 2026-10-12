"use client"

import {
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
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
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

import {
  formatToman,
  formatTomanTick,
  timestampToMinutes,
} from "./stock-shared"

const raw = generateMockMarketData(80, 314, 100, 1768145757834)
const SMA_PERIOD = 8

const data = raw.map((candle, i, arr) => {
  if (i < SMA_PERIOD - 1) {
    return { ...candle, sma: undefined as number | undefined }
  }
  const slice = arr.slice(i - SMA_PERIOD + 1, i + 1)
  const sma =
    slice.reduce((sum, item) => sum + item.close, 0) / SMA_PERIOD
  return { ...candle, sma: +sma.toFixed(2) }
})

const chartConfig = {
  close: { label: "قیمت پایانی", color: "var(--chart-1)" },
  sma: { label: "میانگین متحرک", color: "var(--chart-4)" },
} satisfies ChartConfig

export default function StockTrendlineDemo({
  defaultIndex,
}: {
  defaultIndex?: TooltipIndex
}) {
  useChart2Caption(
    () => <>خط روند با میانگین متحرک ساده ({SMA_PERIOD} دوره)</>
  )

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
            content={
              <ChartTooltipContent
                labelFormatter={(_, payload) => {
                  const time = payload?.[0]?.payload?.time
                  return time != null ? `زمان: ${timestampToMinutes(time)}` : ""
                }}
                formatter={(value) =>
                  value == null ? null : formatToman(Number(value))
                }
              />
            }
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Line
            type="monotone"
            dataKey="close"
            stroke="var(--color-close)"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="sma"
            stroke="var(--color-sma)"
            strokeWidth={2}
            strokeDasharray="5 4"
            dot={false}
            connectNulls
          />
        </ComposedChart>
      </ChartContainer>
    </div>
  )
}
