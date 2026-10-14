"use client"

import { useId } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { useChart2Caption, usePersianMockData } from "@/components/chart2-live"
import {
  CHART2_BAR_COLORS,
  chart2DashedGridClassName,
  formatChart2Number,
  formatPersianNumber,
  toPersianDigits,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

const MONOTONE = CHART2_BAR_COLORS[0]
const CARDINAL = CHART2_BAR_COLORS[2]

type CurvePoint = { label: string; value: number }

const monoConfig = {
  value: { label: "یکنواخت", color: MONOTONE },
} satisfies ChartConfig

const cardinalConfig = {
  value: { label: "کاردینال", color: CARDINAL },
} satisfies ChartConfig

function CurveTooltip({
  active,
  payload,
  color,
}: {
  active?: boolean
  payload?: Array<{ payload?: CurvePoint }>
  color: string
}) {
  if (!(active && payload?.length)) return null
  const row = payload[0]?.payload
  if (!row) return null
  return (
    <div
      className="min-w-[7.5rem] rounded-xl border bg-background/95 px-3 py-2 text-xs shadow-lg backdrop-blur-sm font-sans"
      dir="rtl"
    >
      <div className="mb-1 flex items-center gap-1.5">
        <span
          className="size-2 rounded-full"
          style={{ background: color }}
          aria-hidden
        />
        <span className="font-medium">{row.label}</span>
      </div>
      <p className="text-muted-foreground">
        مقدار:{" "}
        <span className="fa-num text-foreground font-semibold">
          {formatPersianNumber(row.value)}
        </span>
      </p>
    </div>
  )
}

function CurvePanel({
  title,
  en,
  color,
  curve,
  data,
  gradId,
  config,
  isAnimationActive,
  delay = 0,
}: {
  title: string
  en: string
  color: string
  curve: "monotone" | "natural"
  data: CurvePoint[]
  gradId: string
  config: ChartConfig
  isAnimationActive: boolean
  delay?: number
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2 px-0.5">
        <span className="flex min-w-0 items-center gap-1.5 text-[12px] font-medium text-foreground">
          <span
            className="size-1.5 shrink-0 rounded-full"
            style={{ background: color }}
            aria-hidden
          />
          <span className="truncate">{title}</span>
        </span>
        <span
          dir="ltr"
          lang="en"
          className="shrink-0 font-sans text-[10px] text-muted-foreground/70"
        >
          {en}
        </span>
      </div>

      <ChartContainer
        config={config}
        className={`aspect-[1.45] h-auto w-full max-w-none rounded-xl border border-border/50 bg-background font-sans text-xs ${chart2DashedGridClassName}`}
      >
        <AreaChart
          accessibilityLayer
          data={data}
          margin={{ top: 14, right: 6, left: 0, bottom: 2 }}
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.32} />
              <stop offset="50%" stopColor={color} stopOpacity={0.12} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            reversed
            tickMargin={8}
            minTickGap={28}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            orientation="right"
            width={44}
            tickMargin={6}
            tickCount={4}
            axisLine={false}
            tickLine={false}
            tickFormatter={formatChart2Number}
          />
          <ChartTooltip
            cursor={{
              stroke: color,
              strokeOpacity: 0.35,
              strokeDasharray: "4 4",
            }}
            content={(props) => (
              <CurveTooltip
                active={props.active}
                payload={props.payload as Array<{ payload?: CurvePoint }>}
                color={color}
              />
            )}
          />
          <Area
            type={curve}
            dataKey="value"
            stroke={color}
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={`url(#${gradId})`}
            fillOpacity={1}
            isAnimationActive={isAnimationActive}
            animationBegin={delay}
            animationDuration={1200}
            animationEasing="ease-out"
            dot={false}
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

export default function CardinalAreaChartDemo({
  isAnimationActive = true,
}: {
  isAnimationActive?: boolean
}) {
  const uid = useId().replace(/:/g, "")
  const raw = usePersianMockData(10, 9823)
  const data: CurvePoint[] = raw.map((row) => ({
    label: row.label,
    value: row.x,
  }))

  const last = data[data.length - 1]
  const first = data[0]
  const delta =
    first && last && first.value
      ? ((last.value - first.value) / first.value) * 100
      : 0

  useChart2Caption(() => (
    <>
      مقایسهٔ منحنی — یکنواخت در برابر کاردینال · تغییر دوره{" "}
      <span className="fa-num" dir="ltr">
        {delta >= 0 ? "+" : ""}
        {toPersianDigits(delta.toFixed(1))}٪
      </span>
    </>
  ))

  return (
    <div className="flex w-full max-w-[760px] flex-col gap-3 font-sans">
      <div className="grid gap-3 sm:grid-cols-2">
        <CurvePanel
          title="منحنی یکنواخت"
          en="Monotone"
          color={MONOTONE}
          curve="monotone"
          data={data}
          gradId={`mono-grad-${uid}`}
          config={monoConfig}
          isAnimationActive={isAnimationActive}
        />
        <CurvePanel
          title="منحنی کاردینال"
          en="Natural"
          color={CARDINAL}
          curve="natural"
          data={data}
          gradId={`nat-grad-${uid}`}
          config={cardinalConfig}
          isAnimationActive={isAnimationActive}
          delay={140}
        />
      </div>
    </div>
  )
}
