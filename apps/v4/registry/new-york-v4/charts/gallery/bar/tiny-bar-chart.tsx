"use client"

import { Bar, BarChart } from "recharts"

import { usePersianMockData } from "@/registry/new-york-v4/lib/chart-live"
import { chartBarMockConfig } from "@/lib/chart-fa"
import { ChartContainer } from "@/registry/new-york-v4/ui/chart"

export default function TinyBarChartDemo() {
  const data = usePersianMockData(6, 905)

  return (
    <ChartContainer
      config={chartBarMockConfig}
      className="mx-auto aspect-[1.618] h-[100px] w-full max-w-[300px] font-sans"
    >
      <BarChart accessibilityLayer data={data}>
        <Bar
          dataKey="x"
          fill="var(--color-x)"
          radius={[3, 3, 0, 0]}
          isAnimationActive={false}
        />
      </BarChart>
    </ChartContainer>
  )
}
