"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  Text,
  XAxis,
  YAxis,
  type YAxisTickContentProps,
} from "recharts"

import {
  CHART_BAR_COLORS,
  FA_CHART,
  FA_MONTHS,
  chartBarContainerClassName,
  formatChartNumber,
} from "@/lib/chart-fa"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

const data = [
  { name: FA_MONTHS[0], uv: 4000, pv: 2400 },
  { name: FA_MONTHS[1], uv: -3000, pv: 1398 },
  { name: FA_MONTHS[2], uv: -2000, pv: -9800 },
  { name: FA_MONTHS[3], uv: 2780, pv: 3908 },
  { name: FA_MONTHS[4], uv: -1890, pv: 4800 },
  { name: FA_MONTHS[5], uv: 2390, pv: -3800 },
  { name: "مهر", uv: 3490, pv: 4300 },
]

function CustomYAxisTick({
  upColor,
  ...props
}: YAxisTickContentProps & { upColor: string }) {
  const value = Number(props.payload?.value ?? 0)
  const fill =
    Math.sign(value) === -1
      ? "var(--destructive)"
      : Math.sign(value) === 1
        ? upColor
        : "var(--foreground)"

  return (
    <Text
      {...props}
      fill={fill}
      fontWeight={value === 0 ? "bold" : "normal"}
      style={{ fontFamily: "var(--font-sans)" }}
    >
      {formatChartNumber(value)}
    </Text>
  )
}

export default function PositiveAndNegativeBarChartDemo() {
  const [c0, c1] = CHART_BAR_COLORS
  const upTick = c1

  const chartConfig = {
    pv: { label: FA_CHART.online, color: c0 },
    uv: { label: FA_CHART.store, color: c1 },
  } satisfies ChartConfig

  return (
    <ChartContainer
      config={chartConfig}
      className={chartBarContainerClassName}
    >
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ top: 5, right: 8, left: 0, bottom: 5 }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="name" reversed tickMargin={8} />
        <YAxis
          orientation="right"
          width={56}
          tickMargin={10}
          tick={(props) => <CustomYAxisTick {...props} upColor={upTick} />}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <ReferenceLine y={0} stroke="var(--border)" />
        <Bar
          dataKey="pv"
          fill="var(--color-pv)"
          radius={[3, 3, 0, 0]}
        />
        <Bar
          dataKey="uv"
          fill="var(--color-uv)"
          radius={[3, 3, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  )
}
