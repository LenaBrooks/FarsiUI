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

export default function ComposedChartWithAxisLabelsDemo() {
  return (
    <ChartContainer config={chartConfig} className={chart2ContainerClassName}>
      <ComposedChart
        accessibilityLayer
        data={data}
        margin={{ top: 20, right: 8, bottom: 28, left: 8 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="name"
          scale="band"
          reversed
          tickMargin={8}
          label={{
            value: "ماه",
            position: "insideBottomLeft",
            offset: -4,
            style: { fontFamily: "var(--font-sans)", fontSize: 11 },
            fill: "var(--muted-foreground)",
          }}
        />
        <YAxis
          orientation="right"
          width={52}
          tickMargin={12}
          tickFormatter={formatChart2Number}
          label={{
            value: "مقدار",
            angle: 90,
            position: "insideRight",
            offset: 8,
            style: { fontFamily: "var(--font-sans)", fontSize: 11 },
            fill: "var(--muted-foreground)",
          }}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          type="monotone"
          dataKey="amt"
          fill="var(--color-amt)"
          stroke="var(--color-amt)"
          fillOpacity={0.25}
        />
        <Bar dataKey="pv" barSize={20} fill="var(--color-pv)" radius={[3, 3, 0, 0]} />
        <Line
          type="monotone"
          dataKey="uv"
          stroke="var(--color-uv)"
          strokeWidth={2}
          dot={false}
        />
      </ComposedChart>
    </ChartContainer>
  )
}
