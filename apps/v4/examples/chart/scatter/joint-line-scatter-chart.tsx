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
  CHART_BAR_COLORS,
  chartContainerClassName,
  chartDashedGridClassName,
} from "@/lib/chart-fa"
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
  { x: 10, y: 30 },
  { x: 30, y: 200 },
  { x: 45, y: 100 },
  { x: 50, y: 400 },
  { x: 70, y: 150 },
  { x: 100, y: 250 },
]

const data02 = [
  { x: 30, y: 20 },
  { x: 50, y: 180 },
  { x: 75, y: 240 },
  { x: 100, y: 100 },
  { x: 120, y: 190 },
]

const chartConfig = {
  schoolA: { label: "مدرسهٔ الف", color: CHART_BAR_COLORS[0] },
  schoolB: { label: "مدرسهٔ ب", color: CHART_BAR_COLORS[1] },
} satisfies ChartConfig

export default function JointLineScatterChartDemo({
  defaultIndex,
}: {
  defaultIndex?: TooltipIndex
}) {
  return (
    <ChartContainer config={chartConfig} className={`${chartContainerClassName} ${chartDashedGridClassName}`}>
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
        <ZAxis type="number" range={[100, 100]} />
        <ChartTooltip
          defaultIndex={defaultIndex}
          content={<ChartTooltipContent />}
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Scatter
          name="schoolA"
          data={data01}
          fill="var(--color-schoolA)"
          line
          shape="cross"
        />
        <Scatter
          name="schoolB"
          data={data02}
          fill="var(--color-schoolB)"
          line
          lineJointType="monotone"
          shape="diamond"
        />
      </ScatterChart>
    </ChartContainer>
  )
}
