"use client"

import type { AxisInterval } from "recharts"
import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts"

import { usePersianMockData, useChart2Caption } from "@/components/chart2-live"
import {
  CHART_TOMAN_AXIS_WIDTH,
  toPersianDigits,
} from "@/lib/chart-locale"
import { TomanAxisTick } from "@/lib/chart-toman-tick"
import {
  ChartContainer,
  ChartTooltip,
} from "@/registry/new-york-v4/ui/chart"

import {
  LINE_TOOLTIP_CURSOR,
  LineSalesTooltipContent,
  lineSalesConfig,
} from "./line-fa-shared"

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
  // Dense axis demo: numeric Persian indices; values remapped to toman scale.
  const data = raw.map((row, i) => ({
    month: toPersianDigits(i + 1),
    store: Math.round(row.x * 40_000),
    online: Math.round(row.y * 40_000),
  }))
  const dense = typeof interval === "number"

  return (
    <ChartContainer
      config={lineSalesConfig}
      className="aspect-[1.618] h-auto w-full max-w-[700px] max-h-[40vh] font-sans [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-muted-foreground/32 dark:[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-muted-foreground/38"
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
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
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
          width={CHART_TOMAN_AXIS_WIDTH}
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          minTickGap={16}
          tick={TomanAxisTick}
        />
        <ChartTooltip
          cursor={LINE_TOOLTIP_CURSOR}
          content={<LineSalesTooltipContent />}
        />
        <Line
          type="monotone"
          dataKey="online"
          name="online"
          stroke="var(--color-online)"
          strokeWidth={2.25}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="store"
          name="store"
          stroke="var(--color-store)"
          strokeWidth={2.5}
          activeDot={{ r: 6, strokeWidth: 2, stroke: "var(--background)" }}
          dot={false}
        />
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
  useChart2Caption(() => "فاصلهٔ تیک محور · تومان · ارقام فارسی", [])

  return (
    <div dir="rtl" className="flex w-full max-w-[700px] flex-col gap-6 font-sans">
      <MyChart interval="preserveStart" />
      <MyChart interval="preserveEnd" />
      <MyChart interval="preserveStartEnd" />
      <MyChart interval="equidistantPreserveStart" />
      <MyChart interval={1} length={20} />
    </div>
  )
}
