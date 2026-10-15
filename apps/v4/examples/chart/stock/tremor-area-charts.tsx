"use client"

/**
 * Tremor-inspired area charts — polished like the sparklines portfolio demo.
 */

import * as React from "react"
import { useId } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts"

import { useChartCaption } from "@/components/chart-live"
import { useMarketNeon } from "@/examples/chart/area/use-market-neon"
import {
  CHART_TOMAN_AXIS_WIDTH,
  formatToman,
} from "@/lib/chart-locale"
import { TomanAxisTick } from "@/lib/chart-toman-tick"
import {
  chartBarContainerClassName,
  chartAreaGradientStops,
  chartDashedGridClassName,
  chartNeonGlowProps,
  chartNeonOverflowClassName,
  CHART_BAR_COLORS,
  FA_CHART,
  FA_MONTHS_FULL,
  MARKET_DOWN,
  MARKET_MUTE,
  MARKET_UP,
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

import { CANDLE_DOWN, CANDLE_UP } from "./stock-shared"

type MonthRow = {
  month: string
  store: number
  online: number
}

const chartData: MonthRow[] = FA_MONTHS_FULL.map((month, i) => {
  const store = [
    2_890_000, 2_756_000, 3_322_000, 3_470_000, 3_475_000, 3_129_000, 3_490_000,
    2_903_000, 2_643_000, 2_837_000, 2_954_000, 3_239_000,
  ][i]!
  const online = [
    2_338_000, 2_103_000, 2_194_000, 2_108_000, 1_812_000, 1_726_000, 1_982_000,
    2_012_000, 2_342_000, 2_473_000, 2_848_000, 2_736_000,
  ][i]!
  return { month, store, online }
})

function pctChange(first: number, last: number) {
  if (first === 0) return 0
  return ((last - first) / first) * 100
}

function formatPct(value: number) {
  const sign = value > 0 ? "+" : ""
  return `${sign}${toPersianDigits(value.toFixed(1))}٪`
}

function formatMoney(value: number) {
  return formatToman(value, { compact: true }).replace(/ /g, "\u00A0")
}

const storeTotal = chartData.reduce((s, r) => s + r.store, 0)
const onlineTotal = chartData.reduce((s, r) => s + r.online, 0)
const yearTotal = storeTotal + onlineTotal

const storeChange = pctChange(chartData[0]!.store, chartData[chartData.length - 1]!.store)
const onlineChange = pctChange(
  chartData[0]!.online,
  chartData[chartData.length - 1]!.online
)
const yearChange = pctChange(
  chartData[0]!.store + chartData[0]!.online,
  chartData[chartData.length - 1]!.store + chartData[chartData.length - 1]!.online
)

function useTremorColors() {
  const neon = useMarketNeon()
  const store = neon ? MARKET_UP : CANDLE_UP
  const online = neon ? MARKET_DOWN : CANDLE_DOWN
  const total = neon ? MARKET_MUTE : CHART_BAR_COLORS[0]
  const up = neon ? MARKET_UP : CANDLE_UP
  const down = neon ? MARKET_DOWN : CANDLE_DOWN
  return { neon, store, online, total, up, down }
}

function KpiMiniArea({
  id,
  label,
  value,
  change,
  color,
  series,
  neon,
  upColor,
  downColor,
}: {
  id: string
  label: string
  value: number
  change: number
  color: string
  series: readonly number[]
  neon: boolean
  upColor: string
  downColor: string
}) {
  const good = change >= 0
  const data = series.map((v, i) => ({ i, value: v }))
  const config = {
    value: { label, color },
  } satisfies ChartConfig
  const uid = useId().replace(/:/g, "")
  const gradId = `tremor-kpi-${id}-${uid}`
  const glow = neon ? chartNeonGlowProps(color) : null
  const stops = chartAreaGradientStops(color, {
    startOpacity: neon ? 0.32 : 0.4,
    endOpacity: neon ? 0 : 0.02,
  })

  return (
    <div className="min-w-0 flex-1 overflow-hidden rounded-xl border border-border/60 bg-background">
      <div className="flex items-start justify-between gap-2 px-3.5 pt-3.5">
        <div className="min-w-0">
          <p className="text-muted-foreground text-[11px] font-medium tracking-wide">
            {label}
          </p>
          <p className="mt-0.5 fa-num whitespace-nowrap text-[13px] font-semibold sm:text-sm">
            {formatMoney(value)}
          </p>
        </div>
        <span
          className="shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-medium"
          style={{
            color: good ? upColor : downColor,
            background: good ? `${upColor}18` : `${downColor}18`,
          }}
        >
          {formatPct(change)}
        </span>
      </div>
      <ChartContainer
        config={config}
        className={cn(
          "aspect-auto h-[72px] w-full font-sans",
          neon && chartNeonOverflowClassName
        )}
      >
        <AreaChart data={data} margin={{ top: 6, right: 0, bottom: 0, left: 0 }}>
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
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            fill={`url(#${gradId})`}
            strokeWidth={glow?.strokeWidth ?? 2}
            dot={false}
            activeDot={false}
            isAnimationActive={false}
            style={glow?.style}
            className={glow?.className}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}

function RevenueTooltip({
  active,
  payload,
  storeColor,
  onlineColor,
}: TooltipContentProps & { storeColor: string; onlineColor: string }) {
  if (!(active && payload?.length)) return null
  const row = payload[0]?.payload as MonthRow | undefined
  if (!row) return null
  const total = row.store + row.online

  return (
    <div className="min-w-[10rem] rounded-lg border bg-background px-3 py-2.5 text-xs shadow-xl font-sans">
      <p className="mb-2 font-medium">{row.month}</p>
      <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span
            className="size-1.5 rounded-full"
            style={{ background: storeColor }}
          />
          {FA_CHART.store}
        </span>
        <span className="text-end text-foreground">{formatMoney(row.store)}</span>
        <span className="flex items-center gap-1.5">
          <span
            className="size-1.5 rounded-full"
            style={{ background: onlineColor }}
          />
          {FA_CHART.online}
        </span>
        <span className="text-end text-foreground">{formatMoney(row.online)}</span>
      </div>
      <p className="mt-2 border-t pt-1.5 text-end font-medium text-foreground">
        جمع: {formatMoney(total)}
      </p>
    </div>
  )
}

function AreaGradients({
  idPrefix,
  storeColor,
  onlineColor,
  neon,
}: {
  idPrefix: string
  storeColor: string
  onlineColor: string
  neon: boolean
}) {
  const storeStops = chartAreaGradientStops(storeColor, {
    startOpacity: neon ? 0.32 : 0.36,
    endOpacity: neon ? 0 : 0.02,
  })
  const onlineStops = chartAreaGradientStops(onlineColor, {
    startOpacity: neon ? 0.32 : 0.36,
    endOpacity: neon ? 0 : 0.02,
  })
  return (
    <defs>
      <linearGradient id={`${idPrefix}-store`} x1="0" y1="0" x2="0" y2="1">
        {storeStops.map((s) => (
          <stop
            key={s.offset}
            offset={s.offset}
            stopColor={s.stopColor}
            stopOpacity={s.stopOpacity}
          />
        ))}
      </linearGradient>
      <linearGradient id={`${idPrefix}-online`} x1="0" y1="0" x2="0" y2="1">
        {onlineStops.map((s) => (
          <stop
            key={s.offset}
            offset={s.offset}
            stopColor={s.stopColor}
            stopOpacity={s.stopOpacity}
          />
        ))}
      </linearGradient>
    </defs>
  )
}

function HeroArea() {
  const { neon, store, online } = useTremorColors()
  const [activeMonth, setActiveMonth] = React.useState(
    chartData[chartData.length - 1]!.month
  )
  const active =
    chartData.find((row) => row.month === activeMonth) ??
    chartData[chartData.length - 1]!
  const total = active.store + active.online
  const storeGlow = neon ? chartNeonGlowProps(store) : null
  const onlineGlow = neon ? chartNeonGlowProps(online) : null

  const chartConfig = {
    store: { label: FA_CHART.store, color: store },
    online: { label: FA_CHART.online, color: online },
  } satisfies ChartConfig

  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-background">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border/50 px-4 py-3">
        <div>
          <p className="text-muted-foreground text-[11px] font-medium">
            درآمد ماه
          </p>
          <p className="mt-0.5 fa-num whitespace-nowrap text-xl font-semibold">
            {formatMoney(total)}
          </p>
          <p className="text-muted-foreground mt-0.5 text-[11px]">
            {active.month}
          </p>
        </div>
        <div className="flex gap-4 text-[11px]">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span
              className="size-2 rounded-[2px]"
              style={{ background: store }}
            />
            {FA_CHART.store}
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span
              className="size-2 rounded-[2px]"
              style={{ background: online }}
            />
            {FA_CHART.online}
          </span>
        </div>
      </div>
      <ChartContainer
        config={chartConfig}
        className={cn(
          `${chartBarContainerClassName} max-h-[320px] max-w-none`,
          neon && chartNeonOverflowClassName
        )}
      >
        <AreaChart
          accessibilityLayer
          data={chartData}
          margin={{ top: 16, right: 8, left: 4, bottom: 4 }}
          onMouseMove={(state) => {
            const label = state?.activeLabel
            if (typeof label === "string" && label !== activeMonth) {
              setActiveMonth(label)
            }
          }}
        >
          <AreaGradients
            idPrefix="tremor-hero"
            storeColor={store}
            onlineColor={online}
            neon={neon}
          />
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            reversed
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            minTickGap={18}
          />
          <YAxis
            orientation="right"
            width={CHART_TOMAN_AXIS_WIDTH}
            tickLine={false}
            axisLine={false}
            tickMargin={6}
            tickCount={5}
            tick={TomanAxisTick}
          />
          <ChartTooltip
            cursor={{ stroke: store, strokeOpacity: 0.35 }}
            content={(props) => (
              <RevenueTooltip
                {...props}
                storeColor={store}
                onlineColor={online}
              />
            )}
          />
          <Area
            type="monotone"
            dataKey="store"
            stroke={store}
            strokeWidth={storeGlow?.strokeWidth ?? 2}
            fill="url(#tremor-hero-store)"
            isAnimationActive={false}
            style={storeGlow?.style}
            className={storeGlow?.className}
          />
          <Area
            type="monotone"
            dataKey="online"
            stroke={online}
            strokeWidth={onlineGlow?.strokeWidth ?? 2}
            fill="url(#tremor-hero-online)"
            isAnimationActive={false}
            style={onlineGlow?.style}
            className={onlineGlow?.className}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}

function VariantCard({
  title,
  hint,
  children,
}: {
  title: string
  hint: string
  children: React.ReactNode
}) {
  return (
    <div className="min-w-0 flex-1 overflow-hidden rounded-xl border border-border/60 bg-background">
      <div className="border-b border-border/50 px-3.5 py-2.5">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-muted-foreground text-[11px]">{hint}</p>
      </div>
      <div className="px-1 pb-1 pt-2">{children}</div>
    </div>
  )
}

function StackedVariant() {
  const { neon, store, online } = useTremorColors()
  const storeGlow = neon ? chartNeonGlowProps(store) : null
  const onlineGlow = neon ? chartNeonGlowProps(online) : null
  const chartConfig = {
    store: { label: FA_CHART.store, color: store },
    online: { label: FA_CHART.online, color: online },
  } satisfies ChartConfig

  return (
    <ChartContainer
      config={chartConfig}
      className={cn(
        `aspect-auto h-[200px] w-full font-sans ${chartDashedGridClassName}`,
        neon && chartNeonOverflowClassName
      )}
    >
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
      >
        <AreaGradients
          idPrefix="tremor-stack"
          storeColor={store}
          onlineColor={online}
          neon={neon}
        />
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          reversed
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={28}
          interval="preserveStartEnd"
        />
        <YAxis hide domain={[0, "auto"]} />
        <ChartTooltip
          content={(props) => (
            <RevenueTooltip
              {...props}
              storeColor={store}
              onlineColor={online}
            />
          )}
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          type="monotone"
          dataKey="store"
          stackId="a"
          stroke={store}
          strokeWidth={storeGlow?.strokeWidth ?? 1.75}
          fill="url(#tremor-stack-store)"
          isAnimationActive={false}
          style={storeGlow?.style}
          className={storeGlow?.className}
        />
        <Area
          type="monotone"
          dataKey="online"
          stackId="a"
          stroke={online}
          strokeWidth={onlineGlow?.strokeWidth ?? 1.75}
          fill="url(#tremor-stack-online)"
          isAnimationActive={false}
          style={onlineGlow?.style}
          className={onlineGlow?.className}
        />
      </AreaChart>
    </ChartContainer>
  )
}

function PercentVariant() {
  const { neon, store, online } = useTremorColors()
  const storeGlow = neon ? chartNeonGlowProps(store) : null
  const onlineGlow = neon ? chartNeonGlowProps(online) : null
  const chartConfig = {
    store: { label: FA_CHART.store, color: store },
    online: { label: FA_CHART.online, color: online },
  } satisfies ChartConfig
  const storeStops = chartAreaGradientStops(store, {
    startOpacity: neon ? 0.4 : 0.55,
    endOpacity: neon ? 0.08 : 0.12,
  })
  const onlineStops = chartAreaGradientStops(online, {
    startOpacity: neon ? 0.4 : 0.55,
    endOpacity: neon ? 0.08 : 0.12,
  })

  return (
    <ChartContainer
      config={chartConfig}
      className={cn(
        `aspect-auto h-[200px] w-full font-sans ${chartDashedGridClassName}`,
        neon && chartNeonOverflowClassName
      )}
    >
      <AreaChart
        accessibilityLayer
        data={chartData}
        stackOffset="expand"
        margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="tremor-pct-store" x1="0" y1="0" x2="0" y2="1">
            {storeStops.map((s) => (
              <stop
                key={s.offset}
                offset={s.offset}
                stopColor={s.stopColor}
                stopOpacity={s.stopOpacity}
              />
            ))}
          </linearGradient>
          <linearGradient id="tremor-pct-online" x1="0" y1="0" x2="0" y2="1">
            {onlineStops.map((s) => (
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
          dataKey="month"
          reversed
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={28}
          interval="preserveStartEnd"
        />
        <YAxis
          orientation="right"
          width={36}
          tickLine={false}
          axisLine={false}
          tickMargin={4}
          tickFormatter={(v: number) =>
            `${toPersianDigits(Math.round(v * 100))}٪`
          }
        />
        <ChartTooltip
          content={(props) => (
            <RevenueTooltip
              {...props}
              storeColor={store}
              onlineColor={online}
            />
          )}
        />
        <Area
          type="monotone"
          dataKey="store"
          stackId="a"
          stroke={store}
          strokeWidth={storeGlow?.strokeWidth ?? 1.75}
          fill="url(#tremor-pct-store)"
          isAnimationActive={false}
          style={storeGlow?.style}
          className={storeGlow?.className}
        />
        <Area
          type="monotone"
          dataKey="online"
          stackId="a"
          stroke={online}
          strokeWidth={onlineGlow?.strokeWidth ?? 1.75}
          fill="url(#tremor-pct-online)"
          isAnimationActive={false}
          style={onlineGlow?.style}
          className={onlineGlow?.className}
        />
      </AreaChart>
    </ChartContainer>
  )
}

export default function TremorAreaChartsDemo() {
  const { neon, store, online, total, up, down } = useTremorColors()

  useChartCaption(() => (
    <>
      داشبورد ناحیه‌ای به سبک Tremor — KPI، گرادیان نرم و متریک زنده با هاور
    </>
  ))

  const kpiCards = [
    {
      id: "store",
      label: FA_CHART.store,
      value: storeTotal,
      change: storeChange,
      color: store,
      series: chartData.map((r) => r.store),
    },
    {
      id: "online",
      label: FA_CHART.online,
      value: onlineTotal,
      change: onlineChange,
      color: online,
      series: chartData.map((r) => r.online),
    },
    {
      id: "total",
      label: "جمع فروش",
      value: yearTotal,
      change: yearChange,
      color: total,
      series: chartData.map((r) => r.store + r.online),
    },
  ] as const

  return (
    <div className="w-full max-w-[760px] space-y-4 font-sans">
      <div className="grid gap-3 sm:grid-cols-3">
        {kpiCards.map((card) => (
          <KpiMiniArea
            key={card.id}
            {...card}
            neon={neon}
            upColor={up}
            downColor={down}
          />
        ))}
      </div>

      <HeroArea />

      <div className="flex flex-col gap-3 sm:flex-row">
        <VariantCard title="انباشته" hint="مجموع روی‌هم فروش حضوری و آنلاین">
          <StackedVariant />
        </VariantCard>
        <VariantCard title="سهم نسبی" hint="درصد هر کانال از فروش ماه">
          <PercentVariant />
        </VariantCard>
      </div>
    </div>
  )
}
