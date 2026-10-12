"use client"

import { Treemap, type TreemapNode } from "recharts"

import { useChart2Caption } from "@/components/chart2-live"
import { formatChart2Number, toPersianDigits } from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

import { TREEMAP_BUNDLE_DATA } from "./data"
import { treemapColorAt } from "./treemap-colors"

const chartConfig = {
  size: { label: "حجم", color: "#8fa0c4" },
} satisfies ChartConfig

function TreemapContent(props: TreemapNode) {
  const { root, depth, x, y, width, height, index, name } = props
  if (depth !== 1) return null

  const fill = treemapColorAt(index, root?.children?.length ?? 1)
  const showLabel = width > 56 && height > 32

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill,
          stroke: "var(--background)",
          strokeWidth: 2,
        }}
      />
      {showLabel ? (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#1f2937"
          fontSize={width > 100 ? 13 : 11}
          style={{ fontFamily: "var(--font-sans)", direction: "rtl" }}
        >
          {name}
        </text>
      ) : null}
    </g>
  )
}

export default function TreemapBundleSizeDemo() {
  useChart2Caption(() => (
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
          content={TreemapContent}
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
