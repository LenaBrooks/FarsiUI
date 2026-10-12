"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

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
const allData = generatePersianMockData(DATA_LENGTH, 90).map((o, i) => ({ ...o, i }))

function getCircularWindowData(windowStart: number) {
  return Array.from({ length: WINDOW }, (_, index) => allData[(windowStart + index) % DATA_LENGTH]!)
}

export default function BarAnimatedSeriesDemo() {
  const [windowStart, setWindowStart] = React.useState(0)

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setWindowStart((s) => (s + 1) % DATA_LENGTH)
    }, 900)
    return () => window.clearInterval(id)
  }, [])

  const data = getCircularWindowData(windowStart)

  return (
    <ChartContainer config={chart2MockConfig} className={chart2ContainerClassName}>
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ top: 20, right: 8, left: 0, bottom: 5 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis dataKey="label" reversed tickMargin={8} />
        <YAxis
          orientation="right"
          width={52}
          tickMargin={12}
          tickFormatter={formatChart2Number}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar
          dataKey="y"
          fill="var(--color-y)"
          radius={[4, 4, 0, 0]}
          animationDuration={800}
          isAnimationActive
        />
      </BarChart>
    </ChartContainer>
  )
}
