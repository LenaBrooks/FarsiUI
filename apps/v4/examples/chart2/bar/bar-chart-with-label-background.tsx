"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

import {
  FA_CHART,
  FA_MONTHS,
  chart2ContainerClassName,
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
]

const chartConfig = {
  pv: { label: FA_CHART.online, color: "var(--chart-1)" },
  uv: { label: FA_CHART.store, color: "var(--chart-2)" },
} satisfies ChartConfig

export default function BarChartWithLabelBackgroundDemo({
  isAnimationActive = true,
}: {
  isAnimationActive?: boolean
}) {
  return (
    <ChartContainer config={chartConfig} className={chart2ContainerClassName}>
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ top: 15, right: 8, left: 0, bottom: 5 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis dataKey="name" reversed tickMargin={8} />
        <YAxis
          orientation="right"
          width={52}
          tickMargin={12}
          tickFormatter={formatChart2Number}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar
          dataKey="pv"
          stackId="a"
          fill="var(--color-pv)"
          isAnimationActive={isAnimationActive}
        >
          <LabelList
            dataKey="pv"
            position="inside"
            formatter={(v: number) => formatChart2Number(v)}
            className="fill-primary-foreground text-[10px] [font-family:var(--font-sans)]"
          />
        </Bar>
        <Bar
          dataKey="uv"
          stackId="a"
          fill="var(--color-uv)"
          isAnimationActive={isAnimationActive}
          radius={[4, 4, 0, 0]}
        >
          <LabelList
            dataKey="uv"
            position="inside"
            formatter={(v: number) => formatChart2Number(v)}
            className="fill-primary-foreground text-[10px] [font-family:var(--font-sans)]"
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
