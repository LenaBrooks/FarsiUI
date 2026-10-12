"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import { useChart2RandomSeed } from "@/components/chart2-live"
import {
  chart2ContainerClassName,
  chart2MockConfig,
  formatChart2Number,
  generatePersianMockData,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/registry/new-york-v4/ui/chart"

const WINDOW = 6
const DATA_LENGTH = 30

function getCircularWindowData<T>(
  allData: T[],
  windowStart: number
): T[] {
  return Array.from({ length: WINDOW }, (_, index) => {
    return allData[(windowStart + index) % DATA_LENGTH]!
  })
}

export default function LineAnimatedTimeSeriesDemo() {
  const seed = useChart2RandomSeed(90)
  const allData = React.useMemo(
    () =>
      generatePersianMockData(DATA_LENGTH, seed).map((row, i) => ({
        ...row,
        i,
      })),
    [seed]
  )
  const [windowStart, setWindowStart] = React.useState(0)

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setWindowStart((s) => (s + 1) % DATA_LENGTH)
    }, 800)
    return () => window.clearInterval(id)
  }, [])

  const data = getCircularWindowData(allData, windowStart)

  return (
    <ChartContainer
      config={chart2MockConfig}
      className={`${chart2ContainerClassName} max-w-[600px]`}
    >
      <LineChart
        accessibilityLayer
        data={data}
        margin={{ top: 16, right: 12, left: 12, bottom: 8 }}
      >
        <CartesianGrid />
        <XAxis
          dataKey="label"
          reversed
          allowDataOverflow
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
        <Line
          dataKey="y"
          stroke="var(--color-y)"
          strokeWidth={2}
          animationDuration={800}
          isAnimationActive
        />
      </LineChart>
    </ChartContainer>
  )
}
