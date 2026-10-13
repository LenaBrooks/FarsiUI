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
  CHART2_BAR_COLORS,
  chart2ContainerClassName,
  chart2DashedGridClassName,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

import { ScatterXUnitTick, ScatterYUnitTick } from "./scatter-fa-shared"

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
  schoolA: { label: "مدرسهٔ الف", color: CHART2_BAR_COLORS[0] },
  schoolB: { label: "مدرسهٔ ب", color: CHART2_BAR_COLORS[1] },
} satisfies ChartConfig

export default function ThreeDimScatterChartDemo({
  defaultIndex,
}: {
  defaultIndex?: TooltipIndex
}) {
  return (
    <ChartContainer config={chartConfig} className={`${chart2ContainerClassName} ${chart2DashedGridClassName}`}>
      <ScatterChart
        accessibilityLayer
        margin={{ top: 20, right: 8, bottom: 16, left: 0 }}
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
        <ZAxis
          type="number"
          dataKey="z"
          range={[60, 400]}
          name="امتیاز"
          unit=" امتیاز"
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
