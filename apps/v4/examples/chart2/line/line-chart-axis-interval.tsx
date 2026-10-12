"use client"

import { usePersianMockData } from "@/components/chart2-live"
import type { AxisInterval } from "recharts"
import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts"

import {
  chart2MockConfig,
  formatChart2Number,
  toPersianDigits,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/registry/new-york-v4/ui/chart"

function intervalLabel(interval: AxisInterval) {
  if (typeof interval === "number") {
    return `فاصله: ${toPersianDigits(interval)}`
  }
  const map: Record<string, string> = {
    preserveStart: "حفظ ابتدا",
    preserveEnd: "حفظ انتها",
    preserveStartEnd: "حفظ ابتدا و انتها",
    equidistantPreserveStart: "فاصلهٔ یکنواخت با حفظ ابتدا",
  }
  return map[String(interval)] ?? String(interval)
}

function MyChart({
  interval,
  length = 100,
}: {
  interval: AxisInterval
  length?: number
}) {
  const raw = usePersianMockData(length, 22813)
  // Compact numeric labels — full «دوره N» strings crush the axis when dense.
  const data = raw.map((row, i) => ({
    ...row,
    label: toPersianDigits(i + 1),
  }))
  const dense = typeof interval === "number"

  return (
    <ChartContainer
      config={chart2MockConfig}
      className="aspect-[1.618] h-auto w-full max-w-[700px] max-h-[40vh] font-sans"
    >
      <LineChart
        accessibilityLayer
        data={data}
        margin={{
          left: 8,
          right: 8,
          top: 16,
          bottom: dense ? 36 : 12,
        }}
      >
        <CartesianGrid />
        <XAxis
          dataKey="label"
          reversed
          interval={interval}
          tickLine={false}
          axisLine={false}
          tickMargin={dense ? 16 : 8}
          minTickGap={dense ? 14 : 20}
          angle={dense ? -45 : 0}
          textAnchor={dense ? "end" : "middle"}
          height={dense ? 56 : undefined}
        />
        <YAxis
          orientation="right"
          interval={interval}
          width={52}
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          minTickGap={16}
          tickFormatter={formatChart2Number}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          type="monotone"
          dataKey="x"
          stroke="var(--color-x)"
          strokeWidth={2}
          activeDot={{ r: 8 }}
        />
        <Line type="monotone" dataKey="y" stroke="var(--color-y)" strokeWidth={2} />
        <Label
          position="insideBottom"
          offset={dense ? 36 : 8}
          value={intervalLabel(interval)}
          style={{ fontFamily: "var(--font-sans)" }}
        />
      </LineChart>
    </ChartContainer>
  )
}

export default function LineChartAxisIntervalDemo() {
  return (
    <div className="flex w-full max-w-[700px] flex-col gap-6">
      <MyChart interval="preserveStart" />
      <MyChart interval="preserveEnd" />
      <MyChart interval="preserveStartEnd" />
      <MyChart interval="equidistantPreserveStart" />
      {/* Fewer points so interval={1} stays readable with Persian digits. */}
      <MyChart interval={1} length={20} />
    </div>
  )
}
