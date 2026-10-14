"use client"

import { useMemo, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  XAxis,
  YAxis,
  type BarRectangleItem,
} from "recharts"

import { useChart2Live } from "@/components/chart2-live"
import {
  CHART2_BAR_COLORS,
  FA_MONTHS,
  chart2BarContainerClassName,
  toPersianDigits,
} from "@/lib/chart2-fa"
import { formatToman } from "@/lib/chart-locale"
import { cn } from "@/lib/utils"
import {
  ChartContainer,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

type MonthRow = {
  name: string
  /** فروش به تومان */
  sales: number
  orders: number
}

const data: MonthRow[] = [
  { name: FA_MONTHS[0], sales: 420_000_000, orders: 1860 },
  { name: FA_MONTHS[1], sales: 310_000_000, orders: 1420 },
  { name: FA_MONTHS[2], sales: 280_000_000, orders: 1290 },
  { name: FA_MONTHS[3], sales: 360_000_000, orders: 1610 },
  { name: FA_MONTHS[4], sales: 240_000_000, orders: 1110 },
  { name: FA_MONTHS[5], sales: 390_000_000, orders: 1740 },
  { name: "مهر", sales: 450_000_000, orders: 1980 },
]

const chartConfig = {
  sales: { label: "فروش", color: CHART2_BAR_COLORS[0] },
} satisfies ChartConfig

function formatAxisMillion(value: number) {
  return toPersianDigits(Math.round(value / 1_000_000))
}

function pctChange(current: number, previous: number) {
  if (previous === 0) return null
  return ((current - previous) / previous) * 100
}

export default function BarChartWithCustomizedEventDemo() {
  // آخرین ماه به‌صورت پیش‌فرض انتخاب است — مثل فیلتر داشبورد
  const [selected, setSelected] = useState(data.length - 1)
  const live = useChart2Live()
  const showGrid = live?.showGrid !== false

  const average = useMemo(
    () => data.reduce((sum, row) => sum + row.sales, 0) / data.length,
    []
  )

  const row = data[selected]
  const prev = selected > 0 ? data[selected - 1] : null
  const salesDelta = prev ? pctChange(row.sales, prev.sales) : null
  const ordersDelta = prev ? pctChange(row.orders, prev.orders) : null
  const avgBasket = row.orders > 0 ? row.sales / row.orders : 0
  const vsAverage = pctChange(row.sales, average)
  const share = (row.sales / data.reduce((s, r) => s + r.sales, 0)) * 100

  function selectMonth(index: number) {
    setSelected(index)
  }

  function step(delta: number) {
    setSelected((curr) =>
      Math.min(data.length - 1, Math.max(0, curr + delta))
    )
  }

  return (
    <div
      dir="rtl"
      className="flex w-full max-w-[720px] flex-col gap-3 font-sans tracking-normal [font-variant-numeric:normal] [letter-spacing:0] [&_.recharts-text]:tracking-normal [&_.recharts-text]:[letter-spacing:0]"
    >
      <ChartContainer
        config={chartConfig}
        className={`${chart2BarContainerClassName} max-w-none aspect-[1.65]`}
      >
        <BarChart
          accessibilityLayer
          data={data}
          margin={{ top: 12, right: 8, left: 4, bottom: 4 }}
          style={{ cursor: "pointer" }}
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
            width={40}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(v) => formatAxisMillion(Number(v))}
            tick={{
              fontSize: 12,
              fontFamily: "var(--font-sans)",
              letterSpacing: 0,
            }}
          />
          {showGrid ? (
            <ReferenceLine
              y={average}
              stroke="var(--border)"
              strokeDasharray="3 3"
              strokeWidth={1}
              strokeOpacity={0.7}
            />
          ) : null}
          <Bar
            dataKey="sales"
            radius={[4, 4, 0, 0]}
            onClick={(_item: BarRectangleItem, index: number) => {
              selectMonth(index)
            }}
          >
            {data.map((_, index) => {
              const isSelected = selected === index
              return (
                <Cell
                  key={index}
                  fill={
                    isSelected ? CHART2_BAR_COLORS[0] : CHART2_BAR_COLORS[4]
                  }
                  fillOpacity={isSelected ? 1 : 0.45}
                  style={{
                    cursor: "pointer",
                    transition: "fill-opacity 0.15s ease, fill 0.15s ease",
                  }}
                />
              )
            })}
          </Bar>
        </BarChart>
      </ChartContainer>

      {/* انتخاب سریع ماه — هم‌گام با کلیک روی میله */}
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {data.map((item, index) => {
          const active = index === selected
          return (
            <button
              key={item.name}
              type="button"
              onClick={() => selectMonth(index)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs transition-colors",
                active
                  ? "bg-foreground text-background"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {item.name}
            </button>
          )
        })}
      </div>

      {/* پنل جزئیات ماه انتخاب‌شده */}
      <div className="grid gap-3 rounded-xl border bg-background px-4 py-3 sm:grid-cols-[1fr_auto]">
        <div className="space-y-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <p className="text-xs text-muted-foreground">گزارش ماه</p>
              <p className="text-base font-semibold text-foreground">
                {row.name}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => step(1)}
                disabled={selected >= data.length - 1}
                className="rounded-md border px-2 py-1 text-xs text-muted-foreground enabled:hover:bg-muted disabled:opacity-40"
                aria-label="ماه بعد"
              >
                بعد
              </button>
              <button
                type="button"
                onClick={() => step(-1)}
                disabled={selected <= 0}
                className="rounded-md border px-2 py-1 text-xs text-muted-foreground enabled:hover:bg-muted disabled:opacity-40"
                aria-label="ماه قبل"
              >
                قبل
              </button>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-4">
            <div>
              <dt className="text-[11px] text-muted-foreground">فروش</dt>
              <dd className="text-sm font-medium tracking-normal text-foreground [font-variant-numeric:normal] [letter-spacing:0]">
                {formatToman(row.sales, { compact: true })}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] text-muted-foreground">سفارش</dt>
              <dd className="text-sm font-medium tracking-normal text-foreground [font-variant-numeric:normal] [letter-spacing:0]">
                {toPersianDigits(row.orders)}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] text-muted-foreground">میانگین سبد</dt>
              <dd className="text-sm font-medium tracking-normal text-foreground [font-variant-numeric:normal] [letter-spacing:0]">
                {formatToman(avgBasket, { compact: true })}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] text-muted-foreground">سهم از کل</dt>
              <dd className="text-sm font-medium tracking-normal text-foreground [font-variant-numeric:normal] [letter-spacing:0]">
                {toPersianDigits(share.toFixed(1))}٪
              </dd>
            </div>
          </dl>
        </div>

        <div className="flex flex-col justify-center gap-2 border-t pt-3 sm:min-w-[9.5rem] sm:border-t-0 sm:border-r sm:pr-4 sm:pt-0">
          <DeltaLine
            label={prev ? `نسبت به ${prev.name}` : "ماه اول دوره"}
            value={salesDelta}
          />
          <DeltaLine label="نسبت به میانگین" value={vsAverage} />
          {ordersDelta != null ? (
            <DeltaLine label="تغییر سفارش" value={ordersDelta} />
          ) : null}
          {showGrid ? (
            <p className="text-[10px] leading-relaxed text-muted-foreground">
              خط‌چین کم‌رنگ = میانگین فروش دوره
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function DeltaLine({
  label,
  value,
}: {
  label: string
  value: number | null
}) {
  if (value == null) {
    return (
      <p className="text-xs text-muted-foreground">
        {label}: —
      </p>
    )
  }
  const up = value >= 0
  return (
    <p className="text-xs">
      <span className="text-muted-foreground">{label}: </span>
      <span
        className="font-medium tracking-normal [font-variant-numeric:normal] [letter-spacing:0]"
        style={{ color: up ? CHART2_BAR_COLORS[2] : CHART2_BAR_COLORS[1] }}
      >
        {up ? "+" : "−"}
        {toPersianDigits(Math.abs(value).toFixed(1))}٪
      </span>
    </p>
  )
}
