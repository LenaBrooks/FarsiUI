"use client"

import { Pie, PieChart } from "recharts"

import {
  CHART2_BAR_COLORS,
  FA_CHART,
  formatChart2Number,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

const data = [
  { name: "tehran", value: 400, fill: "var(--color-tehran)" },
  { name: "isfahan", value: 300, fill: "var(--color-isfahan)" },
  { name: "fars", value: 300, fill: "var(--color-fars)" },
  { name: "khorasan", value: 200, fill: "var(--color-khorasan)" },
  { name: "other", value: 278, fill: "var(--color-other)" },
  { name: "card", value: 189, fill: "var(--color-card)" },
]

const chartConfig = {
  value: { label: FA_CHART.sales },
  tehran: { label: FA_CHART.tehran, color: CHART2_BAR_COLORS[0] },
  isfahan: { label: FA_CHART.isfahan, color: CHART2_BAR_COLORS[1] },
  fars: { label: FA_CHART.fars, color: CHART2_BAR_COLORS[2] },
  khorasan: { label: FA_CHART.khorasan, color: CHART2_BAR_COLORS[3] },
  other: { label: FA_CHART.other, color: CHART2_BAR_COLORS[4] },
  card: { label: FA_CHART.card, color: CHART2_BAR_COLORS[0] },
} satisfies ChartConfig

export default function StraightAnglePieChartDemo({
  isAnimationActive = true,
}: {
  isAnimationActive?: boolean
}) {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-[2] h-auto w-full max-w-[500px] max-h-[80vh] font-sans text-xs"
    >
      <PieChart accessibilityLayer>
        <ChartTooltip
          content={
            <ChartTooltipContent
              nameKey="name"
              formatter={(value) => formatChart2Number(value as number)}
            />
          }
        />
        <Pie
          dataKey="value"
          nameKey="name"
          startAngle={180}
          endAngle={0}
          data={data}
          cx="50%"
          cy="100%"
          outerRadius="120%"
          label={({ value }) => formatChart2Number(Number(value))}
          isAnimationActive={isAnimationActive}
        />
      </PieChart>
    </ChartContainer>
  )
}
