"use client"

import type { MouseEvent, TouchEvent } from "react"
import { useId } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  getRelativeCoordinate,
} from "recharts"

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

export default function AreaWithCustomEventsDemo() {
  const neon = useMarketNeon()
  const uid = useId().replace(/:/g, "")
  const gradId = `chartEventsAreaX-${uid}`
  const data = usePersianMockData(20, 456)
  const color = neon ? MARKET_UP : CHART_BAR_COLORS[0]
  const glow = neon ? chartNeonGlowProps(color) : null
  const stops = chartAreaGradientStops(color, {
    startOpacity: neon ? 0.32 : 0.7,
    endOpacity: neon ? 0 : 0.05,
  })

  const chartConfig = {
    x: { label: CHART_SERIES_LABELS.x, color },
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
        onClick={(_d, event: MouseEvent<SVGGraphicsElement>) => {
          console.log("AreaChart clicked:", getRelativeCoordinate(event))
        }}
        onMouseEnter={(_d, event: MouseEvent<SVGGraphicsElement>) => {
          console.log("AreaChart mouse enter:", getRelativeCoordinate(event))
        }}
        onMouseMove={(_d, event: MouseEvent<SVGGraphicsElement>) => {
          console.log("AreaChart mouse move:", getRelativeCoordinate(event))
        }}
        onMouseLeave={(_d, event: MouseEvent<SVGGraphicsElement>) => {
          console.log("AreaChart mouse leave:", getRelativeCoordinate(event))
        }}
        onContextMenu={(_d, event: MouseEvent<SVGGraphicsElement>) => {
          event.preventDefault()
          console.log("AreaChart context menu:", getRelativeCoordinate(event))
        }}
        onTouchStart={(_d, event: TouchEvent<SVGGraphicsElement>) => {
          console.log("AreaChart touch start:", getRelativeCoordinate(event))
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
          type="step"
          dataKey="x"
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
