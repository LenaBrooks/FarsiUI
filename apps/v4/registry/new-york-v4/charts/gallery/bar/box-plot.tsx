"use client"

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  DefaultZIndexes,
  ErrorBar,
  LabelList,
  Rectangle,
  Scatter,
  XAxis,
  YAxis,
  type BarShapeProps,
  type TooltipContentProps,
  type TooltipIndex,
} from "recharts"

import { useChartCaption } from "@/lib/chart-live"
import {
  CHART_BAR_COLORS,
  chartBarContainerClassName,
  formatPersianNumber,
  toPersianDigits,
} from "@/lib/chart-fa"
import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

type BoxPlotDatum = {
  category: string
  min: number
  q1: number
  median: number
  q3: number
  max: number
}

/** نمره از ۰ تا ۲۰ — هر ستون پراکندگی نمرات یک درس را نشان می‌دهد. */
const data: ReadonlyArray<BoxPlotDatum> = [
  { category: "ریاضی", min: 8, q1: 12, median: 15, q3: 17, max: 19 },
  { category: "فیزیک", min: 6, q1: 10, median: 13, q3: 16, max: 18 },
  { category: "شیمی", min: 9, q1: 13, median: 16, q3: 18, max: 20 },
  { category: "زبان", min: 7, q1: 11, median: 14, q3: 17, max: 20 },
]

type OutlierDatum = {
  category: string
  value: number
}

/** نمره‌های خیلی دور از بقیه */
const outliers: ReadonlyArray<OutlierDatum> = [
  { category: "ریاضی", value: 3 },
  { category: "فیزیک", value: 2 },
  { category: "شیمی", value: 4 },
  { category: "زبان", value: 1 },
]

const chartConfig = {
  box: { label: "نیمهٔ میانی نمرات", color: CHART_BAR_COLORS[0] },
  outlier: { label: "نمرهٔ غیرعادی", color: CHART_BAR_COLORS[1] },
} satisfies ChartConfig

const boxDataKey = (entry: BoxPlotDatum): [number, number] => [
  entry.q1,
  entry.q3,
]

const whiskerDataKey = (entry: BoxPlotDatum): [number, number] => [
  entry.q3 - entry.min,
  entry.max - entry.q3,
]

function BoxShape(props: BarShapeProps) {
  // @ts-expect-error Recharts spreads datum on the props
  const entry: BoxPlotDatum = props
  const quartileRange = entry.q3 - entry.q1
  const medianOffset =
    quartileRange === 0
      ? Number(props.height) / 2
      : ((entry.q3 - entry.median) / quartileRange) * Number(props.height)
  const medianY = Number(props.y) + medianOffset

  return (
    <g>
      <Rectangle
        x={props.x}
        y={props.y}
        width={props.width}
        height={props.height}
        fill="var(--color-box)"
        radius={3}
      />
      <line
        x1={props.x}
        x2={Number(props.x) + Number(props.width)}
        y1={medianY}
        y2={medianY}
        stroke="var(--foreground)"
        strokeWidth={2.5}
      />
    </g>
  )
}

function medianLabel(props: {
  x?: string | number
  y?: string | number
  width?: string | number
  height?: string | number
  value?: string | number
  index?: number
}) {
  const entry = data[props.index ?? -1]
  if (!entry) return null
  const x = Number(props.x) + Number(props.width) / 2
  const h = Number(props.height)
  const quartileRange = entry.q3 - entry.q1
  const medianOffset =
    quartileRange === 0 ? h / 2 : ((entry.q3 - entry.median) / quartileRange) * h
  const y = Number(props.y) + medianOffset - 8
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      className="fill-foreground text-[11px] font-medium"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      وسط: {toPersianDigits(entry.median)}
    </text>
  )
}

function TooltipContent(props: TooltipContentProps) {
  const { active, payload } = props
  if (!(active && payload?.length)) return null
  const entry = payload[0]?.payload as BoxPlotDatum | undefined
  if (!entry?.category || entry.median == null) return null

  const rows = [
    { label: "کمترین", value: entry.min },
    { label: "یک‌چهارم پایین", value: entry.q1 },
    { label: "نمرهٔ وسط", value: entry.median },
    { label: "یک‌چهارم بالا", value: entry.q3 },
    { label: "بیشترین", value: entry.max },
  ]

  return (
    <div className="min-w-[10.5rem] rounded-lg border bg-background px-3 py-2.5 text-xs shadow-md font-sans">
      <p className="mb-2 font-medium text-foreground">{entry.category}</p>
      <ul className="space-y-1">
        {rows.map((row) => (
          <li
            key={row.label}
            className="flex items-center justify-between gap-4"
          >
            <span className="text-muted-foreground">{row.label}</span>
            <span className="font-medium tabular-nums text-foreground">
              {toPersianDigits(row.value)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function KeyLegend() {
  return (
    <ul className="mx-auto flex max-w-[26rem] flex-col gap-1.5 text-[12px] leading-relaxed text-muted-foreground sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-5">
      <li className="inline-flex items-center gap-2">
        <span
          className="h-3 w-5 shrink-0 rounded-sm"
          style={{ background: CHART_BAR_COLORS[0] }}
          aria-hidden
        />
        جعبه آبی = جایی که بیشتر نمرات جمع شده
      </li>
      <li className="inline-flex items-center gap-2">
        <span className="h-0.5 w-5 shrink-0 bg-foreground" aria-hidden />
        خط تیره = نمرهٔ وسط کلاس
      </li>
      <li className="inline-flex items-center gap-2">
        <span
          className="size-2 shrink-0 rounded-full"
          style={{ background: CHART_BAR_COLORS[1] }}
          aria-hidden
        />
        نقطهٔ صورتی = نمرهٔ خیلی پرت
      </li>
    </ul>
  )
}

export default function BoxPlotDemo({
  defaultIndex,
}: {
  defaultIndex?: TooltipIndex
}) {
  useChartCaption(
    () =>
      "هر ستون یک درس است. جعبه آبی جایی است که بیشتر بچه‌ها نمره گرفته‌اند؛ خط تیره = نمرهٔ وسط؛ نقطهٔ صورتی = نمرهٔ خیلی پرت."
  )

  return (
    <div
      dir="rtl"
      className="flex w-full max-w-[700px] flex-col gap-3 font-sans"
    >
      <p className="text-center text-sm font-medium text-foreground">
        پراکندگی نمرات کلاس (از ۰ تا ۲۰)
      </p>
      <ChartContainer
        config={chartConfig}
        className={cn(chartBarContainerClassName, "max-w-none aspect-[1.55]")}
      >
        <ComposedChart
          accessibilityLayer
          data={data as BoxPlotDatum[]}
          margin={{ top: 28, right: 8, left: 4, bottom: 4 }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="category"
            type="category"
            allowDuplicatedCategory={false}
            reversed
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tick={{ fontSize: 12, fontFamily: "var(--font-sans)" }}
          />
          <YAxis
            orientation="right"
            domain={[0, 20]}
            width={36}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(v) => formatPersianNumber(v)}
          />
          <Bar dataKey={boxDataKey} shape={BoxShape} fillOpacity={1} isAnimationActive={false}>
            <LabelList content={medianLabel} />
            <ErrorBar
              dataKey={whiskerDataKey}
              width={14}
              stroke="var(--muted-foreground)"
              strokeWidth={1.5}
              zIndex={DefaultZIndexes.bar - 1}
            />
          </Bar>
          <Scatter
            data={outliers as OutlierDatum[]}
            dataKey="value"
            fill="var(--color-outlier)"
            stroke="none"
            r={4}
            isAnimationActive={false}
          />
          <ChartTooltip content={TooltipContent} defaultIndex={defaultIndex} />
        </ComposedChart>
      </ChartContainer>
      <KeyLegend />
    </div>
  )
}
