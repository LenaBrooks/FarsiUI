"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
} from "recharts"

import { useChart2Caption } from "@/components/chart2-live"
import { formatToman } from "@/lib/chart-locale"
import { CHART2_BAR_COLORS, toPersianDigits } from "@/lib/chart2-fa"
import {
  ChartContainer,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

import { CANDLE_DOWN, CANDLE_UP } from "./stock-shared"

type SparkPoint = { i: number; value: number }

function toSpark(values: number[]): SparkPoint[] {
  return values.map((value, i) => ({ i, value }))
}

function pctChange(values: number[]) {
  const first = values[0]!
  const last = values[values.length - 1]!
  if (first === 0) return 0
  return ((last - first) / first) * 100
}

function formatPct(value: number) {
  const sign = value > 0 ? "+" : ""
  return `${sign}${toPersianDigits(value.toFixed(1))}٪`
}

const salesSeries = [
  412, 418, 405, 422, 416, 430, 424, 438, 432, 445, 440, 452, 448, 458, 454,
  466, 461, 472, 468, 478, 474, 482, 479, 488,
]
const expensesSeries = [
  248, 252, 245, 258, 254, 249, 261, 257, 264, 260, 255, 268, 263, 259, 270,
  266, 261, 274, 269, 265, 276, 271, 267, 278,
]
const profitSeries = salesSeries.map((v, i) => v - expensesSeries[i]!)

const watchlist = [
  {
    symbol: "شپنا",
    name: "پالایش نفت اصفهان",
    price: 2_845_000,
    series: [100, 101, 99, 103, 105, 104, 107, 109, 108, 111, 113, 112, 115, 117],
    volume: [42, 38, 55, 48, 62, 51, 70, 58, 66, 74, 69, 81, 77, 88],
    share: 28,
  },
  {
    symbol: "فولاد",
    name: "فولاد مبارکه",
    price: 1_126_000,
    series: [88, 89, 87, 86, 90, 92, 89, 88, 91, 93, 90, 94, 95, 94],
    volume: [55, 48, 61, 44, 58, 52, 67, 49, 63, 57, 71, 64, 69, 60],
    share: 22,
  },
  {
    symbol: "خودرو",
    name: "ایران‌خودرو",
    price: 412_000,
    series: [72, 70, 73, 68, 66, 69, 64, 62, 65, 61, 59, 63, 60, 58],
    volume: [90, 84, 98, 76, 88, 72, 95, 68, 81, 74, 86, 70, 78, 65],
    share: 14,
  },
  {
    symbol: "وبملت",
    name: "بانک ملت",
    price: 685_000,
    series: [54, 55, 54, 56, 57, 56, 58, 59, 58, 60, 61, 60, 62, 63],
    volume: [33, 36, 31, 40, 38, 42, 35, 44, 41, 47, 43, 50, 46, 52],
    share: 18,
  },
  {
    symbol: "رمپنا",
    name: "گروه مپنا",
    price: 958_000,
    series: [80, 81, 79, 82, 81, 83, 82, 84, 83, 85, 84, 86, 85, 87],
    volume: [28, 32, 26, 35, 30, 38, 33, 41, 36, 39, 34, 43, 37, 45],
    share: 11,
  },
] as const

const kpiCards = [
  {
    id: "sales",
    label: "فروش",
    value: 424_652_000,
    series: salesSeries,
    color: CHART2_BAR_COLORS[0],
    invertSentiment: false,
  },
  {
    id: "expenses",
    label: "هزینه",
    value: 235_312_000,
    series: expensesSeries,
    color: CHART2_BAR_COLORS[1],
    invertSentiment: true,
  },
  {
    id: "profit",
    label: "سود خالص",
    value: 189_340_000,
    series: profitSeries,
    color: CHART2_BAR_COLORS[2],
    invertSentiment: false,
  },
] as const

function SparkAreaCard({
  id,
  label,
  value,
  series,
  color,
  invertSentiment = false,
}: {
  id: string
  label: string
  value: number
  series: readonly number[]
  color: string
  invertSentiment?: boolean
}) {
  const data = toSpark([...series])
  const change = pctChange([...series])
  const good = invertSentiment ? change <= 0 : change >= 0
  const config = {
    value: { label, color },
  } satisfies ChartConfig
  const gradId = `spark-fill-${id}`

  return (
    <div className="min-w-0 flex-1 overflow-hidden rounded-xl border border-border/60 bg-background">
      <div className="flex items-start justify-between gap-2 px-3.5 pt-3.5">
        <div className="min-w-0">
          <p className="text-muted-foreground text-[11px] font-medium tracking-wide">
            {label}
          </p>
          <p className="mt-0.5 whitespace-nowrap text-[13px] font-semibold tracking-tight sm:text-sm">
            {formatToman(value, { compact: true }).replace(/ /g, "\u00A0")}
          </p>
        </div>
        <span
          className="shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-medium"
          style={{
            color: good ? CANDLE_UP : CANDLE_DOWN,
            background: good ? `${CANDLE_UP}18` : `${CANDLE_DOWN}18`,
          }}
        >
          {formatPct(change)}
        </span>
      </div>
      <ChartContainer
        config={config}
        className="aspect-auto h-[88px] w-full font-sans"
      >
        <AreaChart data={data} margin={{ top: 8, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.38} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            fill={`url(#${gradId})`}
            strokeWidth={2}
            dot={false}
            activeDot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}

function TrendSpark({
  series,
  up,
}: {
  series: readonly number[]
  up: boolean
}) {
  const color = up ? CANDLE_UP : CANDLE_DOWN
  const data = toSpark([...series])
  const config = {
    value: { label: "روند", color },
  } satisfies ChartConfig
  const last = data.length - 1

  return (
    <ChartContainer
      config={config}
      className="aspect-auto h-[40px] w-[120px] font-sans"
    >
      <LineChart data={data} margin={{ top: 6, right: 6, bottom: 4, left: 2 }}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.75}
          isAnimationActive={false}
          activeDot={false}
          dot={(props) => {
            const { cx, cy, index } = props
            if (index !== last || cx == null || cy == null) {
              return <g key={`spark-dot-${index}`} />
            }
            return (
              <circle
                key={`spark-end-${index}`}
                cx={cx}
                cy={cy}
                r={3}
                fill={color}
                stroke="var(--background)"
                strokeWidth={1.5}
              />
            )
          }}
        />
      </LineChart>
    </ChartContainer>
  )
}

function VolumeSpark({ series }: { series: readonly number[] }) {
  const data = toSpark([...series])
  const config = {
    value: { label: "حجم", color: CHART2_BAR_COLORS[4] },
  } satisfies ChartConfig

  return (
    <ChartContainer
      config={config}
      className="aspect-auto h-[40px] w-[100px] font-sans"
    >
      <BarChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
        <Bar
          dataKey="value"
          fill={CHART2_BAR_COLORS[4]}
          fillOpacity={0.85}
          radius={[2, 2, 0, 0]}
          isAnimationActive={false}
        />
      </BarChart>
    </ChartContainer>
  )
}

function ShareBar({ share }: { share: number }) {
  return (
    <div className="flex min-w-[5.5rem] items-center gap-2">
      <div className="bg-muted h-1.5 flex-1 overflow-hidden rounded-full">
        <div
          className="h-full rounded-full"
          style={{
            width: `${share}%`,
            background: CHART2_BAR_COLORS[0],
          }}
        />
      </div>
      <span className="text-muted-foreground w-8 text-end text-[11px]">
        {toPersianDigits(String(share))}٪
      </span>
    </div>
  )
}

export default function SparklinesDemo() {
  useChart2Caption(
    () => (
      <>
        اسپارک‌لاین پورتفوی — کارت‌های KPI با گرادیان و جدول نمادهای بورسی
      </>
    )
  )

  return (
    <div className="w-full max-w-[760px] space-y-4 font-sans">
      <div className="grid gap-3 sm:grid-cols-3">
        {kpiCards.map((card) => (
          <SparkAreaCard key={card.id} {...card} />
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border/60">
        <div className="flex items-center justify-between border-b bg-muted/25 px-3.5 py-2.5">
          <p className="text-sm font-medium">پورتفوی امروز</p>
          <p className="text-muted-foreground text-[11px]">۱۴ روز اخیر</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="text-muted-foreground border-b text-[11px]">
                <th className="px-3.5 py-2 text-start font-medium">نماد</th>
                <th className="px-3 py-2 text-start font-medium">آخرین قیمت</th>
                <th className="px-3 py-2 text-start font-medium">تغییر</th>
                <th className="px-3 py-2 text-start font-medium">روند</th>
                <th className="px-3 py-2 text-start font-medium">حجم</th>
                <th className="px-3.5 py-2 text-start font-medium">سهم</th>
              </tr>
            </thead>
            <tbody>
              {watchlist.map((row) => {
                const change = pctChange([...row.series])
                const up = change >= 0
                return (
                  <tr
                    key={row.symbol}
                    className="border-b last:border-0 hover:bg-muted/20"
                  >
                    <td className="px-3.5 py-2.5">
                      <div className="flex flex-col">
                        <span className="font-semibold tracking-tight">
                          {row.symbol}
                        </span>
                        <span className="text-muted-foreground text-[11px]">
                          {row.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 font-medium whitespace-nowrap">
                      {formatToman(row.price, { compact: true }).replace(
                        / /g,
                        "\u00A0"
                      )}
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className="text-[12px] font-medium"
                        style={{ color: up ? CANDLE_UP : CANDLE_DOWN }}
                      >
                        {formatPct(change)}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <TrendSpark series={row.series} up={up} />
                    </td>
                    <td className="px-3 py-2.5">
                      <VolumeSpark series={row.volume} />
                    </td>
                    <td className="px-3.5 py-2.5">
                      <ShareBar share={row.share} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
