"use client"

import {
  Area,
  AreaChart,
  Brush,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts"

import { CHART2_BAR_COLORS } from "@/lib/chart2-fa"
import {
  CHART_TOMAN_AXIS_WIDTH,
  FA_CHART,
  formatPersianMonthTick,
} from "@/lib/chart-locale"
import { TomanAxisTick } from "@/lib/chart-toman-tick"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

import {
  LINE_TOOLTIP_CURSOR,
  LineChannelLegend,
  LineSalesTooltipContent,
  lineSalesConfig,
  monthTotal,
  useLineSalesCaption,
  useSalesData,
} from "./line-fa-shared"

const syncClassName =
  "aspect-[1.618] h-auto w-full max-w-[700px] max-h-[20vh] font-sans [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-muted-foreground/32 dark:[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-muted-foreground/38"

const syncConfig = {
  ...lineSalesConfig,
  total: {
    label: "جمع کانال‌ها",
    color: CHART2_BAR_COLORS[2],
  },
} satisfies ChartConfig

function SyncAxes() {
  return (
    <>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="month"
        reversed
        tickLine={false}
        axisLine={false}
        tickMargin={8}
        tickFormatter={formatPersianMonthTick}
      />
      <YAxis
        orientation="right"
        width={CHART_TOMAN_AXIS_WIDTH}
        tickLine={false}
        axisLine={false}
        tickMargin={8}
        tick={TomanAxisTick}
      />
      <ChartTooltip
        cursor={LINE_TOOLTIP_CURSOR}
        content={<LineSalesTooltipContent />}
      />
    </>
  )
}

export default function SynchronizedLineChartDemo() {
  const sales = useSalesData(2213)
  const data = sales.map((row) => ({ ...row, total: monthTotal(row) }))
  useLineSalesCaption("همگام")

  return (
    <div dir="rtl" className="flex w-full max-w-[700px] flex-col gap-3 font-sans">
      <LineChannelLegend />
      <ChartContainer config={syncConfig} className={syncClassName}>
        <LineChart
          accessibilityLayer
          data={data}
          syncId="chart2-sync"
          margin={{ top: 18, right: 12, left: 4, bottom: 0 }}
        >
          <SyncAxes />
          <Line
            type="monotone"
            dataKey="store"
            name="store"
            stroke="var(--color-store)"
            strokeWidth={2.5}
            dot={false}
          />
        </LineChart>
      </ChartContainer>

      <ChartContainer config={syncConfig} className={syncClassName}>
        <LineChart
          accessibilityLayer
          data={data}
          syncId="chart2-sync"
          margin={{ top: 18, right: 12, left: 4, bottom: 0 }}
        >
          <SyncAxes />
          <Line
            type="monotone"
            dataKey="online"
            name="online"
            stroke="var(--color-online)"
            strokeWidth={2.25}
            dot={false}
          />
          <Brush
            dataKey="month"
            stroke="var(--border)"
            fill="var(--muted)"
            travellerWidth={8}
          />
        </LineChart>
      </ChartContainer>

      <ChartContainer config={syncConfig} className={syncClassName}>
        <AreaChart
          accessibilityLayer
          data={data}
          syncId="chart2-sync"
          margin={{ top: 18, right: 12, left: 4, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            reversed
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={formatPersianMonthTick}
          />
          <YAxis
            orientation="right"
            width={CHART_TOMAN_AXIS_WIDTH}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={TomanAxisTick}
          />
          <ChartTooltip cursor={LINE_TOOLTIP_CURSOR} />
          <Area
            type="monotone"
            dataKey="total"
            name="total"
            stroke="var(--color-total)"
            fill="var(--color-total)"
            fillOpacity={0.22}
          />
        </AreaChart>
      </ChartContainer>
      <p className="text-[11px] text-muted-foreground">
        پنل سوم: {FA_CHART.store} + {FA_CHART.online}
      </p>
    </div>
  )
}
