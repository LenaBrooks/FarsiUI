"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { usePersianMockData } from "@/components/chart2-live"
import {
  chart2AreaContainerClassName,
  chart2MockConfig,
  formatChart2Number,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/registry/new-york-v4/ui/chart"

export default function PreventRightClickAreaDemo() {
  const data = usePersianMockData(6, 4390435)

  return (
    <ChartContainer config={chart2MockConfig} className={chart2AreaContainerClassName}>
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{ top: 20, right: 8, left: 0, bottom: 5 }}
        onContextMenu={(_, e) => e.preventDefault()}
      >
        <defs>
          <linearGradient id="chart2PreventAreaY" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-y)" stopOpacity={0.75} />
            <stop offset="95%" stopColor="var(--color-y)" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" reversed tickMargin={8} />
        <YAxis
          orientation="right"
          width={52}
          tickMargin={12}
          tickFormatter={formatChart2Number}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          type="monotone"
          dataKey="y"
          stroke="var(--color-y)"
          fill="url(#chart2PreventAreaY)"
        />
      </AreaChart>
    </ChartContainer>
  )
}
