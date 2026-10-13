"use client"

import {
  Pie,
  PieChart,
  type PieProps,
  type PieSectorDataItem,
} from "recharts"

import { CHART2_BAR_COLORS, FA_CHART } from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

const chartData = [
  { name: "low", value: 80, fill: "var(--color-low)" },
  { name: "mid", value: 45, fill: "var(--color-mid)" },
  { name: "high", value: 25, fill: "var(--color-high)" },
]

const chartConfig = {
  value: { label: FA_CHART.sales },
  low: { label: "کم", color: "var(--destructive)" },
  mid: { label: "متوسط", color: CHART2_BAR_COLORS[1] },
  high: { label: "زیاد", color: CHART2_BAR_COLORS[0] },
} satisfies ChartConfig

const NEEDLE_BASE_RADIUS_PX = 5
const NEEDLE_COLOR = CHART2_BAR_COLORS[2]

function Needle({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
}: PieSectorDataItem) {
  const needleBaseCenterX = cx
  const needleBaseCenterY = cy
  const needleLength = Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) / 2

  return (
    <g>
      <circle
        cx={needleBaseCenterX}
        cy={needleBaseCenterY}
        r={NEEDLE_BASE_RADIUS_PX}
        fill={NEEDLE_COLOR}
        stroke="none"
      />
      <path
        d={`M${needleBaseCenterX},${needleBaseCenterY}l${needleLength},0`}
        strokeWidth={2}
        stroke={NEEDLE_COLOR}
        fill={NEEDLE_COLOR}
        style={{
          transform: `rotate(-${midAngle}deg)`,
          transformOrigin: `${needleBaseCenterX}px ${needleBaseCenterY}px`,
        }}
      />
    </g>
  )
}

function HalfPie(props: PieProps) {
  return (
    <Pie
      {...props}
      stroke="none"
      dataKey="value"
      nameKey="name"
      startAngle={180}
      endAngle={0}
      data={chartData}
      cx={100}
      cy={100}
      innerRadius={50}
      outerRadius={100}
    />
  )
}

export default function PieChartWithNeedleDemo({
  isAnimationActive = true,
}: {
  isAnimationActive?: boolean
}) {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto h-[120px] w-[210px] aspect-auto font-sans text-xs"
    >
      <PieChart accessibilityLayer width={210} height={120}>
        <HalfPie isAnimationActive={isAnimationActive} />
        <HalfPie isAnimationActive={isAnimationActive} activeShape={Needle} />
        <ChartTooltip defaultIndex={0} content={() => null} active />
      </PieChart>
    </ChartContainer>
  )
}
