"use client"

import { usePersianMockData } from "@/components/chart2-live"
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
  } from "recharts"

import {
  chart2ContainerClassName,
  chart2MockConfig,
  FA_MONTHS,
  formatChart2Number,
  toPersianDigits,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/registry/new-york-v4/ui/chart"

const referenceMonth = FA_MONTHS[2]!

export default function LineChartWithReferenceLinesDemo() {
  const data = usePersianMockData(6, 984)
  return (
    <ChartContainer config={chart2MockConfig} className={chart2ContainerClassName}>
      <LineChart
        accessibilityLayer
        data={data}
        margin={{ top: 20, right: 8, left: 8, bottom: 8 }}
      >
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
        <ChartLegend content={<ChartLegendContent />} />
        <ReferenceLine
          x={referenceMonth}
          stroke="var(--destructive)"
          label={{
            value: "نمونه برچسب",
            fill: "var(--destructive)",
            // Match upstream insideBottomRight (end of vertical line). angle -90
            // so RTL/Persian text grows up into the plot instead of under the axis.
            position: "insideBottomRight",
            angle: -90,
            dx: 20,
            fontFamily: "var(--font-sans)",
          }}
        />
        <ReferenceLine
          y={500}
          stroke="var(--destructive)"
          label={{
            value: toPersianDigits(500),
            fill: "var(--destructive)",
            position: "insideTopLeft",
            fontFamily: "var(--font-sans)",
          }}
        />
        <Line type="monotone" dataKey="x" stroke="var(--color-x)" strokeWidth={2} />
        <Line type="monotone" dataKey="y" stroke="var(--color-y)" strokeWidth={2} />
      </LineChart>
    </ChartContainer>
  )
}
