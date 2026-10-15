"use client"

import { useId } from "react"
import { Area, AreaChart } from "recharts"

import { usePersianMockData } from "@/lib/chart-live"
import { useMarketNeon } from "@/lib/use-market-neon"
import {
  CHART_BAR_COLORS,
  CHART_SERIES_LABELS,
  MARKET_UP,
  chartAreaGradientStops,
  chartNeonGlowProps,
  chartNeonOverflowClassName,
} from "@/lib/chart-fa"
import { cn } from "@/lib/utils"
import {
  ChartContainer,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

export default function TinyAreaChartDemo() {
  const neon = useMarketNeon()
  const uid = useId().replace(/:/g, "")
  const gradId = `chartTinyAreaY-${uid}`
  const data = usePersianMockData(6, 905)
  const color = neon ? MARKET_UP : CHART_BAR_COLORS[1]
  const glow = neon ? chartNeonGlowProps(color) : null
  const fillOpacity = neon ? 0.32 : 0.7
  const stops = chartAreaGradientStops(color, {
    startOpacity: fillOpacity,
    endOpacity: neon ? 0 : 0.05,
  })

  const chartConfig = {
    y: { label: CHART_SERIES_LABELS.y, color },
  } satisfies ChartConfig

  return (
    <ChartContainer
      config={chartConfig}
      className={cn(
        "mx-auto aspect-[1.618] h-[50px] w-full max-w-[200px] font-sans",
        neon && chartNeonOverflowClassName
      )}
    >
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
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
        <Area
          type="monotone"
          dataKey="y"
          stroke={color}
          strokeWidth={glow?.strokeWidth ?? 2}
          fill={`url(#${gradId})`}
          isAnimationActive={false}
          style={glow?.style}
          className={glow?.className}
        />
      </AreaChart>
    </ChartContainer>
  )
}
