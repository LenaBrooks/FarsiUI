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
  chart2ContainerClassName,
  formatChart2Number,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

const data = [
  { x: 100, y: 200, z: 200 },
  { x: 120, y: 100, z: 260 },
  { x: 170, y: 300, z: 400 },
  { x: 140, y: 250, z: 280 },
  { x: 150, y: 400, z: 500 },
  { x: 110, y: 280, z: 200 },
]

const chartConfig = {
  schoolA: { label: "مدرسهٔ الف", color: "var(--chart-1)" },
} satisfies ChartConfig

export default function ScatterChartWithLabelsDemo({
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
        <ZAxis range={[900, 4000]} dataKey="z" />
        <ChartTooltip
          defaultIndex={defaultIndex}
          content={<ChartTooltipContent />}
        />
        <Scatter
          name="schoolA"
          data={data}
          fill="var(--color-schoolA)"
          activeShape={{ fill: "var(--chart-2)" }}
        >
          <LabelList
            dataKey="x"
            formatter={(v: number) => formatChart2Number(v)}
            style={{ fontFamily: "var(--font-sans)", fontSize: 11 }}
            fill="var(--foreground)"
          />
        </Scatter>
      </ScatterChart>
    </ChartContainer>
  )
}
