"use client"

import { useId } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { useChart2Caption, usePersianMockData } from "@/components/chart2-live"
import {
  CHART2_SERIES_LABELS,
  chart2BarMockConfig,
  chart2DashedGridClassName,
  chart2NumClassName,
  formatChart2Number,
  formatPersianNumber,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartTooltip,
} from "@/registry/new-york-v4/ui/chart"

const chartConfig = chart2BarMockConfig

const SERIES = [
  {
    key: "x" as const,
    title: CHART2_SERIES_LABELS.x,
    en: "Store",
    color: chartConfig.x.color,
  },
  {
    key: "y" as const,
    title: CHART2_SERIES_LABELS.y,
    en: "Online",
    color: chartConfig.y.color,
  },
  {
    key: "z" as const,
    title: CHART2_SERIES_LABELS.z,
    en: "Orders",
    color: chartConfig.z.color,
    dashed: true,
  },
] as const

const SYNC_ID = "chart2-area-sync"

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
        <span className={`${chart2NumClassName} font-semibold text-foreground`}>
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
  gradId,
  dashed,
  delay,
  isAnimationActive,
}: {
  title: string
  en: string
  color: string
  dataKey: "x" | "y" | "z"
  data: Row[]
  gradId: string
  dashed?: boolean
  delay: number
  isAnimationActive: boolean
}) {
  const latest = data[data.length - 1]
  const latestValue = latest?.[dataKey]

  return (
    <div className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-border/50 bg-background">
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
            className={`shrink-0 text-[13px] font-semibold ${chart2NumClassName}`}
          >
            {formatPersianNumber(latestValue)}
          </span>
        ) : null}
      </div>

      <ChartContainer
        config={chartConfig}
        className={`aspect-[2.4] h-auto w-full max-w-none max-h-[18vh] p-1.5 pt-0 font-sans text-xs ${chart2DashedGridClassName}`}
      >
        <AreaChart
          accessibilityLayer
          data={data}
          syncId={SYNC_ID}
          margin={{ top: 10, right: 6, left: 0, bottom: 2 }}
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.45} />
              <stop offset="55%" stopColor={color} stopOpacity={0.14} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
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
            tickFormatter={formatChart2Number}
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
            strokeWidth={1.75}
            strokeDasharray={dashed ? "7 5" : undefined}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={`url(#${gradId})`}
            fillOpacity={1}
            isAnimationActive={isAnimationActive}
            animationBegin={delay}
            animationDuration={1100}
            activeDot={{
              r: 4,
              strokeWidth: 2,
              stroke: "var(--background)",
              fill: color,
            }}
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
  const uid = useId().replace(/:/g, "")
  const data = usePersianMockData(7, 298905) as Row[]

  useChart2Caption(
    () => <>سه کانال همگام — هاور روی یکی، همه با هم حرکت می‌کنند</>
  )

  return (
    <div className="flex w-full max-w-[700px] flex-col gap-2.5 font-sans">
      {SERIES.map((series, index) => (
        <SyncPanel
          key={series.key}
          title={series.title}
          en={series.en}
          color={series.color}
          dataKey={series.key}
          data={data}
          gradId={`sync-${series.key}-${uid}`}
          dashed={"dashed" in series && series.dashed}
          delay={index * 140}
          isAnimationActive={isAnimationActive}
        />
      ))}
    </div>
  )
}
