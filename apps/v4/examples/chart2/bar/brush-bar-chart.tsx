"use client"

import {
  Bar,
  BarChart,
  Brush,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"

import {
  FA_CHART,
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
  { name: "۱", uv: 300, pv: 456 },
  { name: "۲", uv: -145, pv: 230 },
  { name: "۳", uv: -100, pv: 345 },
  { name: "۴", uv: -8, pv: 450 },
  { name: "۵", uv: 100, pv: 321 },
  { name: "۶", uv: 9, pv: 235 },
  { name: "۷", uv: 53, pv: 267 },
  { name: "۸", uv: 252, pv: -378 },
  { name: "۹", uv: 79, pv: -210 },
  { name: "۱۰", uv: 294, pv: -23 },
  { name: "۱۲", uv: 43, pv: 45 },
  { name: "۱۳", uv: -74, pv: 90 },
  { name: "۱۴", uv: -71, pv: 130 },
  { name: "۱۵", uv: -117, pv: 11 },
  { name: "۱۶", uv: -186, pv: 107 },
  { name: "۱۷", uv: -16, pv: 926 },
  { name: "۱۸", uv: -125, pv: 653 },
  { name: "۱۹", uv: 222, pv: 366 },
  { name: "۲۰", uv: 372, pv: 486 },
  { name: "۲۱", uv: 182, pv: 512 },
  { name: "۲۲", uv: 164, pv: 302 },
  { name: "۲۳", uv: 316, pv: 425 },
  { name: "۲۴", uv: 131, pv: 467 },
  { name: "۲۵", uv: 291, pv: -190 },
  { name: "۲۶", uv: -47, pv: 194 },
  { name: "۲۷", uv: -415, pv: 371 },
  { name: "۲۸", uv: -182, pv: 376 },
  { name: "۲۹", uv: -93, pv: 295 },
  { name: "۳۰", uv: -99, pv: 322 },
  { name: "۳۱", uv: -52, pv: 246 },
  { name: "۳۲", uv: 154, pv: 33 },
  { name: "۳۳", uv: 205, pv: 354 },
  { name: "۳۴", uv: 70, pv: 258 },
  { name: "۳۵", uv: -25, pv: 359 },
  { name: "۳۶", uv: -59, pv: 192 },
  { name: "۳۷", uv: -63, pv: 464 },
  { name: "۳۸", uv: -91, pv: -2 },
  { name: "۳۹", uv: -66, pv: 154 },
  { name: "۴۰", uv: -50, pv: 186 },
]

const chartConfig = {
  pv: { label: FA_CHART.online, color: "var(--chart-1)" },
  uv: { label: FA_CHART.store, color: "var(--chart-2)" },
} satisfies ChartConfig

export default function BrushBarChartDemo() {
  return (
    <ChartContainer config={chartConfig} className={chart2ContainerClassName}>
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ top: 5, right: 8, left: 0, bottom: 5 }}
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
        <ChartLegend content={<ChartLegendContent />} verticalAlign="top" />
        <ReferenceLine y={0} stroke="var(--border)" />
        <Brush
          dataKey="name"
          height={30}
          stroke="var(--color-pv)"
          fill="var(--muted)"
          travellerWidth={8}
        />
        <Bar dataKey="pv" fill="var(--color-pv)" />
        <Bar dataKey="uv" fill="var(--color-uv)" />
      </BarChart>
    </ChartContainer>
  )
}
