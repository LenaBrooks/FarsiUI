"use client"

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

const data = [
  { subject: "ریاضی", A: 120 },
  { subject: "فارسی", A: 98 },
  { subject: "انگلیسی", A: 86 },
  { subject: "جغرافیا", A: 99 },
  { subject: "فیزیک", A: 85 },
  { subject: "تاریخ", A: 65 },
]

const chartConfig = {
  A: { label: "علی", color: "var(--chart-1)" },
} satisfies ChartConfig

export default function SimpleRadarChartDemo() {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-auto w-full max-w-[500px] max-h-[80vh] font-sans text-xs"
    >
      <RadarChart accessibilityLayer data={data}>
        <PolarGrid />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fontFamily: "var(--font-sans)", fontSize: 12 }}
        />
        <PolarRadiusAxis tick={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Radar
          name="A"
          dataKey="A"
          fill="var(--color-A)"
          stroke="var(--color-A)"
          fillOpacity={0.5}
        />
      </RadarChart>
    </ChartContainer>
  )
}
