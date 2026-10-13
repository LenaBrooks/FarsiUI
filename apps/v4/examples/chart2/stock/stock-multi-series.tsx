"use client"

import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  type TooltipContentProps,
  type TooltipIndex,
} from "recharts"

import { useChart2Caption } from "@/components/chart2-live"
import {
  chart2BarContainerClassName,
  CHART2_BAR_COLORS,
  toPersianDigits,
} from "@/lib/chart2-fa"
import { between, random } from "@/lib/chart2-mock-data"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

import {
  formatMoneyOneLine,
  formatPctChange,
  formatToman,
  JalaliDayTick,
  timestampToDay,
} from "./stock-shared"

const SERIES = [
  { key: "shapna", label: "شپنا", color: CHART2_BAR_COLORS[0], start: 2_420_000 },
  { key: "foolad", label: "فولاد", color: CHART2_BAR_COLORS[2], start: 1_126_000 },
  { key: "khodro", label: "خودرو", color: CHART2_BAR_COLORS[1], start: 412_000 },
] as const

type MultiRow = { time: number } & Record<string, number>

function generateMultiSeries(
  length = 40,
  seed = 55,
  startTime = Date.UTC(2025, 6, 1)
): MultiRow[] {
  const gen = random(seed)
  const dayMs = 24 * 60 * 60 * 1000
  const last: Record<string, number> = Object.fromEntries(
    SERIES.map((s) => [s.key, s.start])
  )
  const rows: MultiRow[] = []

  for (let i = 0; i < length; i++) {
    const row: MultiRow = { time: startTime + i * dayMs }
    for (const s of SERIES) {
      // ±۳٫۵٪ روزانه + جهش گاه‌به‌گاه تا خطوط واقعاً نوسان داشته باشند
      const shock = between(gen, 0, 100) < 18 ? between(gen, -55, 60) / 1000 : 0
      const drift = between(gen, -38, 42) / 1000 + shock
      const next = Math.max(10_000, Math.round(last[s.key]! * (1 + drift)))
      row[s.key] = next
      last[s.key] = next
    }
    rows.push(row)
  }
  return rows
}

const data = generateMultiSeries()
const first = data[0]!
const last = data[data.length - 1]!

/** بازده از روز اول — مقایسهٔ چند نماد با قیمت پایهٔ متفاوت را خوانا می‌کند. */
const chartData = data.map((row) => {
  const out: MultiRow = { time: row.time }
  for (const s of SERIES) {
    out[s.key] = ((row[s.key]! - first[s.key]!) / first[s.key]!) * 100
  }
  return out
})

const summaries = SERIES.map((s) => {
  const change = ((last[s.key]! - first[s.key]!) / first[s.key]!) * 100
  return { ...s, price: last[s.key]!, change, up: change >= 0 }
})

const allPct = chartData.flatMap((row) => SERIES.map((s) => row[s.key]!))
const pctMin = Math.min(...allPct, 0)
const pctMax = Math.max(...allPct, 0)
const pctPad = Math.max(2, (pctMax - pctMin) * 0.12)
const domainMin = Math.floor(pctMin - pctPad)
const domainMax = Math.ceil(pctMax + pctPad)

function formatPctAxis(value: number) {
  const sign = value > 0 ? "+" : ""
  return toPersianDigits(`${sign}${value.toFixed(0)}٪`)
}

const chartConfig = Object.fromEntries(
  SERIES.map((s) => [s.key, { label: s.label, color: s.color }])
) satisfies ChartConfig

function MultiTooltip({ active, payload }: TooltipContentProps) {
  if (!(active && payload?.length)) return null
  const row = payload[0]?.payload as MultiRow | undefined
  if (!row) return null
  const absolute = data.find((d) => d.time === row.time)
  return (
    <div
      className="min-w-[11rem] rounded-lg border bg-background px-3 py-2.5 text-xs shadow-xl font-sans"
      dir="rtl"
    >
      <p className="mb-2 font-medium">{timestampToDay(row.time)}</p>
      <div className="grid grid-cols-[auto_1fr_auto] gap-x-3 gap-y-1 text-muted-foreground">
        {SERIES.map((s) => {
          const pct = row[s.key]!
          const sign = pct > 0 ? "+" : ""
          return (
            <div key={s.key} className="contents">
              <span className="flex items-center gap-1.5">
                <span
                  className="size-1.5 rounded-full"
                  style={{ background: s.color }}
                />
                {s.label}
              </span>
              <span className="text-end text-foreground">
                {absolute ? formatToman(absolute[s.key]!) : "—"}
              </span>
              <span
                className="tabular-nums"
                style={{
                  color: pct >= 0 ? "#5a9e7a" : "#d97986",
                }}
              >
                {toPersianDigits(`${sign}${pct.toFixed(1)}٪`)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function StockMultiSeriesDemo({
  defaultIndex,
}: {
  defaultIndex?: TooltipIndex
}) {
  useChart2Caption(() => <>مقایسهٔ چند نماد بورسی — تم داشبورد</>)

  return (
    <div className="w-full max-w-[760px] space-y-4 font-sans">
      <div className="grid gap-3 sm:grid-cols-3">
        {summaries.map((s) => (
          <div
            key={s.key}
            className="min-w-0 rounded-xl border border-border/60 bg-background px-3.5 py-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span
                  className="size-2 rounded-[2px]"
                  style={{ background: s.color }}
                />
                <p className="text-[11px] font-medium">{s.label}</p>
              </div>
              <span
                className="text-[11px] font-medium"
                style={{ color: s.up ? "#5a9e7a" : "#d97986" }}
              >
                {formatPctChange(s.change)}
              </span>
            </div>
            <p className="mt-0.5 whitespace-nowrap text-[13px] font-semibold tracking-tight sm:text-sm">
              {formatMoneyOneLine(s.price)}
            </p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border/60 bg-background">
        <div className="flex items-center justify-between border-b border-border/50 px-4 py-2.5">
          <p className="text-sm font-medium">بازدهی نسبی از روز اول</p>
          <p className="text-muted-foreground text-[11px]">
            {toPersianDigits(String(data.length))} روز اخیر
          </p>
        </div>

        <ChartContainer
          config={chartConfig}
          className={`${chart2BarContainerClassName} max-h-[340px] max-w-none`}
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 16, right: 8, left: 4, bottom: 4 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              reversed
              tickMargin={10}
              minTickGap={36}
              tick={JalaliDayTick}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              orientation="right"
              width={48}
              tickMargin={6}
              domain={[domainMin, domainMax]}
              tickCount={5}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatPctAxis}
            />
            <ChartTooltip
              defaultIndex={defaultIndex}
              content={MultiTooltip}
            />
            {SERIES.map((s) => (
              <Line
                key={s.key}
                type="linear"
                dataKey={s.key}
                name={s.label}
                stroke={s.color}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  )
}
