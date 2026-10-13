"use client"

import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts"

import { CHART_TOMAN_AXIS_WIDTH } from "@/lib/chart-locale"
import { TomanAxisTick } from "@/lib/chart-toman-tick"
import {
  CHART2_BAR_COLORS,
  FA_CHART,
  FA_MONTHS,
  chart2BarContainerClassName,
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
  { name: FA_MONTHS[0], uv: 590, pv: 800, amt: 1400 },
  { name: FA_MONTHS[1], uv: 868, pv: 967, amt: 1506 },
  { name: FA_MONTHS[2], uv: 1397, pv: 1098, amt: 989 },
  { name: FA_MONTHS[3], uv: 1480, pv: 1200, amt: 1228 },
  { name: FA_MONTHS[4], uv: 1520, pv: 1108, amt: 1100 },
  { name: FA_MONTHS[5], uv: 1400, pv: 680, amt: 1700 },
]

const chartConfig = {
  amt: { label: FA_CHART.orders, color: CHART2_BAR_COLORS[0] },
  pv: { label: FA_CHART.online, color: CHART2_BAR_COLORS[1] },
  uv: { label: FA_CHART.store, color: CHART2_BAR_COLORS[2] },
} satisfies ChartConfig

export default function ComposedResponsiveContainerDemo() {
  return (
    <ChartContainer
      config={chartConfig}
      className={`${chart2BarContainerClassName} max-h-[380px] max-w-none`}
    >
      <ComposedChart
        accessibilityLayer
        data={data}
        margin={{ top: 16, right: 8, bottom: 8, left: 0 }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          scale="band"
          reversed
          tickLine={false}
          axisLine={false}
          tickMargin={10}
        />
        <YAxis
          orientation="right"
          width={CHART_TOMAN_AXIS_WIDTH}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={TomanAxisTick}
        />
        <ChartTooltip
          cursor={{ fill: "var(--muted)", fillOpacity: 0.35 }}
          content={<ChartTooltipContent />}
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          type="monotone"
          dataKey="amt"
          fill="var(--color-amt)"
          stroke="var(--color-amt)"
          fillOpacity={0.22}
          strokeWidth={1.5}
        />
        <Bar
          dataKey="pv"
          barSize={22}
          fill="var(--color-pv)"
          radius={[4, 4, 0, 0]}
        />
        <Line
          type="monotone"
          dataKey="uv"
          stroke="var(--color-uv)"
          strokeWidth={2.25}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </ComposedChart>
    </ChartContainer>
  )
}
