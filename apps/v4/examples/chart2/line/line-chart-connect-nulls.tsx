"use client"

import type { ReactNode } from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

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
  { name: FA_MONTHS[0], uv: 4000 },
  { name: FA_MONTHS[1], uv: 3000 },
  { name: FA_MONTHS[2], uv: 2000 },
  { name: FA_MONTHS[3] },
  { name: FA_MONTHS[4], uv: 1890 },
  { name: FA_MONTHS[5], uv: 2390 },
  { name: "مهر", uv: 3490 },
]

const chartConfig = {
  uv: {
    label: FA_CHART.store,
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

function BaseChart({ children }: { children: ReactNode }) {
  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-[1.618] h-auto w-full max-w-[700px] max-h-[30vh] font-sans"
    >
      <LineChart
        accessibilityLayer
        data={data}
        margin={{ top: 10, right: 12, left: 12, bottom: 0 }}
      >
        <CartesianGrid />
        <XAxis
          dataKey="name"
          reversed
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis
          orientation="right"
          width={48}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={formatChart2Number}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        {children}
      </LineChart>
    </ChartContainer>
  )
}

export default function LineChartConnectNullsDemo() {
  return (
    <div className="flex w-full flex-col gap-4">
      <BaseChart>
        <Line type="monotone" dataKey="uv" stroke="var(--color-uv)" strokeWidth={2} />
      </BaseChart>
      <BaseChart>
        <Line
          connectNulls
          type="monotone"
          dataKey="uv"
          stroke="var(--color-uv)"
          strokeWidth={2}
        />
      </BaseChart>
    </div>
  )
}
