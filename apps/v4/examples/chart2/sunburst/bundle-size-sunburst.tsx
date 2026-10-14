"use client"

import * as React from "react"
import { SunburstChart, type SunburstData } from "recharts"

import { useChart2Caption } from "@/components/chart2-live"
import { formatChart2Number, toPersianDigits } from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

import {
  CHART2_BAR_COLORS,
  SunburstFrame,
  SunburstNameLabels,
  colorizeTree,
  flattenSunburstNames,
  sunburstTextOptions,
  type SunburstActive,
} from "./sunburst-shared"

const children = colorizeTree([
  {
    name: "وابستگی‌ها",
    value: 4096,
    children: [
      { name: "react-redux", value: 2304 },
      { name: "victory-vendor", value: 1792 },
    ],
  },
  {
    name: "منبع",
    value: 4608,
    children: [
      { name: "Treemap", value: 1536 },
      { name: "Sunburst", value: 1280 },
      { name: "Tooltip", value: 1152 },
      { name: "ChartUtils", value: 640 },
    ],
  },
  {
    name: "خروجی",
    value: 1024,
    children: [{ name: "مستندات", value: 1024 }],
  },
])

const TOTAL = 9728
const names = flattenSunburstNames(children)

const data: SunburstData = {
  name: "باندل",
  value: TOTAL,
  children,
}

const chartConfig = {
  value: { label: "حجم", color: CHART2_BAR_COLORS[0] },
} satisfies ChartConfig

export default function SunburstBundleSizeDemo() {
  const [active, setActive] = React.useState<SunburstActive>(null)

  useChart2Caption(() => (
    <>
      ترکیب حجم باندل tree-shaken — حدود {toPersianDigits("9.50")} کیلوبایت
    </>
  ))

  return (
    <SunburstFrame
      active={active}
      total={TOTAL}
      totalLabel="حجم کل"
      unit="بایت"
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
                  formatter={(value) => formatChart2Number(value as number)}
                />
              }
            />
          </SunburstChart>
        </ChartContainer>
      </SunburstNameLabels>
    </SunburstFrame>
  )
}
