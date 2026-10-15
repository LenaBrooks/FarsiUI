"use client"

import * as React from "react"

import {
  useChartCaption,
  useChartRandomSeed,
} from "@/components/chart-live"
import {
  chartContainerClassName,
  CHART_BAR_COLORS,
} from "@/lib/chart-fa"
import {
  FA_CHART,
  FA_MONTHLY_SALES,
  formatToman,
} from "@/lib/chart-locale"
import { TomanAxisTick } from "@/lib/chart-toman-tick"
import { cn } from "@/lib/utils"
import {
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

export { TomanAxisTick }

/** دو رنگ نرم مشترک با bar/stock — آبی و صورتی ملایم. */
export const LINE_SOFT_COLORS = [
  CHART_BAR_COLORS[0],
  CHART_BAR_COLORS[1],
] as const

export const lineSalesConfig = {
  store: {
    label: FA_CHART.store,
    color: LINE_SOFT_COLORS[0],
  },
  online: {
    label: FA_CHART.online,
    color: LINE_SOFT_COLORS[1],
  },
} satisfies ChartConfig

export type SalesPoint = {
  month: string
  store: number
  online: number
}

export const LINE_CHART_CLASS = cn(
  chartContainerClassName,
  "max-w-none",
  "[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-muted-foreground/32 dark:[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-muted-foreground/38"
)

/** Vertical line demos — portrait plot with room for month + toman ticks. */
export const VERTICAL_LINE_CHART_CLASS = cn(
  "aspect-[4/5] h-auto w-full max-w-[460px] max-h-[72vh] overflow-visible font-sans",
  "[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-muted-foreground/32 dark:[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-muted-foreground/38"
)

export const LINE_TOOLTIP_CURSOR = {
  stroke: "color-mix(in oklab, var(--foreground) 30%, transparent)",
  strokeWidth: 1.25,
  strokeDasharray: "4 4",
} as const

export function scaleSales(seed: number, months = 6): SalesPoint[] {
  let s = seed >>> 0
  const next = () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0
    return s / 0x100000000
  }
  return FA_MONTHLY_SALES.slice(0, months).map((row) => {
    const a = 0.86 + next() * 0.28
    const b = 0.86 + next() * 0.28
    return {
      month: row.month,
      store: Math.round(row.store * a),
      online: Math.round(row.online * b),
    }
  })
}

export function monthTotal(row: Pick<SalesPoint, "store" | "online">) {
  return row.store + row.online
}

export function useSalesData(baseSeed: number, months = 6) {
  const seed = useChartRandomSeed(baseSeed)
  return React.useMemo(() => scaleSales(seed, months), [seed, months])
}

export function useLineSalesCaption(extra?: string) {
  useChartCaption(
    () =>
      extra
        ? `${extra} · ${FA_CHART.titleSalesTrend} · ${FA_CHART.rangeFarvardinShahrivar}`
        : `${FA_CHART.titleSalesTrend} · ${FA_CHART.rangeFarvardinShahrivar}`,
    [extra]
  )
}

export function LineChannelLegend({
  dashed = false,
}: {
  dashed?: boolean
}) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
      <span className="inline-flex items-center gap-1.5">
        {dashed ? (
          <span
            className="h-0.5 w-5 shrink-0 rounded-full"
            style={{
              background: `repeating-linear-gradient(90deg, ${LINE_SOFT_COLORS[0]} 0 4px, transparent 4px 7px)`,
            }}
            aria-hidden
          />
        ) : (
          <span
            className="size-2.5 shrink-0 rounded-full"
            style={{ background: LINE_SOFT_COLORS[0] }}
            aria-hidden
          />
        )}
        {FA_CHART.store}
      </span>
      <span className="inline-flex items-center gap-1.5">
        {dashed ? (
          <span
            className="h-0.5 w-5 shrink-0 rounded-full"
            style={{
              background: `repeating-linear-gradient(90deg, ${LINE_SOFT_COLORS[1]} 0 2px, transparent 2px 5px)`,
            }}
            aria-hidden
          />
        ) : (
          <span
            className="size-2.5 shrink-0 rounded-full"
            style={{ background: LINE_SOFT_COLORS[1] }}
            aria-hidden
          />
        )}
        {FA_CHART.online}
      </span>
    </div>
  )
}

export function LineShell({
  children,
  dashedLegend = false,
  className,
}: {
  children: React.ReactNode
  dashedLegend?: boolean
  className?: string
}) {
  return (
    <div
      dir="rtl"
      className={cn(
        "flex w-full max-w-[700px] flex-col gap-2.5 font-sans",
        className
      )}
    >
      <LineChannelLegend dashed={dashedLegend} />
      {children}
    </div>
  )
}

/** Shared toman tooltip for store / online series. */
export function LineSalesTooltipContent() {
  return (
    <ChartTooltipContent
      className="min-w-[12rem] gap-2"
      labelClassName="w-full border-b border-border/50 pb-1.5 mb-0.5"
      labelFormatter={(label) => (
        <span className="text-muted-foreground">ماه {label}</span>
      )}
      formatter={(value, name, item) => {
        const key = String(name)
        const series = key === "store" ? FA_CHART.store : FA_CHART.online
        return (
          <div className="flex w-full flex-1 items-center gap-2">
            <span
              className="size-2.5 shrink-0 rounded-[2px]"
              style={{ background: item.color }}
              aria-hidden
            />
            <div className="flex flex-1 items-center justify-between gap-6">
              <span className="text-muted-foreground">{series}</span>
              <span className="font-medium tracking-[0] text-foreground">
                {formatToman(Number(value), { compact: true })}
              </span>
            </div>
          </div>
        )
      }}
    />
  )
}
