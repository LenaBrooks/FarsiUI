"use client"

import { Label, Pie, PieChart } from "recharts"

import { CHART_BAR_COLORS, FA_CHART } from "@/lib/chart-fa"
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
  tehran: { label: FA_CHART.tehran, color: CHART_BAR_COLORS[0] },
  isfahan: { label: FA_CHART.isfahan, color: CHART_BAR_COLORS[1] },
  fars: { label: FA_CHART.fars, color: CHART_BAR_COLORS[2] },
  khorasan: { label: FA_CHART.khorasan, color: CHART_BAR_COLORS[3] },
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

function CellLabel({ children }: { children: string }) {
  return (
    <Label
      position="center"
      style={{ fontFamily: "var(--font-sans)", fontSize: 11 }}
      fill="var(--muted-foreground)"
    >
      {children}
    </Label>
  )
}

/**
 * نمونه‌ای از استفادهٔ نمودار واکنش‌گرا داخل CSS Grid.
 */
export default function PieChartInGridDemo() {
  return (
    <div className="w-full min-h-[500px] space-y-3 font-sans text-sm">
      <p className="text-muted-foreground leading-relaxed">
        پراپ <code className="rounded bg-muted px-1 py-0.5 text-xs">responsive</code>{" "}
        با گرید CSS خوب کار می‌کند. نمودارهای زیر داخل یک ظرف گرید هستند؛ با تغییر
        اندازهٔ پنجره رفتارشان را ببینید. هر نمودار یک آیتم گرید است.
      </p>
      <div className="grid min-h-[400px] w-full grid-cols-3 grid-rows-3 gap-2.5 rounded-lg border border-border p-2.5">
        <ChartContainer
          config={chartConfig}
          className="col-span-2 row-span-2 aspect-square max-h-full max-w-full border border-border font-sans text-xs"
        >
          <PieChart accessibilityLayer>
            <MyPie />
            <CellLabel>سلول ۲×۲</CellLabel>
          </PieChart>
        </ChartContainer>

        <ChartContainer
          config={chartConfig}
          className="col-start-3 row-start-1 aspect-square max-h-full max-w-full border border-border font-sans text-xs"
        >
          <PieChart accessibilityLayer>
            <MyPie />
            <CellLabel>سلول ۱×۱</CellLabel>
          </PieChart>
        </ChartContainer>

        <ChartContainer
          config={chartConfig}
          className="col-start-3 row-start-2 aspect-square max-h-full max-w-full border border-border font-sans text-xs"
        >
          <PieChart accessibilityLayer>
            <MyPie />
            <CellLabel>سلول ۱×۱</CellLabel>
          </PieChart>
        </ChartContainer>

        <ChartContainer
          config={chartConfig}
          className="col-span-3 row-start-3 mx-auto aspect-square h-full border border-border font-sans text-xs"
        >
          <PieChart accessibilityLayer>
            <MyPie />
            <CellLabel>سلول ۳×۱</CellLabel>
          </PieChart>
        </ChartContainer>
      </div>
    </div>
  )
}
