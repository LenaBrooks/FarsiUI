"use client"

import {
  CartesianGrid,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
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
  { x: 100, y: 200 },
  { x: 120, y: 100 },
  { x: 170, y: 300 },
  { x: 140, y: 250 },
  { x: 150, y: 400 },
  { x: 110, y: 280 },
]

const data02 = [
  { x: 200, y: 260 },
  { x: 240, y: 290 },
  { x: 190, y: 290 },
  { x: 198, y: 250 },
  { x: 180, y: 280 },
  { x: 210, y: 220 },
]

const chartConfig = {
  schoolA: { label: "مدرسهٔ الف", color: CHART2_BAR_COLORS[0] },
  schoolB: { label: "مدرسهٔ ب", color: CHART2_BAR_COLORS[1] },
} satisfies ChartConfig

export default function ScatterChartDemo({
  isAnimationActive = true,
}: {
  isAnimationActive?: boolean
}) {
  return (
    <ChartContainer
      config={chartConfig}
      className={`${chart2ContainerClassName} ${chart2DashedGridClassName}`}
    >
      <ScatterChart
        accessibilityLayer
        margin={{ top: 20, right: 12, bottom: 16, left: 8 }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="x"
          type="number"
          name="قد"
          unit=" سانتی‌متر"
          reversed
          tickMargin={12}
          tick={(props) => <ScatterXUnitTick {...props} unit="سانتی‌متر" />}
        />
        <YAxis
          dataKey="y"
          type="number"
          name="وزن"
          unit=" کیلوگرم"
          orientation="right"
          width={72}
          tickMargin={20}
          tick={(props) => <ScatterYUnitTick {...props} unit="کیلوگرم" />}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Scatter
          name="schoolA"
          data={data01}
          fill="var(--color-schoolA)"
          isAnimationActive={isAnimationActive}
        />
        <Scatter
          name="schoolB"
          data={data02}
          fill="var(--color-schoolB)"
          isAnimationActive={isAnimationActive}
        />
      </ScatterChart>
    </ChartContainer>
  )
}
