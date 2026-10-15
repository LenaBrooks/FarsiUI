"use client"

import { useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { usePersianMockData } from "@/registry/new-york-v4/lib/chart-live"
import {
  chartBarContainerClassName,
  chartBarMockConfig,
  formatChartNumber,
} from "@/lib/chart-fa"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/registry/new-york-v4/ui/chart"

export default function MixBarChartDemo() {
  const data = usePersianMockData(6, 823)
  const [focusedDataKey, setFocusedDataKey] = useState<string | null>(null)
  const [locked, setLocked] = useState(false)

  const fillFor = (key: string, color: string) =>
    focusedDataKey == null || focusedDataKey === key
      ? color
      : "color-mix(in oklab, var(--muted) 70%, transparent)"

  return (
    <ChartContainer
      config={chartBarMockConfig}
      className={chartBarContainerClassName}
    >
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ top: 20, right: 8, left: 0, bottom: 5 }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="label" reversed tickMargin={8} />
        <YAxis
          orientation="right"
          width={52}
          tickMargin={12}
          tickFormatter={formatChartNumber}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend
          content={<ChartLegendContent />}
          onMouseEnter={(payload) => {
            if (!locked) setFocusedDataKey(String(payload.dataKey))
          }}
          onMouseLeave={() => {
            if (!locked) setFocusedDataKey(null)
          }}
          onClick={(payload) => {
            const key = String(payload.dataKey)
            if (focusedDataKey === key) {
              if (locked) {
                setFocusedDataKey(null)
                setLocked(false)
              } else {
                setLocked(true)
              }
            } else {
              setFocusedDataKey(key)
              setLocked(true)
            }
          }}
        />
        <Bar
          dataKey="x"
          stackId="a"
          stroke="none"
          fill={fillFor("x", "var(--color-x)")}
        />
        <Bar
          dataKey="y"
          stackId="a"
          stroke="none"
          fill={fillFor("y", "var(--color-y)")}
        />
        <Bar
          dataKey="z"
          stroke="none"
          fill={fillFor("z", "var(--color-z)")}
        />
      </BarChart>
    </ChartContainer>
  )
}
