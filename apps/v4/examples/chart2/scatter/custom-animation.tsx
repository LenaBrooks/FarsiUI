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
  chart2ContainerClassName,
  formatChart2Number,
  generatePersianMockData,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

const dataA = generatePersianMockData(10, 42)
const dataB = generatePersianMockData(10, 99)

const chartConfig = {
  series: { label: "سری", color: "var(--chart-1)" },
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
    <ChartContainer config={chartConfig} className={chart2ContainerClassName}>
      <ScatterChart
        accessibilityLayer
        margin={{ top: 20, right: 12, bottom: 10, left: 0 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          type="number"
          dataKey="x"
          name="محور افقی"
          reversed
          tickMargin={8}
          tickFormatter={formatChart2Number}
        />
        <YAxis
          type="number"
          dataKey="y"
          name="محور عمودی"
          orientation="right"
          width={52}
          tickMargin={12}
          tickFormatter={formatChart2Number}
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
