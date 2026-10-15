"use client"

import { useId } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { useChartCaption, usePersianMockData } from "@/components/chart-live"
import { useMarketNeon } from "@/examples/chart/area/use-market-neon"
import {
  CHART_BAR_COLORS,
  CHART_SERIES_LABELS,
  MARKET_DOWN,
  MARKET_MUTE,
  MARKET_UP,
  chartAreaContainerClassName,
  chartAreaGradientStops,
  chartNeonGlowProps,
  chartNeonOverflowClassName,
  chartNumClassName,
  formatPersianNumber,
  toPersianDigits,
} from "@/lib/chart-fa"
import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

type SeriesKey = "x" | "y" | "z"

type SeriesDef = {
  key: SeriesKey
  label: string
  color: string
}

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
  series,
}: {
  active?: boolean
  payload?: Array<{
    dataKey?: string | number
    value?: number
    payload?: Row
  }>
  label?: string
  series: SeriesDef[]
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
        {series.map(({ key, label: seriesLabel, color }) => {
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
                  className={`${chartNumClassName} font-semibold text-foreground`}
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
                className={`mt-0.5 text-end text-[10px] text-muted-foreground ${chartNumClassName}`}
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
    <div className="flex min-w-0 flex-1 flex-col gap-1.5 rounded-lg border border-border/40 bg-transparent px-2.5 py-2">
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
          className={`shrink-0 text-[12px] font-semibold ${chartNumClassName}`}
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
  const neon = useMarketNeon()
  const uid = useId().replace(/:/g, "")
  const data = usePersianMockData(7, 198905) as Row[]
  const latest = data[data.length - 1]
  const latestTotal = latest ? latest.x + latest.y + latest.z : 0

  const colors = neon
    ? ([MARKET_UP, MARKET_DOWN, MARKET_MUTE] as const)
    : ([CHART_BAR_COLORS[1], CHART_BAR_COLORS[2], CHART_BAR_COLORS[0]] as const)

  const series: SeriesDef[] = [
    { key: "x", label: CHART_SERIES_LABELS.x, color: colors[0] },
    { key: "y", label: CHART_SERIES_LABELS.y, color: colors[1] },
    { key: "z", label: CHART_SERIES_LABELS.z, color: colors[2] },
  ]

  const chartConfig = {
    x: { label: series[0]!.label, color: series[0]!.color },
    y: { label: series[1]!.label, color: series[1]!.color },
    z: { label: series[2]!.label, color: series[2]!.color },
  } satisfies ChartConfig

  useChartCaption(() =>
    neon ? (
      <>
        سهم نسبی کانال‌ها — الگوی مارکت سبز / صورتی / خاکستری · جمع{" "}
        <span className={chartNumClassName}>۱۰۰٪</span>
      </>
    ) : (
      <>
        سهم نسبی کانال‌ها در هر دوره — همیشه جمع{" "}
        <span className={chartNumClassName}>۱۰۰٪</span>
      </>
    )
  )

  return (
    <div className="flex w-full max-w-[700px] flex-col gap-3 font-sans">
      {latest && latestTotal > 0 ? (
        <div className="flex flex-col gap-1.5">
          <p className="px-0.5 text-[11px] text-muted-foreground">
            ترکیب {latest.label}
          </p>
          <div className="flex gap-2">
            {series.map(({ key, label, color }) => (
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
        className={cn(
          chartAreaContainerClassName,
          neon && chartNeonOverflowClassName
        )}
      >
        <AreaChart
          accessibilityLayer
          data={data}
          stackOffset="expand"
          margin={{ top: 12, right: 8, left: 0, bottom: 4 }}
        >
          <defs>
            {series.map(({ key, color }) => {
              const stops = chartAreaGradientStops(color, {
                startOpacity: neon ? 0.32 : 0.78,
                endOpacity: neon ? 0 : 0.18,
              })
              return (
                <linearGradient
                  key={key}
                  id={`pct-${key}-${uid}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  {stops.map((s) => (
                    <stop
                      key={s.offset}
                      offset={s.offset}
                      stopColor={s.stopColor}
                      stopOpacity={s.stopOpacity}
                    />
                  ))}
                </linearGradient>
              )
            })}
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
            content={(props) => (
              <PercentTooltip
                active={props.active}
                payload={
                  props.payload as Array<{
                    dataKey?: string | number
                    value?: number
                    payload?: Row
                  }>
                }
                label={typeof props.label === "string" ? props.label : undefined}
                series={series}
              />
            )}
          />
          <ChartLegend content={<ChartLegendContent />} />
          {series.map(({ key, color }, index) => {
            const glow = neon ? chartNeonGlowProps(color) : null
            return (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                name={key}
                stackId="pct"
                stroke={color}
                strokeWidth={glow?.strokeWidth ?? 1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={`url(#pct-${key}-${uid})`}
                fillOpacity={1}
                isAnimationActive={isAnimationActive}
                animationBegin={index * 110}
                animationDuration={1100}
                style={glow?.style}
                className={glow?.className}
                activeDot={
                  neon
                    ? {
                        r: 4.2,
                        strokeWidth: 0,
                        fill: color,
                        style: { filter: `drop-shadow(0 0 5px ${color})` },
                      }
                    : {
                        r: 4,
                        strokeWidth: 2,
                        stroke: "var(--background)",
                        fill: color,
                      }
                }
              />
            )
          })}
        </AreaChart>
      </ChartContainer>
    </div>
  )
}
