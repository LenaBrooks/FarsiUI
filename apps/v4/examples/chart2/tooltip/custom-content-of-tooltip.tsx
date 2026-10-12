"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, type TooltipContentProps, type TooltipIndex } from "recharts"

import {
  FA_CHART,
  FA_MONTHS,
  chart2ContainerClassName,
  formatChart2Number,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

const data = [
  { name: FA_MONTHS[0], pv: 4000, uv: 2400 },
  { name: FA_MONTHS[1], pv: 3000, uv: 1398 },
  { name: FA_MONTHS[2], pv: 2000, uv: 9800 },
  { name: FA_MONTHS[3], pv: 2780, uv: 3908 },
  { name: FA_MONTHS[4], pv: 1890, uv: 4800 },
  { name: FA_MONTHS[5], pv: 2390, uv: 3800 },
  { name: "مهر", pv: 3490, uv: 4300 },
]

const chartConfig = {
  pv: { label: FA_CHART.online, color: "var(--chart-1)" },
  uv: { label: FA_CHART.store, color: "var(--chart-2)" },
} satisfies ChartConfig

const intros: Record<string, string> = {
  [FA_MONTHS[0]]: "فروش پوشاک مردانه در ابتدای سال",
  [FA_MONTHS[1]]: "فروش پوشاک زنانه و اوج فصل بهار",
  [FA_MONTHS[2]]: "فروش کیف و اکسسوری",
  [FA_MONTHS[3]]: "کالای خانگی و لوازم منزل",
  [FA_MONTHS[4]]: "مواد غذایی و سوپرمارکت",
  [FA_MONTHS[5]]: "غذای کودک و سیسمونی",
  مهر: "بازگشت به مدرسه و لوازم التحریر",
}

function CustomTooltip({ active, payload, label }: TooltipContentProps) {
  const firstPayload = payload?.[0]
  const isVisible = active && firstPayload != null
  const key = String(label ?? "")

  return (
    <div
      className="rounded-lg border border-border bg-background px-3 py-2 text-xs shadow-xl font-sans"
      dir="rtl"
      style={{ visibility: isVisible ? "visible" : "hidden" }}
    >
      {isVisible ? (
        <>
          <p className="mb-1 font-medium text-foreground">
            {label}: {formatChart2Number(Number(firstPayload.value))}
          </p>
          <p className="mb-1 text-muted-foreground leading-relaxed">
            {intros[key] ?? ""}
          </p>
          <p className="text-muted-foreground/80">
            هر محتوایی که بخواهید اینجا نمایش داده می‌شود.
          </p>
        </>
      ) : null}
    </div>
  )
}

export default function CustomContentOfTooltipDemo({
  isAnimationActive,
  defaultIndex,
}: {
  isAnimationActive?: boolean
  defaultIndex?: TooltipIndex
}) {
  return (
    <ChartContainer
      config={chartConfig}
      className={`${chart2ContainerClassName} max-w-[300px]`}
    >
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ top: 5, right: 8, left: 0, bottom: 0 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis dataKey="name" reversed tickMargin={8} />
        <YAxis
          orientation="right"
          width={52}
          tickMargin={12}
          tickFormatter={formatChart2Number}
        />
        <ChartTooltip
          content={CustomTooltip}
          isAnimationActive={isAnimationActive}
          defaultIndex={defaultIndex}
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="pv"
          fill="var(--color-pv)"
          barSize={20}
          radius={[4, 4, 0, 0]}
          isAnimationActive={isAnimationActive}
        />
      </BarChart>
    </ChartContainer>
  )
}
