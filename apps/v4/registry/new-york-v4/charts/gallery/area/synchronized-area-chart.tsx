"use client"

import { useId } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { useChartCaption, usePersianMockData } from "@/lib/chart-live"
import { useMarketNeon } from "@/lib/use-market-neon"
import {
  CHART_BAR_COLORS,
  CHART_SERIES_LABELS,
  MARKET_DOWN,
  MARKET_MUTE,
  MARKET_UP,
  chartAreaGradientStops,
  chartDashedGridClassName,
  chartNeonGlowProps,
  chartNeonOverflowClassName,
  chartNumClassName,
  formatChartNumber,
  formatPersianNumber,
} from "@/lib/chart-fa"
import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

const SYNC_ID = "chart-area-sync"

type Row = {
  label: string
  x: number
  y: number
  z: number
}

function SyncTooltip({
  active,
  payload,
  label,
  color,
  seriesLabel,
}: {
  active?: boolean
  payload?: Array<{ value?: number }>
  label?: string
  color: string
  seriesLabel: string
}) {
  if (!(active && payload?.length)) return null
  const value = payload[0]?.value
  if (value == null) return null
  return (
    <div
      className="min-w-[8rem] rounded-xl border bg-background/95 px-3 py-2 text-xs shadow-lg backdrop-blur-sm font-sans"
      dir="rtl"
    >
      <p className="mb-1.5 font-semibold tracking-tight">{label}</p>
      <div className="flex items-center justify-between gap-4 text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span
            className="size-2 rounded-full"
            style={{ background: color }}
            aria-hidden
          />
          {seriesLabel}
        </span>
        <span className={`${chartNumClassName} font-semibold text-foreground`}>
          {formatPersianNumber(value)}
        </span>
      </div>
    </div>
  )
}

function SyncPanel({
  title,
  en,
  color,
  dataKey,
  data,
  config,
  gradId,
  neon,
  dashed,
  delay,
  isAnimationActive,
}: {
  title: string
  en: string
  color: string
  dataKey: "x" | "y" | "z"
  data: Row[]
  config: ChartConfig
  gradId: string
  neon: boolean
  dashed?: boolean
  delay: number
  isAnimationActive: boolean
}) {
  const latest = data[data.length - 1]
  const latestValue = latest?.[dataKey]
  const glow = neon ? chartNeonGlowProps(color) : null
  const stops = chartAreaGradientStops(color, {
    startOpacity: neon ? 0.32 : 0.45,
    endOpacity: neon ? 0 : 0.02,
  })

  return (
    <div className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-border/50 bg-transparent">
      <div className="flex items-center justify-between gap-2 border-b border-border/40 px-3 py-2">
        <span className="flex min-w-0 items-center gap-1.5">
          <span
            className="size-1.5 shrink-0 rounded-full"
            style={{ background: color }}
            aria-hidden
          />
          <span className="truncate text-[13px] font-semibold tracking-tight">
            {title}
          </span>
          <span
            dir="ltr"
            lang="en"
            className="shrink-0 font-sans text-[10px] text-muted-foreground/70"
          >
            {en}
          </span>
        </span>
        {latestValue != null ? (
          <span
            className={`shrink-0 text-[13px] font-semibold ${chartNumClassName}`}
          >
            {formatPersianNumber(latestValue)}
          </span>
        ) : null}
      </div>

      <ChartContainer
        config={config}
        className={cn(
          "aspect-[2.4] h-auto w-full max-w-none max-h-[18vh] p-1.5 pt-0 font-sans text-xs",
          chartDashedGridClassName,
          neon && chartNeonOverflowClassName
        )}
      >
        <AreaChart
          accessibilityLayer
          data={data}
          syncId={SYNC_ID}
          margin={{ top: 10, right: 6, left: 0, bottom: 2 }}
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              {stops.map((s) => (
                <stop
                  key={s.offset}
                  offset={s.offset}
                  stopColor={s.stopColor}
                  stopOpacity={s.stopOpacity}
                />
              ))}
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            reversed
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={24}
          />
          <YAxis
            orientation="right"
            width={44}
            tickLine={false}
            axisLine={false}
            tickMargin={6}
            tickCount={3}
            tickFormatter={formatChartNumber}
          />
          <ChartTooltip
            cursor={{
              stroke: color,
              strokeOpacity: 0.4,
              strokeDasharray: "4 4",
            }}
            content={(props) => (
              <SyncTooltip
                active={props.active}
                payload={props.payload as Array<{ value?: number }>}
                label={props.label as string | undefined}
                color={color}
                seriesLabel={title}
              />
            )}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={glow?.strokeWidth ?? 1.75}
            strokeDasharray={dashed ? "7 5" : undefined}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={`url(#${gradId})`}
            fillOpacity={1}
            isAnimationActive={isAnimationActive}
            animationBegin={delay}
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
        </AreaChart>
      </ChartContainer>
    </div>
  )
}

export default function SynchronizedAreaChartDemo({
  isAnimationActive = true,
}: {
  isAnimationActive?: boolean
}) {
  const neon = useMarketNeon()
  const uid = useId().replace(/:/g, "")
  const data = usePersianMockData(7, 298905) as Row[]

  const colors = neon
    ? ([MARKET_UP, MARKET_DOWN, MARKET_MUTE] as const)
    : ([CHART_BAR_COLORS[0], CHART_BAR_COLORS[2], CHART_BAR_COLORS[1]] as const)

  const chartConfig = {
    x: { label: CHART_SERIES_LABELS.x, color: colors[0] },
    y: { label: CHART_SERIES_LABELS.y, color: colors[1] },
    z: { label: CHART_SERIES_LABELS.z, color: colors[2] },
  } satisfies ChartConfig

  const series = [
    {
      key: "x" as const,
      title: CHART_SERIES_LABELS.x,
      en: "Store",
      color: colors[0],
    },
    {
      key: "y" as const,
      title: CHART_SERIES_LABELS.y,
      en: "Online",
      color: colors[1],
    },
    {
      key: "z" as const,
      title: CHART_SERIES_LABELS.z,
      en: "Orders",
      color: colors[2],
      dashed: true,
    },
  ]

  useChartCaption(() =>
    neon ? (
      <>سه کانال همگام — سبز / صورتی / خاکستری مارکت</>
    ) : (
      <>سه کانال همگام — هاور روی یکی، همه با هم حرکت می‌کنند</>
    )
  )

  return (
    <div className="flex w-full max-w-[700px] flex-col gap-2.5 font-sans">
      {series.map((item, index) => (
        <SyncPanel
          key={item.key}
          title={item.title}
          en={item.en}
          color={item.color}
          dataKey={item.key}
          data={data}
          config={chartConfig}
          gradId={`sync-${item.key}-${uid}`}
          neon={neon}
          dashed={"dashed" in item && item.dashed}
          delay={index * 140}
          isAnimationActive={isAnimationActive}
        />
      ))}
    </div>
  )
}
