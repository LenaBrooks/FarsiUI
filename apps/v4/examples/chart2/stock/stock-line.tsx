"use client"

import {
  CartesianGrid,
  Line,
  LineChart,
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
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

import {
  formatToman,
  formatTomanTick,
  timestampToMinutes,
} from "./stock-shared"

const data: ReadonlyArray<MarketCandle> = generateMockMarketData(
  80,
  901,
  100,
  1768145757834
)

const chartConfig = {
  close: { label: "قیمت پایانی", color: "var(--chart-1)" },
} satisfies ChartConfig

export default function StockLineDemo({
  defaultIndex,
}: {
  defaultIndex?: TooltipIndex
}) {
  return (
    <ChartContainer config={chartConfig} className={chart2ContainerClassName}>
      <LineChart
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
        <ChartTooltip
          defaultIndex={defaultIndex}
          content={
            <ChartTooltipContent
              labelFormatter={(_, payload) => {
                const time = payload?.[0]?.payload?.time
                return time != null ? `زمان: ${timestampToMinutes(time)}` : ""
              }}
              formatter={(value) => formatToman(Number(value))}
            />
          }
        />
        <Line
          type="monotone"
          dataKey="close"
          stroke="var(--color-close)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 3 }}
        />
      </LineChart>
    </ChartContainer>
  )
}
