"use client"

import { Treemap } from "recharts"

import { useChartCaption } from "@/components/chart-live"
import { formatChartNumber, toPersianDigits } from "@/lib/chart-fa"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

import { TREEMAP_BUNDLE_DATA } from "./data"
import { SimpleTreemapContent } from "./treemap-content"
import { TREEMAP_COLORS } from "./treemap-colors"

const chartConfig = {
  size: { label: "حجم", color: TREEMAP_COLORS[0] },
} satisfies ChartConfig

export default function TreemapBundleSizeDemo() {
  useChartCaption(() => (
    <>
      درخت‌نقشهٔ حجم باندل — نمونهٔ جایگزین (درخت tree-shaken حدود{" "}
      {toPersianDigits("9.50")} کیلوبایت)
    </>
  ))

  return (
    <div className="w-full max-w-[720px] font-sans">
      <ChartContainer
        config={chartConfig}
        dir="ltr"
        className="aspect-[1.618] h-auto w-full font-sans text-xs"
      >
        <Treemap
          data={TREEMAP_BUNDLE_DATA}
          dataKey="size"
          nameKey="name"
          content={SimpleTreemapContent}
          isAnimationActive
        >
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value) => formatChartNumber(value as number)}
              />
            }
          />
        </Treemap>
      </ChartContainer>
    </div>
  )
}
