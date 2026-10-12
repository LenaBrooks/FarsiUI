"use client"

import { useCallback, useState } from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  FA_CHART,
  FA_MONTHS,
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
  { name: FA_MONTHS[0], uv: 4000, pv: 2400, amt: 2400 },
  { name: FA_MONTHS[1], uv: 3000, pv: 1398, amt: 2210 },
  { name: FA_MONTHS[2], uv: 2000, pv: 9800, amt: 2290 },
  { name: FA_MONTHS[3], uv: 2780, pv: 3908, amt: 2000 },
  { name: FA_MONTHS[4], uv: 1890, pv: 4800, amt: 2181 },
  { name: FA_MONTHS[5], uv: 2390, pv: 3800, amt: 2500 },
  { name: "مهر", uv: 3490, pv: 4300, amt: 2100 },
]

const chartConfig = {
  uv: { label: FA_CHART.store, color: "var(--chart-1)" },
  pv: { label: FA_CHART.online, color: "var(--chart-2)" },
  amt: { label: FA_CHART.orders, color: "var(--chart-3)" },
} satisfies ChartConfig

const DEFAULT_OPACITY: Record<string, number> = {
  uv: 1,
  pv: 1,
  amt: 1,
}

export default function DynamicZIndexLineChartDemo() {
  const [opacity, setOpacity] = useState(DEFAULT_OPACITY)
  const [activeKey, setActiveKey] = useState<string | null>(null)

  const handleMouseEnter = useCallback(
    (o: { dataKey?: string | number | ((obj: unknown) => unknown) }) => {
      const { dataKey } = o
      if (typeof dataKey === "string") {
        setOpacity((prev) => ({ ...prev, [dataKey]: 0.5 }))
        setActiveKey(dataKey)
      }
    },
    []
  )

  const handleMouseLeave = useCallback(
    (o: { dataKey?: string | number | ((obj: unknown) => unknown) }) => {
      const { dataKey } = o
      if (typeof dataKey === "string") {
        setOpacity((prev) => ({ ...prev, [dataKey]: 1 }))
        setActiveKey(null)
      }
    },
    []
  )

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-[1.618] h-auto w-full max-w-[700px] max-h-[70vh] font-sans"
    >
      <LineChart
        accessibilityLayer
        data={data}
        margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
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
        <ChartLegend
          content={<ChartLegendContent />}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
        {(Object.keys(chartConfig) as Array<keyof typeof chartConfig>).map(
          (key) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={`var(--color-${key})`}
              strokeWidth={2}
              strokeOpacity={opacity[key]}
              zIndex={activeKey === key ? 10 : undefined}
            />
          )
        )}
      </LineChart>
    </ChartContainer>
  )
}
