"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { usePersianMockData } from "@/components/chart2-live"
import {
  chart2ContainerClassName,
  chart2MockConfig,
  formatPersianNumber,
  toPersianDigits,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/registry/new-york-v4/ui/chart"

function toPercent(decimal: number) {
  return `${toPersianDigits(Math.round(decimal * 100))}٪`
}

export default function PercentAreaChartDemo() {
  const data = usePersianMockData(6, 198905)

  return (
    <ChartContainer config={chart2MockConfig} className={chart2ContainerClassName}>
      <AreaChart
        accessibilityLayer
        data={data}
        stackOffset="expand"
        margin={{ top: 10, right: 8, left: 0, bottom: 5 }}
      >
        <CartesianGrid />
        <XAxis dataKey="label" reversed tickMargin={8} />
        <YAxis
          orientation="right"
          width={44}
          tickMargin={10}
          tickFormatter={toPercent}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value, name, item, _index, payload) => {
                const row = payload as Record<string, number> | undefined
                const total =
                  (row?.x ?? 0) + (row?.y ?? 0) + (row?.z ?? 0)
                const n = typeof value === "number" ? value : Number(value)
                const pct = total > 0 ? n / total : 0
                const label =
                  chart2MockConfig[name as keyof typeof chart2MockConfig]
                    ?.label ?? String(name)
                return (
                  <div className="flex w-full items-center justify-between gap-3 font-sans [font-family:var(--font-sans)]">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-foreground">
                      {formatPersianNumber(n)} ({toPercent(pct)})
                    </span>
                  </div>
                )
              }}
            />
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          type="monotone"
          dataKey="x"
          stackId="1"
          stroke="var(--color-x)"
          fill="var(--color-x)"
          fillOpacity={0.75}
        />
        <Area
          type="monotone"
          dataKey="y"
          stackId="1"
          stroke="var(--color-y)"
          fill="var(--color-y)"
          fillOpacity={0.75}
        />
        <Area
          type="monotone"
          dataKey="z"
          stackId="1"
          stroke="var(--color-z)"
          fill="var(--color-z)"
          fillOpacity={0.75}
        />
      </AreaChart>
    </ChartContainer>
  )
}
