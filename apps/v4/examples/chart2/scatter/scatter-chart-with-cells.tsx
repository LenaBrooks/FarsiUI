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

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-1)",
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
  schoolA: { label: "مدرسهٔ الف", color: "var(--chart-1)" },
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
        <ChartTooltip
          content={
            <ChartTooltipContent
              className="min-w-0"
              formatter={(value, name) => (
                <div className="flex items-center justify-between gap-3 leading-none">
                  <span className="text-muted-foreground">{String(name)}</span>
                  <span className="font-medium text-foreground tabular-nums">
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
