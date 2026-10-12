"use client"

import { SunburstChart, type SunburstData } from "recharts"

import { useChart2Caption } from "@/components/chart2-live"
import { formatChart2Number, toPersianDigits } from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

const data: SunburstData = {
  name: "باندل",
  value: 9728,
  children: [
    {
      name: "وابستگی‌ها",
      fill: "var(--chart-1)",
      value: 4096,
      children: [
        { name: "react-redux", value: 2304 },
        { name: "victory-vendor", value: 1792 },
      ],
    },
    {
      name: "منبع",
      fill: "var(--chart-2)",
      value: 4608,
      children: [
        { name: "Treemap.tsx", value: 1536 },
        { name: "SunburstChart.tsx", value: 1280 },
        { name: "Tooltip.tsx", value: 1152 },
        { name: "ChartUtils.ts", value: 640 },
      ],
    },
    {
      name: "خروجی",
      fill: "var(--chart-3)",
      value: 1024,
      children: [{ name: "مستندات", value: 1024 }],
    },
  ],
}

const chartConfig = {
  value: { label: "حجم", color: "var(--chart-1)" },
} satisfies ChartConfig

export default function SunburstBundleSizeDemo() {
  useChart2Caption(() => (
    <>
      خورشیدسان حجم باندل — نمونهٔ جایگزین (درخت tree-shaken حدود{" "}
      {toPersianDigits("9.50")} کیلوبایت)
    </>
  ))

  return (
    <div className="w-full max-w-[720px] font-sans">
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square h-[420px] w-full max-w-[420px] font-sans text-xs"
      >
        <SunburstChart
          accessibilityLayer
          data={data}
          dataKey="value"
          isAnimationActive
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
    </div>
  )
}
