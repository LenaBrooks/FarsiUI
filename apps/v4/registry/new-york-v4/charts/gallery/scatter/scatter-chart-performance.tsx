"use client"

import {
  CartesianGrid,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts"

import { between, random } from "@/lib/chart-mock-data"
import {
  CHART_BAR_COLORS,
  chartContainerClassName,
  chartDashedGridClassName,
  toPersianDigits,
} from "@/lib/chart-fa"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

import { ScatterXUnitTick, ScatterYUnitTick } from "./scatter-fa-shared"

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
  passed: { label: "قبول", color: CHART_BAR_COLORS[0] },
  failed: { label: "رد", color: "var(--destructive)" },
} satisfies ChartConfig

export default function ScatterPerformanceDemo() {
  return (
    <ChartContainer config={chartConfig} className={`${chartContainerClassName} ${chartDashedGridClassName}`}>
      <ScatterChart
        accessibilityLayer
        margin={{ top: 20, right: 8, bottom: 16, left: 0 }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="x"
          type="number"
          unit=" متر"
          domain={[0, 100]}
          reversed
          tickMargin={12}
          tick={(props) => <ScatterXUnitTick {...props} unit="متر" />}
        />
        <YAxis
          dataKey="y"
          type="number"
          unit=" متر"
          domain={[0, 100]}
          orientation="right"
          width={56}
          tickMargin={20}
          tick={(props) => <ScatterYUnitTick {...props} unit="متر" />}
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
