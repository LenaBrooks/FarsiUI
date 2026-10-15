"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import type {
  PieSectorDataItem,
  PieSectorShapeProps,
} from "recharts/types/polar/Pie"

import { FA_CHART, FA_MONTHS, formatPersianNumber } from "@/lib/chart-locale"
import { CHART_BAR_COLORS } from "@/lib/chart-fa"
import {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"

export const description = "یک نمودار دایره‌ای تعاملی"

const monthlySalesData = [
  { month: "january", store: 186, fill: "var(--color-january)" },
  { month: "february", store: 305, fill: "var(--color-february)" },
  { month: "march", store: 237, fill: "var(--color-march)" },
  { month: "april", store: 173, fill: "var(--color-april)" },
  { month: "may", store: 209, fill: "var(--color-may)" },
]

const chartConfig = {
  sales: {
    label: FA_CHART.sales,
  },
  store: {
    label: FA_CHART.store,
  },
  online: {
    label: FA_CHART.online,
  },
  january: {
    label: FA_MONTHS[0],
    color: CHART_BAR_COLORS[0],
  },
  february: {
    label: FA_MONTHS[1],
    color: CHART_BAR_COLORS[1],
  },
  march: {
    label: FA_MONTHS[2],
    color: CHART_BAR_COLORS[2],
  },
  april: {
    label: FA_MONTHS[3],
    color: CHART_BAR_COLORS[3],
  },
  may: {
    label: FA_MONTHS[4],
    color: CHART_BAR_COLORS[4],
  },
} satisfies ChartConfig

export default function ChartPieInteractive() {
  const id = "pie-interactive"
  const [activeMonth, setActiveMonth] = React.useState(monthlySalesData[0].month)

  const activeIndex = React.useMemo(
    () => monthlySalesData.findIndex((item) => item.month === activeMonth),
    [activeMonth]
  )
  const months = React.useMemo(() => monthlySalesData.map((item) => item.month), [])

  const renderPieShape = React.useCallback(
    ({ index, outerRadius = 0, ...props }: PieSectorShapeProps) => {
      if (index === activeIndex) {
        return (
          <g>
            <Sector {...props} outerRadius={outerRadius + 10} />
            <Sector
              {...props}
              outerRadius={outerRadius + 25}
              innerRadius={outerRadius + 12}
            />
          </g>
        )
      }

      return <Sector {...props} outerRadius={outerRadius} />
    },
    [activeIndex]
  )

  return (
    <div dir="rtl" data-chart={id} className="flex w-full flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <div className="mb-3 flex items-center justify-end">
        <Select dir="rtl" value={activeMonth} onValueChange={setActiveMonth}>
          <SelectTrigger
            className="h-7 w-[130px] rounded-lg pe-2.5"
            aria-label={FA_CHART.selectRange}
          >
            <SelectValue placeholder="انتخاب ماه" />
          </SelectTrigger>
          <SelectContent dir="rtl" align="end" className="rounded-xl">
            {months.map((key) => {
              const config = chartConfig[key as keyof typeof chartConfig]
              if (!config) return null
              return (
                <SelectItem
                  key={key}
                  value={key}
                  className="rounded-lg text-right [&_span]:flex"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-xs"
                      style={{
                        backgroundColor: `var(--color-${key})`,
                      }}
                    />
                    {config?.label}
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>
      <ChartContainer
        id={id}
        config={chartConfig}
        className="mx-auto aspect-square w-full max-w-[300px]"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={monthlySalesData}
            dataKey="store"
            nameKey="month"
            innerRadius={60}
            strokeWidth={5}
            shape={renderPieShape}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-3xl font-bold"
                      >
                        {formatPersianNumber(
                          monthlySalesData[activeIndex].store
                        )}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        {FA_CHART.sales}
                      </tspan>
                    </text>
                  )
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  )
}
