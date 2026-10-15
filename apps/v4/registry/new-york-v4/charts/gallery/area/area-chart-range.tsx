"use client"

import { useId } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { useMarketNeon } from "@/registry/new-york-v4/lib/use-market-neon"
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

const rangeData = [
  { day: FA_MONTHS[0], temperature: [-1, 10] },
  { day: FA_MONTHS[1], temperature: [2, 15] },
  { day: FA_MONTHS[2], temperature: [3, 12] },
  { day: FA_MONTHS[3], temperature: [4, 12] },
  { day: FA_MONTHS[4], temperature: [12, 16] },
  { day: FA_MONTHS[5], temperature: [5, 16] },
  { day: "مهر", temperature: [3, 12] },
  { day: "آبان", temperature: [0, 8] },
  { day: "آذر", temperature: [-3, 5] },
]

export default function AreaChartRangeDemo({
  isAnimationActive = true,
}: {
  isAnimationActive?: boolean
}) {
  const neon = useMarketNeon()
  const uid = useId().replace(/:/g, "")
  const gradId = `range-temp-${uid}`
  const color = neon ? MARKET_UP : CHART_BAR_COLORS[2]
  const glow = neon ? chartNeonGlowProps(color) : null
  const stops = chartAreaGradientStops(color, {
    startOpacity: neon ? 0.32 : 0.35,
    endOpacity: neon ? 0 : 0.35,
  })

  const chartConfig = {
    temperature: {
      label: "بازهٔ دما",
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
        data={rangeData}
        margin={{ top: 20, right: 8, left: 0, bottom: 20 }}
      >
        {neon ? (
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
        ) : null}
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" reversed tickMargin={8} />
        <YAxis
          orientation="right"
          width={44}
          tickMargin={10}
          tickFormatter={(v) => toPersianDigits(String(v))}
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
          dataKey="temperature"
          stroke={color}
          strokeWidth={glow?.strokeWidth ?? 2}
          fill={neon ? `url(#${gradId})` : color}
          fillOpacity={neon ? 1 : 0.35}
          isAnimationActive={isAnimationActive}
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
      </AreaChart>
    </ChartContainer>
  )
}
