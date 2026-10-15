"use client"

import { useId } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  useChartHeight,
  useYAxisScale,
} from "recharts"

import { useMarketNeon } from "@/examples/chart/area/use-market-neon"
import {
  CHART_BAR_COLORS,
  FA_CHART,
  FA_MONTHS,
  MARKET_DOWN,
  MARKET_UP,
  chartAreaContainerClassName,
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

const data = [
  { name: FA_MONTHS[0], uv: 4000 },
  { name: FA_MONTHS[1], uv: 3000 },
  { name: FA_MONTHS[2], uv: -1000 },
  { name: FA_MONTHS[3], uv: 500 },
  { name: FA_MONTHS[4], uv: -2000 },
  { name: FA_MONTHS[5], uv: -250 },
  { name: "مهر", uv: 3490 },
]

function SplitGradient({
  gradId,
  up,
  down,
  neon,
}: {
  gradId: string
  up: string
  down: string
  neon: boolean
}) {
  const scale = useYAxisScale()
  const height = useChartHeight()
  const scaledZero = scale?.(0)
  if (scaledZero == null || height == null) return null
  const ratio = scaledZero / height
  const tipOpacity = neon ? 0.85 : 1
  const midOpacity = neon ? 0.08 : 0.15

  return (
    <defs>
      <linearGradient
        id={gradId}
        x1="0"
        x2="0"
        y1="0"
        y2={height}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor={up} stopOpacity={tipOpacity} />
        <stop offset={`${ratio}`} stopColor={up} stopOpacity={midOpacity} />
        <stop offset={`${ratio}`} stopColor={down} stopOpacity={midOpacity} />
        <stop offset="1" stopColor={down} stopOpacity={tipOpacity} />
      </linearGradient>
    </defs>
  )
}

export default function AreaChartFillByValueDemo() {
  const neon = useMarketNeon()
  const uid = useId().replace(/:/g, "")
  const gradId = `chartSplitColor-${uid}`

  const up = neon ? MARKET_UP : CHART_BAR_COLORS[2]
  const down = neon ? MARKET_DOWN : CHART_BAR_COLORS[1]
  const stroke = neon ? MARKET_UP : "var(--foreground)"
  const glow = neon ? chartNeonGlowProps(stroke) : null

  const chartConfig = {
    uv: {
      label: FA_CHART.store,
      color: up,
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
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" reversed tickMargin={8} />
        <YAxis
          orientation="right"
          width={52}
          tickMargin={12}
          tickFormatter={formatChartNumber}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <SplitGradient gradId={gradId} up={up} down={down} neon={neon} />
        <Area
          type="monotone"
          dataKey="uv"
          stroke={stroke}
          strokeWidth={glow?.strokeWidth ?? 2}
          fill={`url(#${gradId})`}
          style={glow?.style}
          className={glow?.className}
          activeDot={
            neon
              ? {
                  r: 4.2,
                  strokeWidth: 0,
                  fill: stroke,
                  style: { filter: `drop-shadow(0 0 5px ${stroke})` },
                }
              : undefined
          }
        />
      </AreaChart>
    </ChartContainer>
  )
}
