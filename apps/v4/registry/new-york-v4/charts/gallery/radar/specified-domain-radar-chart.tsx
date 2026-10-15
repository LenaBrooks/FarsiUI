"use client"

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from "recharts"

import { CHART_BAR_COLORS } from "@/lib/chart-fa"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

const data = [
  { subject: "ریاضی", A: 120, B: 110 },
  { subject: "فارسی", A: 98, B: 130 },
  { subject: "انگلیسی", A: 86, B: 130 },
  { subject: "جغرافیا", A: 99, B: 100 },
  { subject: "فیزیک", A: 85, B: 90 },
  { subject: "تاریخ", A: 65, B: 85 },
]

const chartConfig = {
  A: { label: "علی", color: CHART_BAR_COLORS[0] },
  B: { label: "سارا", color: CHART_BAR_COLORS[1] },
} satisfies ChartConfig

export default function SpecifiedDomainRadarChartDemo() {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-auto w-full max-w-[500px] max-h-[80vh] font-sans text-xs"
    >
      <RadarChart accessibilityLayer outerRadius="80%" data={data}>
        <PolarGrid />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fontFamily: "var(--font-sans)", fontSize: 12 }}
        />
        <PolarRadiusAxis
          angle={30}
          domain={[0, 150]}
          tick={false}
          axisLine={false}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Radar
          name="A"
          dataKey="A"
          fill="var(--color-A)"
          stroke="var(--color-A)"
          fillOpacity={0.6}
        />
        <Radar
          name="B"
          dataKey="B"
          fill="var(--color-B)"
          stroke="var(--color-B)"
          fillOpacity={0.6}
        />
        <ChartLegend content={<ChartLegendContent />} />
      </RadarChart>
    </ChartContainer>
  )
}
