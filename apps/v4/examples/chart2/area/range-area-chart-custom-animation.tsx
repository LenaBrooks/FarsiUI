"use client"

import { useId } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  CHART2_BAR_COLORS,
  FA_MONTHS,
  chart2AreaContainerClassName,
  formatChart2Number,
  toPersianDigits,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

const data = [
  { name: FA_MONTHS[0], range: [400, 2400] },
  { name: FA_MONTHS[1], range: [300, 1398] },
  { name: FA_MONTHS[2], range: [200, 9800] },
  { name: FA_MONTHS[3], range: [278, 3908] },
  { name: FA_MONTHS[4], range: [189, 4800] },
  { name: FA_MONTHS[5], range: [239, 3800] },
  { name: "مهر", range: [349, 4300] },
]

const chartConfig = {
  range: {
    label: "بازه",
    color: CHART2_BAR_COLORS[0],
  },
} satisfies ChartConfig

export default function AreaRangeCustomAnimationDemo() {
  const uid = useId().replace(/:/g, "")
  const gradId = `chart2RangeAreaAnim-${uid}`
  const fill = chartConfig.range.color

  return (
    <ChartContainer
      config={chartConfig}
      className={chart2AreaContainerClassName}
    >
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{ top: 10, right: 8, left: 0, bottom: 5 }}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={fill} stopOpacity={0.45} />
            <stop offset="95%" stopColor={fill} stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" reversed tickMargin={8} />
        <YAxis
          orientation="right"
          width={52}
          tickMargin={12}
          tickFormatter={formatChart2Number}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => {
                if (!Array.isArray(value))
                  return formatChart2Number(value as number)
                return `${toPersianDigits(String(value[0]))} — ${toPersianDigits(String(value[1]))}`
              }}
            />
          }
        />
        <Area
          type="linear"
          dataKey="range"
          stroke={fill}
          strokeWidth={2}
          fill={`url(#${gradId})`}
          fillOpacity={1}
          animationDuration={1200}
          isAnimationActive
        />
      </AreaChart>
    </ChartContainer>
  )
}
