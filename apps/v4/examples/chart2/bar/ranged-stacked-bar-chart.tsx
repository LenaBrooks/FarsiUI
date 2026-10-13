"use client"

import { Bar, BarChart, BarStack, CartesianGrid, XAxis, YAxis, type TooltipIndex } from "recharts"

import {
  CHART2_BAR_COLORS,
  FA_MONTHS,
  chart2BarContainerClassName,
  formatChart2Number,
  toPersianDigits,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

const rangedStackedBarData = [
  { name: FA_MONTHS[0], value1: [100, 200], value2: [200, 250], value3: [250, 300] },
  { name: FA_MONTHS[1], value1: [120, 180], value2: [130, 230], value3: [170, 270] },
  { name: FA_MONTHS[2], value1: [90, 160], value2: [210, 310], value3: [340, 440] },
  { name: FA_MONTHS[3], value1: [80, 140], value2: [140, 200], value3: [200, 220] },
]

const chartConfig = {
  value1: { label: "بازهٔ ۱", color: CHART2_BAR_COLORS[0] },
  value2: { label: "بازهٔ ۲", color: CHART2_BAR_COLORS[1] },
  value3: { label: "بازهٔ ۳", color: CHART2_BAR_COLORS[2] },
} satisfies ChartConfig

export default function RangedStackedBarChartDemo({
  isAnimationActive = true,
  defaultIndex,
}: {
  isAnimationActive?: boolean
  defaultIndex?: TooltipIndex
}) {
  return (
    <ChartContainer config={chartConfig} className={chart2BarContainerClassName}>
      <BarChart
        accessibilityLayer
        data={rangedStackedBarData}
        margin={{ top: 20, right: 12, bottom: 20, left: 8 }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="name" reversed tickMargin={8} />
        <YAxis
          orientation="right"
          width={48}
          tickMargin={10}
          tickFormatter={formatChart2Number}
        />
        <ChartTooltip
          defaultIndex={defaultIndex}
          content={
            <ChartTooltipContent
              formatter={(value) => {
                if (!Array.isArray(value)) return formatChart2Number(value as number)
                return `${toPersianDigits(String(value[0]))} — ${toPersianDigits(String(value[1]))}`
              }}
            />
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
        <BarStack radius={12}>
          <Bar
            dataKey="value1"
            fill="var(--color-value1)"
            stroke="var(--color-value1)"
            maxBarSize={50}
            isAnimationActive={isAnimationActive}
          />
          <Bar
            dataKey="value2"
            fill="var(--color-value2)"
            stroke="var(--color-value2)"
            maxBarSize={50}
            isAnimationActive={isAnimationActive}
          />
          <Bar
            dataKey="value3"
            fill="var(--color-value3)"
            stroke="var(--color-value3)"
            maxBarSize={50}
            isAnimationActive={isAnimationActive}
          />
        </BarStack>
      </BarChart>
    </ChartContainer>
  )
}
