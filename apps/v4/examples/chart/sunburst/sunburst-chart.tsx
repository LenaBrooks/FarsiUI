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
    name: "تهران",
    value: 40,
    children: [
      { name: "فروش حضوری", value: 16 },
      { name: "آنلاین", value: 14 },
      {
        name: "انبار",
        value: 10,
        children: [
          { name: "مرکزی", value: 6 },
          { name: "محلی", value: 4 },
        ],
      },
    ],
  },
  {
    name: "اصفهان",
    value: 22,
    children: [
      { name: "حضوری", value: 12 },
      { name: "آنلاین", value: 10 },
    ],
  },
  {
    name: "مشهد",
    value: 20,
    children: [
      { name: "ویترین", value: 11 },
      { name: "انبار", value: 9 },
    ],
  },
  {
    name: "شیراز",
    value: 18,
    children: [
      { name: "حضوری", value: 10 },
      { name: "آنلاین", value: 8 },
    ],
  },
])

const TOTAL = 100
const names = flattenSunburstNames(children)

const data: SunburstData = {
  name: "کل فروش",
  value: TOTAL,
  children,
}

const chartConfig = {
  value: { label: "سهم", color: CHART_BAR_COLORS[0] },
} satisfies ChartConfig

export default function SunburstChartDemo() {
  const [active, setActive] = React.useState<SunburstActive>(null)

  useChartCaption(() => <>سهم فروش شعب و کانال‌ها</>)

  return (
    <SunburstFrame
      active={active}
      total={TOTAL}
      totalLabel="کل فروش"
      unit="درصد"
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
