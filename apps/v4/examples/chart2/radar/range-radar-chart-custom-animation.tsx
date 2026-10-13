"use client"

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from "recharts"

import { CHART2_BAR_COLORS } from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

const data = [
  { subject: "ریاضی", range: [30, 110], A: 110 },
  { subject: "هنر", range: [55, 120], A: 120 },
  { subject: "موسیقی", range: [40, 95], A: 95 },
  { subject: "فیزیک", range: [65, 135], A: 135 },
  { subject: "تاریخ", range: [50, 105], A: 105 },
  { subject: "ورزش", range: [70, 125], A: 125 },
]

const chartConfig = {
  A: { label: "سقف بازه", color: CHART2_BAR_COLORS[0] },
} satisfies ChartConfig

export default function RadarRangeCustomAnimationDemo() {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-auto w-full max-w-[700px] max-h-[70vh] font-sans text-xs"
    >
      <RadarChart
        accessibilityLayer
        data={data}
        cx="50%"
        cy="50%"
        outerRadius="80%"
      >
        <PolarGrid />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fontFamily: "var(--font-sans)", fontSize: 12 }}
        />
        <PolarRadiusAxis tick={false} axisLine={false} />
        <Radar
          name="A"
          dataKey="A"
          stroke="var(--color-A)"
          fill="var(--color-A)"
          fillOpacity={0.35}
          animationDuration={1600}
          isAnimationActive
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
      </RadarChart>
    </ChartContainer>
  )
}
