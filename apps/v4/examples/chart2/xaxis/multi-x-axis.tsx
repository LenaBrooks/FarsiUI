"use client"

import { Line, LineChart, XAxis } from "recharts"

import {
  FA_CHART,
  FA_MONTHS,
  chart2ContainerClassName,
  formatChart2Number,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

const data = [
  { name: FA_MONTHS[0], uv: 4000, pv: 2400, amt: 2400 },
  { name: FA_MONTHS[1], uv: 3000, pv: 1398, amt: 2210 },
  { name: FA_MONTHS[2], uv: 2000, pv: 9800, amt: 2290 },
  { name: FA_MONTHS[3], uv: 2780, pv: 3908, amt: 2000 },
  { name: FA_MONTHS[4], uv: 1890, pv: 4800, amt: 2181 },
  { name: FA_MONTHS[5], uv: 2390, pv: 3800, amt: 2500 },
  { name: "مهر", uv: 3490, pv: 4300, amt: 2100 },
]

const chartConfig = {
  name: { label: "ماه", color: "var(--chart-1)" },
  uv: { label: FA_CHART.store, color: "var(--chart-2)" },
  pv: { label: FA_CHART.online, color: "var(--chart-3)" },
  amt: { label: FA_CHART.orders, color: "var(--chart-4)" },
} satisfies ChartConfig

export default function MultiXAxisDemo() {
  return (
    <ChartContainer config={chartConfig} className={chart2ContainerClassName}>
      <LineChart accessibilityLayer data={data}>
        <XAxis
          dataKey="name"
          xAxisId="a"
          orientation="top"
          height={40}
          reversed
          tickMargin={8}
          tick={{ fontFamily: "var(--font-sans)", fontSize: 11 }}
        />
        <XAxis
          mirror
          dataKey="uv"
          xAxisId="b"
          height={50}
          reversed
          tickFormatter={formatChart2Number}
          tick={{ fontFamily: "var(--font-sans)", fontSize: 10 }}
        />
        <XAxis
          dataKey="pv"
          type="number"
          xAxisId="c"
          height={60}
          reversed
          tickFormatter={formatChart2Number}
          tick={{ fontFamily: "var(--font-sans)", fontSize: 10 }}
        />
        <XAxis
          mirror
          dataKey="amt"
          type="number"
          orientation="top"
          xAxisId="d"
          height={20}
          reversed
          tickFormatter={formatChart2Number}
          tick={{ fontFamily: "var(--font-sans)", fontSize: 10 }}
        />
        <ChartTooltip
          defaultIndex={2}
          axisId="a"
          content={<ChartTooltipContent />}
        />
        <Line
          dataKey="name"
          xAxisId="a"
          stroke="var(--color-name)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="uv"
          xAxisId="b"
          stroke="var(--color-uv)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="pv"
          xAxisId="c"
          stroke="var(--color-pv)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="amt"
          xAxisId="d"
          stroke="var(--color-amt)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  )
}

export const multiXAxisDescription = (
  <article className="space-y-3 text-sm leading-relaxed text-muted-foreground font-sans" dir="rtl">
    <p>
      وقتی روی همهٔ محورهای یک نوع (XAxis، YAxis، ZAxis) مقدار{" "}
      <code className="rounded bg-muted px-1 py-0.5 text-xs">AxisId</code> مشخص باشد،
      Recharts روی المان گرافیکی متناظر هم به{" "}
      <code className="rounded bg-muted px-1 py-0.5 text-xs">{`{x,y,z}AxisId`}</code> نیاز دارد.
    </p>
    <p>
      همچنین Tooltip باید <code className="rounded bg-muted px-1 py-0.5 text-xs">axisId</code>{" "}
      داشته باشد تا بداند به کدام محور بچسبد.
    </p>
  </article>
)
