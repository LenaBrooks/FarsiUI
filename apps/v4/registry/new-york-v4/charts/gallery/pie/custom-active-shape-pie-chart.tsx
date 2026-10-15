"use client"

import {
  Pie,
  PieChart,
  Sector,
  type PieSectorDataItem,
  type TooltipIndex,
} from "recharts"

import {
  CHART_BAR_COLORS,
  FA_CHART,
  formatChartNumber,
  toPersianDigits,
} from "@/lib/chart-fa"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
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
  tehran: { label: FA_CHART.tehran, color: CHART_BAR_COLORS[0] },
  isfahan: { label: FA_CHART.isfahan, color: CHART_BAR_COLORS[1] },
  fars: { label: FA_CHART.fars, color: CHART_BAR_COLORS[2] },
  khorasan: { label: FA_CHART.khorasan, color: CHART_BAR_COLORS[3] },
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
  const angle = midAngle ?? 0
  const sin = Math.sin(-RADIAN * angle)
  const cos = Math.cos(-RADIAN * angle)
  const or = outerRadius ?? 0
  const centerX = cx ?? 0
  const centerY = cy ?? 0
  const onRight = cos >= 0
  const side = onRight ? 1 : -1

  const sx = centerX + (or + 12) * cos
  const sy = centerY + (or + 12) * sin
  const mx = centerX + (or + 36) * cos
  const my = centerY + (or + 36) * sin
  // نوک خط — متن با فاصلهٔ واضح بعد از آن می‌آید
  const ex = mx + side * 18
  const ey = my
  const textX = ex + side * 10
  const textAnchor = onRight ? "start" : "end"
  const key = String(payload?.name ?? "")
  const label =
    chartConfig[key as keyof typeof chartConfig]?.label ?? payload?.name

  return (
    <g>
      <text
        x={centerX}
        y={centerY}
        dy={5}
        textAnchor="middle"
        fill={fill}
        style={{ fontFamily: "var(--font-sans)", fontSize: 14, letterSpacing: 0 }}
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
        innerRadius={or + 6}
        outerRadius={or + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        strokeWidth={1.25}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2.5} fill={fill} stroke="none" />
      {/* direction:ltr تا در RTL متن روی خط برنگردد */}
      <g style={{ direction: "ltr" }}>
        <text
          x={textX}
          y={ey}
          dy={-6}
          textAnchor={textAnchor}
          fill="var(--foreground)"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: 0,
          }}
        >
          {formatChartNumber(Number(value))}
        </text>
        <text
          x={textX}
          y={ey}
          dy={12}
          textAnchor={textAnchor}
          fill="var(--muted-foreground)"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 11,
            letterSpacing: 0,
          }}
        >
          {toPersianDigits(((percent ?? 0) * 100).toFixed(0))}٪
        </text>
      </g>
    </g>
  )
}

export default function CustomActiveShapePieChartDemo({
  isAnimationActive = true,
  defaultIndex = 0,
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
        margin={{ top: 56, right: 136, bottom: 28, left: 136 }}
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
        <ChartTooltip content={() => null} defaultIndex={defaultIndex} active />
        <ChartLegend content={<ChartLegendContent nameKey="name" />} />
      </PieChart>
    </ChartContainer>
  )
}
