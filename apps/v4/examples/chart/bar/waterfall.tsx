"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
  XAxis,
  YAxis,
  type BarShapeProps,
  type TooltipContentProps,
} from "recharts"

import {
  CHART_BAR_COLORS,
  CHART_DOWN,
  chartBarContainerClassName,
  formatPersianNumber,
  toPersianDigits,
} from "@/lib/chart-fa"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

type RawEntry = { name: string; value: number; isTotal?: boolean }

interface WaterfallDatum {
  name: string
  value: number
  waterfallRange: [number, number]
  isTotal: boolean
}

function computeWaterfallData(raw: ReadonlyArray<RawEntry>): WaterfallDatum[] {
  let runningTotal = 0

  return raw.map((entry) => {
    const { value, isTotal = false } = entry
    let barBottom: number
    let barTop: number

    if (isTotal) {
      barBottom = Math.min(0, value)
      barTop = Math.max(0, value)
    } else if (value >= 0) {
      barBottom = runningTotal
      barTop = runningTotal + value
    } else {
      barBottom = runningTotal + value
      barTop = runningTotal
    }

    if (!isTotal) {
      runningTotal += value
    }

    return {
      name: entry.name,
      value,
      waterfallRange: [barBottom, barTop] as [number, number],
      isTotal,
    }
  })
}

const rawData: ReadonlyArray<RawEntry> = [
  { name: "درآمد", value: 420 },
  { name: "خدمات", value: 210 },
  { name: "هزینهٔ ثابت", value: -170 },
  { name: "هزینهٔ متغیر", value: -120 },
  { name: "مالیات", value: -60 },
  { name: "سود", value: 280, isTotal: true },
]

const waterfallData = computeWaterfallData(rawData)

function getBarColor(
  entry: WaterfallDatum,
  colors: { total: string; up: string; down: string }
): string {
  if (entry.isTotal) return colors.total
  return entry.value >= 0 ? colors.up : colors.down
}

function WaterfallBar({
  colors,
  ...props
}: BarShapeProps & {
  colors: { total: string; up: string; down: string }
}) {
  // @ts-expect-error Recharts spreads the data entry on the shape props
  const entry = props as WaterfallDatum
  const color = getBarColor(entry, colors)
  return (
    <Rectangle
      {...props}
      fill={color}
      radius={[3, 3, 0, 0]}
    />
  )
}

function WaterfallTooltip({ active, payload }: TooltipContentProps) {
  if (!(active && payload && payload.length)) return null
  const firstPayload = payload[0]
  if (firstPayload == null) return null
  const entry = firstPayload.payload as WaterfallDatum
  const sign = entry.value >= 0 ? "+" : ""
  return (
    <div className="rounded-lg border bg-background px-3 py-2 text-xs shadow-xl font-sans">
      <p className="mb-1 font-medium">{entry.name}</p>
      <p className="text-muted-foreground">
        مقدار: {toPersianDigits(`${sign}${entry.value}`)}
      </p>
      {entry.isTotal ? (
        <p className="mt-0.5 italic text-muted-foreground">جمع کل</p>
      ) : null}
    </div>
  )
}

export default function WaterfallDemo() {
  const colors = {
    total: CHART_BAR_COLORS[0],
    up: CHART_BAR_COLORS[1],
    down: CHART_DOWN,
  }

  const chartConfig = {
    waterfallRange: { label: "مقدار", color: colors.total },
  } satisfies ChartConfig

  return (
    <ChartContainer
      config={chartConfig}
      className={chartBarContainerClassName}
    >
      <BarChart
        accessibilityLayer
        data={waterfallData}
        margin={{ top: 20, right: 12, bottom: 5, left: 8 }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="name" reversed tickMargin={8} />
        <YAxis
          orientation="right"
          width={48}
          tickMargin={10}
          tickFormatter={(v) => formatPersianNumber(v)}
        />
        <ChartTooltip content={WaterfallTooltip} />
        <Bar
          dataKey="waterfallRange"
          shape={(props) => <WaterfallBar {...props} colors={colors} />}
          isAnimationActive={false}
        />
      </BarChart>
    </ChartContainer>
  )
}
