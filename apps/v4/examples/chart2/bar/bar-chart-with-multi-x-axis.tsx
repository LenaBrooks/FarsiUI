"use client"

import type { ReactNode } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Text,
  XAxis,
  YAxis,
  type XAxisTickContentProps,
} from "recharts"

import {
  CHART2_BAR_COLORS,
  FA_CHART,
  FA_MONTHS_FULL,
  chart2BarContainerClassName,
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

const values = [
  [4000, 2400],
  [3000, 1398],
  [2000, 9800],
  [2780, 3908],
  [1890, 4800],
  [2390, 3800],
  [3490, 4300],
  [4000, 2400],
  [3000, 1398],
  [2000, 9800],
  [2780, 3908],
  [1890, 4800],
]

const data = FA_MONTHS_FULL.map((month, i) => ({
  date: month,
  monthIndex: i,
  uv: values[i]![0],
  pv: values[i]![1],
}))

const chartConfig = {
  pv: { label: FA_CHART.online, color: CHART2_BAR_COLORS[0] },
  uv: { label: FA_CHART.store, color: CHART2_BAR_COLORS[1] },
} satisfies ChartConfig

const quarterLabels = ["سه‌ماههٔ ۱", "سه‌ماههٔ ۲", "سه‌ماههٔ ۳", "سه‌ماههٔ ۴"]

function renderQuarterTick(tickProps: XAxisTickContentProps): ReactNode {
  const { x: xProp, y: yProp, payload, width: widthProp, visibleTicksCount } = tickProps
  const x = Number(xProp)
  const y = Number(yProp)
  const width = Number(widthProp)
  const { offset = 0 } = payload
  const monthIndex = Math.max(
    0,
    data.findIndex((d) => d.date === payload.value)
  )
  const quarterNo = Math.floor(monthIndex / 3)

  if (monthIndex % 3 === 1) {
    return (
      <Text
        x={x + width / visibleTicksCount / 2 - offset}
        y={y - 4}
        textAnchor="middle"
        style={{ fontFamily: "var(--font-sans)", fontSize: 11 }}
        fill="var(--muted-foreground)"
      >
        {quarterLabels[quarterNo]}
      </Text>
    )
  }

  const isLast = monthIndex === 11
  if (monthIndex % 3 === 0 || isLast) {
    const pathX =
      Math.floor(isLast ? x - offset + width / visibleTicksCount : x - offset) + 0.5
    return <path d={`M${pathX},${y - 4}v${-35}`} stroke="var(--destructive)" />
  }
  return null
}

export default function BarChartWithMultiXAxisDemo() {
  return (
    <ChartContainer config={chartConfig} className={chart2BarContainerClassName}>
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ top: 25, right: 8, left: 0, bottom: 5 }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          reversed
          tickMargin={8}
          tickFormatter={(v) => {
            const i = FA_MONTHS_FULL.indexOf(v as (typeof FA_MONTHS_FULL)[number])
            return toPersianDigits(String(i >= 0 ? i + 1 : v))
          }}
        />
        <XAxis
          dataKey="date"
          xAxisId="quarter"
          axisLine={false}
          tickLine={false}
          interval={0}
          tick={renderQuarterTick}
          height={1}
          scale="band"
          reversed
        />
        <YAxis
          orientation="right"
          width={52}
          tickMargin={12}
          tickFormatter={formatChart2Number}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="pv" fill="var(--color-pv)" radius={[3, 3, 0, 0]} />
        <Bar dataKey="uv" fill="var(--color-uv)" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}
