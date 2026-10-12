"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import type { LineProps } from "recharts"

import { formatChart2Number } from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

const series = [
  {
    name: "سری ۱",
    dataKey: "s1",
    data: [
      { category: "الف", value: 0.1 },
      { category: "ب", value: 0.2 },
      { category: "پ", value: 0.3 },
    ],
  },
  {
    name: "سری ۲",
    dataKey: "s2",
    data: [
      { category: "ب", value: 0.4 },
      { category: "پ", value: 0.5 },
      { category: "ت", value: 0.6 },
    ],
  },
  {
    name: "سری ۳",
    dataKey: "s3",
    data: [
      { category: "پ", value: 0.7 },
      { category: "ت", value: 0.8 },
      { category: "ث", value: 0.9 },
    ],
  },
]

const chartConfig = {
  s1: { label: "سری ۱", color: "var(--chart-1)" },
  s2: { label: "سری ۲", color: "var(--chart-2)" },
  s3: { label: "سری ۳", color: "var(--chart-3)" },
} satisfies ChartConfig

function MyLine(props: LineProps & { index: number }) {
  const { index, ...rest } = props
  const colors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
  ]
  return <Line stroke={colors[index % colors.length]} strokeWidth={2} {...rest} />
}

export default function LineChartHasMultiSeriesDemo({
  defaultIndex,
}: {
  defaultIndex?: number
}) {
  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-[1.618] h-auto w-full max-w-[700px] max-h-[70vh] font-sans"
    >
      <LineChart accessibilityLayer>
        <CartesianGrid />
        <XAxis
          dataKey="category"
          type="category"
          allowDuplicatedCategory={false}
          reversed
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis
          dataKey="value"
          orientation="right"
          width={48}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={formatChart2Number}
        />
        <ChartTooltip
          defaultIndex={defaultIndex}
          content={<ChartTooltipContent />}
        />
        <ChartLegend content={<ChartLegendContent />} />
        {series.map((s, index) => (
          <MyLine
            key={s.name}
            dataKey="value"
            data={s.data}
            name={s.name}
            index={index}
          />
        ))}
      </LineChart>
    </ChartContainer>
  )
}
