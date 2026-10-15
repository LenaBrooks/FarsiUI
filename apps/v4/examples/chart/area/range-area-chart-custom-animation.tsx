"use client"

import { useId } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { useMarketNeon } from "@/examples/chart/area/use-market-neon"
import {
  CHART_BAR_COLORS,
  FA_MONTHS,
  MARKET_UP,
  chartAreaContainerClassName,
  chartAreaGradientStops,
  chartNeonGlowProps,
  chartNeonOverflowClassName,
  formatChartNumber,
  toPersianDigits,
} from "@/lib/chart-fa"
import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

const data = [
  { name: FA_MONTHS[0], range: [400, 2400] },
  { name: FA_MONTHS[1], range: [300, 1398] },
  { name: FA_MONTHS[2], range: [200, 9800] },
  { name: FA_MONTHS[3], range: [278, 3908] },
  { name: FA_MONTHS[4], range: [189, 4800] },
  { name: FA_MONTHS[5], range: [239, 3800] },
  { name: "مهر", range: [349, 4300] },
]

export default function AreaRangeCustomAnimationDemo() {
  const neon = useMarketNeon()
  const uid = useId().replace(/:/g, "")
  const gradId = `chartRangeAreaAnim-${uid}`
  const color = neon ? MARKET_UP : CHART_BAR_COLORS[0]
  const glow = neon ? chartNeonGlowProps(color) : null
  const stops = chartAreaGradientStops(color, {
    startOpacity: neon ? 0.32 : 0.45,
    endOpacity: neon ? 0 : 0.1,
  })

  const chartConfig = {
    range: {
      label: "بازه",
      color,
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
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => {
                if (!Array.isArray(value))
                  return formatChartNumber(value as number)
                return `${toPersianDigits(String(value[0]))} — ${toPersianDigits(String(value[1]))}`
              }}
            />
          }
        />
        <Area
          type="linear"
          dataKey="range"
          stroke={color}
          strokeWidth={glow?.strokeWidth ?? 2}
          fill={`url(#${gradId})`}
          fillOpacity={1}
          animationDuration={1200}
          isAnimationActive
          style={glow?.style}
          className={glow?.className}
        />
      </AreaChart>
    </ChartContainer>
  )
}
