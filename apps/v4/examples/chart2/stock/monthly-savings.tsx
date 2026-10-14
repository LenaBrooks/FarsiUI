"use client"

import { useCallback, useMemo, useState } from "react"
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
  FA_MONTHS_FULL,
  formatPersianNumber,
  toPersianDigits,
} from "@/lib/chart2-fa"
import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

type ChannelId = "gold" | "dollar" | "fund" | "bank" | "cash"

type MonthRow = {
  month: string
  /** موجودی انباشته در پایان ماه */
  balance: number
  /** واریز همان ماه */
  deposit: number
}

const CHANNELS: {
  id: ChannelId
  label: string
  /** بازده ماهانهٔ تقریبی */
  monthlyRate: number
}[] = [
  { id: "gold", label: "طلا", monthlyRate: 0.032 },
  { id: "dollar", label: "دلار", monthlyRate: 0.022 },
  { id: "fund", label: "صندوق ثابت", monthlyRate: 0.018 },
  { id: "bank", label: "سپرده بانکی", monthlyRate: 0.015 },
  { id: "cash", label: "نقد", monthlyRate: 0 },
]

/** واریز ثابت ماهانه — تومان */
const MONTHLY_DEPOSIT = 2_000_000

const BAR_COLOR = CHART2_BAR_COLORS[0]
const ACCENT_COLOR = CHART2_BAR_COLORS[1]

const chartConfig = {
  balance: { label: "موجودی", color: BAR_COLOR },
} satisfies ChartConfig

function buildSeries(monthlyRate: number): MonthRow[] {
  let balance = 0
  return FA_MONTHS_FULL.map((month) => {
    balance = (balance + MONTHLY_DEPOSIT) * (1 + monthlyRate)
    return {
      month,
      deposit: MONTHLY_DEPOSIT,
      balance: Math.round(balance),
    }
  })
}

function formatAmount(amount: number) {
  return formatPersianNumber(amount, { useGrouping: true })
}

function formatAmountLabel(amount: number) {
  return `ت ${formatAmount(amount)}`
}

function formatCompact(value: number) {
  const m = value / 1_000_000
  if (m === 0) return toPersianDigits("0")
  if (Number.isInteger(m)) return toPersianDigits(String(m))
  return toPersianDigits(m.toFixed(1))
}

function VerticalBar(props: BarShapeProps) {
  const x = Number(props.x) || 0
  const y = Number(props.y) || 0
  const width = Math.max(Number(props.width) || 0, 0)
  const height = Math.max(Number(props.height) || 0, 0)
  if (width < 1 || height < 1) return null

  const r = Math.min(10, width / 2, height / 2)
  const d = [
    `M${x},${y + height}`,
    `V${y + r}`,
    `Q${x},${y} ${x + r},${y}`,
    `H${x + width - r}`,
    `Q${x + width},${y} ${x + width},${y + r}`,
    `V${y + height}`,
    "Z",
  ].join(" ")

  return <path d={d} fill={BAR_COLOR} />
}

export default function MonthlySavingsDemo({
  isAnimationActive: _isAnimationActive = true,
}: {
  isAnimationActive?: boolean
}) {
  const [channelId, setChannelId] = useState<ChannelId>("gold")
  const channel = CHANNELS.find((c) => c.id === channelId) ?? CHANNELS[0]!
  const data = useMemo(
    () => buildSeries(channel.monthlyRate),
    [channel.monthlyRate]
  )

  const barShape = useCallback((props: BarShapeProps) => {
    return <VerticalBar {...props} />
  }, [])

  const { totalDeposited, finalBalance, profit, profitPct } = useMemo(() => {
    const totalDeposited = MONTHLY_DEPOSIT * data.length
    const finalBalance = data[data.length - 1]?.balance ?? 0
    const profit = finalBalance - totalDeposited
    const profitPct = totalDeposited
      ? (profit / totalDeposited) * 100
      : 0
    return { totalDeposited, finalBalance, profit, profitPct }
  }, [data])

  const domainMax = useMemo(() => {
    const peak = finalBalance
    const step =
      peak <= 20_000_000
        ? 5_000_000
        : peak <= 40_000_000
          ? 10_000_000
          : 15_000_000
    return Math.ceil(peak / step) * step || step
  }, [finalBalance])

  const ticks = useMemo(() => {
    const step = domainMax / 4
    return [0, step, step * 2, step * 3, domainMax]
  }, [domainMax])

  return (
    <div
      dir="rtl"
      className="mx-auto grid w-full max-w-[920px] grid-cols-1 overflow-hidden rounded-2xl border border-border/70 bg-background font-sans tracking-[0] md:grid-cols-[240px_minmax(0,1fr)]"
    >
      <aside className="order-2 flex flex-col gap-4 border-t border-border/60 p-4 md:order-1 md:border-t-0 md:border-s">
        <section className="flex flex-col gap-2">
          <h3 className="text-xs font-semibold text-foreground">کانال پس‌انداز</h3>
          <div className="grid grid-cols-2 gap-2">
            {CHANNELS.map((item) => {
              const active = channelId === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setChannelId(item.id)}
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
          <p className="text-xs leading-relaxed text-muted-foreground">
            واریز ماهانه{" "}
            <span className="font-medium text-foreground">
              {formatAmountLabel(MONTHLY_DEPOSIT)}
            </span>{" "}
            — موجودی انباشته در طول سال
          </p>
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
                موجودی پایان سال:
              </span>
              <span
                className="inline-flex items-center gap-1 font-semibold"
                style={{ color: BAR_COLOR }}
              >
                <span>{formatAmountLabel(finalBalance)}</span>
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
                سود تقریبی:
              </span>
              <span
                className="inline-flex items-center gap-1 font-semibold"
                style={{ color: ACCENT_COLOR }}
              >
                {formatAmountLabel(profit)}
                <span className="font-normal opacity-80">
                  ({formatPersianNumber(profitPct.toFixed(0))}٪)
                </span>
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            مجموع واریز: {formatAmountLabel(totalDeposited)}
          </p>
        </section>
      </aside>

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
            data={data}
            barCategoryGap="18%"
            margin={{ top: 12, right: 8, left: 4, bottom: 4 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="4 4" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(v) => String(v).slice(0, 3)}
            />
            <YAxis
              type="number"
              domain={[0, domainMax]}
              ticks={ticks}
              width={40}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(v) => formatCompact(Number(v))}
            />
            <ChartTooltip
              cursor={{
                fill: "color-mix(in oklab, var(--foreground) 4%, transparent)",
              }}
              content={({ active, payload }) => {
                if (!(active && payload?.length)) return null
                const row = payload[0]?.payload as MonthRow | undefined
                if (!row) return null
                return (
                  <div
                    dir="rtl"
                    className="min-w-[9.5rem] rounded-lg border bg-background px-3 py-2 text-xs font-sans tracking-[0]"
                  >
                    <p className="mb-1 font-medium text-foreground">
                      {row.month}
                    </p>
                    <p className="text-muted-foreground">
                      موجودی:{" "}
                      <span className="font-semibold text-foreground">
                        {formatAmountLabel(row.balance)}
                      </span>
                    </p>
                    <p className="mt-0.5 text-muted-foreground">
                      واریز ماه:{" "}
                      <span className="font-semibold text-foreground">
                        {formatAmountLabel(row.deposit)}
                      </span>
                    </p>
                  </div>
                )
              }}
            />
            <Bar
              dataKey="balance"
              fill={BAR_COLOR}
              shape={barShape}
              maxBarSize={36}
              isAnimationActive={false}
            />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  )
}
