"use client"

import { Activity } from "lucide-react"
import { useId } from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useMarketNeon } from "@/lib/use-market-neon"
import {
  formatPersianMonthTick,
  FA_CHART,
  FA_MONTHS,
} from "@/lib/chart-locale"
import {
  CHART_BAR_COLORS,
  MARKET_UP,
  chartAreaGradientStops,
  chartNeonGlowProps,
  chartNeonOverflowClassName,
} from "@/lib/chart-fa"
import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

export const description = "یک نمودار ناحیه‌ای پله‌ای"

const chartData = [
  { month: FA_MONTHS[0], store: 186 },
  { month: FA_MONTHS[1], store: 305 },
  { month: FA_MONTHS[2], store: 237 },
  { month: FA_MONTHS[3], store: 73 },
  { month: FA_MONTHS[4], store: 209 },
  { month: FA_MONTHS[5], store: 214 },
]

export default function ChartAreaStep() {
  const neon = useMarketNeon()
  const uid = useId().replace(/:/g, "")
  const gradId = `area-step-${uid}`
  const color = neon ? MARKET_UP : CHART_BAR_COLORS[0]
  const glow = neon ? chartNeonGlowProps(color) : null
  const fillOpacity = neon ? 0.32 : 0.4
  const stops = chartAreaGradientStops(color, {
    startOpacity: fillOpacity,
    endOpacity: neon ? 0 : 0.05,
  })

  const chartConfig = {
    store: {
      label: FA_CHART.store,
      color,
      icon: Activity,
    },
  } satisfies ChartConfig

  return (
    <ChartContainer
      config={chartConfig}
      className={cn(neon && chartNeonOverflowClassName)}
    >
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            {stops.map((s) => (
              <stop
                key={s.offset}
                offset={s.offset}
                stopColor={s.stopColor}
                stopOpacity={s.stopOpacity}
              />
            ))}
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={formatPersianMonthTick}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Area
          dataKey="store"
          type="step"
          fill={neon ? `url(#${gradId})` : "var(--color-store)"}
          fillOpacity={neon ? 1 : 0.4}
          stroke={color}
          strokeWidth={glow?.strokeWidth ?? 2}
          style={glow?.style}
          className={glow?.className}
        />
      </AreaChart>
    </ChartContainer>
  )
}
