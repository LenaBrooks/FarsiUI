"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import type { DefaultLegendContentProps } from "recharts"

import { usePersianMockData } from "@/registry/new-york-v4/lib/chart-live"
import { CHART_TOMAN_AXIS_WIDTH } from "@/lib/chart-locale"
import { TomanAxisTick } from "@/lib/chart-toman-tick"
import {
  chartBarContainerClassName,
  chartBarMockConfig,
  formatChartNumber,
} from "@/lib/chart-fa"
import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@/registry/new-york-v4/ui/chart"

const SERIES_META = {
  x: {
    label: chartBarMockConfig.x.label,
    hint: "شعب و فروشگاه‌ها",
    color: chartBarMockConfig.x.color,
  },
  y: {
    label: chartBarMockConfig.y.label,
    hint: "سایت و اپلیکیشن",
    color: chartBarMockConfig.y.color,
  },
} as const

function CustomLegend({
  payload,
  totals,
}: DefaultLegendContentProps & {
  totals: { x: number; y: number }
}) {
  if (!payload?.length) return null

  return (
    <div
      dir="rtl"
      className="mt-5 grid w-full grid-cols-1 gap-3 px-1 sm:grid-cols-2"
    >
      {payload
        .filter((item) => item.type !== "none")
        .map((item) => {
          const key = String(item.dataKey ?? "") as keyof typeof SERIES_META
          const meta = SERIES_META[key]
          if (!meta) return null
          const total = totals[key]

          return (
            <div
              key={key}
              className="relative overflow-hidden rounded-2xl border border-border/60 bg-muted/40 px-4 py-3.5 font-sans tracking-normal [letter-spacing:0] [&_*]:tracking-normal [&_*]:[letter-spacing:0]"
            >
              <span
                aria-hidden
                className="absolute inset-y-0 end-0 w-1"
                style={{ backgroundColor: meta.color }}
              />
              <div className="flex items-start justify-between gap-4 pe-2">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="size-3 shrink-0 rounded-full ring-4 ring-background"
                    style={{ backgroundColor: meta.color }}
                  />
                  <div className="text-start">
                    <p className="text-sm font-medium text-foreground">
                      {meta.label}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {meta.hint}
                    </p>
                  </div>
                </div>
                <div className="text-end">
                  <p className="text-[10px] text-muted-foreground">جمع دوره</p>
                  <p
                    className="mt-0.5 text-base font-semibold tracking-normal [letter-spacing:0] [font-variant-numeric:normal]"
                    dir="ltr"
                    style={{
                      color: meta.color,
                      unicodeBidi: "isolate",
                    }}
                  >
                    {formatChartNumber(total)}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
    </div>
  )
}

export default function LegendStylesDemo() {
  const data = usePersianMockData(6, 99)
  const totals = {
    x: data.reduce((sum, row) => sum + row.x, 0),
    y: data.reduce((sum, row) => sum + row.y, 0),
  }

  return (
    <ChartContainer
      config={chartBarMockConfig}
      className={`${chartBarContainerClassName} mx-auto max-w-[520px]`}
    >
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ top: 10, right: 8, left: 0, bottom: 8 }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="label" reversed tickMargin={8} />
        <YAxis
          orientation="right"
          width={CHART_TOMAN_AXIS_WIDTH}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          domain={[0, "dataMax + 20"]}
          tick={TomanAxisTick}
        />
        <ChartTooltip
          cursor={{ fill: "var(--muted)", fillOpacity: 0.35 }}
          content={<ChartTooltipContent />}
        />
        <ChartLegend
          verticalAlign="bottom"
          content={<CustomLegend totals={totals} />}
        />
        <Bar
          dataKey="x"
          fill="var(--color-x)"
          name={chartBarMockConfig.x.label}
          radius={[5, 5, 0, 0]}
          maxBarSize={28}
        />
        <Bar
          dataKey="y"
          fill="var(--color-y)"
          name={chartBarMockConfig.y.label}
          radius={[5, 5, 0, 0]}
          maxBarSize={28}
        />
      </BarChart>
    </ChartContainer>
  )
}
