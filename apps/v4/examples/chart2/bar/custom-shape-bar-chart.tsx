"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  LabelList,
  XAxis,
  YAxis,
  type BarShapeProps,
  type LabelProps,
} from "recharts"

import {
  FA_CHART,
  FA_MONTHS,
  chart2ContainerClassName,
  formatChart2Number,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

const colors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-1)",
  "var(--chart-2)",
]

const data = [
  { name: FA_MONTHS[0], uv: 4000 },
  { name: FA_MONTHS[1], uv: 3000 },
  { name: FA_MONTHS[2], uv: 2000 },
  { name: FA_MONTHS[3], uv: 2780 },
  { name: FA_MONTHS[4], uv: 1890 },
  { name: FA_MONTHS[5], uv: 2390 },
  { name: "مهر", uv: 3490 },
]

const chartConfig = {
  uv: { label: FA_CHART.store, color: "var(--chart-1)" },
} satisfies ChartConfig

function getPath(x: number, y: number, width: number, height: number) {
  return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3}
  ${x + width / 2}, ${y}
  C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width}, ${y + height}
  Z`
}

function TriangleBar(props: BarShapeProps) {
  const { x, y, width, height, index } = props
  const color = colors[(index ?? 0) % colors.length]
  return (
    <path
      strokeWidth={props.isActive ? 5 : 0}
      d={getPath(Number(x), Number(y), Number(width), Number(height))}
      stroke={color}
      fill={color}
      style={{ transition: "stroke-width 0.3s ease-out" }}
    />
  )
}

function CustomColorLabel(props: LabelProps) {
  const fill = colors[(props.index ?? 0) % colors.length]
  return (
    <Label
      {...props}
      fill={fill}
      value={formatChart2Number(Number(props.value))}
      style={{ fontFamily: "var(--font-sans)" }}
    />
  )
}

export default function CustomShapeBarChartDemo() {
  return (
    <ChartContainer config={chartConfig} className={chart2ContainerClassName}>
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ top: 20, right: 8, left: 0, bottom: 5 }}
      >
        <CartesianGrid vertical={false} />
        <ChartTooltip cursor={{ fillOpacity: 0.5 }} content={<ChartTooltipContent />} />
        <XAxis dataKey="name" reversed tickMargin={8} />
        <YAxis
          orientation="right"
          width={52}
          tickMargin={12}
          tickFormatter={formatChart2Number}
        />
        <Bar dataKey="uv" shape={TriangleBar} activeBar>
          <LabelList content={CustomColorLabel} position="top" />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
