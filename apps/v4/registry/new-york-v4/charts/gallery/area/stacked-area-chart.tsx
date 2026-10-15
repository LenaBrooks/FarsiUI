"use client"

import { useId } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { useChartCaption, usePersianMockData } from "@/lib/chart-live"
import { useMarketNeon } from "@/lib/use-market-neon"
import {
  CHART_BAR_COLORS,
  CHART_SERIES_LABELS,
  MARKET_DOWN,
  MARKET_MUTE,
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

export default function StackedAreaChartDemo({
  isAnimationActive = true,
}: {
  isAnimationActive?: boolean
}) {
  const neon = useMarketNeon()
  const uid = useId().replace(/:/g, "")
  const data = usePersianMockData(8, 351905)

  const colors = neon
    ? ([MARKET_UP, MARKET_DOWN, MARKET_MUTE] as const)
    : ([CHART_BAR_COLORS[1], CHART_BAR_COLORS[2], CHART_BAR_COLORS[0]] as const)

  const stackedConfig = {
    x: { label: CHART_SERIES_LABELS.x, color: colors[0] },
    y: { label: CHART_SERIES_LABELS.y, color: colors[1] },
    z: { label: CHART_SERIES_LABELS.z, color: colors[2] },
  } satisfies ChartConfig

  const SERIES = [
    { key: "x" as const, color: colors[0] },
    { key: "y" as const, color: colors[1] },
    { key: "z" as const, color: colors[2] },
  ]

  useChartCaption(() =>
    neon ? (
      <>سهم کانال‌ها روی هم — الگوی سبز / صورتی / خاکستری مارکت‌کارت</>
    ) : (
      <>سهم کانال‌ها روی هم — گرادیان نرم، بدون پرش رنگ</>
    )
  )

  return (
    <ChartContainer
      config={stackedConfig}
      className={cn(
        chartAreaContainerClassName,
        neon && chartNeonOverflowClassName
      )}
    >
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{ top: 16, right: 8, left: 0, bottom: 4 }}
      >
        <defs>
          {SERIES.map(({ key, color }) => {
            const stops = chartAreaGradientStops(color, {
              startOpacity: neon ? 0.32 : 0.72,
              endOpacity: neon ? 0 : 0.04,
            })
            return (
              <linearGradient
                key={key}
                id={`stack-${key}-${uid}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
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
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="label"
          reversed
          tickMargin={10}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          orientation="right"
          width={52}
          tickMargin={10}
          axisLine={false}
          tickLine={false}
          tickFormatter={formatChartNumber}
        />
        <ChartTooltip
          cursor={{ stroke: "var(--border)", strokeDasharray: "4 4" }}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <ChartLegend content={<ChartLegendContent />} />
        {SERIES.map(({ key, color }, index) => {
          const glow = neon ? chartNeonGlowProps(color) : null
          return (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stackId="stack"
              stroke={color}
              strokeWidth={glow?.strokeWidth ?? 2}
              fill={`url(#stack-${key}-${uid})`}
              fillOpacity={1}
              isAnimationActive={isAnimationActive}
              animationBegin={index * 120}
              animationDuration={1100}
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
                  : {
                      r: 4,
                      strokeWidth: 2,
                      stroke: "var(--background)",
                      fill: color,
                    }
              }
            />
          )
        })}
      </AreaChart>
    </ChartContainer>
  )
}
