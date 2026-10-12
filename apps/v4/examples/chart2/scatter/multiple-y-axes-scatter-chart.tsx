"use client"

import {
  CartesianGrid,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
} from "recharts"

import {
  chart2ContainerClassName,
  formatChart2Number,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

const data01 = [
  { x: 100, y: 200, z: 200 },
  { x: 120, y: 100, z: 260 },
  { x: 170, y: 300, z: 400 },
  { x: 140, y: 250, z: 280 },
  { x: 150, y: 400, z: 500 },
  { x: 110, y: 280, z: 200 },
]

const data02 = [
  { x: 300, y: 300, z: 200 },
  { x: 400, y: 500, z: 260 },
  { x: 200, y: 700, z: 400 },
  { x: 340, y: 350, z: 280 },
  { x: 560, y: 500, z: 500 },
  { x: 230, y: 780, z: 200 },
  { x: 500, y: 400, z: 200 },
  { x: 300, y: 500, z: 260 },
  { x: 240, y: 300, z: 400 },
  { x: 320, y: 550, z: 280 },
  { x: 500, y: 400, z: 500 },
  { x: 420, y: 280, z: 200 },
]

const chartConfig = {
  schoolA: { label: "مدرسهٔ الف", color: "var(--chart-1)" },
  schoolB: { label: "مدرسهٔ ب", color: "var(--chart-2)" },
} satisfies ChartConfig

export default function MultipleYAxesScatterChartDemo() {
  return (
    <ChartContainer config={chartConfig} className={chart2ContainerClassName}>
      <ScatterChart
        accessibilityLayer
        margin={{ top: 20, right: 8, bottom: 8, left: 8 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          type="number"
          dataKey="x"
          name="قد"
          unit=" س‌م"
          reversed
          tickMargin={8}
          tickFormatter={formatChart2Number}
        />
        <YAxis
          yAxisId="left"
          type="number"
          dataKey="y"
          name="وزن"
          unit=" ک‌گ"
          orientation="left"
          width={56}
          tickMargin={8}
          tickFormatter={formatChart2Number}
        />
        <YAxis
          yAxisId="right"
          type="number"
          dataKey="y"
          name="وزن"
          unit=" ک‌گ"
          orientation="right"
          width={56}
          tickMargin={12}
          tickFormatter={formatChart2Number}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Scatter
          yAxisId="left"
          name="schoolA"
          data={data01}
          fill="var(--color-schoolA)"
        />
        <Scatter
          yAxisId="right"
          name="schoolB"
          data={data02}
          fill="var(--color-schoolB)"
        />
      </ScatterChart>
    </ChartContainer>
  )
}
