"use client"

import {
  Pie,
  PieChart,
  Sector,
  type PieSectorDataItem,
  type TooltipIndex,
} from "recharts"

import {
  FA_CHART,
  formatChart2Number,
  toPersianDigits,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

const data = [
  { name: "tehran", value: 400, fill: "var(--color-tehran)" },
  { name: "isfahan", value: 300, fill: "var(--color-isfahan)" },
  { name: "fars", value: 100, fill: "var(--color-fars)" },
  { name: "khorasan", value: 200, fill: "var(--color-khorasan)" },
]

const chartConfig = {
  value: { label: FA_CHART.sales },
  tehran: { label: FA_CHART.tehran, color: "var(--chart-1)" },
  isfahan: { label: FA_CHART.isfahan, color: "var(--chart-2)" },
  fars: { label: FA_CHART.fars, color: "var(--chart-3)" },
  khorasan: { label: FA_CHART.khorasan, color: "var(--chart-4)" },
} satisfies ChartConfig

function renderActiveShape({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  fill,
  payload,
  percent,
  value,
}: PieSectorDataItem) {
  const RADIAN = Math.PI / 180
  const sin = Math.sin(-RADIAN * (midAngle ?? 1))
  const cos = Math.cos(-RADIAN * (midAngle ?? 1))
  const sx = (cx ?? 0) + ((outerRadius ?? 0) + 10) * cos
  const sy = (cy ?? 0) + ((outerRadius ?? 0) + 10) * sin
  const mx = (cx ?? 0) + ((outerRadius ?? 0) + 30) * cos
  const my = (cy ?? 0) + ((outerRadius ?? 0) + 30) * sin
  const ex = mx + (cos >= 0 ? 1 : -1) * 22
  const ey = my
  const textAnchor = cos >= 0 ? "start" : "end"
  const key = String(payload?.name ?? "")
  const label =
    chartConfig[key as keyof typeof chartConfig]?.label ?? payload?.name

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={8}
        textAnchor="middle"
        fill={fill}
        style={{ fontFamily: "var(--font-sans)", fontSize: 14 }}
      >
        {label}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={(outerRadius ?? 0) + 6}
        outerRadius={(outerRadius ?? 0) + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="var(--foreground)"
        style={{ fontFamily: "var(--font-sans)", fontSize: 12 }}
      >
        {`مقدار ${formatChart2Number(Number(value))}`}
      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="var(--muted-foreground)"
        style={{ fontFamily: "var(--font-sans)", fontSize: 11 }}
      >
        {`(سهم ${toPersianDigits(((percent ?? 0) * 100).toFixed(2))}٪)`}
      </text>
    </g>
  )
}

export default function CustomActiveShapePieChartDemo({
  isAnimationActive = true,
  defaultIndex = undefined,
}: {
  isAnimationActive?: boolean
  defaultIndex?: TooltipIndex
}) {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-auto w-full max-w-[500px] max-h-[80vh] font-sans text-xs"
    >
      <PieChart
        accessibilityLayer
        margin={{ top: 50, right: 120, bottom: 0, left: 120 }}
      >
        <Pie
          activeShape={renderActiveShape}
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius="60%"
          outerRadius="80%"
          isAnimationActive={isAnimationActive}
        />
        <ChartTooltip content={() => null} defaultIndex={defaultIndex} />
      </PieChart>
    </ChartContainer>
  )
}
