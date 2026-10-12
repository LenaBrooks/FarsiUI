"use client"

import {
  CartesianGrid,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts"

import { between, random } from "@/lib/chart2-mock-data"
import {
  chart2ContainerClassName,
  formatChart2Number,
  toPersianDigits,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

const gen = random(42)
const countOfScatterElements = 100
const pointsPerScatter = 10

const datasets = Array.from({ length: countOfScatterElements }, (_1, i) => {
  const passed = between(gen, 0, 10) > 5
  return {
    name: `خط ${toPersianDigits(i + 1)}`,
    passed,
    points: Array.from({ length: pointsPerScatter }, () => ({
      x: between(gen, 0, 100),
      y: between(gen, 0, 100),
      z: between(gen, 0, 100),
    })),
  }
})

const chartConfig = {
  passed: { label: "قبول", color: "var(--chart-2)" },
  failed: { label: "رد", color: "var(--destructive)" },
} satisfies ChartConfig

export default function ScatterPerformanceDemo() {
  return (
    <ChartContainer config={chartConfig} className={chart2ContainerClassName}>
      <ScatterChart
        accessibilityLayer
        margin={{ top: 20, right: 8, bottom: 8, left: 0 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="x"
          type="number"
          unit=" م"
          domain={[0, 100]}
          reversed
          tickMargin={8}
          tickFormatter={formatChart2Number}
        />
        <YAxis
          dataKey="y"
          type="number"
          unit=" م"
          domain={[0, 100]}
          orientation="right"
          width={48}
          tickMargin={12}
          tickFormatter={formatChart2Number}
        />
        <ZAxis dataKey="z" range={[0, 100]} />
        <ChartTooltip content={<ChartTooltipContent />} />
        {datasets.map((line) => (
          <Scatter
            key={line.name}
            data={line.points}
            fill={line.passed ? "var(--color-passed)" : "var(--color-failed)"}
            isAnimationActive={false}
            name={line.name}
            strokeWidth={4}
          />
        ))}
      </ScatterChart>
    </ChartContainer>
  )
}
