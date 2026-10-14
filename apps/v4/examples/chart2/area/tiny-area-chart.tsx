"use client"

import { useId } from "react"
import { Area, AreaChart } from "recharts"

import { usePersianMockData } from "@/components/chart2-live"
import { chart2BarMockConfig } from "@/lib/chart2-fa"
import { ChartContainer } from "@/registry/new-york-v4/ui/chart"

export default function TinyAreaChartDemo() {
  const uid = useId().replace(/:/g, "")
  const gradId = `chart2TinyAreaY-${uid}`
  const data = usePersianMockData(6, 905)
  const fill = chart2BarMockConfig.y.color

  return (
    <ChartContainer
      config={chart2BarMockConfig}
      className="aspect-[1.618] h-[50px] w-full max-w-[200px] font-sans"
    >
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={fill} stopOpacity={0.7} />
            <stop offset="95%" stopColor={fill} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="y"
          stroke={fill}
          fill={`url(#${gradId})`}
          isAnimationActive={false}
        />
      </AreaChart>
    </ChartContainer>
  )
}
