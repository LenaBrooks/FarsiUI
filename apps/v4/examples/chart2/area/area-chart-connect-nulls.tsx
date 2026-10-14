"use client"

import type { ReactNode } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  CHART2_BAR_COLORS,
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

const uvConfig = {
  uv: { label: FA_CHART.store, color: CHART2_BAR_COLORS[0] },
} satisfies ChartConfig

const stackConfig = {
  uv: { label: FA_CHART.store, color: CHART2_BAR_COLORS[0] },
  pv: { label: FA_CHART.online, color: CHART2_BAR_COLORS[1] },
  amt: { label: FA_CHART.orders, color: CHART2_BAR_COLORS[2] },
} satisfies ChartConfig

const panelClass =
  `aspect-[1.618] h-auto w-full max-w-[700px] max-h-[30vh] font-sans ${chart2DashedGridClassName}`

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
    <ChartContainer config={config} className={panelClass}>
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          reversed
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis
          orientation="right"
          width={48}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={formatChart2Number}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        {legend ? <ChartLegend content={<ChartLegendContent />} /> : null}
        {children}
      </AreaChart>
    </ChartContainer>
  )
}

export default function AreaChartConnectNullsDemo() {
  return (
    <div className="flex w-full flex-col gap-4">
      <BaseChart data={singleSeries} config={uvConfig}>
        <Area type="monotone" dataKey="uv" stroke="var(--color-uv)" fill="var(--color-uv)" fillOpacity={0.35} />
      </BaseChart>
      <BaseChart data={singleSeries} config={uvConfig}>
        <Area
          connectNulls
          type="monotone"
          dataKey="uv"
          stroke="var(--color-uv)"
          fill="var(--color-uv)"
          fillOpacity={0.35}
        />
      </BaseChart>
      <BaseChart data={stackedSeries} config={stackConfig} legend>
        <Area type="monotone" dataKey="uv" stackId="1" stroke="var(--color-uv)" fill="var(--color-uv)" fillOpacity={0.7} />
        <Area type="monotone" dataKey="pv" stackId="1" stroke="var(--color-pv)" fill="var(--color-pv)" fillOpacity={0.7} />
        <Area type="monotone" dataKey="amt" stackId="1" stroke="var(--color-amt)" fill="var(--color-amt)" fillOpacity={0.7} />
      </BaseChart>
      <BaseChart data={stackedSeries} config={stackConfig} legend>
        <Area connectNulls type="monotone" dataKey="uv" stackId="1" stroke="var(--color-uv)" fill="var(--color-uv)" fillOpacity={0.7} />
        <Area connectNulls type="monotone" dataKey="pv" stackId="1" stroke="var(--color-pv)" fill="var(--color-pv)" fillOpacity={0.7} />
        <Area connectNulls type="monotone" dataKey="amt" stackId="1" stroke="var(--color-amt)" fill="var(--color-amt)" fillOpacity={0.7} />
      </BaseChart>
      <BaseChart data={stackedWithGaps} config={stackConfig} legend>
        <Area type="monotone" dataKey="uv" stackId="1" stroke="var(--color-uv)" fill="var(--color-uv)" fillOpacity={0.7} />
        <Area type="monotone" dataKey="pv" stackId="1" stroke="var(--color-pv)" fill="var(--color-pv)" fillOpacity={0.7} />
        <Area type="monotone" dataKey="amt" stackId="1" stroke="var(--color-amt)" fill="var(--color-amt)" fillOpacity={0.7} />
      </BaseChart>
      <BaseChart data={stackedWithGaps} config={stackConfig} legend>
        <Area connectNulls type="monotone" dataKey="uv" stackId="1" stroke="var(--color-uv)" fill="var(--color-uv)" fillOpacity={0.7} />
        <Area connectNulls type="monotone" dataKey="pv" stackId="1" stroke="var(--color-pv)" fill="var(--color-pv)" fillOpacity={0.7} />
        <Area connectNulls type="monotone" dataKey="amt" stackId="1" stroke="var(--color-amt)" fill="var(--color-amt)" fillOpacity={0.7} />
      </BaseChart>
    </div>
  )
}
