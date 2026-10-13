"use client"

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts"

import {
  CHART2_BAR_COLORS,
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
  { name: FA_MONTHS[0], a: [0, 0] as [number, number], b: 0 },
  { name: FA_MONTHS[1], a: [50, 300] as [number, number], b: 106 },
  { name: FA_MONTHS[2], a: [150, 423] as [number, number], b: 229 },
  { name: FA_MONTHS[3], b: 312 },
  { name: FA_MONTHS[4], a: [367, 678] as [number, number], b: 451 },
  { name: FA_MONTHS[5], a: [305, 821] as [number, number], b: 623 },
]

const chartConfig = {
  b: { label: "روند", color: CHART2_BAR_COLORS[0] },
  a: { label: "بازه", color: "var(--muted)" },
} satisfies ChartConfig

export default function BandedChartDemo() {
  return (
    <ChartContainer config={chartConfig} className={chart2ContainerClassName}>
      <ComposedChart
        accessibilityLayer
        data={data}
        margin={{ top: 20, right: 8, bottom: 8, left: 0 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis dataKey="name" reversed tickMargin={8} />
        <YAxis
          orientation="right"
          width={52}
          tickMargin={12}
          tickFormatter={formatChart2Number}
        />
        <ChartLegend
          content={(props) => (
            <ChartLegendContent
              {...props}
              payload={props.payload?.filter((item) => item.dataKey !== "a")}
            />
          )}
        />
        <ChartTooltip
          content={(props) => (
            <ChartTooltipContent
              {...props}
              payload={props.payload?.filter((item) => item.dataKey !== "a")}
            />
          )}
        />
        <Area
          type="monotone"
          dataKey="a"
          stroke="none"
          fill="var(--color-a)"
          fillOpacity={0.35}
          connectNulls
          dot={false}
          activeDot={false}
          legendType="none"
        />
        <Line
          type="natural"
          dataKey="b"
          stroke="var(--color-b)"
          strokeWidth={2}
          connectNulls
          dot={false}
        />
      </ComposedChart>
    </ChartContainer>
  )
}
