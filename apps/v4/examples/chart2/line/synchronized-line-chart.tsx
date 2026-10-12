"use client"

import { usePersianMockData } from "@/components/chart2-live"
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

import {
  chart2MockConfig,
  formatChart2Number,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/registry/new-york-v4/ui/chart"

const syncClassName =
  "aspect-[1.618] h-auto w-full max-w-[700px] max-h-[20vh] font-sans"

function SyncAxes() {
  return (
    <>
      <CartesianGrid />
      <XAxis
        dataKey="label"
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
    </>
  )
}

export default function SynchronizedLineChartDemo() {
  const data = usePersianMockData(6, 2213)
  return (
    <div className="flex w-full flex-col gap-3">
      <ChartContainer config={chart2MockConfig} className={syncClassName}>
        <LineChart
          accessibilityLayer
          data={data}
          syncId="chart2-sync"
          margin={{ top: 10, right: 12, left: 12, bottom: 0 }}
        >
          <SyncAxes />
          <Line type="monotone" dataKey="x" stroke="var(--color-x)" strokeWidth={2} />
        </LineChart>
      </ChartContainer>

      <ChartContainer config={chart2MockConfig} className={syncClassName}>
        <LineChart
          accessibilityLayer
          data={data}
          syncId="chart2-sync"
          margin={{ top: 10, right: 12, left: 12, bottom: 0 }}
        >
          <SyncAxes />
          <Line type="monotone" dataKey="y" stroke="var(--color-y)" strokeWidth={2} />
          <Brush
            dataKey="label"
            stroke="var(--border)"
            fill="var(--muted)"
            travellerWidth={8}
          />
        </LineChart>
      </ChartContainer>

      <ChartContainer config={chart2MockConfig} className={syncClassName}>
        <AreaChart
          accessibilityLayer
          data={data}
          syncId="chart2-sync"
          margin={{ top: 10, right: 12, left: 12, bottom: 0 }}
        >
          <SyncAxes />
          <Area
            type="monotone"
            dataKey="z"
            stroke="var(--color-z)"
            fill="var(--color-z)"
            fillOpacity={0.25}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}
