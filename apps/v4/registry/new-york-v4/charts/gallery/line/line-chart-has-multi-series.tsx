"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import type { LineProps } from "recharts"

import { CHART_BAR_COLORS } from "@/lib/chart-fa"
import {
  CHART_TOMAN_AXIS_WIDTH,
  FA_MONTHS,
  formatPersianMonthTick,
  formatToman,
} from "@/lib/chart-locale"
import { TomanAxisTick } from "@/lib/chart-toman-tick"
import { useChartCaption } from "@/registry/new-york-v4/lib/chart-live"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

import { LINE_CHART_CLASS, LINE_TOOLTIP_CURSOR } from "./line-fa-shared"

const series = [
  {
    name: "شعبه تهران",
    dataKey: "s1",
    data: [
      { category: FA_MONTHS[0], value: 120_000_000 },
      { category: FA_MONTHS[1], value: 180_000_000 },
      { category: FA_MONTHS[2], value: 150_000_000 },
    ],
  },
  {
    name: "شعبه اصفهان",
    dataKey: "s2",
    data: [
      { category: FA_MONTHS[1], value: 90_000_000 },
      { category: FA_MONTHS[2], value: 140_000_000 },
      { category: FA_MONTHS[3], value: 160_000_000 },
    ],
  },
  {
    name: "شعبه شیراز",
    dataKey: "s3",
    data: [
      { category: FA_MONTHS[2], value: 70_000_000 },
      { category: FA_MONTHS[3], value: 110_000_000 },
      { category: FA_MONTHS[4], value: 130_000_000 },
    ],
  },
]

const chartConfig = {
  s1: { label: "شعبه تهران", color: CHART_BAR_COLORS[0] },
  s2: { label: "شعبه اصفهان", color: CHART_BAR_COLORS[1] },
  s3: { label: "شعبه شیراز", color: CHART_BAR_COLORS[2] },
} satisfies ChartConfig

const COLORS = [
  CHART_BAR_COLORS[0],
  CHART_BAR_COLORS[1],
  CHART_BAR_COLORS[2],
]

function MyLine(props: LineProps & { index: number }) {
  const { index, ...rest } = props
  return (
    <Line
      stroke={COLORS[index % COLORS.length]}
      strokeWidth={2.4}
      dot={false}
      {...rest}
    />
  )
}

export default function LineChartHasMultiSeriesDemo({
  defaultIndex,
}: {
  defaultIndex?: number
}) {
  useChartCaption(() => "چند سری · فروش شعب · ماه‌های شمسی", [])

  return (
    <div dir="rtl" className="w-full max-w-[700px] font-sans">
      <ChartContainer config={chartConfig} className={LINE_CHART_CLASS}>
        <LineChart accessibilityLayer>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="category"
            type="category"
            allowDuplicatedCategory={false}
            reversed
            tickLine={false}
            axisLine={false}
            tickMargin={12}
            tickFormatter={formatPersianMonthTick}
          />
          <YAxis
            orientation="right"
            width={CHART_TOMAN_AXIS_WIDTH}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={TomanAxisTick}
          />
          <ChartTooltip
            defaultIndex={defaultIndex}
            cursor={LINE_TOOLTIP_CURSOR}
            content={
              <ChartTooltipContent
                className="min-w-[12rem]"
                labelFormatter={(label) => (
                  <span className="text-muted-foreground">ماه {label}</span>
                )}
                formatter={(value, name) => {
                  const key = String(name)
                  const label =
                    chartConfig[key as keyof typeof chartConfig]?.label ?? key
                  return (
                    <div className="flex w-full flex-1 items-center justify-between gap-6">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium tracking-[0]">
                        {formatToman(Number(value), { compact: true })}
                      </span>
                    </div>
                  )
                }}
              />
            }
          />
          <ChartLegend content={<ChartLegendContent />} />
          {series.map((s, index) => (
            <MyLine
              key={s.dataKey}
              dataKey={s.dataKey}
              data={s.data.map((d) => ({
                category: d.category,
                [s.dataKey]: d.value,
              }))}
              name={s.name}
              index={index}
            />
          ))}
        </LineChart>
      </ChartContainer>
    </div>
  )
}
