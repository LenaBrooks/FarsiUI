"use client"

import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts"

import {
  CHART2_BAR_COLORS,
  FA_MONTHS,
  chart2ContainerClassName,
  chart2DashedGridClassName,
  toPersianDigits,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

type Row = {
  month: string
  revenue: number
  cost: number
  margin: number
}

/** درآمد و هزینه — میلیون تومان؛ حاشیه — درصد */
const data: Row[] = [
  { month: FA_MONTHS[0], revenue: 42, cost: 28, margin: 33 },
  { month: FA_MONTHS[1], revenue: 48, cost: 31, margin: 35 },
  { month: FA_MONTHS[2], revenue: 45, cost: 30, margin: 33 },
  { month: FA_MONTHS[3], revenue: 52, cost: 34, margin: 35 },
  { month: FA_MONTHS[4], revenue: 49, cost: 33, margin: 33 },
  { month: FA_MONTHS[5], revenue: 58, cost: 36, margin: 38 },
]

const chartConfig = {
  revenue: { label: "درآمد", color: CHART2_BAR_COLORS[0] },
  cost: { label: "هزینه", color: CHART2_BAR_COLORS[1] },
  margin: { label: "حاشیه٪", color: CHART2_BAR_COLORS[2] },
} satisfies ChartConfig

function TooltipContent({ active, payload, label }: TooltipContentProps) {
  if (!(active && payload?.length)) return null
  return (
    <div className="min-w-[10.5rem] rounded-lg border bg-background px-3 py-2.5 text-xs shadow-md font-sans tracking-[0]">
      <p className="mb-2 font-medium text-foreground">{String(label)}</p>
      <ul className="space-y-1">
        {payload.map((item) => {
          const key = String(item.dataKey)
          const cfg = chartConfig[key as keyof typeof chartConfig]
          if (!cfg || typeof item.value !== "number") return null
          return (
            <li key={key} className="flex items-center justify-between gap-4">
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <span
                  className="size-2 rounded-full"
                  style={{ background: cfg.color }}
                />
                {cfg.label}
              </span>
              <span className="font-medium text-foreground">
                {key === "margin"
                  ? `${toPersianDigits(item.value)}٪`
                  : `${toPersianDigits(item.value)} م`}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default function ComposedChartWithAxisLabelsDemo() {
  return (
    <ChartContainer
      config={chartConfig}
      className={`${chart2ContainerClassName} ${chart2DashedGridClassName} max-w-none`}
    >
      <ComposedChart
        accessibilityLayer
        data={data}
        margin={{ top: 12, right: 12, bottom: 28, left: 8 }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          scale="band"
          reversed
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={{ fontSize: 12, fontFamily: "var(--font-sans)", letterSpacing: 0 }}
          label={{
            value: "ماه",
            position: "insideBottom",
            offset: -16,
            style: {
              fontFamily: "var(--font-sans)",
              fontSize: 11,
              fill: "var(--muted-foreground)",
            },
          }}
        />
        <YAxis
          yAxisId="money"
          orientation="right"
          width={44}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          domain={[0, 70]}
          tickFormatter={(v) => toPersianDigits(v)}
          tick={{ fontSize: 11, fontFamily: "var(--font-sans)", letterSpacing: 0 }}
          label={{
            value: "میلیون تومان",
            angle: 90,
            position: "insideRight",
            offset: 0,
            style: {
              fontFamily: "var(--font-sans)",
              fontSize: 11,
              fill: "var(--muted-foreground)",
            },
          }}
        />
        <YAxis
          yAxisId="pct"
          orientation="left"
          width={36}
          tickLine={false}
          axisLine={false}
          tickMargin={6}
          domain={[0, 50]}
          tickFormatter={(v) => `${toPersianDigits(v)}٪`}
          tick={{ fontSize: 11, fontFamily: "var(--font-sans)", letterSpacing: 0 }}
        />
        <ChartTooltip content={TooltipContent} />
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          yAxisId="money"
          type="monotone"
          dataKey="revenue"
          fill="var(--color-revenue)"
          stroke="var(--color-revenue)"
          fillOpacity={0.16}
          strokeWidth={1.5}
          dot={false}
        />
        <Bar
          yAxisId="money"
          dataKey="cost"
          barSize={20}
          fill="var(--color-cost)"
          radius={[3, 3, 0, 0]}
        />
        <Line
          yAxisId="pct"
          type="monotone"
          dataKey="margin"
          stroke="var(--color-margin)"
          strokeWidth={2}
          dot={{ r: 3, fill: "var(--color-margin)", strokeWidth: 0 }}
        />
      </ComposedChart>
    </ChartContainer>
  )
}
