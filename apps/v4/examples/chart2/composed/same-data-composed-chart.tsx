"use client"

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts"

import {
  CHART2_BAR_COLORS,
  FA_CHART,
  FA_MONTHS,
  chart2ContainerClassName,
  formatChart2Number,
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
  { name: FA_MONTHS[0], uv: 590 },
  { name: FA_MONTHS[1], uv: 868 },
  { name: FA_MONTHS[2], uv: 1397 },
  { name: FA_MONTHS[3], uv: 1480 },
  { name: FA_MONTHS[4], uv: 1520 },
  { name: FA_MONTHS[5], uv: 1400 },
]

const chartConfig = {
  uv: { label: FA_CHART.store, color: CHART2_BAR_COLORS[0] },
} satisfies ChartConfig

export default function SameDataComposedChartDemo() {
  return (
    <ChartContainer config={chartConfig} className={chart2ContainerClassName}>
      <ComposedChart
        accessibilityLayer
        data={data}
        margin={{ top: 20, right: 8, bottom: 8, left: 0 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis dataKey="name" scale="band" reversed tickMargin={8} />
        <YAxis
          orientation="right"
          width={52}
          tickMargin={12}
          tickFormatter={formatChart2Number}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="uv"
          barSize={20}
          fill="var(--color-uv)"
          radius={[3, 3, 0, 0]}
        />
        <Line
          type="monotone"
          dataKey="uv"
          stroke={CHART2_BAR_COLORS[1]}
          strokeWidth={2}
          dot={false}
          legendType="none"
        />
      </ComposedChart>
    </ChartContainer>
  )
}
