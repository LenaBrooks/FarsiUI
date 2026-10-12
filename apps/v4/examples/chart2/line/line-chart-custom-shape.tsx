"use client"

import { usePersianMockData } from "@/components/chart2-live"
import { CartesianGrid,
  Curve,
  Line,
  LineChart,
  XAxis,
  YAxis } from "recharts"

import {
  chart2ContainerClassName,
  chart2MockConfig,
  formatChart2Number,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/registry/new-york-v4/ui/chart"

/** Fade-in custom line shape (entrance animation proxy for older Recharts). */
function OpacityFadeShape(props: Record<string, unknown>) {
  const { animationElapsedTime = 1, isEntrance = false, ...rest } = props as {
    animationElapsedTime?: number
    isEntrance?: boolean
  } & Record<string, unknown>
  const opacity = isEntrance ? animationElapsedTime : 1
  return <Curve {...rest} strokeOpacity={opacity} />
}

export default function LineAnimatesOpacityDemo() {
  const data = usePersianMockData(7, 100)
  return (
    <ChartContainer config={chart2MockConfig} className={chart2ContainerClassName}>
      <LineChart
        accessibilityLayer
        data={data}
        margin={{ top: 10, right: 12, left: 12, bottom: 0 }}
      >
        <CartesianGrid />
        <XAxis
          dataKey="label"
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
        <Line
          type="monotone"
          dataKey="y"
          stroke="var(--color-y)"
          strokeWidth={3}
          shape={OpacityFadeShape}
          animationDuration={500}
        />
      </LineChart>
    </ChartContainer>
  )
}
