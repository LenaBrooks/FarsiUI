"use client"

import { Pie, PieChart } from "recharts"

import {
  CHART2_BAR_COLORS,
  FA_CHART,
  formatChart2Number,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

const data = [
  { name: "tehran", value: 400, fill: "var(--color-tehran)" },
  { name: "isfahan", value: 300, fill: "var(--color-isfahan)" },
  { name: "fars", value: 300, fill: "var(--color-fars)" },
  { name: "khorasan", value: 200, fill: "var(--color-khorasan)" },
]

const chartConfig = {
  value: { label: FA_CHART.sales },
  tehran: { label: FA_CHART.tehran, color: CHART2_BAR_COLORS[0] },
  isfahan: { label: FA_CHART.isfahan, color: CHART2_BAR_COLORS[1] },
  fars: { label: FA_CHART.fars, color: CHART2_BAR_COLORS[2] },
  khorasan: { label: FA_CHART.khorasan, color: CHART2_BAR_COLORS[3] },
} satisfies ChartConfig

export default function PieResponsiveContainerDemo() {
  return (
    <div className="h-[300px] w-full font-sans">
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square h-full w-full max-w-[300px] font-sans text-xs"
      >
        <PieChart accessibilityLayer>
          <ChartTooltip
            content={
              <ChartTooltipContent
                nameKey="name"
                hideLabel
                formatter={(value) => formatChart2Number(value as number)}
              />
            }
          />
          <Pie
            dataKey="value"
            nameKey="name"
            data={data}
            label={({ value }) => formatChart2Number(Number(value))}
          />
          <ChartLegend
            content={<ChartLegendContent nameKey="name" />}
            className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
          />
        </PieChart>
      </ChartContainer>
    </div>
  )
}
