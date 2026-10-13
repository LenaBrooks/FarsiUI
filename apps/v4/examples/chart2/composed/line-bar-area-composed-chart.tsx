"use client"

import * as React from "react"
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  Scatter,
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
  { month: FA_MONTHS[0], uv: 590, pv: 800, amt: 1400, cnt: 490 },
  { month: FA_MONTHS[1], uv: 868, pv: 967, amt: 1506, cnt: 590 },
  { month: FA_MONTHS[2], uv: 1397, pv: 1098, amt: 989, cnt: 350 },
  { month: FA_MONTHS[3], uv: 1480, pv: 1200, amt: 1228, cnt: 480 },
  { month: FA_MONTHS[4], uv: 1520, pv: 1108, amt: 1100, cnt: 460 },
  { month: FA_MONTHS[5], uv: 1400, pv: 680, amt: 1700, cnt: 380 },
]

const chartConfig = {
  month: { label: "ماه" },
  amt: { label: FA_CHART.orders, color: CHART2_BAR_COLORS[0] },
  pv: { label: FA_CHART.online, color: CHART2_BAR_COLORS[1] },
  uv: { label: FA_CHART.store, color: CHART2_BAR_COLORS[2] },
  cnt: { label: "تعداد", color: CHART2_BAR_COLORS[3] },
} satisfies ChartConfig

function ComposedTooltipContent(
  props: React.ComponentProps<typeof ChartTooltipContent>
) {
  // Scatter adds the X-axis category as its own tooltip row; drop it.
  const payload = props.payload?.filter((item) => {
    const key = String(item.dataKey ?? item.name ?? "")
    return key !== "month" && typeof item.value === "number"
  })
  return <ChartTooltipContent {...props} payload={payload} />
}

export default function LineBarAreaComposedChartDemo() {
  return (
    <ChartContainer config={chartConfig} className={chart2ContainerClassName}>
      <ComposedChart
        accessibilityLayer
        data={data}
        margin={{ top: 20, right: 8, bottom: 8, left: 0 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" scale="band" reversed tickMargin={8} />
        <YAxis
          orientation="right"
          width={52}
          tickMargin={12}
          tickFormatter={formatChart2Number}
        />
        <ChartTooltip
          content={(props) => <ComposedTooltipContent {...props} />}
        />
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
        <Scatter dataKey="cnt" fill="var(--color-cnt)" />
      </ComposedChart>
    </ChartContainer>
  )
}
