"use client"

import {
  CartesianGrid,
  LabelList,
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
  formatChart2Number,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

import { ScatterXUnitTick, ScatterYUnitTick } from "./scatter-fa-shared"

const data = [
  { x: 100, y: 200, z: 200 },
  { x: 120, y: 100, z: 260 },
  { x: 170, y: 300, z: 400 },
  { x: 140, y: 250, z: 280 },
  { x: 150, y: 400, z: 500 },
  { x: 110, y: 280, z: 200 },
]

const chartConfig = {
  schoolA: { label: "مدرسهٔ الف", color: CHART2_BAR_COLORS[0] },
} satisfies ChartConfig

export default function ScatterChartWithLabelsDemo({
  defaultIndex,
}: {
  defaultIndex?: TooltipIndex
}) {
  return (
    <ChartContainer
      config={chartConfig}
      className={`${chart2ContainerClassName} ${chart2DashedGridClassName} overflow-visible`}
    >
      <ScatterChart
        accessibilityLayer
        margin={{ top: 48, right: 12, bottom: 16, left: 0 }}
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
        <ZAxis range={[1200, 2800]} dataKey="z" />
        <ChartTooltip
          defaultIndex={defaultIndex}
          content={<ChartTooltipContent />}
        />
        <Scatter
          name="schoolA"
          data={data}
          fill="var(--color-schoolA)"
          activeShape={{ fill: CHART2_BAR_COLORS[1] }}
        >
          <LabelList
            dataKey="x"
            position="center"
            formatter={(v: number) => formatChart2Number(v)}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 11,
              fontWeight: 600,
              pointerEvents: "none",
            }}
            fill="#fff"
          />
        </Scatter>
      </ScatterChart>
    </ChartContainer>
  )
}
