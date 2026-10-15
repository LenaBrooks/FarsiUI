"use client"

import * as React from "react"
import { SunburstChart, type SunburstData } from "recharts"

import { useChartCaption } from "@/components/chart-live"
import { formatChartNumber } from "@/lib/chart-fa"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

import {
  CHART_BAR_COLORS,
  SunburstFrame,
  SunburstNameLabels,
  colorizeTree,
  flattenSunburstNames,
  sunburstTextOptions,
  type SunburstActive,
} from "./sunburst-shared"

const children = colorizeTree([
  {
    name: "فنی",
    value: 60,
    children: [
      { name: "فرانت‌اند", value: 25 },
      {
        name: "بک‌اند",
        value: 20,
        children: [
          { name: "API", value: 12 },
          { name: "داده", value: 8 },
        ],
      },
      { name: "تست", value: 15 },
    ],
  },
  {
    name: "فروش",
    value: 40,
    children: [
      { name: "مستقیم", value: 25 },
      { name: "شرکا", value: 15 },
    ],
  },
  {
    name: "بازاریابی",
    value: 30,
    children: [
      { name: "محتوا", value: 18 },
      { name: "تبلیغات", value: 12 },
    ],
  },
  {
    name: "پشتیبانی",
    value: 20,
    children: [
      { name: "تیکت", value: 12 },
      { name: "تلفن", value: 8 },
    ],
  },
])

const TOTAL = 150
const names = flattenSunburstNames(children)

const data: SunburstData = {
  name: "شرکت",
  value: TOTAL,
  children,
}

const chartConfig = {
  value: { label: "نفر", color: CHART_BAR_COLORS[0] },
  فنی: { label: "فنی", color: CHART_BAR_COLORS[0] },
  فروش: { label: "فروش", color: CHART_BAR_COLORS[1] },
  بازاریابی: { label: "بازاریابی", color: CHART_BAR_COLORS[2] },
  پشتیبانی: { label: "پشتیبانی", color: CHART_BAR_COLORS[3] },
} satisfies ChartConfig

export default function SunburstChartThemeColorsDemo() {
  const [active, setActive] = React.useState<SunburstActive>(null)

  useChartCaption(() => <>ترکیب نیروی تیم‌ها به‌صورت خورشیدسان</>)

  return (
    <SunburstFrame
      active={active}
      total={TOTAL}
      totalLabel="کل نیرو"
      unit="نفر"
    >
      <SunburstNameLabels names={names} className="w-full">
        <ChartContainer
          config={chartConfig}
          className="aspect-square h-auto w-full max-w-[400px] max-h-[70vh] font-sans text-xs [&_.recharts-sector]:cursor-pointer [&_.recharts-sector]:outline-none"
        >
          <SunburstChart
            accessibilityLayer
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={72}
            padding={2}
            ringPadding={2}
            stroke="var(--background)"
            textOptions={sunburstTextOptions}
            isAnimationActive
            onMouseEnter={(node) => {
              setActive({
                name: String(node.name ?? ""),
                value: Number(node.value ?? 0),
                fill: typeof node.fill === "string" ? node.fill : undefined,
              })
            }}
            onMouseLeave={() => setActive(null)}
          >
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => formatChartNumber(value as number)}
                />
              }
            />
          </SunburstChart>
        </ChartContainer>
      </SunburstNameLabels>
    </SunburstFrame>
  )
}
