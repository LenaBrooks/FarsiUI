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
  orders: number
  online: number
  store: number
}

/** میلیون تومان / هزار سفارش */
const data: Row[] = [
  { month: FA_MONTHS[0], orders: 12.4, online: 8.2, store: 5.9 },
  { month: FA_MONTHS[1], orders: 13.1, online: 9.1, store: 6.4 },
  { month: FA_MONTHS[2], orders: 11.8, online: 10.4, store: 7.1 },
  { month: FA_MONTHS[3], orders: 14.6, online: 11.2, store: 7.8 },
  { month: FA_MONTHS[4], orders: 15.2, online: 10.8, store: 8.2 },
  { month: FA_MONTHS[5], orders: 16.0, online: 12.4, store: 7.6 },
]

const chartConfig = {
  orders: { label: "سفارش (هزار)", color: CHART2_BAR_COLORS[0] },
  online: { label: "آنلاین", color: CHART2_BAR_COLORS[1] },
  store: { label: "حضوری", color: CHART2_BAR_COLORS[2] },
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
                {toPersianDigits(item.value.toFixed(1))}
                {key === "orders" ? "" : " م"}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default function LineBarAreaComposedChartDemo() {
  return (
    <ChartContainer
      config={chartConfig}
      className={`${chart2ContainerClassName} ${chart2DashedGridClassName} max-w-none`}
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
          tickFormatter={(v) => toPersianDigits(v)}
          tick={{ fontSize: 11, fontFamily: "var(--font-sans)", letterSpacing: 0 }}
        />
        <ChartTooltip content={TooltipContent} />
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          type="monotone"
          dataKey="orders"
          fill="var(--color-orders)"
          stroke="var(--color-orders)"
          fillOpacity={0.18}
          strokeWidth={1.5}
          dot={false}
        />
        <Bar
          dataKey="online"
          barSize={22}
          fill="var(--color-online)"
          radius={[3, 3, 0, 0]}
        />
        <Line
          type="monotone"
          dataKey="store"
          stroke="var(--color-store)"
          strokeWidth={2}
          dot={{ r: 3, fill: "var(--color-store)", strokeWidth: 0 }}
          activeDot={{ r: 4 }}
        />
      </ComposedChart>
    </ChartContainer>
  )
}
