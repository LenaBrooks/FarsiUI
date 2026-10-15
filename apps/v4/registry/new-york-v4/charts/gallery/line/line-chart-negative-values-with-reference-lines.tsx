"use client"

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"

import { useChartCaption } from "@/registry/new-york-v4/lib/chart-live"
import { CHART_BAR_COLORS } from "@/lib/chart-fa"
import { formatPersianNumber } from "@/lib/chart-locale"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

const data = [
  { x: -50, y: -50 },
  { x: 0, y: 0 },
  { x: 50, y: 50 },
  { x: 100, y: 100 },
  { x: 150, y: 150 },
  { x: 200, y: 200 },
  { x: 250, y: 250 },
  { x: 350, y: 350 },
  { x: 400, y: 400 },
  { x: 450, y: 450 },
  { x: 500, y: 500 },
]

const minX = Math.min(...data.map((d) => d.x))
const minY = Math.min(...data.map((d) => d.y))

const chartConfig = {
  y: {
    label: "مقدار Y",
    color: CHART_BAR_COLORS[0],
  },
} satisfies ChartConfig

export default function LineChartNegativeValuesWithReferenceLinesDemo() {
  useChartCaption(() => "مقادیر منفی با خطوط مرجع · ارقام فارسی", [])

  return (
    <div dir="rtl" className="w-full max-w-[700px] font-sans">
      <ChartContainer
        config={chartConfig}
        className="aspect-[1.618] h-auto w-full max-w-[700px] max-h-[70vh] font-sans [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-muted-foreground/32 dark:[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-muted-foreground/38"
      >
        <LineChart
          accessibilityLayer
          margin={{ top: 18, right: 8, left: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <YAxis
            dataKey="y"
            domain={["auto", "auto"]}
            type="number"
            interval={0}
            orientation="right"
            allowDataOverflow
            strokeWidth={minX < 0 ? 0 : 1}
            width={52}
            tickFormatter={(v) => formatPersianNumber(v)}
            label={{
              value: "محور Y",
              style: {
                textAnchor: "middle",
                fontFamily: "var(--font-sans)",
              },
              angle: -90,
              position: "insideRight",
              offset: 0,
            }}
          />
          <XAxis
            dataKey="x"
            domain={["auto", "auto"]}
            interval={0}
            type="number"
            reversed
            allowDataOverflow
            strokeWidth={minY < 0 ? 0 : 1}
            tickFormatter={(v) => formatPersianNumber(v)}
            label={{
              key: "xAxisLabel",
              value: "محور X",
              position: "bottom",
              style: { fontFamily: "var(--font-sans)" },
            }}
          />
          {minY < 0 ? (
            <ReferenceLine y={0} strokeWidth={1.5} strokeOpacity={0.65} />
          ) : null}
          {minX < 0 ? (
            <ReferenceLine x={0} strokeWidth={1.5} strokeOpacity={0.65} />
          ) : null}
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            strokeWidth={2.5}
            data={data}
            dot={false}
            type="monotone"
            dataKey="y"
            stroke="var(--color-y)"
            tooltipType="none"
          />
        </LineChart>
      </ChartContainer>
    </div>
  )
}
