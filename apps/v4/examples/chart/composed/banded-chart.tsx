"use client"

import {
  Area,
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

type Row = {
  month: string
  /** [حد پایین، حد بالا] بازهٔ اطمینان */
  band: [number, number]
  actual: number
}

const data: Row[] = [
  { month: FA_MONTHS[0], band: [10, 14], actual: 12.2 },
  { month: FA_MONTHS[1], band: [11, 16], actual: 13.8 },
  { month: FA_MONTHS[2], band: [12, 17], actual: 14.1 },
  { month: FA_MONTHS[3], band: [13, 19], actual: 16.4 },
  { month: FA_MONTHS[4], band: [14, 20], actual: 15.6 },
  { month: FA_MONTHS[5], band: [15, 22], actual: 18.2 },
  { month: "مهر", band: [16, 23], actual: 17.5 },
]

const chartConfig = {
  band: { label: "بازهٔ اطمینان", color: CHART_BAR_COLORS[0] },
  actual: { label: "فروش واقعی", color: CHART_BAR_COLORS[1] },
} satisfies ChartConfig

function TooltipContent({ active, payload, label }: TooltipContentProps) {
  if (!(active && payload?.length)) return null
  const row = payload[0]?.payload as Row | undefined
  if (!row) return null
  return (
    <div className="min-w-[11rem] rounded-lg border bg-background px-3 py-2.5 text-xs shadow-md font-sans tracking-[0]">
      <p className="mb-2 font-medium text-foreground">{String(label)}</p>
      <ul className="space-y-1">
        <li className="flex justify-between gap-4">
          <span className="text-muted-foreground">فروش واقعی</span>
          <span className="font-medium text-foreground">
            {toPersianDigits(row.actual.toFixed(1))} م
          </span>
        </li>
        <li className="flex justify-between gap-4">
          <span className="text-muted-foreground">بازهٔ پیش‌بینی</span>
          <span className="font-medium text-foreground">
            {toPersianDigits(row.band[0])} — {toPersianDigits(row.band[1])} م
          </span>
        </li>
      </ul>
    </div>
  )
}

export default function BandedChartDemo() {
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
          domain={[0, 28]}
          tickFormatter={(v) => toPersianDigits(v)}
          tick={{ fontSize: 11, fontFamily: "var(--font-sans)", letterSpacing: 0 }}
        />
        <ChartTooltip content={TooltipContent} />
        <ChartLegend
          content={(props) => (
            <ChartLegendContent
              {...props}
              payload={props.payload?.filter(
                (item) => item.dataKey === "actual" || item.dataKey === "band"
              )}
            />
          )}
        />
        <Area
          type="monotone"
          dataKey="band"
          stroke="none"
          fill="var(--color-band)"
          fillOpacity={0.22}
          connectNulls
          dot={false}
          activeDot={false}
          name="بازهٔ اطمینان"
        />
        <Line
          type="monotone"
          dataKey="actual"
          stroke="var(--color-actual)"
          strokeWidth={2}
          connectNulls
          dot={{ r: 3, fill: "var(--color-actual)", strokeWidth: 0 }}
          activeDot={{ r: 4 }}
          name="فروش واقعی"
        />
      </ComposedChart>
    </ChartContainer>
  )
}
