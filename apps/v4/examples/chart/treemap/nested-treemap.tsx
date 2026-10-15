"use client"

import { Treemap, type TreemapNode } from "recharts"

import { useChartCaption } from "@/components/chart-live"
import { formatChartNumber } from "@/lib/chart-fa"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

import { TREEMAP_DATA_GALLERY } from "./data"
import { NestedTreemapContent } from "./treemap-content"
import { TREEMAP_COLORS } from "./treemap-colors"

const chartConfig = {
  size: { label: "اندازه", color: TREEMAP_COLORS[0] },
} satisfies ChartConfig

function nestBreadcrumb(item: TreemapNode, index: number) {
  const raw = item?.name
  const label =
    !raw || raw === "root" || raw === "Root" ? "همه" : String(raw)
  return index === 0 ? `↑ ${label}` : label
}

export default function NestedTreemapDemo() {
  useChartCaption(() => (
    <>
      روی دسته کلیک کنید تا وارد شوید؛ برای برگشت از نوار پایین (مثلاً «↑ همه»)
      استفاده کنید
    </>
  ))

  return (
    <div className="w-full max-w-[720px] font-sans" dir="rtl">
      <ChartContainer
        config={chartConfig}
        dir="ltr"
        className="aspect-[1.618] h-auto w-full overflow-visible font-sans text-xs [&_.recharts-responsive-container]:overflow-visible [&_.recharts-treemap-nest-index-wrapper]:mt-2 [&_.recharts-treemap-nest-index-wrapper]:flex [&_.recharts-treemap-nest-index-wrapper]:flex-wrap [&_.recharts-treemap-nest-index-wrapper]:justify-center [&_.recharts-treemap-nest-index-wrapper]:gap-1.5 [&_.recharts-treemap-nest-index-wrapper]:text-center [&_.recharts-treemap-nest-index-box]:!m-0 [&_.recharts-treemap-nest-index-box]:rounded-md [&_.recharts-treemap-nest-index-box]:!bg-primary [&_.recharts-treemap-nest-index-box]:px-2.5 [&_.recharts-treemap-nest-index-box]:py-1 [&_.recharts-treemap-nest-index-box]:!text-primary-foreground [&_.recharts-treemap-nest-index-box]:text-xs [&_.recharts-treemap-nest-index-box]:font-medium"
      >
        <Treemap
          data={TREEMAP_DATA_GALLERY}
          dataKey="size"
          nameKey="name"
          type="nest"
          content={NestedTreemapContent}
          nestIndexContent={nestBreadcrumb}
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
