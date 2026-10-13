"use client"

import type { MouseEvent, TouchEvent } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  getRelativeCoordinate,
} from "recharts"

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

export default function AreaWithCustomEventsDemo() {
  const data = usePersianMockData(20, 456)

  return (
    <ChartContainer config={chart2MockConfig} className={chart2AreaContainerClassName}>
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{ top: 20, right: 8, left: 0, bottom: 5 }}
        onClick={(_d, event: MouseEvent<SVGGraphicsElement>) => {
          console.log("AreaChart clicked:", getRelativeCoordinate(event))
        }}
        onMouseEnter={(_d, event: MouseEvent<SVGGraphicsElement>) => {
          console.log("AreaChart mouse enter:", getRelativeCoordinate(event))
        }}
        onMouseMove={(_d, event: MouseEvent<SVGGraphicsElement>) => {
          console.log("AreaChart mouse move:", getRelativeCoordinate(event))
        }}
        onMouseLeave={(_d, event: MouseEvent<SVGGraphicsElement>) => {
          console.log("AreaChart mouse leave:", getRelativeCoordinate(event))
        }}
        onContextMenu={(_d, event: MouseEvent<SVGGraphicsElement>) => {
          event.preventDefault()
          console.log("AreaChart context menu:", getRelativeCoordinate(event))
        }}
        onTouchStart={(_d, event: TouchEvent<SVGGraphicsElement>) => {
          console.log("AreaChart touch start:", getRelativeCoordinate(event))
        }}
      >
        <defs>
          <linearGradient id="chart2EventsAreaX" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-x)" stopOpacity={0.7} />
            <stop offset="95%" stopColor="var(--color-x)" stopOpacity={0.05} />
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
          type="step"
          dataKey="x"
          stroke="var(--color-x)"
          fill="url(#chart2EventsAreaX)"
        />
      </AreaChart>
    </ChartContainer>
  )
}
