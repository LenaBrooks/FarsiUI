"use client"

import { useId } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { usePersianMockData } from "@/components/chart2-live"
import {
  CHART2_BAR_COLORS,
  CHART2_SERIES_LABELS,
  chart2AreaContainerClassName,
  formatChart2Number,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

/** Blue + green from CHART2_BAR_COLORS — pink/red slot is for other series. */
const areaChartConfig = {
  x: {
    label: CHART2_SERIES_LABELS.x,
    color: CHART2_BAR_COLORS[0],
  },
  y: {
    label: CHART2_SERIES_LABELS.y,
    color: CHART2_BAR_COLORS[2],
  },
} satisfies ChartConfig

export default function AreaChartDemo({
  isAnimationActive = true,
}: {
  isAnimationActive?: boolean
}) {
  const uid = useId().replace(/:/g, "")
  const gradX = `chart2AreaX-${uid}`
  const gradY = `chart2AreaY-${uid}`
  const data = usePersianMockData(6, 598905)

  return (
    <ChartContainer
      config={areaChartConfig}
      className={chart2AreaContainerClassName}
    >
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{ top: 10, right: 8, left: 0, bottom: 5 }}
      >
        <defs>
          <linearGradient id={gradX} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-x)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-x)" stopOpacity={0.05} />
          </linearGradient>
          <linearGradient id={gradY} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-y)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-y)" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" reversed tickMargin={8} />
        <YAxis
          orientation="right"
          width={52}
          tickMargin={12}
          tickFormatter={formatChart2Number}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          type="monotone"
          dataKey="x"
          stroke="var(--color-x)"
          fill={`url(#${gradX})`}
          fillOpacity={1}
          isAnimationActive={isAnimationActive}
          animationBegin={200}
          animationDuration={1300}
        />
        <Area
          type="monotone"
          dataKey="y"
          stroke="var(--color-y)"
          fill={`url(#${gradY})`}
          fillOpacity={1}
          isAnimationActive={isAnimationActive}
        />
      </AreaChart>
    </ChartContainer>
  )
}
