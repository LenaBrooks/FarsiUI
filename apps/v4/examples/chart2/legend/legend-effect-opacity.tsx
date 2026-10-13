"use client"

import * as React from "react"
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  type DataKey,
  type LegendPayload,
} from "recharts"

import { CHART_TOMAN_AXIS_WIDTH } from "@/lib/chart-locale"
import { TomanAxisTick } from "@/lib/chart-toman-tick"
import {
  CHART2_BAR_COLORS,
  FA_CHART,
  FA_MONTHS,
  chart2ContainerClassName,
  chart2DashedGridClassName,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

const data = [
  { name: FA_MONTHS[0], uv: 4000, pv: 2400 },
  { name: FA_MONTHS[1], uv: 3000, pv: 1398 },
  { name: FA_MONTHS[2], uv: 2000, pv: 9800 },
  { name: FA_MONTHS[3], uv: 2780, pv: 3908 },
  { name: FA_MONTHS[4], uv: 1890, pv: 4800 },
  { name: FA_MONTHS[5], uv: 2390, pv: 3800 },
  { name: "مهر", uv: 3490, pv: 4300 },
]

const chartConfig = {
  pv: { label: FA_CHART.online, color: CHART2_BAR_COLORS[0] },
  uv: { label: FA_CHART.store, color: CHART2_BAR_COLORS[1] },
} satisfies ChartConfig

export default function LegendEffectOpacityDemo() {
  const [hoveringDataKey, setHoveringDataKey] = React.useState<
    DataKey<unknown> | undefined
  >(undefined)

  let pvOpacity = 1
  let uvOpacity = 1

  if (hoveringDataKey === "uv") {
    pvOpacity = 0.5
  }

  if (hoveringDataKey === "pv") {
    uvOpacity = 0.5
  }

  const handleMouseEnter = (payload: LegendPayload) => {
    setHoveringDataKey(payload.dataKey)
  }

  const handleMouseLeave = () => {
    setHoveringDataKey(undefined)
  }

  return (
    <ChartContainer
      config={chartConfig}
      className={`${chart2ContainerClassName} ${chart2DashedGridClassName} [&_.recharts-legend-item]:inline-flex [&_.recharts-legend-item]:items-center [&_.recharts-legend-item]:gap-2`}
    >
      <LineChart
        accessibilityLayer
        data={data}
        margin={{ top: 20, right: 8, left: 0, bottom: 36 }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="name" reversed tickMargin={8} />
        <YAxis
          orientation="right"
          width={CHART_TOMAN_AXIS_WIDTH}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={TomanAxisTick}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          verticalAlign="bottom"
          wrapperStyle={{
            fontFamily: "var(--font-sans)",
            direction: "rtl",
            marginTop: 16,
            paddingTop: 4,
          }}
          iconSize={14}
        />
        <Line
          type="monotone"
          dataKey="pv"
          name={FA_CHART.online}
          stroke="var(--color-pv)"
          strokeWidth={2}
          strokeOpacity={pvOpacity}
          activeDot={{ r: 8 }}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="uv"
          name={FA_CHART.store}
          stroke="var(--color-uv)"
          strokeWidth={2}
          strokeOpacity={uvOpacity}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  )
}
