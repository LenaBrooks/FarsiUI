"use client"

import type { ReactNode } from "react"
import { useId } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { useChart2Caption } from "@/components/chart2-live"
import {
  FA_CHART,
  FA_MONTHS,
  chart2DashedGridClassName,
  formatChart2Number,
} from "@/lib/chart2-fa"
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

/** Soft but punchier triad — sky / mint / magenta */
const C_SKY = "#5ea6d8"
const C_MINT = "#4fbfa5"
const C_MAGENTA = "#d47aa8"

const uvConfig = {
  uv: { label: FA_CHART.store, color: C_SKY },
} satisfies ChartConfig

const stackConfig = {
  uv: { label: FA_CHART.store, color: C_SKY },
  pv: { label: FA_CHART.online, color: C_MINT },
  amt: { label: FA_CHART.orders, color: C_MAGENTA },
} satisfies ChartConfig

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
    <div className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-border/50 bg-background">
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
}: {
  data: Record<string, unknown>[]
  config: ChartConfig
  children: ReactNode
  legend?: boolean
}) {
  return (
    <ChartContainer
      config={config}
      className={`aspect-[1.45] h-auto w-full max-w-none font-sans text-xs ${chart2DashedGridClassName}`}
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
          tickFormatter={formatChart2Number}
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
}: {
  dataKey: string
  color: string
  stackId?: string
  connectNulls?: boolean
  uid: string
}) {
  const gradId = `nulls-${dataKey}-${connectNulls ? "c" : "g"}-${uid}`
  return (
    <>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={stackId ? 0.72 : 0.48} />
          <stop offset="55%" stopColor={color} stopOpacity={stackId ? 0.32 : 0.16} />
          <stop offset="100%" stopColor={color} stopOpacity={0.04} />
        </linearGradient>
      </defs>
      <Area
        type="monotone"
        dataKey={dataKey}
        stackId={stackId}
        connectNulls={connectNulls}
        stroke={color}
        strokeWidth={2.25}
        fill={`url(#${gradId})`}
        fillOpacity={1}
        dot={false}
        activeDot={{ r: 3.5, strokeWidth: 2, stroke: "var(--background)" }}
      />
    </>
  )
}

export default function AreaChartConnectNullsDemo() {
  const uid = useId().replace(/:/g, "")

  useChart2Caption(
    () => <>شکاف داده — با و بدون وصل کردن مقادیر خالی (connectNulls)</>
  )

  return (
    <div className="flex w-full max-w-[760px] flex-col gap-3 font-sans">
      <div className="grid gap-3 sm:grid-cols-2">
        <Panel title="تک‌سری · شکاف باز" en="Gap">
          <BaseChart data={singleSeries} config={uvConfig}>
            <SoftArea dataKey="uv" color={C_SKY} uid={`${uid}-a`} />
          </BaseChart>
        </Panel>
        <Panel title="تک‌سری · وصل‌شده" en="connectNulls">
          <BaseChart data={singleSeries} config={uvConfig}>
            <SoftArea
              dataKey="uv"
              color={C_SKY}
              connectNulls
              uid={`${uid}-b`}
            />
          </BaseChart>
        </Panel>

        <Panel title="پشته کامل · معمولی" en="Stacked">
          <BaseChart data={stackedSeries} config={stackConfig} legend>
            <SoftArea dataKey="uv" color={C_SKY} stackId="1" uid={`${uid}-c1`} />
            <SoftArea dataKey="pv" color={C_MINT} stackId="1" uid={`${uid}-c2`} />
            <SoftArea dataKey="amt" color={C_MAGENTA} stackId="1" uid={`${uid}-c3`} />
          </BaseChart>
        </Panel>
        <Panel title="پشته کامل · وصل‌شده" en="Stacked + nulls">
          <BaseChart data={stackedSeries} config={stackConfig} legend>
            <SoftArea dataKey="uv" color={C_SKY} stackId="1" connectNulls uid={`${uid}-d1`} />
            <SoftArea dataKey="pv" color={C_MINT} stackId="1" connectNulls uid={`${uid}-d2`} />
            <SoftArea dataKey="amt" color={C_MAGENTA} stackId="1" connectNulls uid={`${uid}-d3`} />
          </BaseChart>
        </Panel>

        <Panel title="پشته با شکاف · باز" en="Gaps">
          <BaseChart data={stackedWithGaps} config={stackConfig} legend>
            <SoftArea dataKey="uv" color={C_SKY} stackId="1" uid={`${uid}-e1`} />
            <SoftArea dataKey="pv" color={C_MINT} stackId="1" uid={`${uid}-e2`} />
            <SoftArea dataKey="amt" color={C_MAGENTA} stackId="1" uid={`${uid}-e3`} />
          </BaseChart>
        </Panel>
        <Panel title="پشته با شکاف · وصل‌شده" en="Gaps + nulls">
          <BaseChart data={stackedWithGaps} config={stackConfig} legend>
            <SoftArea dataKey="uv" color={C_SKY} stackId="1" connectNulls uid={`${uid}-f1`} />
            <SoftArea dataKey="pv" color={C_MINT} stackId="1" connectNulls uid={`${uid}-f2`} />
            <SoftArea dataKey="amt" color={C_MAGENTA} stackId="1" connectNulls uid={`${uid}-f3`} />
          </BaseChart>
        </Panel>
      </div>
    </div>
  )
}
