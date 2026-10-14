"use client"

import { useId } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { useChart2Caption, usePersianMockData } from "@/components/chart2-live"
import {
  CHART2_BAR_COLORS,
  CHART2_SERIES_LABELS,
  chart2AreaContainerClassName,
  chart2NumClassName,
  formatPersianNumber,
  toPersianDigits,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

/** حضوری · آنلاین · سفارش — از پالت CHART2 (همخوان با stacked) */
const SERIES = [
  { key: "x" as const, label: CHART2_SERIES_LABELS.x, color: CHART2_BAR_COLORS[1] },
  { key: "y" as const, label: CHART2_SERIES_LABELS.y, color: CHART2_BAR_COLORS[2] },
  { key: "z" as const, label: CHART2_SERIES_LABELS.z, color: CHART2_BAR_COLORS[0] },
]

const chartConfig = {
  x: { label: SERIES[0]!.label, color: SERIES[0]!.color },
  y: { label: SERIES[1]!.label, color: SERIES[1]!.color },
  z: { label: SERIES[2]!.label, color: SERIES[2]!.color },
} satisfies ChartConfig

type Row = {
  label: string
  x: number
  y: number
  z: number
}

function toPercent(decimal: number) {
  return `${toPersianDigits(Math.round(decimal * 100))}٪`
}

function PercentTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{
    dataKey?: string | number
    value?: number
    payload?: Row
  }>
  label?: string
}) {
  if (!(active && payload?.length)) return null
  const row = payload[0]?.payload
  if (!row) return null
  const total = row.x + row.y + row.z
  return (
    <div
      className="min-w-[11rem] rounded-xl border bg-background/95 px-3 py-2.5 text-xs shadow-lg backdrop-blur-sm font-sans"
      dir="rtl"
    >
      <p className="mb-2.5 text-[13px] font-semibold tracking-tight">
        {label ?? row.label}
      </p>
      <div className="space-y-2">
        {SERIES.map(({ key, label: seriesLabel, color }) => {
          const value = row[key]
          const pct = total > 0 ? value / total : 0
          return (
            <div key={key}>
              <div className="mb-1 flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span
                    className="size-2 rounded-full"
                    style={{ background: color }}
                    aria-hidden
                  />
                  {seriesLabel}
                </span>
                <span
                  className={`${chart2NumClassName} font-semibold text-foreground`}
                >
                  {toPercent(pct)}
                </span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-muted/60">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.max(pct * 100, 2)}%`,
                    background: color,
                  }}
                />
              </div>
              <p
                className={`mt-0.5 text-end text-[10px] text-muted-foreground ${chart2NumClassName}`}
              >
                {formatPersianNumber(value)}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ShareChip({
  label,
  pct,
  color,
}: {
  label: string
  pct: number
  color: string
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5 rounded-lg border border-border/40 bg-muted/15 px-2.5 py-2">
      <div className="flex items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-1.5 text-[11px] text-muted-foreground">
          <span
            className="size-1.5 shrink-0 rounded-full"
            style={{ background: color }}
            aria-hidden
          />
          <span className="truncate">{label}</span>
        </span>
        <span
          className={`shrink-0 text-[12px] font-semibold ${chart2NumClassName}`}
        >
          {toPercent(pct)}
        </span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-muted/50">
        <div
          className="h-full rounded-full transition-[width] duration-700"
          style={{
            width: `${Math.max(pct * 100, 2)}%`,
            background: color,
          }}
        />
      </div>
    </div>
  )
}

export default function PercentAreaChartDemo({
  isAnimationActive = true,
}: {
  isAnimationActive?: boolean
}) {
  const uid = useId().replace(/:/g, "")
  const data = usePersianMockData(7, 198905) as Row[]
  const latest = data[data.length - 1]
  const latestTotal = latest ? latest.x + latest.y + latest.z : 0

  useChart2Caption(() => (
    <>
      سهم نسبی کانال‌ها در هر دوره — همیشه جمع{" "}
      <span className={chart2NumClassName}>۱۰۰٪</span>
    </>
  ))

  return (
    <div className="flex w-full max-w-[700px] flex-col gap-3 font-sans">
      {latest && latestTotal > 0 ? (
        <div className="flex flex-col gap-1.5">
          <p className="px-0.5 text-[11px] text-muted-foreground">
            ترکیب {latest.label}
          </p>
          <div className="flex gap-2">
            {SERIES.map(({ key, label, color }) => (
              <ShareChip
                key={key}
                label={label}
                pct={latest[key] / latestTotal}
                color={color}
              />
            ))}
          </div>
        </div>
      ) : null}

      <ChartContainer
        config={chartConfig}
        className={chart2AreaContainerClassName}
      >
        <AreaChart
          accessibilityLayer
          data={data}
          stackOffset="expand"
          margin={{ top: 12, right: 8, left: 0, bottom: 4 }}
        >
          <defs>
            {SERIES.map(({ key, color }) => (
              <linearGradient
                key={key}
                id={`pct-${key}-${uid}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={color} stopOpacity={0.78} />
                <stop offset="55%" stopColor={color} stopOpacity={0.42} />
                <stop offset="100%" stopColor={color} stopOpacity={0.18} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            reversed
            tickMargin={10}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            orientation="right"
            width={44}
            tickMargin={8}
            axisLine={false}
            tickLine={false}
            tickFormatter={toPercent}
            tickCount={5}
          />
          <ChartTooltip
            cursor={{ stroke: "var(--border)", strokeDasharray: "4 4" }}
            content={<PercentTooltip />}
          />
          <ChartLegend content={<ChartLegendContent />} />
          {SERIES.map(({ key, color }, index) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              name={key}
              stackId="pct"
              stroke={color}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill={`url(#pct-${key}-${uid})`}
              fillOpacity={1}
              isAnimationActive={isAnimationActive}
              animationBegin={index * 110}
              animationDuration={1100}
              activeDot={{
                r: 4,
                strokeWidth: 2,
                stroke: "var(--background)",
                fill: color,
              }}
            />
          ))}
        </AreaChart>
      </ChartContainer>
    </div>
  )
}
