"use client"

import type { ReactNode } from "react"
import { useId } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { useChartCaption } from "@/components/chart-live"
import { useMarketNeon } from "@/examples/chart/area/use-market-neon"
import {
  CHART_BAR_COLORS,
  FA_CHART,
  FA_MONTHS,
  MARKET_DOWN,
  MARKET_MUTE,
  MARKET_UP,
  chartAreaGradientStops,
  chartDashedGridClassName,
  chartNeonGlowProps,
  chartNeonOverflowClassName,
  formatChartNumber,
} from "@/lib/chart-fa"
import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

const singleSeries = [
  { name: FA_MONTHS[0], uv: 4000 },
  { name: FA_MONTHS[1], uv: 3000 },
  { name: FA_MONTHS[2], uv: 2000 },
  { name: FA_MONTHS[3] },
  { name: FA_MONTHS[4], uv: 1890 },
  { name: FA_MONTHS[5], uv: 2390 },
  { name: "مهر", uv: 3490 },
]

const stackedSeries = [
  { name: FA_MONTHS[0], uv: 4000, pv: 2400, amt: 2400 },
  { name: FA_MONTHS[1], uv: 3000, pv: 1398, amt: 2210 },
  { name: FA_MONTHS[2], uv: 2000, pv: 9800, amt: 2290 },
  { name: FA_MONTHS[3], uv: 2780, pv: 3908, amt: 2000 },
  { name: FA_MONTHS[4], uv: 1890, pv: 4800, amt: 2181 },
  { name: FA_MONTHS[5], uv: 2390, pv: 3800, amt: 2500 },
  { name: "مهر", uv: 3490, pv: 4300, amt: 2100 },
]

const stackedWithGaps = [
  { name: FA_MONTHS[0], uv: 4000, pv: 2400, amt: 2400 },
  { name: FA_MONTHS[1], uv: 3000, pv: 1398, amt: 2210 },
  { name: FA_MONTHS[2] },
  { name: FA_MONTHS[3], uv: 2000, pv: 9800, amt: 2290 },
  { name: FA_MONTHS[4], uv: 1890, pv: 4800, amt: 2181 },
  { name: FA_MONTHS[5], pv: 4300, amt: 2100 },
  { name: "مهر", uv: 3490, pv: 4300, amt: 2100 },
]

function Panel({
  title,
  en,
  children,
}: {
  title: string
  en: string
  children: ReactNode
}) {
  return (
    <div className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-border/50 bg-transparent">
      <div className="flex items-center justify-between gap-2 border-b border-border/40 px-3 py-2">
        <span className="truncate text-[13px] font-semibold tracking-tight">
          {title}
        </span>
        <span
          dir="ltr"
          lang="en"
          className="shrink-0 font-sans text-[10px] tracking-wide text-muted-foreground/80 uppercase"
        >
          {en}
        </span>
      </div>
      <div className="min-w-0 p-1.5 pt-0">{children}</div>
    </div>
  )
}

function BaseChart({
  data,
  config,
  children,
  legend,
  neon,
}: {
  data: Record<string, unknown>[]
  config: ChartConfig
  children: ReactNode
  legend?: boolean
  neon: boolean
}) {
  return (
    <ChartContainer
      config={config}
      className={cn(
        "aspect-[1.45] h-auto w-full max-w-none font-sans text-xs",
        chartDashedGridClassName,
        neon && chartNeonOverflowClassName
      )}
    >
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{ top: 12, right: 6, left: 0, bottom: 2 }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
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
          tickCount={4}
          tickFormatter={formatChartNumber}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        {legend ? <ChartLegend content={<ChartLegendContent />} /> : null}
        {children}
      </AreaChart>
    </ChartContainer>
  )
}

function SoftArea({
  dataKey,
  color,
  stackId,
  connectNulls,
  uid,
  neon,
}: {
  dataKey: string
  color: string
  stackId?: string
  connectNulls?: boolean
  uid: string
  neon: boolean
}) {
  const gradId = `nulls-${dataKey}-${connectNulls ? "c" : "g"}-${uid}`
  const glow = neon ? chartNeonGlowProps(color) : null
  const stops = chartAreaGradientStops(color, {
    startOpacity: neon ? 0.32 : stackId ? 0.72 : 0.48,
    endOpacity: neon ? 0 : 0.04,
  })

  return (
    <>
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
        dataKey={dataKey}
        stackId={stackId}
        connectNulls={connectNulls}
        stroke={color}
        strokeWidth={glow?.strokeWidth ?? 2}
        fill={`url(#${gradId})`}
        fillOpacity={1}
        dot={false}
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
            : { r: 3.5, strokeWidth: 2, stroke: "var(--background)", fill: color }
        }
      />
    </>
  )
}

export default function AreaChartConnectNullsDemo() {
  const uid = useId().replace(/:/g, "")
  const neon = useMarketNeon()

  const colors = neon
    ? ([MARKET_UP, MARKET_DOWN, MARKET_MUTE] as const)
    : ([CHART_BAR_COLORS[0], CHART_BAR_COLORS[2], CHART_BAR_COLORS[1]] as const)

  const [c1, c2, c3] = colors

  const uvConfig = {
    uv: { label: FA_CHART.store, color: c1 },
  } satisfies ChartConfig

  const stackConfig = {
    uv: { label: FA_CHART.store, color: c1 },
    pv: { label: FA_CHART.online, color: c2 },
    amt: { label: FA_CHART.orders, color: c3 },
  } satisfies ChartConfig

  useChartCaption(
    () =>
      neon ? (
        <>شکاف داده — الگوی مارکت سبز / صورتی / خاکستری (connectNulls)</>
      ) : (
        <>شکاف داده — با و بدون وصل کردن مقادیر خالی (connectNulls)</>
      )
  )

  return (
    <div className="flex w-full max-w-[760px] flex-col gap-3 font-sans">
      <div className="grid gap-3 sm:grid-cols-2">
        <Panel title="تک‌سری · شکاف باز" en="Gap">
          <BaseChart data={singleSeries} config={uvConfig} neon={neon}>
            <SoftArea dataKey="uv" color={c1} uid={`${uid}-a`} neon={neon} />
          </BaseChart>
        </Panel>
        <Panel title="تک‌سری · وصل‌شده" en="connectNulls">
          <BaseChart data={singleSeries} config={uvConfig} neon={neon}>
            <SoftArea
              dataKey="uv"
              color={c1}
              connectNulls
              uid={`${uid}-b`}
              neon={neon}
            />
          </BaseChart>
        </Panel>

        <Panel title="پشته کامل · معمولی" en="Stacked">
          <BaseChart data={stackedSeries} config={stackConfig} legend neon={neon}>
            <SoftArea dataKey="uv" color={c1} stackId="1" uid={`${uid}-c1`} neon={neon} />
            <SoftArea dataKey="pv" color={c2} stackId="1" uid={`${uid}-c2`} neon={neon} />
            <SoftArea dataKey="amt" color={c3} stackId="1" uid={`${uid}-c3`} neon={neon} />
          </BaseChart>
        </Panel>
        <Panel title="پشته کامل · وصل‌شده" en="Stacked + nulls">
          <BaseChart data={stackedSeries} config={stackConfig} legend neon={neon}>
            <SoftArea dataKey="uv" color={c1} stackId="1" connectNulls uid={`${uid}-d1`} neon={neon} />
            <SoftArea dataKey="pv" color={c2} stackId="1" connectNulls uid={`${uid}-d2`} neon={neon} />
            <SoftArea dataKey="amt" color={c3} stackId="1" connectNulls uid={`${uid}-d3`} neon={neon} />
          </BaseChart>
        </Panel>

        <Panel title="پشته با شکاف · باز" en="Gaps">
          <BaseChart data={stackedWithGaps} config={stackConfig} legend neon={neon}>
            <SoftArea dataKey="uv" color={c1} stackId="1" uid={`${uid}-e1`} neon={neon} />
            <SoftArea dataKey="pv" color={c2} stackId="1" uid={`${uid}-e2`} neon={neon} />
            <SoftArea dataKey="amt" color={c3} stackId="1" uid={`${uid}-e3`} neon={neon} />
          </BaseChart>
        </Panel>
        <Panel title="پشته با شکاف · وصل‌شده" en="Gaps + nulls">
          <BaseChart data={stackedWithGaps} config={stackConfig} legend neon={neon}>
            <SoftArea dataKey="uv" color={c1} stackId="1" connectNulls uid={`${uid}-f1`} neon={neon} />
            <SoftArea dataKey="pv" color={c2} stackId="1" connectNulls uid={`${uid}-f2`} neon={neon} />
            <SoftArea dataKey="amt" color={c3} stackId="1" connectNulls uid={`${uid}-f3`} neon={neon} />
          </BaseChart>
        </Panel>
      </div>
    </div>
  )
}
