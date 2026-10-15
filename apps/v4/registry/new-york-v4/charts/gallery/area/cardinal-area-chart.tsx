"use client"

import { useId } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { useChartCaption, usePersianMockData } from "@/lib/chart-live"
import { useMarketNeon } from "@/lib/use-market-neon"
import {
  CHART_BAR_COLORS,
  MARKET_DOWN,
  MARKET_UP,
  chartAreaGradientStops,
  chartDashedGridClassName,
  chartNeonGlowProps,
  chartNeonOverflowClassName,
  formatChartNumber,
  formatPersianNumber,
  toPersianDigits,
} from "@/lib/chart-fa"
import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

type CurvePoint = { label: string; value: number }

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
  neon,
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
  neon: boolean
  isAnimationActive: boolean
  delay?: number
}) {
  const glow = neon ? chartNeonGlowProps(color) : null
  const stops = chartAreaGradientStops(color, {
    startOpacity: neon ? 0.32 : 0.32,
    endOpacity: neon ? 0 : 0,
  })

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
        className={cn(
          "aspect-[1.45] h-auto w-full max-w-none rounded-xl border border-border/50 bg-transparent font-sans text-xs",
          chartDashedGridClassName,
          neon && chartNeonOverflowClassName
        )}
      >
        <AreaChart
          accessibilityLayer
          data={data}
          margin={{ top: 14, right: 6, left: 0, bottom: 2 }}
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
            tickFormatter={formatChartNumber}
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
            strokeWidth={glow?.strokeWidth ?? 1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={`url(#${gradId})`}
            fillOpacity={1}
            isAnimationActive={isAnimationActive}
            animationBegin={delay}
            animationDuration={1200}
            animationEasing="ease-out"
            style={glow?.style}
            className={glow?.className}
            dot={false}
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

export default function CardinalAreaChartDemo({
  isAnimationActive = true,
}: {
  isAnimationActive?: boolean
}) {
  const neon = useMarketNeon()
  const uid = useId().replace(/:/g, "")
  const raw = usePersianMockData(10, 9823)
  const data: CurvePoint[] = raw.map((row) => ({
    label: row.label,
    value: row.x,
  }))

  const mono = neon ? MARKET_UP : CHART_BAR_COLORS[0]
  const cardinal = neon ? MARKET_DOWN : CHART_BAR_COLORS[2]

  const monoConfig = {
    value: { label: "یکنواخت", color: mono },
  } satisfies ChartConfig

  const cardinalConfig = {
    value: { label: "کاردینال", color: cardinal },
  } satisfies ChartConfig

  const last = data[data.length - 1]
  const first = data[0]
  const delta =
    first && last && first.value
      ? ((last.value - first.value) / first.value) * 100
      : 0

  useChartCaption(() =>
    neon ? (
      <>
        مقایسهٔ منحنی — سبز / صورتی مارکت · تغییر دوره{" "}
        <span className="fa-num" dir="ltr">
          {delta >= 0 ? "+" : ""}
          {toPersianDigits(delta.toFixed(1))}٪
        </span>
      </>
    ) : (
      <>
        مقایسهٔ منحنی — یکنواخت در برابر کاردینال · تغییر دوره{" "}
        <span className="fa-num" dir="ltr">
          {delta >= 0 ? "+" : ""}
          {toPersianDigits(delta.toFixed(1))}٪
        </span>
      </>
    )
  )

  return (
    <div className="flex w-full max-w-[760px] flex-col gap-3 font-sans">
      <div className="grid gap-3 sm:grid-cols-2">
        <CurvePanel
          title="منحنی یکنواخت"
          en="Monotone"
          color={mono}
          curve="monotone"
          data={data}
          gradId={`mono-grad-${uid}`}
          config={monoConfig}
          neon={neon}
          isAnimationActive={isAnimationActive}
        />
        <CurvePanel
          title="منحنی کاردینال"
          en="Natural"
          color={cardinal}
          curve="natural"
          data={data}
          gradId={`nat-grad-${uid}`}
          config={cardinalConfig}
          neon={neon}
          isAnimationActive={isAnimationActive}
          delay={140}
        />
      </div>
    </div>
  )
}
