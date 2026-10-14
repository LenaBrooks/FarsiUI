"use client"

import {
  CartesianGrid,
  Scatter,
  ScatterChart,
  Symbols,
  XAxis,
  YAxis,
  type ScatterShapeProps,
  type SymbolType,
} from "recharts"

import {
  CHART2_BAR_COLORS,
  chart2ContainerClassName,
  chart2DashedGridClassName,
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

const COLORS = [
  CHART2_BAR_COLORS[0],
  CHART2_BAR_COLORS[1],
  CHART2_BAR_COLORS[2],
  CHART2_BAR_COLORS[3],
  CHART2_BAR_COLORS[4],
  CHART2_BAR_COLORS[0],
]

const SYMBOLS: ReadonlyArray<SymbolType> = [
  "circle",
  "cross",
  "diamond",
  "square",
  "star",
  "triangle",
  "wye",
]

const chartConfig = {
  schoolA: { label: "مدرسهٔ الف", color: CHART2_BAR_COLORS[0] },
} satisfies ChartConfig

function MyCustomSymbol(props: ScatterShapeProps) {
  return (
    <Symbols
      {...props}
      size={300}
      fill={COLORS[props.index % COLORS.length]}
      type={SYMBOLS[props.index % SYMBOLS.length]}
    />
  )
}

export default function ScatterChartWithCellsDemo() {
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
        <ChartTooltip
          content={
            <ChartTooltipContent
              className="min-w-0"
              formatter={(value, name) => (
                <div className="flex items-center justify-between gap-3 leading-none">
                  <span className="text-muted-foreground">{String(name)}</span>
                  <span className="fa-num font-medium text-foreground">
                    {formatChart2Number(Number(value))}
                  </span>
                </div>
              )}
            />
          }
        />
        <Scatter name="schoolA" data={data} shape={MyCustomSymbol} />
      </ScatterChart>
    </ChartContainer>
  )
}
