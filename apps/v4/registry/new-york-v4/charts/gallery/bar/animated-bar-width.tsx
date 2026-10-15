"use client"

import { Bar, BarChart, CartesianGrid, Rectangle, XAxis, YAxis } from "recharts"

import { usePersianMockData } from "@/registry/new-york-v4/lib/chart-live"
import {
  chartBarContainerClassName,
  chartBarMockConfig,
  formatChartNumber,
} from "@/lib/chart-fa"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/registry/new-york-v4/ui/chart"

function AnimatedShape(props: Record<string, unknown>) {
  const p = props as {
    x?: number
    isActive?: boolean
  } & Record<string, unknown>
  return (
    <>
      <Rectangle {...p} fill="transparent" />
      <Rectangle
        {...p}
        fill="var(--color-y)"
        style={{
          transform: p.isActive ? undefined : "scaleX(20%)",
          transformOrigin: `${p.x ?? 0}px center`,
          transition: "all 0.2s ease-out",
          pointerEvents: "none",
        }}
      />
    </>
  )
}

export default function BarAnimatedWidthDemo() {
  const data = usePersianMockData(15, 5)

  return (
    <ChartContainer
      config={chartBarMockConfig}
      className={chartBarContainerClassName}
    >
      <BarChart
        accessibilityLayer
        data={data}
        barCategoryGap={4}
        margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="label"
          reversed
          mirror
          padding={{ right: 30 }}
          interval={1}
        />
        <YAxis
          orientation="right"
          mirror
          tickLine={false}
          tick={{ angle: 90, textAnchor: "start" }}
          padding={{ bottom: 30 }}
          tickFormatter={formatChartNumber}
        />
        <Bar
          dataKey="y"
          fill="var(--color-y)"
          activeBar={AnimatedShape}
          shape={AnimatedShape}
          label={{
            fill: "var(--foreground)",
            position: "insideTopRight",
            angle: 90,
            textAnchor: "start",
            fontFamily: "var(--font-sans)",
            formatter: (value: number | string) => formatChartNumber(value),
          }}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
      </BarChart>
    </ChartContainer>
  )
}
