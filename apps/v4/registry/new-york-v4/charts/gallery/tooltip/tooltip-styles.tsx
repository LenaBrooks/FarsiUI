"use client"

import type { CSSProperties } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { usePersianMockData } from "@/lib/chart-live"
import { CHART_TOMAN_AXIS_WIDTH } from "@/lib/chart-locale"
import { TomanAxisTick } from "@/lib/chart-toman-tick"
import {
  CHART_BAR_COLORS,
  chartBarContainerClassName,
  chartBarMockConfig,
  formatChartNumber,
} from "@/lib/chart-fa"
import {
  ChartContainer,
  ChartTooltip,
} from "@/registry/new-york-v4/ui/chart"

const customContentStyles: CSSProperties = {
  backgroundColor: "var(--background)",
  border: `2px solid ${CHART_BAR_COLORS[0]}`,
  borderRadius: 8,
  color: "var(--foreground)",
  fontFamily: "var(--font-sans)",
  direction: "rtl",
  textAlign: "right",
}

const customItemStyles: CSSProperties = {
  color: CHART_BAR_COLORS[0],
  fontWeight: "bold",
  fontSize: 14,
  paddingTop: 6,
  paddingBottom: 6,
  borderBottom: "1px dashed var(--border)",
  fontFamily: "var(--font-sans)",
}

const customLabelStyles: CSSProperties = {
  color: CHART_BAR_COLORS[1],
  fontWeight: "bold",
  fontSize: 16,
  fontFamily: "var(--font-sans)",
}

export default function TooltipStylesDemo() {
  const data = usePersianMockData(5, 42)

  return (
    <ChartContainer
      config={chartBarMockConfig}
      className={`${chartBarContainerClassName} mx-auto max-w-[500px]`}
    >
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ top: 10, right: 8, left: 0, bottom: 5 }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="label" reversed tickMargin={8} />
        <YAxis
          orientation="right"
          width={CHART_TOMAN_AXIS_WIDTH}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          domain={[0, "dataMax + 20"]}
          tick={TomanAxisTick}
        />
        <ChartTooltip
          // Keep tooltip visible after mouseOut to make it easy to inspect
          active
          defaultIndex={3}
          labelFormatter={(label) => `برچسب: ${label}`}
          formatter={(value) => formatChartNumber(value as number)}
          contentStyle={customContentStyles}
          itemStyle={customItemStyles}
          labelStyle={customLabelStyles}
        />
        <Bar
          dataKey="x"
          fill="var(--color-x)"
          name={chartBarMockConfig.x.label}
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="y"
          fill="var(--color-y)"
          name={chartBarMockConfig.y.label}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  )
}
