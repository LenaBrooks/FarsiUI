"use client"

import { useCallback, useMemo, useState } from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import { CHART2_BAR_COLORS } from "@/lib/chart2-fa"
import {
  CHART_TOMAN_AXIS_WIDTH,
  FA_CHART,
  formatPersianMonthTick,
  formatToman,
} from "@/lib/chart-locale"
import { TomanAxisTick } from "@/lib/chart-toman-tick"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

import {
  LINE_CHART_CLASS,
  LINE_TOOLTIP_CURSOR,
  LineShell,
  useLineSalesCaption,
  useSalesData,
  monthTotal,
} from "./line-fa-shared"

const chartConfig = {
  store: { label: FA_CHART.store, color: CHART2_BAR_COLORS[0] },
  online: { label: FA_CHART.online, color: CHART2_BAR_COLORS[1] },
  orders: { label: FA_CHART.orders, color: CHART2_BAR_COLORS[2] },
} satisfies ChartConfig

const DEFAULT_OPACITY: Record<string, number> = {
  store: 1,
  online: 1,
  orders: 1,
}

export default function DynamicZIndexLineChartDemo() {
  const sales = useSalesData(4102)
  const data = useMemo(
    () =>
      sales.map((row) => ({
        ...row,
        // Orders as a third distinct scale derived from mix (still toman-like).
        orders: Math.round(monthTotal(row) * 0.18),
      })),
    [sales]
  )
  const [opacity, setOpacity] = useState(DEFAULT_OPACITY)
  const [activeKey, setActiveKey] = useState<string | null>(null)
  useLineSalesCaption("z-index پویا")

  const handleMouseEnter = useCallback(
    (o: { dataKey?: string | number | ((obj: unknown) => unknown) }) => {
      const { dataKey } = o
      if (typeof dataKey === "string") {
        setOpacity((prev) => ({ ...prev, [dataKey]: 0.45 }))
        setActiveKey(dataKey)
      }
    },
    []
  )

  const handleMouseLeave = useCallback(
    (o: { dataKey?: string | number | ((obj: unknown) => unknown) }) => {
      const { dataKey } = o
      if (typeof dataKey === "string") {
        setOpacity((prev) => ({ ...prev, [dataKey]: 1 }))
        setActiveKey(null)
      }
    },
    []
  )

  return (
    <LineShell>
      <ChartContainer config={chartConfig} className={LINE_CHART_CLASS}>
        <LineChart
          accessibilityLayer
          data={data}
          margin={{ top: 18, right: 8, left: 4, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            reversed
            tickLine={false}
            axisLine={false}
            tickMargin={12}
            tickFormatter={formatPersianMonthTick}
          />
          <YAxis
            orientation="right"
            width={CHART_TOMAN_AXIS_WIDTH}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={TomanAxisTick}
          />
          <ChartTooltip
            cursor={LINE_TOOLTIP_CURSOR}
            content={
              <ChartTooltipContent
                className="min-w-[12rem] gap-2"
                labelClassName="w-full border-b border-border/50 pb-1.5 mb-0.5"
                labelFormatter={(label) => (
                  <span className="text-muted-foreground">ماه {label}</span>
                )}
                formatter={(value, name, item) => {
                  const key = String(name)
                  const series =
                    chartConfig[key as keyof typeof chartConfig]?.label ?? key
                  return (
                    <div className="flex w-full flex-1 items-center gap-2">
                      <span
                        className="size-2.5 shrink-0 rounded-[2px]"
                        style={{ background: item.color }}
                        aria-hidden
                      />
                      <div className="flex flex-1 items-center justify-between gap-6">
                        <span className="text-muted-foreground">{series}</span>
                        <span className="font-medium tracking-[0]">
                          {formatToman(Number(value), { compact: true })}
                        </span>
                      </div>
                    </div>
                  )
                }}
              />
            }
          />
          <ChartLegend
            content={<ChartLegendContent />}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
          {(Object.keys(chartConfig) as Array<keyof typeof chartConfig>).map(
            (key) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                name={key}
                stroke={`var(--color-${key})`}
                strokeWidth={key === "store" ? 2.75 : 2.25}
                strokeOpacity={opacity[key]}
                zIndex={activeKey === key ? 10 : undefined}
                dot={false}
              />
            )
          )}
        </LineChart>
      </ChartContainer>
    </LineShell>
  )
}
