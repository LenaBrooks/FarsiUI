"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import { usePersianMockData } from "@/components/chart2-live"
import {
  chart2MockConfig,
  formatChart2Number,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/registry/new-york-v4/ui/chart"

export default function VerticalLineChartDemo(props: {
  isAnimationActive?: boolean
}) {
  const data = usePersianMockData(6, 294213)

  return (
    <ChartContainer
      config={chart2MockConfig}
      className="aspect-[1/1.618] h-auto w-full max-w-[320px] max-h-[70vh] overflow-visible font-sans"
    >
      <LineChart
        accessibilityLayer
        layout="vertical"
        data={data}
        margin={{ top: 12, right: 8, left: 12, bottom: 12 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          type="number"
          height={52}
          tickLine={false}
          axisLine={false}
          tickMargin={18}
          padding={{ left: 28, right: 20 }}
          tick={{ dy: 4 }}
          tickFormatter={formatChart2Number}
        />
        <YAxis
          dataKey="label"
          type="category"
          orientation="right"
          width={96}
          tickLine={false}
          axisLine={false}
          tickMargin={18}
          tick={{ dx: 4 }}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          dataKey="x"
          stroke="var(--color-x)"
          isAnimationActive={props.isAnimationActive}
        />
        <Line
          dataKey="y"
          stroke="var(--color-y)"
          isAnimationActive={props.isAnimationActive}
        />
      </LineChart>
    </ChartContainer>
  )
}
