"use client"

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"

import {
  CHART_TOMAN_AXIS_WIDTH,
  FA_MONTHS,
  formatPersianMonthTick,
  formatToman,
} from "@/lib/chart-locale"
import { TomanAxisTick } from "@/lib/chart-toman-tick"
import {
  ChartContainer,
  ChartTooltip,
} from "@/registry/new-york-v4/ui/chart"

import {
  LINE_CHART_CLASS,
  LINE_TOOLTIP_CURSOR,
  LineSalesTooltipContent,
  LineShell,
  lineSalesConfig,
  useLineSalesCaption,
  useSalesData,
} from "./line-fa-shared"

const referenceMonth = FA_MONTHS[2]!
const referenceY = 200_000_000

export default function LineChartWithReferenceLinesDemo() {
  const data = useSalesData(984)
  useLineSalesCaption("خطوط مرجع")

  return (
    <LineShell>
      <ChartContainer config={lineSalesConfig} className={LINE_CHART_CLASS}>
        <LineChart
          accessibilityLayer
          data={data}
          margin={{ top: 20, right: 8, left: 8, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            reversed
            tickLine={false}
            axisLine={false}
            tickMargin={12}
            tickFormatter={formatPersianMonthTick}
          />
          <YAxis
            orientation="right"
            width={CHART_TOMAN_AXIS_WIDTH}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={TomanAxisTick}
          />
          <ChartTooltip
            cursor={LINE_TOOLTIP_CURSOR}
            content={<LineSalesTooltipContent />}
          />
          <ReferenceLine
            x={referenceMonth}
            stroke="var(--destructive)"
            label={{
              value: "مرجع ماه",
              fill: "var(--destructive)",
              position: "insideBottomRight",
              angle: -90,
              dx: 20,
              fontFamily: "var(--font-sans)",
            }}
          />
          <ReferenceLine
            y={referenceY}
            stroke="var(--destructive)"
            label={{
              value: formatToman(referenceY, { compact: true, suffix: false }),
              fill: "var(--destructive)",
              position: "insideTopLeft",
              fontFamily: "var(--font-sans)",
            }}
          />
          <Line
            type="monotone"
            dataKey="online"
            name="online"
            stroke="var(--color-online)"
            strokeWidth={2.25}
          />
          <Line
            type="monotone"
            dataKey="store"
            name="store"
            stroke="var(--color-store)"
            strokeWidth={2.75}
          />
        </LineChart>
      </ChartContainer>
    </LineShell>
  )
}
