"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"

import { CHART_TOMAN_AXIS_WIDTH } from "@/lib/chart-locale"
import { TomanAxisTick } from "@/lib/chart-toman-tick"
import {
  CHART_BAR_COLORS,
  FA_CHART,
  FA_MONTHS,
  chartAreaContainerClassName,
} from "@/lib/chart-fa"
import {
  ChartContainer,
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
  uv: { label: FA_CHART.store, color: CHART_BAR_COLORS[2] },
} satisfies ChartConfig

export default function ResponsiveContainerDemo({
  isAnimationActive = true,
}: {
  isAnimationActive?: boolean
}) {
  return (
    <ChartContainer
      config={chartConfig}
      className={`${chartAreaContainerClassName} max-h-[420px]`}
    >
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{ top: 20, right: 8, left: 12, bottom: 4 }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          reversed
          tickLine={false}
          axisLine={false}
          tickMargin={10}
        />
        <YAxis
          orientation="right"
          width={CHART_TOMAN_AXIS_WIDTH}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={TomanAxisTick}
          tickCount={4}
          // ۰ / ۲هزار / ۴هزار / ۶هزار — سقف ۴هزار وسط فضای خالی می‌ماند
          domain={[0, 6000]}
        />
        <ChartTooltip
          cursor={{ stroke: CHART_BAR_COLORS[2], strokeOpacity: 0.35 }}
          content={<ChartTooltipContent />}
        />
        <ReferenceLine
          x={FA_MONTHS[2]}
          stroke={CHART_BAR_COLORS[1]}
          strokeDasharray="4 4"
          label={{
            value: "حداقل ماه",
            position: "insideTopLeft",
            fill: CHART_BAR_COLORS[1],
            fontFamily: "var(--font-sans)",
            fontSize: 11,
          }}
        />
        <ReferenceLine
          y={4000}
          stroke={CHART_BAR_COLORS[3]}
          strokeDasharray="4 4"
          label={({ viewBox }) => {
            if (!viewBox || !("y" in viewBox) || !("x" in viewBox)) return null
            const vb = viewBox as { x: number; y: number }
            return (
              <text
                x={vb.x + 10}
                y={vb.y - 8}
                fill={CHART_BAR_COLORS[3]}
                fontSize={11}
                fontFamily="var(--font-sans)"
                textAnchor="start"
              >
                سقف هدف
              </text>
            )
          }}
        />
        <Area
          type="monotone"
          dataKey="uv"
          stroke="var(--color-uv)"
          fill="var(--color-uv)"
          fillOpacity={0.28}
          strokeWidth={2}
          isAnimationActive={isAnimationActive}
        />
      </AreaChart>
    </ChartContainer>
  )
}
