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
  province: string
  sales: number
  target: number
}

/** فروش در برابر هدف — میلیون تومان */
const data: Row[] = [
  { province: "تهران", sales: 48, target: 52 },
  { province: "اصفهان", sales: 31, target: 28 },
  { province: "فارس", sales: 24, target: 26 },
  { province: "خراسان", sales: 22, target: 24 },
  { province: "البرز", sales: 18, target: 16 },
  { province: "آذربایجان", sales: 15, target: 17 },
]

const chartConfig = {
  sales: { label: "فروش", color: CHART_BAR_COLORS[0] },
  target: { label: "هدف", color: CHART_BAR_COLORS[1] },
} satisfies ChartConfig

function TooltipContent({ active, payload }: TooltipContentProps) {
  if (!(active && payload?.length)) return null
  const row = payload[0]?.payload as Row | undefined
  if (!row) return null
  const delta = row.sales - row.target
  return (
    <div className="min-w-[10rem] rounded-lg border bg-background px-3 py-2.5 text-xs shadow-md font-sans tracking-[0]">
      <p className="mb-2 font-medium text-foreground">{row.province}</p>
      <ul className="space-y-1">
        <li className="flex justify-between gap-4">
          <span className="text-muted-foreground">فروش</span>
          <span className="font-medium">{toPersianDigits(row.sales)} م</span>
        </li>
        <li className="flex justify-between gap-4">
          <span className="text-muted-foreground">هدف</span>
          <span className="font-medium">{toPersianDigits(row.target)} م</span>
        </li>
      </ul>
      <p
        className="mt-2 border-t pt-2 font-medium"
        style={{
          color: delta >= 0 ? CHART_BAR_COLORS[2] : CHART_BAR_COLORS[1],
        }}
      >
        {delta >= 0 ? "+" : "−"}
        {toPersianDigits(Math.abs(delta))} نسبت به هدف
      </p>
    </div>
  )
}

export default function VerticalComposedChartDemo() {
  return (
    <ChartContainer
      config={chartConfig}
      className={`aspect-[1.15] h-auto w-full max-w-[520px] max-h-[70vh] font-sans text-xs ${chartDashedGridClassName}`}
    >
      <ComposedChart
        accessibilityLayer
        layout="vertical"
        data={data}
        margin={{ top: 8, right: 12, bottom: 8, left: 4 }}
        barCategoryGap="18%"
      >
        <CartesianGrid horizontal={false} strokeDasharray="3 3" />
        <XAxis
          type="number"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          domain={[0, 60]}
          tickFormatter={(v) => toPersianDigits(v)}
          tick={{ fontSize: 11, fontFamily: "var(--font-sans)", letterSpacing: 0 }}
        />
        <YAxis
          dataKey="province"
          type="category"
          scale="band"
          orientation="right"
          width={72}
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tick={{ fontSize: 12, fontFamily: "var(--font-sans)", letterSpacing: 0 }}
        />
        <ChartTooltip content={TooltipContent} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="sales"
          barSize={14}
          fill="var(--color-sales)"
          radius={[0, 3, 3, 0]}
        />
        <Line
          dataKey="target"
          stroke="var(--color-target)"
          strokeWidth={2}
          dot={{ r: 3, fill: "var(--color-target)", strokeWidth: 0 }}
          activeDot={{ r: 4 }}
        />
      </ComposedChart>
    </ChartContainer>
  )
}
