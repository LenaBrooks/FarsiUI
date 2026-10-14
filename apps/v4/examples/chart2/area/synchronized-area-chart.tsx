"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { usePersianMockData } from "@/components/chart2-live"
import {
  chart2DashedGridClassName,
  chart2BarMockConfig,
  formatChart2Number,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/registry/new-york-v4/ui/chart"

const syncClassName =
  `aspect-[1.618] h-auto w-full max-w-[700px] max-h-[20vh] font-sans ${chart2DashedGridClassName}`

function SyncAxes() {
  return (
    <>
      <CartesianGrid strokeDasharray="3 3" />
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

export default function SynchronizedAreaChartDemo() {
  const data = usePersianMockData(6, 298905)

  return (
    <div className="flex w-full flex-col gap-3">
      <ChartContainer config={chart2BarMockConfig} className={syncClassName}>
        <AreaChart
          accessibilityLayer
          data={data}
          syncId="chart2-area-sync"
          margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
        >
          <SyncAxes />
          <Area
            type="monotone"
            dataKey="x"
            stroke="var(--color-x)"
            fill="var(--color-x)"
            fillOpacity={0.35}
          />
        </AreaChart>
      </ChartContainer>

      <ChartContainer config={chart2BarMockConfig} className={syncClassName}>
        <AreaChart
          accessibilityLayer
          data={data}
          syncId="chart2-area-sync"
          margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
        >
          <SyncAxes />
          <Area
            type="monotone"
            dataKey="y"
            stroke="var(--color-y)"
            fill="var(--color-y)"
            fillOpacity={0.35}
            animationBegin={200}
            animationDuration={1300}
          />
        </AreaChart>
      </ChartContainer>

      <ChartContainer config={chart2BarMockConfig} className={syncClassName}>
        <AreaChart
          accessibilityLayer
          data={data}
          syncId="chart2-area-sync"
          margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
        >
          <SyncAxes />
          <Area
            type="monotone"
            dataKey="z"
            stroke="var(--color-z)"
            fill="var(--color-z)"
            fillOpacity={0.2}
            strokeWidth={3}
            strokeDasharray="10 8"
            animationBegin={400}
            animationDuration={1100}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}
