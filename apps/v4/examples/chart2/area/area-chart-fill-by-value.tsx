"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  useChartHeight,
  useYAxisScale,
} from "recharts"

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
  { name: FA_MONTHS[0], uv: 4000 },
  { name: FA_MONTHS[1], uv: 3000 },
  { name: FA_MONTHS[2], uv: -1000 },
  { name: FA_MONTHS[3], uv: 500 },
  { name: FA_MONTHS[4], uv: -2000 },
  { name: FA_MONTHS[5], uv: -250 },
  { name: "مهر", uv: 3490 },
]

const chartConfig = {
  uv: {
    label: FA_CHART.store,
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

function SplitGradient() {
  const scale = useYAxisScale()
  const height = useChartHeight()
  const scaledZero = scale?.(0)
  if (scaledZero == null || height == null) return null
  const ratio = scaledZero / height

  return (
    <defs>
      <linearGradient
        id="chart2SplitColor"
        x1="0"
        x2="0"
        y1="0"
        y2={height}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="var(--chart-2)" stopOpacity={1} />
        <stop offset={`${ratio}`} stopColor="var(--chart-2)" stopOpacity={0.15} />
        <stop offset={`${ratio}`} stopColor="var(--chart-5)" stopOpacity={0.15} />
        <stop offset="1" stopColor="var(--chart-5)" stopOpacity={1} />
      </linearGradient>
    </defs>
  )
}

export default function AreaChartFillByValueDemo() {
  return (
    <ChartContainer config={chartConfig} className={chart2ContainerClassName}>
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{ top: 10, right: 8, left: 0, bottom: 5 }}
      >
        <CartesianGrid />
        <XAxis dataKey="name" reversed tickMargin={8} />
        <YAxis
          orientation="right"
          width={52}
          tickMargin={12}
          tickFormatter={formatChart2Number}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <SplitGradient />
        <Area
          type="monotone"
          dataKey="uv"
          stroke="var(--foreground)"
          fill="url(#chart2SplitColor)"
        />
      </AreaChart>
    </ChartContainer>
  )
}
