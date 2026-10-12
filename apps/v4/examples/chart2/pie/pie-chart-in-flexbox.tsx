"use client"

import { Label, Pie, PieChart } from "recharts"

import { FA_CHART } from "@/lib/chart2-fa"
import {
  ChartContainer,
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
  tehran: { label: FA_CHART.tehran, color: "var(--chart-1)" },
  isfahan: { label: FA_CHART.isfahan, color: "var(--chart-2)" },
  fars: { label: FA_CHART.fars, color: "var(--chart-3)" },
  khorasan: { label: FA_CHART.khorasan, color: "var(--chart-4)" },
} satisfies ChartConfig

function MyPie() {
  return (
    <Pie
      data={data}
      dataKey="value"
      nameKey="name"
      outerRadius="80%"
      innerRadius="60%"
      isAnimationActive={false}
    />
  )
}

/**
 * نمونه‌ای از استفادهٔ نمودار واکنش‌گرا داخل flexbox.
 */
export default function PieChartInFlexboxDemo() {
  return (
    <div className="flex min-h-[300px] w-full flex-wrap items-stretch justify-around gap-2 rounded-lg border border-border p-2.5 font-sans">
      <ChartContainer
        config={chartConfig}
        className="aspect-square h-[calc(100%-20px)] w-[33%] min-w-0 flex-[1_1_200px] font-sans text-xs"
      >
        <PieChart accessibilityLayer>
          <MyPie />
          <Label
            position="center"
            style={{ fontFamily: "var(--font-sans)", fontSize: 11 }}
            fill="var(--muted-foreground)"
          >
            فلکس: ۱ ۱ ۲۰۰px
          </Label>
        </PieChart>
      </ChartContainer>

      <ChartContainer
        config={chartConfig}
        className="aspect-square h-[calc(100%-20px)] w-[33%] max-w-[300px] font-sans text-xs"
      >
        <PieChart accessibilityLayer>
          <MyPie />
          <Label
            position="center"
            style={{ fontFamily: "var(--font-sans)", fontSize: 11 }}
            fill="var(--muted-foreground)"
          >
            حداکثر عرض: ۳۰۰px
          </Label>
        </PieChart>
      </ChartContainer>

      <ChartContainer
        config={chartConfig}
        className="aspect-square h-[calc(100%-20px)] max-h-[20vh] w-[33%] font-sans text-xs"
      >
        <PieChart accessibilityLayer>
          <MyPie />
          <Label
            position="center"
            style={{ fontFamily: "var(--font-sans)", fontSize: 11 }}
            fill="var(--muted-foreground)"
          >
            حداکثر ارتفاع: ۲۰vh
          </Label>
        </PieChart>
      </ChartContainer>
    </div>
  )
}
