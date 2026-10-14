"use client"

import { Treemap } from "recharts"

import { useChart2Caption } from "@/components/chart2-live"
import { formatChart2Number } from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

import { TREEMAP_DATA_GALLERY } from "./data"
import { CustomTreemapContent } from "./treemap-content"
import { TREEMAP_COLORS } from "./treemap-colors"

const chartConfig = {
  size: { label: "اندازه", color: TREEMAP_COLORS[0] },
} satisfies ChartConfig

export default function CustomContentTreemapDemo() {
  useChart2Caption(() => (
    <>درخت‌نقشه با برچسب شماره و مقدار روی هر سلول</>
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
          content={CustomTreemapContent}
          isAnimationActive
        >
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value) => formatChart2Number(value as number)}
              />
            }
          />
        </Treemap>
      </ChartContainer>
    </div>
  )
}
