"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  DefaultZIndexes,
  ErrorBar,
  Rectangle,
  Scatter,
  XAxis,
  YAxis,
  type BarShapeProps,
  type TooltipContentProps,
  type TooltipIndex,
} from "recharts"

import {
  CHART2_BAR_COLORS,
  chart2BarContainerClassName,
  formatPersianNumber,
} from "@/lib/chart2-fa"
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

const data: ReadonlyArray<BoxPlotDatum> = [
  { category: "گروه الف", min: 16, q1: 20, median: 24, q3: 29, max: 35 },
  { category: "گروه ب", min: 12, q1: 15, median: 18, q3: 21, max: 27 },
  { category: "گروه ج", min: 22, q1: 26, median: 30, q3: 34, max: 49 },
  { category: "گروه د", min: 9, q1: 13, median: 17, q3: 20, max: 26 },
  { category: "گروه هـ", min: 18, q1: 22, median: 25, q3: 28, max: 32 },
]

type OutlierDatum = {
  category: string
  value: number
}

const outliers: ReadonlyArray<OutlierDatum> = [
  { category: "گروه الف", value: 10 },
  { category: "گروه الف", value: 11 },
  { category: "گروه الف", value: 12 },
  { category: "گروه الف", value: 5 },
  { category: "گروه ب", value: 0 },
  { category: "گروه الف", value: 40 },
  { category: "گروه د", value: 8 },
  { category: "گروه هـ", value: 33 },
]

const chartConfig = {
  box: { label: "بازهٔ میان‌چارکی", color: CHART2_BAR_COLORS[0] },
  outlier: { label: "نقطهٔ پرت", color: "var(--destructive)" },
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
      <Rectangle {...props} fill="var(--color-box)" />
      <line
        x1={props.x}
        x2={Number(props.x) + Number(props.width)}
        y1={medianY}
        y2={medianY}
        stroke="var(--foreground)"
        strokeWidth={2}
      />
    </g>
  )
}

function TooltipContent(props: TooltipContentProps) {
  const { active, payload } = props
  if (!(active && payload && payload.length)) return null
  const firstPayload = payload[0]
  if (firstPayload == null) return null
  const entry = firstPayload.payload as BoxPlotDatum
  if (!entry?.category || entry.median == null) return null
  return (
    <div className="rounded-lg border bg-background px-3 py-2 text-xs shadow-xl font-sans">
      <p className="mb-1 font-medium">{entry.category}</p>
      <p className="text-muted-foreground">
        کمینه: {formatPersianNumber(entry.min)}
      </p>
      <p className="text-muted-foreground">
        چارک اول: {formatPersianNumber(entry.q1)}
      </p>
      <p className="text-muted-foreground">
        میانه: {formatPersianNumber(entry.median)}
      </p>
      <p className="text-muted-foreground">
        چارک سوم: {formatPersianNumber(entry.q3)}
      </p>
      <p className="text-muted-foreground">
        بیشینه: {formatPersianNumber(entry.max)}
      </p>
    </div>
  )
}

export default function BoxPlotDemo({
  defaultIndex,
}: {
  defaultIndex?: TooltipIndex
}) {
  return (
    <ChartContainer config={chartConfig} className={chart2BarContainerClassName}>
      <BarChart accessibilityLayer data={data as BoxPlotDatum[]}>
        <XAxis
          dataKey="category"
          reversed
          allowDuplicatedCategory={false}
          tickMargin={8}
        />
        <YAxis
          orientation="right"
          width={44}
          tickMargin={10}
          tickFormatter={(v) => formatPersianNumber(v)}
        />
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <Bar dataKey={boxDataKey} shape={BoxShape} fillOpacity={1}>
          <ErrorBar
            dataKey={whiskerDataKey}
            width={0}
            zIndex={DefaultZIndexes.bar - 1}
          />
        </Bar>
        <Scatter
          data={outliers as OutlierDatum[]}
          dataKey="value"
          fill="var(--color-outlier)"
          stroke="none"
        />
        <ChartTooltip content={TooltipContent} defaultIndex={defaultIndex} />
      </BarChart>
    </ChartContainer>
  )
}
