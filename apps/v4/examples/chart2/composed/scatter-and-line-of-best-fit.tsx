"use client"

import {
  CartesianGrid,
  ComposedChart,
  Line,
  Scatter,
  XAxis,
  YAxis,
} from "recharts"

import {
  CHART2_BAR_COLORS,
  chart2ContainerClassName,
  formatChart2Number,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

const data = [
  { index: 10000, red: 1643, blue: 790 },
  { index: 1666, red: 182, blue: 42 },
  { index: 625, red: 56, blue: 11 },
  // Calculation of line of best fit is not included in this demo
  { index: 300, redLine: 0 },
  { index: 10000, redLine: 1522 },
  { index: 600, blueLine: 0 },
  { index: 10000, blueLine: 678 },
]

const chartConfig = {
  red: { label: "سری صورتی", color: CHART2_BAR_COLORS[1] },
  blue: { label: "سری آبی", color: CHART2_BAR_COLORS[0] },
  redLine: { label: "روند صورتی", color: CHART2_BAR_COLORS[1] },
  blueLine: { label: "روند آبی", color: CHART2_BAR_COLORS[0] },
} satisfies ChartConfig

function isTooltipValue(value: unknown) {
  return typeof value === "number" && Number.isFinite(value)
}

export default function ScatterAndLineOfBestFitDemo() {
  return (
    <ChartContainer config={chartConfig} className={chart2ContainerClassName}>
      <ComposedChart
        accessibilityLayer
        data={data}
        margin={{ top: 20, right: 8, bottom: 28, left: 8 }}
      >
        <CartesianGrid vertical={false} />
        <ChartTooltip
          shared={false}
          content={({ active, payload, label }) => {
            const clean = payload?.filter((item) => isTooltipValue(item.value))
            if (!active || !clean?.length) return null
            return (
              <ChartTooltipContent
                active={active}
                payload={clean}
                label={label}
                labelFormatter={(value) =>
                  `شاخص: ${formatChart2Number(Number(value))}`
                }
              />
            )
          }}
        />
        <ChartLegend
          content={(props) => (
            <ChartLegendContent
              {...props}
              payload={props.payload?.filter(
                (item) => item.dataKey === "red" || item.dataKey === "blue"
              )}
            />
          )}
        />
        <XAxis
          dataKey="index"
          type="number"
          reversed
          tickMargin={8}
          tickFormatter={formatChart2Number}
          label={{
            value: "شاخص",
            position: "insideBottomLeft",
            offset: -4,
            style: { fontFamily: "var(--font-sans)", fontSize: 11 },
            fill: "var(--muted-foreground)",
          }}
        />
        <YAxis
          type="number"
          orientation="right"
          width={56}
          tickMargin={12}
          tickFormatter={formatChart2Number}
          label={{
            value: "زمان (میلی‌ثانیه)",
            angle: 90,
            position: "insideRight",
            offset: 8,
            style: { fontFamily: "var(--font-sans)", fontSize: 11 },
            fill: "var(--muted-foreground)",
          }}
        />
        <Scatter dataKey="red" fill="var(--color-red)" stroke="none" />
        <Scatter dataKey="blue" fill="var(--color-blue)" stroke="none" />
        <Line
          dataKey="blueLine"
          stroke="var(--color-blueLine)"
          strokeWidth={2}
          dot={false}
          activeDot={false}
          legendType="none"
        />
        <Line
          dataKey="redLine"
          stroke="var(--color-redLine)"
          strokeWidth={2}
          dot={false}
          activeDot={false}
          legendType="none"
        />
      </ComposedChart>
    </ChartContainer>
  )
}
