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
  type TooltipContentProps,
} from "recharts"

import { useChart2Live } from "@/components/chart2-live"
import {
  CHART2_BAR_COLORS,
  FA_MONTHS,
  chart2BarContainerClassName,
  toPersianDigits,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

type MonthSales = {
  name: string
  online: number
  store: number
  wholesale: number
}

/** فروش ماهانه — میلیون تومان */
const data: MonthSales[] = [
  { name: FA_MONTHS[0], online: 6.2, store: 4.8, wholesale: 3.1 },
  { name: FA_MONTHS[1], online: 7.4, store: 5.1, wholesale: 4.2 },
  { name: FA_MONTHS[2], online: 5.8, store: 6.4, wholesale: 3.6 },
  { name: FA_MONTHS[3], online: 8.1, store: 5.6, wholesale: 4.8 },
  { name: FA_MONTHS[4], online: 6.9, store: 4.2, wholesale: 3.4 },
  { name: FA_MONTHS[5], online: 9.2, store: 6.8, wholesale: 5.1 },
  { name: "مهر", online: 7.6, store: 5.9, wholesale: 4.4 },
]

const TARGET = 18

const chartConfig = {
  online: { label: "آنلاین", color: CHART2_BAR_COLORS[0] },
  store: { label: "فروشگاه", color: CHART2_BAR_COLORS[1] },
  wholesale: { label: "عمده", color: CHART2_BAR_COLORS[2] },
} satisfies ChartConfig

function totalOf(row: MonthSales) {
  return row.online + row.store + row.wholesale
}

function formatMil(n: number) {
  return toPersianDigits(n.toFixed(1))
}

function TotalLabel(props: LabelProps) {
  const { x, y, width, index } = props
  const row = data[index ?? -1]
  if (row == null || x == null || y == null || width == null) return null

  const total = totalOf(row)
  const cx = Number(x) + Number(width) / 2
  const cy = Number(y) - 10

  return (
    <text
      x={cx}
      y={cy}
      textAnchor="middle"
      fill="var(--muted-foreground)"
      fontSize={11}
      fontWeight={500}
      style={{ fontFamily: "var(--font-sans)", letterSpacing: 0 }}
    >
      {formatMil(total)}
    </text>
  )
}

function TooltipContent({ active, payload }: TooltipContentProps) {
  if (!(active && payload?.length)) return null
  const row = payload[0]?.payload as MonthSales | undefined
  if (!row) return null

  const total = totalOf(row)
  const delta = total - TARGET
  const hit = delta >= 0

  return (
    <div className="min-w-[11rem] rounded-lg border bg-background px-3 py-2.5 text-xs shadow-md font-sans tracking-[0]">
      <p className="mb-2 font-medium text-foreground">{row.name}</p>
      <ul className="space-y-1">
        {(
          [
            ["online", "آنلاین"],
            ["store", "فروشگاه"],
            ["wholesale", "عمده"],
          ] as const
        ).map(([key, label]) => (
          <li key={key} className="flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <span
                className="size-2 rounded-full"
                style={{ background: chartConfig[key].color }}
              />
              {label}
            </span>
            <span className="font-medium text-foreground">
              {formatMil(row[key])}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-2 space-y-1 border-t pt-2">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">جمع</span>
          <span className="font-medium text-foreground">
            {formatMil(total)} م
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">هدف</span>
          <span className="font-medium text-foreground">
            {toPersianDigits(TARGET)} م
          </span>
        </div>
        <p
          className="pt-0.5 font-medium"
          style={{
            color: hit ? CHART2_BAR_COLORS[2] : CHART2_BAR_COLORS[1],
          }}
        >
          {hit ? "+" : "−"}
          {formatMil(Math.abs(delta))} نسبت به هدف
        </p>
      </div>
    </div>
  )
}

function TargetLabel(props: {
  viewBox?: { x?: number; y?: number; width?: number }
}) {
  const vb = props.viewBox
  // کنار محور Y (راست) تا داخل لبهٔ کادر نرود
  const x = Number(vb?.x ?? 0) + Number(vb?.width ?? 0) - 4
  const y = Number(vb?.y ?? 0) - 8

  return (
    <text
      x={x}
      y={y}
      textAnchor="end"
      fill="var(--muted-foreground)"
      fontSize={11}
      fontWeight={500}
      style={{ fontFamily: "var(--font-sans)", letterSpacing: 0 }}
    >
      هدف {toPersianDigits(TARGET)} م
    </text>
  )
}

export default function StackedBarChartWithHorizontalLineDemo() {
  const live = useChart2Live()
  const showGrid = live?.showGrid !== false

  return (
    <ChartContainer
      config={chartConfig}
      className={`${chart2BarContainerClassName} max-w-none aspect-[1.55]`}
    >
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ top: 32, right: 12, left: 8, bottom: 4 }}
        barCategoryGap="24%"
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          reversed
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tick={{
            fontSize: 12,
            fontFamily: "var(--font-sans)",
            letterSpacing: 0,
          }}
        />
        <YAxis
          orientation="right"
          width={36}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          domain={[0, 24]}
          ticks={[0, 6, 12, 18, 24]}
          tickFormatter={(v) => toPersianDigits(v)}
          tick={{
            fontSize: 11,
            fontFamily: "var(--font-sans)",
            letterSpacing: 0,
          }}
        />
        <ChartTooltip
          cursor={{ fill: "var(--foreground)", fillOpacity: 0.04 }}
          content={TooltipContent}
        />
        <ChartLegend content={<ChartLegendContent />} />
        {showGrid ? (
          <ReferenceLine
            y={TARGET}
            stroke="var(--muted-foreground)"
            strokeWidth={1}
            strokeDasharray="4 4"
            strokeOpacity={0.8}
            label={TargetLabel}
          />
        ) : null}
        <Bar
          dataKey="online"
          stackId="sales"
          fill="var(--color-online)"
          maxBarSize={40}
        />
        <Bar
          dataKey="store"
          stackId="sales"
          fill="var(--color-store)"
          maxBarSize={40}
        />
        <Bar
          dataKey="wholesale"
          stackId="sales"
          fill="var(--color-wholesale)"
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
        >
          <LabelList content={<TotalLabel />} position="top" />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
