"use client"

import { useId } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { useChart2Caption, usePersianMockData } from "@/components/chart2-live"
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

/** x=حضوری · y=آنلاین · z=سفارش — از پالت CHART2 */
const STACK_COLORS = [
  CHART2_BAR_COLORS[1],
  CHART2_BAR_COLORS[2],
  CHART2_BAR_COLORS[0],
] as const

const stackedConfig = {
  x: { label: CHART2_SERIES_LABELS.x, color: STACK_COLORS[0] },
  y: { label: CHART2_SERIES_LABELS.y, color: STACK_COLORS[1] },
  z: { label: CHART2_SERIES_LABELS.z, color: STACK_COLORS[2] },
} satisfies ChartConfig

const SERIES = [
  { key: "x" as const, color: STACK_COLORS[0] },
  { key: "y" as const, color: STACK_COLORS[1] },
  { key: "z" as const, color: STACK_COLORS[2] },
]

export default function StackedAreaChartDemo({
  isAnimationActive = true,
}: {
  isAnimationActive?: boolean
}) {
  const uid = useId().replace(/:/g, "")
  const data = usePersianMockData(8, 351905)

  useChart2Caption(
    () => <>سهم کانال‌ها روی هم — گرادیان نرم، بدون پرش رنگ</>
  )

  return (
    <ChartContainer
      config={stackedConfig}
      className={chart2AreaContainerClassName}
    >
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{ top: 16, right: 8, left: 0, bottom: 4 }}
      >
        <defs>
          {SERIES.map(({ key, color }) => (
            <linearGradient
              key={key}
              id={`stack-${key}-${uid}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={color} stopOpacity={0.72} />
              <stop offset="55%" stopColor={color} stopOpacity={0.28} />
              <stop offset="100%" stopColor={color} stopOpacity={0.04} />
            </linearGradient>
          ))}
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
          tickFormatter={formatChart2Number}
        />
        <ChartTooltip
          cursor={{ stroke: "var(--border)", strokeDasharray: "4 4" }}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <ChartLegend content={<ChartLegendContent />} />
        {SERIES.map(({ key, color }, index) => (
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            stackId="stack"
            stroke={color}
            strokeWidth={2}
            fill={`url(#stack-${key}-${uid})`}
            fillOpacity={1}
            isAnimationActive={isAnimationActive}
            animationBegin={index * 120}
            animationDuration={1100}
            activeDot={{
              r: 4,
              strokeWidth: 2,
              stroke: "var(--background)",
              fill: color,
            }}
          />
        ))}
      </AreaChart>
    </ChartContainer>
  )
}
