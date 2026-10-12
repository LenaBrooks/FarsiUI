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
  ChartLegend,
} from "@/registry/new-york-v4/ui/chart"

const customWrapperStyle: CSSProperties = {
  backgroundColor: "var(--muted)",
  border: "2px solid var(--chart-1)",
  borderRadius: 8,
  paddingTop: 10,
  paddingBottom: 10,
  paddingLeft: 16,
  paddingRight: 16,
  fontFamily: "var(--font-sans)",
  direction: "rtl",
}

const customLabelStyles: CSSProperties = {
  color: "var(--foreground)",
  fontWeight: "bold",
  fontSize: 14,
  fontFamily: "var(--font-sans)",
}

export default function LegendStylesDemo() {
  const data = usePersianMockData(6, 99)

  return (
    <ChartContainer
      config={chart2MockConfig}
      className={`${chart2ContainerClassName} max-w-[500px]`}
    >
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ top: 10, right: 8, left: 0, bottom: 36 }}
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
        <ChartLegend
          wrapperStyle={customWrapperStyle}
          iconSize={20}
          iconType="line"
          inactiveColor="var(--muted-foreground)"
          labelStyle={customLabelStyles}
          verticalAlign="bottom"
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
