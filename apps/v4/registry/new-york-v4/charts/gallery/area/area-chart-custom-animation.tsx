"use client"

import { useId } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { useMarketNeon } from "@/lib/use-market-neon"
import {
  CHART_BAR_COLORS,
  FA_CHART,
  FA_MONTHS,
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
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

const data = FA_MONTHS.map((name, i) => ({
  name,
  uv: [4000, 3000, 2000, 2780, 1890, 2390][i]!,
}))

export default function AreaCustomAnimationDemo() {
  const neon = useMarketNeon()
  const uid = useId().replace(/:/g, "")
  const gradId = `chartAreaCustomAnim-${uid}`
  const fill = neon ? MARKET_UP : CHART_BAR_COLORS[2]
  const glow = neon ? chartNeonGlowProps(fill) : null
  const stops = chartAreaGradientStops(fill, {
    startOpacity: neon ? 0.32 : 0.8,
    endOpacity: neon ? 0 : 0.05,
  })

  const chartConfig = {
    uv: {
      label: FA_CHART.store,
      color: fill,
    },
  } satisfies ChartConfig

  return (
    <ChartContainer
      config={chartConfig}
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
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" reversed tickMargin={8} />
        <YAxis
          orientation="right"
          width={52}
          tickMargin={12}
          tickFormatter={formatChartNumber}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          type="monotone"
          dataKey="uv"
          stroke={fill}
          strokeWidth={glow?.strokeWidth ?? 2}
          fill={`url(#${gradId})`}
          fillOpacity={1}
          animationDuration={900}
          isAnimationActive
          style={glow?.style}
          className={glow?.className}
          activeDot={
            neon
              ? {
                  r: 4.2,
                  strokeWidth: 0,
                  fill,
                  style: { filter: `drop-shadow(0 0 5px ${fill})` },
                }
              : undefined
          }
        />
      </AreaChart>
    </ChartContainer>
  )
}
