"use client"

import type { CSSProperties } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { usePersianMockData } from "@/components/chart2-live"
import {
  chart2ContainerClassName,
  chart2MockConfig,
  formatChart2Number,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartTooltip,
} from "@/registry/new-york-v4/ui/chart"

const customContentStyles: CSSProperties = {
  backgroundColor: "var(--background)",
  border: "2px solid var(--chart-1)",
  borderRadius: 8,
  color: "var(--foreground)",
  fontFamily: "var(--font-sans)",
  direction: "rtl",
  textAlign: "right",
}

const customItemStyles: CSSProperties = {
  color: "var(--chart-1)",
  fontWeight: "bold",
  fontSize: 14,
  paddingTop: 6,
  paddingBottom: 6,
  borderBottom: "1px dashed var(--border)",
  fontFamily: "var(--font-sans)",
}

const customLabelStyles: CSSProperties = {
  color: "var(--chart-2)",
  fontWeight: "bold",
  fontSize: 16,
  fontFamily: "var(--font-sans)",
}

export default function TooltipStylesDemo() {
  const data = usePersianMockData(5, 42)

  return (
    <ChartContainer
      config={chart2MockConfig}
      className={`${chart2ContainerClassName} max-w-[500px]`}
    >
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ top: 10, right: 8, left: 0, bottom: 5 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis dataKey="label" reversed tickMargin={8} />
        <YAxis
          orientation="right"
          width={52}
          tickMargin={12}
          domain={[0, "dataMax + 20"]}
          tickFormatter={formatChart2Number}
        />
        <ChartTooltip
          // Keep tooltip visible after mouseOut to make it easy to inspect
          active
          defaultIndex={3}
          labelFormatter={(label) => `برچسب: ${label}`}
          formatter={(value) => formatChart2Number(value as number)}
          contentStyle={customContentStyles}
          itemStyle={customItemStyles}
          labelStyle={customLabelStyles}
        />
        <Bar
          dataKey="x"
          fill="var(--color-x)"
          name={chart2MockConfig.x.label}
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="y"
          fill="var(--color-y)"
          name={chart2MockConfig.y.label}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  )
}
