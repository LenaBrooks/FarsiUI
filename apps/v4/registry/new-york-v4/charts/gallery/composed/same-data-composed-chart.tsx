"use client"

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts"

import {
  CHART_BAR_COLORS,
  FA_MONTHS,
  chartContainerClassName,
  chartDashedGridClassName,
  toPersianDigits,
} from "@/lib/chart-fa"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

type Row = { month: string; sales: number }

const data: Row[] = [
  { month: FA_MONTHS[0], sales: 12.4 },
  { month: FA_MONTHS[1], sales: 14.8 },
  { month: FA_MONTHS[2], sales: 13.2 },
  { month: FA_MONTHS[3], sales: 16.5 },
  { month: FA_MONTHS[4], sales: 15.1 },
  { month: FA_MONTHS[5], sales: 17.8 },
  { month: "مهر", sales: 16.2 },
]

const chartConfig = {
  sales: { label: "فروش", color: CHART_BAR_COLORS[0] },
  trend: { label: "روند", color: CHART_BAR_COLORS[1] },
} satisfies ChartConfig

function TooltipContent({ active, payload, label }: TooltipContentProps) {
  if (!(active && payload?.length)) return null
  const value = payload.find((p) => p.dataKey === "sales")?.value
  if (typeof value !== "number") return null
  return (
    <div className="rounded-lg border bg-background px-3 py-2 text-xs shadow-md font-sans tracking-[0]">
      <p className="mb-1 font-medium text-foreground">{String(label)}</p>
      <p className="text-muted-foreground">
        فروش:{" "}
        <span className="font-medium text-foreground">
          {toPersianDigits(value.toFixed(1))} میلیون تومان
        </span>
      </p>
    </div>
  )
}

export default function SameDataComposedChartDemo() {
  return (
    <ChartContainer
      config={chartConfig}
      className={`${chartContainerClassName} ${chartDashedGridClassName} max-w-none`}
    >
      <ComposedChart
        accessibilityLayer
        data={data}
        margin={{ top: 12, right: 8, bottom: 4, left: 4 }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          scale="band"
          reversed
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tick={{ fontSize: 12, fontFamily: "var(--font-sans)", letterSpacing: 0 }}
        />
        <YAxis
          orientation="right"
          width={36}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          domain={[0, 20]}
          tickFormatter={(v) => toPersianDigits(v)}
          tick={{ fontSize: 11, fontFamily: "var(--font-sans)", letterSpacing: 0 }}
        />
        <ChartTooltip content={TooltipContent} />
        <Bar
          dataKey="sales"
          barSize={28}
          fill="var(--color-sales)"
          radius={[4, 4, 0, 0]}
          name="فروش"
        />
        <Line
          type="monotone"
          dataKey="sales"
          stroke={CHART_BAR_COLORS[1]}
          strokeWidth={2}
          dot={{ r: 3, fill: CHART_BAR_COLORS[1], strokeWidth: 0 }}
          activeDot={{ r: 4 }}
          name="روند"
        />
      </ComposedChart>
    </ChartContainer>
  )
}
