"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"

import {
  FA_CHART,
  FA_MONTHS,
  formatChart2Number,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
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
  uv: { label: FA_CHART.store, color: "var(--chart-1)" },
} satisfies ChartConfig

export default function ResponsiveContainerDemo({
  isAnimationActive = true,
}: {
  isAnimationActive?: boolean
}) {
  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-[1.618] h-auto w-full max-h-[500px] font-sans text-xs"
    >
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{ top: 20, right: 8, left: 0, bottom: 0 }}
      >
        <XAxis dataKey="name" reversed tickMargin={8} />
        <YAxis
          orientation="right"
          width={52}
          tickMargin={12}
          tickFormatter={formatChart2Number}
        />
        <CartesianGrid vertical={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ReferenceLine
          x={FA_MONTHS[2]}
          stroke="var(--chart-2)"
          label={{
            value: "حداقل ماه",
            position: "insideTopLeft",
            fill: "var(--chart-2)",
            fontFamily: "var(--font-sans)",
            fontSize: 11,
          }}
        />
        <ReferenceLine
          y={4000}
          stroke="var(--destructive)"
          strokeDasharray="3 3"
          label={{
            value: "حداکثر",
            position: "insideTopRight",
            fill: "var(--destructive)",
            fontFamily: "var(--font-sans)",
            fontSize: 11,
          }}
        />
        <Area
          type="monotone"
          dataKey="uv"
          stroke="var(--color-uv)"
          fill="var(--color-uv)"
          fillOpacity={0.35}
          isAnimationActive={isAnimationActive}
        />
      </AreaChart>
    </ChartContainer>
  )
}
