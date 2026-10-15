"use client"

import { Treemap } from "recharts"

import { useChartCaption } from "@/lib/chart-live"
import { formatChartNumber } from "@/lib/chart-fa"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

import { TREEMAP_DATA_GALLERY } from "./data"
import { GapsTreemapContent } from "./treemap-content"
import { TREEMAP_COLORS } from "./treemap-colors"

const chartConfig = {
  size: { label: "اندازه", color: TREEMAP_COLORS[0] },
} satisfies ChartConfig

export default function TreemapWithPaddingAndGapsDemo() {
  useChartCaption(() => (
    <>درخت‌نقشه با فاصله بین سلول‌ها برای خوانایی بیشتر</>
  ))

  return (
    <div className="w-full max-w-[720px] font-sans">
      <ChartContainer
        config={chartConfig}
        dir="ltr"
        className="aspect-[1.618] h-auto w-full font-sans text-xs"
      >
        <Treemap
          data={TREEMAP_DATA_GALLERY}
          dataKey="size"
          nameKey="name"
          nodeGap={6}
          content={GapsTreemapContent}
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
