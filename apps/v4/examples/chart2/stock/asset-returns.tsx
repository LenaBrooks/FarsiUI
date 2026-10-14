"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  type BarShapeProps,
} from "recharts"
import { TriangleIcon } from "lucide-react"

import {
  CHART2_BAR_COLORS,
  chart2DashedGridClassName,
  chart2Shade,
  formatPersianNumber,
  toPersianDigits,
} from "@/lib/chart2-fa"
import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

type RangeId = "3m" | "6m" | "1y" | "3y"

type AssetRow = {
  asset: string
  /** بازدهی به درصد — طول میله */
  returnPct: number
  /** ارزش ریالی تقریبی رشد سرمایه‌گذاری */
  amount: number
}

const RANGES: { id: RangeId; label: string }[] = [
  { id: "3m", label: "۳ ماه پیش" },
  { id: "6m", label: "۶ ماه پیش" },
  { id: "1y", label: "۱ سال پیش" },
  { id: "3y", label: "۳ سال پیش" },
]

/** دادهٔ نمونه — بازدهی دارایی‌ها در بازه‌های زمانی */
const DATA_BY_RANGE: Record<RangeId, AssetRow[]> = {
  "3m": [
    { asset: "رمزارز", returnPct: 28, amount: 1_280_400 },
    { asset: "طلا", returnPct: 14, amount: 1_142_000 },
    { asset: "سکه", returnPct: 12, amount: 1_118_500 },
    { asset: "دلار", returnPct: 9, amount: 1_092_200 },
    { asset: "سود بانکی", returnPct: 6, amount: 1_058_000 },
    { asset: "شاخص\u00a0بورس", returnPct: 3, amount: 1_031_800 },
  ],
  "6m": [
    { asset: "رمزارز", returnPct: 86, amount: 1_862_000 },
    { asset: "طلا", returnPct: 42, amount: 1_421_500 },
    { asset: "سکه", returnPct: 38, amount: 1_382_000 },
    { asset: "دلار", returnPct: 27, amount: 1_274_000 },
    { asset: "سود بانکی", returnPct: 12, amount: 1_118_000 },
    { asset: "شاخص\u00a0بورس", returnPct: 8, amount: 1_079_500 },
  ],
  "1y": [
    { asset: "رمزارز", returnPct: 214, amount: 3_142_000 },
    { asset: "طلا", returnPct: 98, amount: 1_982_400 },
    { asset: "سکه", returnPct: 86, amount: 1_864_000 },
    { asset: "دلار", returnPct: 64, amount: 1_642_500 },
    { asset: "سود بانکی", returnPct: 24, amount: 1_241_000 },
    { asset: "شاخص\u00a0بورس", returnPct: 18, amount: 1_182_000 },
  ],
  "3y": [
    { asset: "رمزارز", returnPct: 1235, amount: 13_349_058 },
    { asset: "طلا", returnPct: 892, amount: 9_920_400 },
    { asset: "سکه", returnPct: 764, amount: 8_641_200 },
    { asset: "دلار", returnPct: 518, amount: 6_182_500 },
    { asset: "سود بانکی", returnPct: 186, amount: 2_864_000 },
    { asset: "شاخص\u00a0بورس", returnPct: 46, amount: 1_462_800 },
  ],
}

const BAR_COLOR = CHART2_BAR_COLORS[0]
const ACCENT_COLOR = CHART2_BAR_COLORS[1]
const BAR_LABEL_FILL = chart2Shade(CHART2_BAR_COLORS[0], -55)

const chartConfig = {
  returnPct: { label: "بازدهی", color: BAR_COLOR },
} satisfies ChartConfig

const DOMAIN_BY_RANGE: Record<RangeId, [number, number]> = {
  "3m": [0, 40],
  "6m": [0, 100],
  "1y": [0, 250],
  "3y": [0, 1400],
}

function formatAmountLabel(amount: number) {
  return `ت ${formatPersianNumber(amount, { useGrouping: true })}`
}

function formatPct(value: number) {
  return `${formatPersianNumber(value, { useGrouping: true })}٪`
}

export default function AssetReturnsDemo({
  isAnimationActive: _isAnimationActive = true,
}: {
  isAnimationActive?: boolean
}) {
  const [range, setRange] = useState<RangeId>("3y")
  const data = DATA_BY_RANGE[range]
  const domain = DOMAIN_BY_RANGE[range]
  const dataRef = useRef(data)
  dataRef.current = data

  const amountBar = useCallback((props: BarShapeProps) => {
    const x = Number(props.x) || 0
    const y = Number(props.y) || 0
    const width = Math.max(Number(props.width) || 0, 0)
    const height = Math.max(Number(props.height) || 0, 0)
    const row =
      (props.payload as AssetRow | undefined) ??
      dataRef.current[props.index ?? -1]

    if (width < 1 || height < 1) return null

    const r = Math.min(14, height / 2, width / 2)
    const d = [
      `M${x},${y}`,
      `H${x + width - r}`,
      `Q${x + width},${y} ${x + width},${y + r}`,
      `V${y + height - r}`,
      `Q${x + width},${y + height} ${x + width - r},${y + height}`,
      `H${x}`,
      "Z",
    ].join(" ")

    return (
      <g>
        <path d={d} fill={BAR_COLOR} />
        {row && width >= 36 ? (
          <text
            x={x + width - 10}
            y={y + height / 2}
            textAnchor="end"
            dominantBaseline="central"
            fill={BAR_LABEL_FILL}
            fontSize={11}
            fontFamily="var(--font-sans)"
            style={{ letterSpacing: 0, pointerEvents: "none" }}
          >
            {width < 88 ? "…" : formatAmountLabel(row.amount)}
          </text>
        ) : null}
      </g>
    )
  }, [])

  const { maxRow, minRow } = useMemo(() => {
    let max = data[0]!
    let min = data[0]!
    for (const row of data) {
      if (row.returnPct > max.returnPct) max = row
      if (row.returnPct < min.returnPct) min = row
    }
    return { maxRow: max, minRow: min }
  }, [data])

  const ticks = useMemo(() => {
    const [, max] = domain
    const step = max <= 40 ? 10 : max <= 100 ? 20 : max <= 250 ? 50 : 200
    const out: number[] = []
    for (let v = 0; v <= max; v += step) out.push(v)
    return out
  }, [domain])

  return (
    <div
      dir="rtl"
      className="mx-auto grid w-full max-w-[920px] grid-cols-1 overflow-hidden rounded-2xl border border-border/70 bg-background font-sans tracking-[0] md:grid-cols-[240px_minmax(0,1fr)]"
    >
      {/* سایدبار راست (ستون اول در RTL) */}
      <aside className="order-2 flex flex-col gap-4 border-t border-border/60 p-4 md:order-1 md:border-t-0 md:border-s">
        <section className="flex flex-col gap-2">
          <h3 className="text-xs font-semibold text-foreground">بازه زمانی</h3>
          <div className="grid grid-cols-2 gap-2">
            {RANGES.map((item) => {
              const active = range === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setRange(item.id)}
                  className={cn(
                    "rounded-lg border px-2 py-2 text-xs transition-colors",
                    active
                      ? "text-foreground"
                      : "border-border bg-background text-foreground hover:bg-muted/40"
                  )}
                  style={
                    active
                      ? {
                          borderColor: BAR_COLOR,
                          background: `color-mix(in oklab, ${BAR_COLOR} 16%, var(--background))`,
                        }
                      : undefined
                  }
                >
                  {item.label}
                </button>
              )
            })}
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="text-xs font-semibold text-foreground">آمارها</h3>
          <div className="flex flex-col gap-2">
            <div
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-xs"
              style={{
                background: `color-mix(in oklab, ${BAR_COLOR} 14%, var(--background))`,
              }}
            >
              <span className="shrink-0 font-medium text-muted-foreground">
                بیشترین بازدهی:
              </span>
              <span
                className="inline-flex items-center gap-1 font-semibold"
                style={{ color: BAR_COLOR }}
              >
                <span>{maxRow.asset}</span>
                <span>{formatPct(maxRow.returnPct)}</span>
                <TriangleIcon className="size-2.5 fill-current" />
              </span>
            </div>
            <div
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-xs"
              style={{
                background: `color-mix(in oklab, ${ACCENT_COLOR} 14%, var(--background))`,
              }}
            >
              <span className="shrink-0 font-medium text-muted-foreground">
                کمترین بازدهی:
              </span>
              <span
                className="inline-flex items-center gap-1 font-semibold"
                style={{ color: ACCENT_COLOR }}
              >
                <span>{minRow.asset}</span>
                <span>{formatPct(minRow.returnPct)}</span>
                <TriangleIcon className="size-2.5 rotate-180 fill-current" />
              </span>
            </div>
          </div>
        </section>
      </aside>

      {/* نمودار — LTR تا میله‌ها مثل نمونه از چپ رشد کنند */}
      <div dir="ltr" className="order-1 min-w-0 p-3 md:order-2 md:p-4">
        <ChartContainer
          dir="ltr"
          config={chartConfig}
          className={cn(
            chart2DashedGridClassName,
            "aspect-auto h-[320px] w-full max-h-none max-w-none font-sans text-xs"
          )}
        >
          <BarChart
            accessibilityLayer
            layout="vertical"
            data={data}
            barCategoryGap="22%"
            margin={{ top: 8, right: 20, left: 8, bottom: 4 }}
          >
            <CartesianGrid horizontal={false} strokeDasharray="4 4" />
            <XAxis
              type="number"
              domain={domain}
              ticks={ticks}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              interval={0}
              tickFormatter={(v) => toPersianDigits(String(v))}
            />
            <YAxis
              type="category"
              dataKey="asset"
              width={96}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <ChartTooltip
              cursor={{
                fill: "color-mix(in oklab, var(--foreground) 4%, transparent)",
              }}
              content={({ active, payload }) => {
                if (!(active && payload?.length)) return null
                const row = payload[0]?.payload as AssetRow | undefined
                if (!row) return null
                return (
                  <div
                    dir="rtl"
                    className="min-w-[9.5rem] rounded-lg border bg-background px-3 py-2 text-xs font-sans tracking-[0]"
                  >
                    <p className="mb-1 font-medium text-foreground">
                      {row.asset}
                    </p>
                    <p className="text-muted-foreground">
                      بازدهی:{" "}
                      <span className="font-semibold text-foreground">
                        {formatPct(row.returnPct)}
                      </span>
                    </p>
                    <p className="mt-0.5 text-muted-foreground">
                      ارزش:{" "}
                      <span className="font-semibold text-foreground">
                        {formatAmountLabel(row.amount)}
                      </span>
                    </p>
                  </div>
                )
              }}
            />
            <Bar
              dataKey="returnPct"
              fill={BAR_COLOR}
              shape={amountBar}
              maxBarSize={28}
              /* shape سفارشی با انیمیشن عرض ۰ می‌دهد — لیبل داخل میله مهم‌تر است */
              isAnimationActive={false}
            />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  )
}
