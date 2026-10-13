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

import { usePersianMockData } from "@/components/chart2-live"
import {
  chart2BarMockConfig,
  formatChart2Number,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/registry/new-york-v4/ui/chart"

export default function VerticalComposedChartDemo() {
  const data = usePersianMockData(6, 324)

  return (
    <ChartContainer
      config={chart2BarMockConfig}
      className="aspect-[1/1.618] h-auto w-full max-w-[320px] max-h-[70vh] overflow-visible font-sans text-xs"
    >
      <ComposedChart
        accessibilityLayer
        layout="vertical"
        data={data}
        margin={{ top: 20, right: 8, bottom: 8, left: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          type="number"
          height={52}
          tickLine={false}
          axisLine={false}
          tickMargin={18}
          padding={{ left: 28, right: 20 }}
          tickFormatter={formatChart2Number}
        />
        <YAxis
          dataKey="label"
          type="category"
          scale="band"
          orientation="right"
          width={96}
          tickLine={false}
          axisLine={false}
          tickMargin={18}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          dataKey="x"
          fill="var(--color-x)"
          stroke="var(--color-x)"
          fillOpacity={0.25}
        />
        <Bar dataKey="y" barSize={20} fill="var(--color-y)" />
        <Line dataKey="z" stroke="var(--color-z)" strokeWidth={2} dot={false} />
      </ComposedChart>
    </ChartContainer>
  )
}
