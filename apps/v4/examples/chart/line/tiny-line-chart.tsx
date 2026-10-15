"use client"

import { Line, LineChart } from "recharts"

import { ChartContainer } from "@/registry/new-york-v4/ui/chart"

import { lineSalesConfig, useSalesData } from "./line-fa-shared"

export default function TinyLineChartDemo() {
  const data = useSalesData(22123)

  return (
    <ChartContainer
      config={lineSalesConfig}
      className="mx-auto aspect-[1.618] h-[50px] w-full max-w-[100px] font-sans"
    >
      <LineChart accessibilityLayer data={data}>
        <Line
          dataKey="store"
          stroke="var(--color-store)"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ChartContainer>
  )
}
