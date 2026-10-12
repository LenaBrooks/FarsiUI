"use client"

import { RadialBar, RadialBarChart } from "recharts"

import {
  FA_CHART,
  formatChart2Number,
  toPersianDigits,
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
  { name: "age18", label: `${toPersianDigits("18")}–${toPersianDigits("24")}`, uv: 31.47, fill: "var(--color-age18)" },
  { name: "age25", label: `${toPersianDigits("25")}–${toPersianDigits("29")}`, uv: 26.69, fill: "var(--color-age25)" },
  { name: "age30", label: `${toPersianDigits("30")}–${toPersianDigits("34")}`, uv: 15.69, fill: "var(--color-age30)" },
  { name: "age35", label: `${toPersianDigits("35")}–${toPersianDigits("39")}`, uv: 8.22, fill: "var(--color-age35)" },
  { name: "age40", label: `${toPersianDigits("40")}–${toPersianDigits("49")}`, uv: 8.63, fill: "var(--color-age40)" },
  { name: "age50", label: `${toPersianDigits("50")}+`, uv: 2.63, fill: "var(--color-age50)" },
  { name: "unknown", label: "نامشخص", uv: 6.67, fill: "var(--color-unknown)" },
]

const chartConfig = {
  uv: { label: FA_CHART.visitors },
  age18: { label: `${toPersianDigits("18")}–${toPersianDigits("24")}`, color: "var(--chart-1)" },
  age25: { label: `${toPersianDigits("25")}–${toPersianDigits("29")}`, color: "var(--chart-2)" },
  age30: { label: `${toPersianDigits("30")}–${toPersianDigits("34")}`, color: "var(--chart-3)" },
  age35: { label: `${toPersianDigits("35")}–${toPersianDigits("39")}`, color: "var(--chart-4)" },
  age40: { label: `${toPersianDigits("40")}–${toPersianDigits("49")}`, color: "var(--chart-5)" },
  age50: { label: `${toPersianDigits("50")}+`, color: "var(--chart-1)" },
  unknown: { label: "نامشخص", color: "var(--chart-2)" },
} satisfies ChartConfig

export default function SimpleRadialBarChartDemo() {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-[1.618] h-auto w-full max-w-[700px] max-h-[80vh] font-sans text-xs"
    >
      <RadialBarChart
        accessibilityLayer
        data={data}
        cx="40%"
        innerRadius="15%"
        outerRadius="100%"
        barSize={14}
      >
        <RadialBar
          dataKey="uv"
          background
          cornerRadius={4}
          label={{
            position: "insideStart",
            fill: "var(--foreground)",
            fontSize: 11,
            fontFamily: "var(--font-sans)",
            formatter: (v: number) => formatChart2Number(v),
          }}
        />
        <ChartLegend
          content={<ChartLegendContent nameKey="name" />}
          className="flex-col gap-2 pe-4 items-start"
          verticalAlign="middle"
          align="right"
          layout="vertical"
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              nameKey="name"
              hideLabel
              formatter={(value) => formatChart2Number(value as number)}
            />
          }
        />
      </RadialBarChart>
    </ChartContainer>
  )
}
