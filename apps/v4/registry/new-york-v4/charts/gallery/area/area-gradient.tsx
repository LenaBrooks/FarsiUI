"use client"

import { useId } from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useMarketNeon } from "@/registry/new-york-v4/lib/use-market-neon"
import {
  formatPersianMonthTick,
  FA_CHART,
  FA_MONTHS,
} from "@/lib/chart-locale"
import {
  CHART_BAR_COLORS,
  MARKET_DOWN,
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

export const description = "یک نمودار ناحیه‌ای با گرادیان"

const chartData = [
  { month: FA_MONTHS[0], store: 186, online: 80 },
  { month: FA_MONTHS[1], store: 305, online: 200 },
  { month: FA_MONTHS[2], store: 237, online: 120 },
  { month: FA_MONTHS[3], store: 73, online: 190 },
  { month: FA_MONTHS[4], store: 209, online: 130 },
  { month: FA_MONTHS[5], store: 214, online: 140 },
]

export default function ChartAreaGradient() {
  const neon = useMarketNeon()
  const uid = useId().replace(/:/g, "")
  const gradStore = `fillStore-${uid}`
  const gradOnline = `fillOnline-${uid}`
  const colorStore = neon ? MARKET_UP : CHART_BAR_COLORS[0]
  const colorOnline = neon ? MARKET_DOWN : CHART_BAR_COLORS[1]
  const fillOpacity = neon ? 0.32 : 0.8

  const chartConfig = {
    store: {
      label: FA_CHART.store,
      color: colorStore,
    },
    online: {
      label: FA_CHART.online,
      color: colorOnline,
    },
  } satisfies ChartConfig

  const series = [
    {
      key: "online" as const,
      color: colorOnline,
      grad: gradOnline,
    },
    {
      key: "store" as const,
      color: colorStore,
      grad: gradStore,
    },
  ]

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
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={formatPersianMonthTick}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <defs>
          {series.map(({ color, grad }) => {
            const stops = chartAreaGradientStops(color, {
              startOpacity: fillOpacity,
              endOpacity: neon ? 0 : 0.1,
            })
            return (
              <linearGradient key={grad} id={grad} x1="0" y1="0" x2="0" y2="1">
                {stops.map((s) => (
                  <stop
                    key={s.offset}
                    offset={s.offset}
                    stopColor={s.stopColor}
                    stopOpacity={s.stopOpacity}
                  />
                ))}
              </linearGradient>
            )
          })}
        </defs>
        {series.map(({ key, color, grad }) => {
          const glow = neon ? chartNeonGlowProps(color) : null
          return (
            <Area
              key={key}
              dataKey={key}
              type="natural"
              fill={`url(#${grad})`}
              fillOpacity={neon ? 1 : 0.4}
              stroke={color}
              strokeWidth={glow?.strokeWidth ?? 2}
              stackId="a"
              style={glow?.style}
              className={glow?.className}
            />
          )
        })}
      </AreaChart>
    </ChartContainer>
  )
}
