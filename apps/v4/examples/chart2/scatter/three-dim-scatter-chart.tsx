"use client"

import {
  CartesianGrid,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
  type TooltipIndex,
} from "recharts"

import {
  chart2ContainerClassName,
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

const data01 = [
  { x: 100, y: 200, z: 200 },
  { x: 120, y: 100, z: 260 },
  { x: 170, y: 300, z: 400 },
  { x: 140, y: 250, z: 280 },
  { x: 150, y: 400, z: 500 },
  { x: 110, y: 280, z: 200 },
]

const data02 = [
  { x: 200, y: 260, z: 240 },
  { x: 240, y: 290, z: 220 },
  { x: 190, y: 290, z: 250 },
  { x: 198, y: 250, z: 210 },
  { x: 180, y: 280, z: 260 },
  { x: 210, y: 220, z: 230 },
]

const chartConfig = {
  schoolA: { label: "مدرسهٔ الف", color: "var(--chart-1)" },
  schoolB: { label: "مدرسهٔ ب", color: "var(--chart-2)" },
} satisfies ChartConfig

export default function ThreeDimScatterChartDemo({
  defaultIndex,
}: {
  defaultIndex?: TooltipIndex
}) {
  return (
    <ChartContainer config={chartConfig} className={chart2ContainerClassName}>
      <ScatterChart
        accessibilityLayer
        margin={{ top: 20, right: 8, bottom: 8, left: 0 }}
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
          type="number"
          dataKey="y"
          name="وزن"
          unit=" ک‌گ"
          orientation="right"
          width={56}
          tickMargin={12}
          tickFormatter={formatChart2Number}
        />
        <ZAxis
          type="number"
          dataKey="z"
          range={[60, 400]}
          name="امتیاز"
          unit=" کم"
        />
        <ChartTooltip
          defaultIndex={defaultIndex}
          content={<ChartTooltipContent />}
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Scatter
          name="schoolA"
          data={data01}
          fill="var(--color-schoolA)"
          shape="star"
        />
        <Scatter
          name="schoolB"
          data={data02}
          fill="var(--color-schoolB)"
          shape="triangle"
        />
      </ScatterChart>
    </ChartContainer>
  )
}
