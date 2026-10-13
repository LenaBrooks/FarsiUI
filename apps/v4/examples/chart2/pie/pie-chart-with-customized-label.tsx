"use client"

import {
  Pie,
  PieChart,
  Sector,
  type PieLabelRenderProps,
  type PieSectorShapeProps,
  useActiveTooltipDataPoints,
  useIsTooltipActive,
} from "recharts"

import {
  CHART2_BAR_COLORS,
  FA_CHART,
  toPersianDigits,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

const data = [
  { name: "tehran", value: 400, fill: "var(--color-tehran)" },
  { name: "isfahan", value: 300, fill: "var(--color-isfahan)" },
  { name: "fars", value: 300, fill: "var(--color-fars)" },
  { name: "khorasan", value: 200, fill: "var(--color-khorasan)" },
]

const chartConfig = {
  value: { label: FA_CHART.sales },
  tehran: { label: FA_CHART.tehran, color: CHART2_BAR_COLORS[0] },
  isfahan: { label: FA_CHART.isfahan, color: CHART2_BAR_COLORS[1] },
  fars: { label: FA_CHART.fars, color: CHART2_BAR_COLORS[2] },
  khorasan: { label: FA_CHART.khorasan, color: CHART2_BAR_COLORS[3] },
} satisfies ChartConfig

const RADIAN = Math.PI / 180
const COLORS = [
  CHART2_BAR_COLORS[0],
  CHART2_BAR_COLORS[1],
  CHART2_BAR_COLORS[2],
  CHART2_BAR_COLORS[3],
]

function renderCustomizedLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: PieLabelRenderProps) {
  if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
    return null
  }
  const radius = Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 0.5
  const ncx = Number(cx)
  const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN)
  const ncy = Number(cy)
  const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="var(--primary-foreground)"
      textAnchor={x > ncx ? "start" : "end"}
      dominantBaseline="central"
      style={{ fontFamily: "var(--font-sans)", fontSize: 12 }}
    >
      {`${toPersianDigits(String(Math.round((percent ?? 0) * 100)))}٪`}
    </text>
  )
}

function MyCustomPie(props: PieSectorShapeProps) {
  const p = useActiveTooltipDataPoints()
  const isAnyPieActive = useIsTooltipActive()
  const isThisPieActive = isAnyPieActive && props.payload === p?.[0]
  const fillOpacity = isAnyPieActive && !isThisPieActive ? 0.5 : 1
  return (
    <Sector
      {...props}
      fill={COLORS[props.index % COLORS.length]}
      stroke="none"
      fillOpacity={fillOpacity}
      style={{ transition: "fill-opacity 0.3s ease" }}
    />
  )
}

export default function PieChartWithCustomizedLabelDemo({
  isAnimationActive = true,
}: {
  isAnimationActive?: boolean
}) {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-auto w-full max-w-[500px] max-h-[80vh] font-sans text-xs"
    >
      <PieChart accessibilityLayer>
        <ChartTooltip
          content={
            <ChartTooltipContent nameKey="name" hideLabel />
          }
        />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          labelLine={false}
          label={renderCustomizedLabel}
          isAnimationActive={isAnimationActive}
          shape={MyCustomPie}
        />
      </PieChart>
    </ChartContainer>
  )
}
