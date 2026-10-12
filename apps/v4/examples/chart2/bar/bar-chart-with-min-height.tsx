"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
  type LabelProps,
} from "recharts"

import {
  FA_CHART,
  FA_MONTHS,
  chart2ContainerClassName,
  formatChart2Number,
  toPersianDigits,
} from "@/lib/chart2-fa"
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
  { name: FA_MONTHS[1], uv: 3000, pv: 1398 },
  { name: FA_MONTHS[2], uv: 2000, pv: 8 },
  { name: FA_MONTHS[3], uv: 2780, pv: 3908 },
  { name: FA_MONTHS[4], uv: 18, pv: 4800 },
  { name: FA_MONTHS[5], uv: 2390, pv: 3800 },
  { name: "مهر", uv: 3490, pv: 4300 },
]

const chartConfig = {
  pv: { label: FA_CHART.online, color: "var(--chart-1)" },
  uv: { label: FA_CHART.store, color: "var(--chart-2)" },
} satisfies ChartConfig

function renderCustomizedLabel(props: LabelProps) {
  const { x, y, width, value } = props
  if (x == null || y == null || width == null) return null
  const radius = 10
  const text = toPersianDigits(String(value).slice(0, 1))

  return (
    <g>
      <circle
        cx={Number(x) + Number(width) / 2}
        cy={Number(y) - radius}
        r={radius}
        fill="var(--color-pv)"
      />
      <text
        x={Number(x) + Number(width) / 2}
        y={Number(y) - radius}
        fill="var(--primary-foreground)"
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ fontFamily: "var(--font-sans)", fontSize: 10 }}
      >
        {text}
      </text>
    </g>
  )
}

export default function BarChartWithMinHeightDemo() {
  return (
    <ChartContainer config={chartConfig} className={chart2ContainerClassName}>
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ top: 25, right: 8, left: 0, bottom: 5 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis dataKey="name" reversed tickMargin={8} />
        <YAxis
          orientation="right"
          width={52}
          tickMargin={12}
          tickFormatter={formatChart2Number}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="pv" fill="var(--color-pv)" minPointSize={5} radius={[3, 3, 0, 0]}>
          <LabelList dataKey="name" content={renderCustomizedLabel} />
        </Bar>
        <Bar dataKey="uv" fill="var(--color-uv)" minPointSize={10} radius={[3, 3, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}
