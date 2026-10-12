"use client"

import { usePersianMockData } from "@/components/chart2-live"
import { Line,
  LineChart } from "recharts"

import { chart2MockConfig } from "@/lib/chart2-fa"
import { ChartContainer } from "@/registry/new-york-v4/ui/chart"

export default function TinyLineChartDemo() {
  const data = usePersianMockData(6, 22123)
  return (
    <ChartContainer
      config={chart2MockConfig}
      className="aspect-[1.618] h-[50px] w-full max-w-[100px] font-sans"
    >
      <LineChart accessibilityLayer data={data}>
        <Line
          dataKey="x"
          stroke="var(--color-x)"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ChartContainer>
  )
}
