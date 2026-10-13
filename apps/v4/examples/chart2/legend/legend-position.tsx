"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import { CHART_TOMAN_AXIS_WIDTH } from "@/lib/chart-locale"
import { TomanAxisTick } from "@/lib/chart-toman-tick"
import {
  CHART2_BAR_COLORS,
  FA_CHART,
  FA_MONTHS,
  chart2ContainerClassName,
  chart2DashedGridClassName,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

const data = [
  { name: FA_MONTHS[0], uv: 4000, pv: 2400 },
  { name: FA_MONTHS[1], uv: 3000, pv: 1398 },
  { name: FA_MONTHS[2], uv: 2000, pv: 9800 },
  { name: FA_MONTHS[3], uv: 2780, pv: 3908 },
  { name: FA_MONTHS[4], uv: 1890, pv: 4800 },
  { name: FA_MONTHS[5], uv: 2390, pv: 3800 },
  { name: "مهر", uv: 3490, pv: 4300 },
]

const chartConfig = {
  pv: { label: FA_CHART.online, color: CHART2_BAR_COLORS[0] },
  uv: { label: FA_CHART.store, color: CHART2_BAR_COLORS[1] },
} satisfies ChartConfig

export default function LegendDemo({
  isAnimationActive = true,
}: {
  isAnimationActive?: boolean
}) {
  return (
    <ChartContainer
      config={chartConfig}
      className={`${chart2ContainerClassName} ${chart2DashedGridClassName}`}
    >
      <LineChart
        accessibilityLayer
        data={data}
        margin={{ top: 8, right: 8, left: 0, bottom: 5 }}
      >
        <XAxis dataKey="name" reversed tickMargin={8} />
        <YAxis
          orientation="right"
          width={CHART_TOMAN_AXIS_WIDTH}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={TomanAxisTick}
        />
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend
          content={<ChartLegendContent />}
          verticalAlign="top"
          className="pb-4"
        />
        <Line
          type="monotone"
          dataKey="pv"
          stroke="var(--color-pv)"
          strokeWidth={2}
          dot={false}
          isAnimationActive={isAnimationActive}
        />
        <Line
          type="monotone"
          dataKey="uv"
          stroke="var(--color-uv)"
          strokeWidth={2}
          dot={false}
          isAnimationActive={isAnimationActive}
        />
      </LineChart>
    </ChartContainer>
  )
}
