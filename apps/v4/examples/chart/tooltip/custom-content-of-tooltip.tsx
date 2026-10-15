"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  type TooltipContentProps,
  type TooltipIndex,
} from "recharts"

import { CHART_TOMAN_AXIS_WIDTH } from "@/lib/chart-locale"
import { TomanAxisTick } from "@/lib/chart-toman-tick"
import {
  CHART_BAR_COLORS,
  FA_CHART,
  FA_MONTHS,
  chartBarContainerClassName,
  formatChartNumber,
} from "@/lib/chart-fa"
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
  pv: { label: FA_CHART.online, color: CHART_BAR_COLORS[0] },
  uv: { label: FA_CHART.store, color: CHART_BAR_COLORS[1] },
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
  const isVisible = Boolean(active && payload?.length)
  const key = String(label ?? "")

  return (
    <div
      className="rounded-lg border border-border bg-background px-3 py-2 text-xs shadow-xl font-sans"
      dir="rtl"
      style={{ visibility: isVisible ? "visible" : "hidden" }}
    >
      {isVisible ? (
        <>
          <p className="mb-1 font-medium text-foreground">{label}</p>
          <p className="mb-2 text-muted-foreground leading-relaxed">
            {intros[key] ?? ""}
          </p>
          {payload!.map((item) => {
            const seriesKey = String(item.dataKey ?? "")
            const series =
              chartConfig[seriesKey as keyof typeof chartConfig]?.label ??
              seriesKey
            return (
              <p
                key={seriesKey}
                className="mb-0.5 last:mb-0"
                style={{ color: item.color ?? "var(--foreground)" }}
              >
                {series}: {formatChartNumber(Number(item.value))}
              </p>
            )
          })}
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
      className={`${chartBarContainerClassName} max-w-[500px]`}
    >
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ top: 10, right: 8, left: 0, bottom: 5 }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="name" reversed tickMargin={8} />
        <YAxis
          orientation="right"
          width={CHART_TOMAN_AXIS_WIDTH}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={TomanAxisTick}
        />
        <ChartTooltip
          content={CustomTooltip}
          isAnimationActive={isAnimationActive}
          defaultIndex={defaultIndex}
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="pv"
          fill={CHART_BAR_COLORS[0]}
          radius={[4, 4, 0, 0]}
          isAnimationActive={isAnimationActive}
        />
        <Bar
          dataKey="uv"
          fill={CHART_BAR_COLORS[1]}
          radius={[4, 4, 0, 0]}
          isAnimationActive={isAnimationActive}
        />
      </BarChart>
    </ChartContainer>
  )
}
