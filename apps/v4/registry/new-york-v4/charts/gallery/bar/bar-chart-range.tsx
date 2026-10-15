"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  CHART_BAR_COLORS,
  FA_MONTHS,
  chartBarContainerClassName,
  formatChartNumber,
  toPersianDigits,
} from "@/lib/chart-fa"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

const rangeData = [
  { day: FA_MONTHS[0], temperature: [-1, 10] },
  { day: FA_MONTHS[1], temperature: [2, 15] },
  { day: FA_MONTHS[2], temperature: [3, 12] },
  { day: FA_MONTHS[3], temperature: [4, 12] },
  { day: FA_MONTHS[4], temperature: [12, 16] },
  { day: FA_MONTHS[5], temperature: [5, 16] },
  { day: "مهر", temperature: [3, 12] },
  { day: "آبان", temperature: [0, 8] },
  { day: "آذر", temperature: [-3, 5] },
]

export default function BarChartRangeDemo({
  isAnimationActive = true,
}: {
  isAnimationActive?: boolean
}) {
  const [c0] = CHART_BAR_COLORS

  const chartConfig = {
    temperature: {
      label: "بازهٔ دما",
      color: c0,
    },
  } satisfies ChartConfig

  return (
    <ChartContainer
      config={chartConfig}
      className={chartBarContainerClassName}
    >
      <BarChart
        accessibilityLayer
        data={rangeData}
        margin={{ top: 20, right: 12, bottom: 20, left: 8 }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="day" reversed tickMargin={8} />
        <YAxis
          orientation="right"
          width={44}
          tickMargin={10}
          tickFormatter={(v) => toPersianDigits(String(v))}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => {
                if (!Array.isArray(value)) return formatChartNumber(value as number)
                return `${toPersianDigits(String(value[0]))} — ${toPersianDigits(String(value[1]))}`
              }}
            />
          }
        />
        <Bar
          dataKey="temperature"
          fill="var(--color-temperature)"
          radius={[3, 3, 3, 3]}
          isAnimationActive={isAnimationActive}
        />
      </BarChart>
    </ChartContainer>
  )
}
