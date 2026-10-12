"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ReferenceLine,
  XAxis,
  YAxis,
  type LabelProps,
} from "recharts"

import {
  FA_MONTHS,
  chart2ContainerClassName,
  formatChart2Number,
  formatPersianNumber,
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
  { name: FA_MONTHS[0], data1: 4000, data2: 2400, data3: 1500 },
  { name: FA_MONTHS[1], data1: 9000, data2: 1398, data3: 2500 },
  { name: FA_MONTHS[2], data1: 2000, data2: 9800, data3: 4200 },
  { name: FA_MONTHS[3], data1: 2780, data2: 3908, data3: 1300 },
  { name: FA_MONTHS[4], data1: 1890, data2: 4800, data3: 5400 },
  { name: FA_MONTHS[5], data1: 2390, data2: 8800, data3: 1500 },
  { name: "مهر", data1: 3490, data2: 4300, data3: 2600 },
]

const chartConfig = {
  data1: { label: "سری ۱", color: "var(--chart-1)" },
  data2: { label: "سری ۲", color: "var(--chart-2)" },
  data3: { label: "سری ۳", color: "var(--chart-3)" },
} satisfies ChartConfig

const THRESHOLD = 18000

type DataPoint = (typeof data)[number]

function StackTotalLabel(props: LabelProps) {
  const { x, y, width, value } = props
  const total = Number(value)
  if (x == null || y == null || width == null || Number.isNaN(total)) return null

  const label = formatPersianNumber(total, { useGrouping: true })
  const cx = Number(x) + Number(width) / 2
  const cy = Number(y) - 18
  const boxWidth = Math.max(label.length * 7 + 16, 36)
  const boxHeight = 22

  return (
    <g>
      <rect
        x={cx - boxWidth / 2}
        y={cy - boxHeight / 2}
        width={boxWidth}
        height={boxHeight}
        rx={6}
        fill="var(--background)"
        stroke="var(--border)"
        strokeWidth={1.5}
      />
      <text
        x={cx}
        y={cy}
        fill="var(--foreground)"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={11}
        style={{ fontFamily: "var(--font-sans)" }}
      >
        {label}
      </text>
    </g>
  )
}

export default function StackedBarChartWithHorizontalLineDemo() {
  return (
    <ChartContainer config={chartConfig} className={chart2ContainerClassName}>
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ top: 40, right: 8, left: 8, bottom: 5 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis dataKey="name" reversed tickMargin={8} />
        <YAxis
          orientation="right"
          width={56}
          tickMargin={10}
          tickFormatter={formatChart2Number}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <ReferenceLine
          y={THRESHOLD}
          stroke="var(--destructive)"
          strokeWidth={2}
          label={{
            value: "آستانه",
            fill: "var(--destructive)",
            position: "insideTopLeft",
            fontFamily: "var(--font-sans)",
          }}
        />
        <Bar dataKey="data1" stackId="a" fill="var(--color-data1)" />
        <Bar dataKey="data2" stackId="a" fill="var(--color-data2)" />
        <Bar dataKey="data3" stackId="a" fill="var(--color-data3)">
          <LabelList
            content={StackTotalLabel}
            position="top"
            offset={8}
            valueAccessor={(entry) => {
              const point = entry.payload as DataPoint
              return point.data1 + point.data2 + point.data3
            }}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
