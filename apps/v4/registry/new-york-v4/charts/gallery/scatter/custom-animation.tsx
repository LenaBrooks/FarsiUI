"use client"

import * as React from "react"
import {
  CartesianGrid,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts"

import {
  CHART_BAR_COLORS,
  chartContainerClassName,
  chartDashedGridClassName,
  generatePersianMockData,
} from "@/lib/chart-fa"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

import { ScatterXUnitTick, ScatterYUnitTick } from "./scatter-fa-shared"

const dataA = generatePersianMockData(10, 42)
const dataB = generatePersianMockData(10, 99)

const chartConfig = {
  series: { label: "سری", color: CHART_BAR_COLORS[0] },
} satisfies ChartConfig

export default function ScatterCustomAnimationDemo() {
  const [dataSet, setDataSet] = React.useState<"a" | "b">("a")

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setDataSet((s) => (s === "a" ? "b" : "a"))
    }, 2000)
    return () => window.clearInterval(id)
  }, [])

  const data = dataSet === "a" ? dataA : dataB

  return (
    <ChartContainer
      config={chartConfig}
      className={`${chartContainerClassName} ${chartDashedGridClassName}`}
    >
      <ScatterChart
        accessibilityLayer
        margin={{ top: 20, right: 12, bottom: 16, left: 8 }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          type="number"
          dataKey="x"
          name="قد"
          unit=" سانتی‌متر"
          reversed
          tickMargin={12}
          tick={(props) => <ScatterXUnitTick {...props} unit="سانتی‌متر" />}
        />
        <YAxis
          type="number"
          dataKey="y"
          name="وزن"
          unit=" کیلوگرم"
          orientation="right"
          width={72}
          tickMargin={20}
          tick={(props) => <ScatterYUnitTick {...props} unit="کیلوگرم" />}
        />
        <ZAxis type="number" dataKey="z" range={[60, 400]} />
        <ChartTooltip
          cursor={{ strokeDasharray: "3 3" }}
          content={<ChartTooltipContent />}
        />
        <Scatter
          key={dataSet}
          name="series"
          data={data}
          fill="var(--color-series)"
          animationDuration={900}
          isAnimationActive
        />
      </ScatterChart>
    </ChartContainer>
  )
}
