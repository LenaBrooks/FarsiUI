"use client"

import { useId } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { usePersianMockData } from "@/components/chart-live"
import { useMarketNeon } from "@/examples/chart/area/use-market-neon"
import {
  CHART_BAR_COLORS,
  CHART_SERIES_LABELS,
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

export default function PreventRightClickAreaDemo() {
  const neon = useMarketNeon()
  const uid = useId().replace(/:/g, "")
  const gradId = `chartPreventAreaY-${uid}`
  const data = usePersianMockData(6, 4390435)
  const color = neon ? MARKET_UP : CHART_BAR_COLORS[1]
  const glow = neon ? chartNeonGlowProps(color) : null
  const stops = chartAreaGradientStops(color, {
    startOpacity: neon ? 0.32 : 0.75,
    endOpacity: neon ? 0 : 0.05,
  })

  const chartConfig = {
    y: { label: CHART_SERIES_LABELS.y, color },
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
        margin={{ top: 20, right: 8, left: 0, bottom: 5 }}
        onContextMenu={(_, e) => e.preventDefault()}
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
        <XAxis dataKey="label" reversed tickMargin={8} />
        <YAxis
          orientation="right"
          width={52}
          tickMargin={12}
          tickFormatter={formatChartNumber}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          type="monotone"
          dataKey="y"
          stroke={color}
          strokeWidth={glow?.strokeWidth ?? 2}
          fill={`url(#${gradId})`}
          style={glow?.style}
          className={glow?.className}
        />
      </AreaChart>
    </ChartContainer>
  )
}
