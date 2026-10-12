"use client"

import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  type TooltipIndex,
} from "recharts"

import { useChart2Caption } from "@/components/chart2-live"
import { chart2ContainerClassName } from "@/lib/chart2-fa"
import { generateMockStockSeries } from "@/lib/chart2-mock-data"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

import { formatToman, formatTomanTick, timestampToDay } from "./stock-shared"

const data = generateMockStockSeries(
  60,
  55,
  { tehran: 120, esfahan: 95, mashhad: 80 },
  1735689600000
)

const chartConfig = {
  tehran: { label: "تهران", color: "var(--chart-1)" },
  esfahan: { label: "اصفهان", color: "var(--chart-2)" },
  mashhad: { label: "مشهد", color: "var(--chart-3)" },
} satisfies ChartConfig

export default function StockMultiSeriesDemo({
  defaultIndex,
}: {
  defaultIndex?: TooltipIndex
}) {
  useChart2Caption(
    () => <>مقایسهٔ چند نماد روی یک محور زمانی — مشابه نمونهٔ چندسری سهام</>
  )

  return (
    <div className="w-full max-w-[700px] font-sans">
      <ChartContainer config={chartConfig} className={chart2ContainerClassName}>
        <LineChart
          accessibilityLayer
          data={data}
          margin={{ top: 12, right: 8, bottom: 8, left: 0 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="time"
            reversed
            tickMargin={8}
            tickFormatter={timestampToDay}
            minTickGap={28}
          />
          <YAxis
            orientation="right"
            width={56}
            tickMargin={10}
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
                  return time != null ? `تاریخ: ${timestampToDay(time)}` : ""
                }}
                formatter={(value) => formatToman(Number(value))}
              />
            }
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Line
            type="monotone"
            dataKey="tehran"
            stroke="var(--color-tehran)"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="esfahan"
            stroke="var(--color-esfahan)"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="mashhad"
            stroke="var(--color-mashhad)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  )
}
