"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  XAxis,
  YAxis,
  type TooltipContentProps,
  type TooltipIndex,
} from "recharts"

import { useChartCaption } from "@/components/chart-live"
import { splitTomanCompact } from "@/lib/chart-locale"
import {
  chartBarContainerClassName,
  toPersianDigits,
} from "@/lib/chart-fa"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

import {
  CANDLE_DOWN,
  CANDLE_UP,
  formatToman,
  formatVolume,
  generateNaturalCandles,
} from "./stock-shared"

const BINS = 16
const candles = generateNaturalCandles(48, 5520)
const priceMin = Math.min(...candles.map((c) => c.low))
const priceMax = Math.max(...candles.map((c) => c.high))
const step = (priceMax - priceMin) / BINS || 1

const profile = Array.from({ length: BINS }, (_, i) => {
  const low = priceMin + i * step
  const high = low + step
  const mid = (low + high) / 2
  let volume = 0
  for (const c of candles) {
    if (c.close >= low && c.close < high + (i === BINS - 1 ? 1 : 0)) {
      volume += c.volume
    }
  }
  const { amount, unit } = splitTomanCompact(Math.round(mid))
  return {
    id: `lvl-${i}`,
    level: mid,
    amount,
    unit,
    volume,
  }
}).reverse()

const poc = profile.reduce((a, b) => (b.volume > a.volume ? b : a), profile[0]!)
const priceUnit = profile[0]?.unit ?? "میلیون تومان"

const chartConfig = {
  volume: { label: "حجم معاملات", color: CANDLE_UP },
} satisfies ChartConfig

/** تیک حجم: فقط عدد (واحد در عنوان محور است). */
function VolumeTick({
  x = 0,
  y = 0,
  payload,
}: {
  x?: number
  y?: number
  payload?: { value?: number }
}) {
  const value = payload?.value ?? 0
  const label =
    value <= 0
      ? toPersianDigits("0")
      : value >= 1_000
        ? toPersianDigits(String(Math.round(value / 1_000)))
        : toPersianDigits(String(Math.round(value)))

  return (
    <text
      x={x}
      y={y + 14}
      textAnchor="middle"
      direction="ltr"
      className="fill-muted-foreground"
      style={{
        fontSize: 11,
        fontFamily: "var(--font-sans)",
        direction: "ltr",
        unicodeBidi: "isolate",
        letterSpacing: 0,
      }}
    >
      {label}
    </text>
  )
}

/** تیک قیمت: فقط عدد، راست‌چین کنار میله. */
function PriceTick({
  x = 0,
  y = 0,
  payload,
}: {
  x?: number
  y?: number
  payload?: { value?: string }
}) {
  const row = profile.find((r) => r.id === payload?.value)
  if (!row) return null
  return (
    <text
      x={x - 6}
      y={y}
      textAnchor="end"
      dominantBaseline="central"
      direction="ltr"
      className="fill-muted-foreground"
      style={{
        fontSize: 11,
        fontFamily: "var(--font-sans)",
        direction: "ltr",
        unicodeBidi: "isolate",
        letterSpacing: 0,
      }}
    >
      {row.amount}
    </text>
  )
}

function ProfileTooltip({ active, payload }: TooltipContentProps) {
  if (!(active && payload?.length)) return null
  const row = payload[0]?.payload as (typeof profile)[number] | undefined
  if (!row) return null
  return (
    <div
      className="min-w-[9rem] rounded-lg border bg-background px-3 py-2.5 text-xs shadow-xl font-sans"
      dir="rtl"
    >
      <p className="mb-1.5 font-medium">{formatToman(Math.round(row.level))}</p>
      <p className="text-muted-foreground flex justify-between gap-4">
        <span>حجم معاملات</span>
        <span className="text-foreground">
          {formatVolume(row.volume)} سهم
        </span>
      </p>
    </div>
  )
}

export default function VolumeProfileDemo({
  defaultIndex,
}: {
  defaultIndex?: TooltipIndex
}) {
  useChartCaption(() => <>توزیع حجم معاملات در سطوح مختلف قیمت</>)

  return (
    <div className="w-full max-w-[760px] overflow-hidden rounded-xl border border-border/60 bg-background font-sans">
      <div className="flex flex-wrap items-end justify-between gap-2 border-b border-border/50 px-4 py-2.5">
        <div>
          <p className="text-sm font-medium">پروفایل حجم · شپنا</p>
          <p className="text-muted-foreground text-[11px]">
            نقطهٔ کنترل (POC): {formatToman(Math.round(poc.level))}
          </p>
        </div>
        <div className="text-muted-foreground text-end text-[11px]">
          <p>{toPersianDigits(String(BINS))} سطح قیمت</p>
          <p>محور قیمت: {priceUnit}</p>
        </div>
      </div>
      <ChartContainer
        config={chartConfig}
        className={`${chartBarContainerClassName} max-h-[420px] max-w-none`}
      >
        <BarChart
          accessibilityLayer
          layout="vertical"
          data={profile}
          margin={{ top: 20, right: 16, left: 8, bottom: 28 }}
        >
          <CartesianGrid horizontal={false} strokeDasharray="3 3" />
          <XAxis
            type="number"
            tickMargin={8}
            axisLine={false}
            tickLine={false}
            tick={VolumeTick}
            label={{
              value: "حجم معاملات (هزار سهم)",
              position: "insideBottom",
              offset: -14,
              style: {
                fill: "var(--muted-foreground)",
                fontSize: 11,
                fontFamily: "var(--font-sans)",
              },
            }}
          />
          <YAxis
            type="category"
            dataKey="id"
            width={52}
            tickMargin={4}
            axisLine={false}
            tickLine={false}
            tick={PriceTick}
          />
          <ChartTooltip defaultIndex={defaultIndex} content={ProfileTooltip} />
          <Bar dataKey="volume" radius={[0, 4, 4, 0]} isAnimationActive={false}>
            {profile.map((row, i) => (
              <Cell
                key={row.id}
                fill={row.level === poc.level ? CANDLE_UP : CANDLE_DOWN}
                fillOpacity={row.level === poc.level ? 0.9 : 0.45}
              />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  )
}
