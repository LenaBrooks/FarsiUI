"use client"

import { useId } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { usePersianMockData } from "@/registry/new-york-v4/lib/chart-live"
import { useMarketNeon } from "@/registry/new-york-v4/lib/use-market-neon"
import {
  CHART_BAR_COLORS,
  CHART_SERIES_LABELS,
  MARKET_DOWN,
  MARKET_UP,
  chartAreaContainerClassName,
  chartAreaGradientStops,
  chartNeonGlowProps,
  chartNeonOverflowClassName,
  formatChartNumber,
} from "@/lib/chart-fa"
import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

export default function AreaChartDemo({
  isAnimationActive = true,
}: {
  isAnimationActive?: boolean
}) {
  const neon = useMarketNeon()
  const uid = useId().replace(/:/g, "")
  const gradX = `chartAreaX-${uid}`
  const gradY = `chartAreaY-${uid}`
  const data = usePersianMockData(6, 598905)

  const colorX = neon ? MARKET_UP : CHART_BAR_COLORS[0]
  const colorY = neon ? MARKET_DOWN : CHART_BAR_COLORS[2]
  const fillOpacity = neon ? 0.32 : 0.8

  const areaChartConfig = {
    x: { label: CHART_SERIES_LABELS.x, color: colorX },
    y: { label: CHART_SERIES_LABELS.y, color: colorY },
  } satisfies ChartConfig

  const series = [
    { key: "x" as const, color: colorX, grad: gradX, begin: 200 },
    { key: "y" as const, color: colorY, grad: gradY, begin: 0 },
  ]

  return (
    <ChartContainer
      config={areaChartConfig}
      className={cn(
        chartAreaContainerClassName,
        neon && chartNeonOverflowClassName
      )}
    >
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{ top: 10, right: 8, left: 0, bottom: 5 }}
      >
        <defs>
          {series.map(({ color, grad }) => {
            const stops = chartAreaGradientStops(color, {
              startOpacity: fillOpacity,
              endOpacity: neon ? 0 : 0.05,
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
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" reversed tickMargin={8} />
        <YAxis
          orientation="right"
          width={52}
          tickMargin={12}
          tickFormatter={formatChartNumber}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        {series.map(({ key, color, grad, begin }) => {
          const glow = neon ? chartNeonGlowProps(color) : null
          return (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stroke={color}
              strokeWidth={glow?.strokeWidth ?? 2}
              fill={`url(#${grad})`}
              fillOpacity={1}
              isAnimationActive={isAnimationActive}
              animationBegin={begin || undefined}
              animationDuration={begin ? 1300 : undefined}
              style={glow?.style}
              className={glow?.className}
              activeDot={
                neon
                  ? {
                      r: 4.2,
                      strokeWidth: 0,
                      fill: color,
                      style: { filter: `drop-shadow(0 0 5px ${color})` },
                    }
                  : undefined
              }
            />
          )
        })}
      </AreaChart>
    </ChartContainer>
  )
}
