"use client"

import { Treemap, type TreemapNode } from "recharts"

import { formatChart2Number } from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

import { TREEMAP_DATA_NESTED } from "./data"
import { treemapColorAt } from "./treemap-colors"

const chartConfig = {
  size: { label: "اندازه", color: "#8fa0c4" },
} satisfies ChartConfig

function TreemapContent(props: TreemapNode) {
  const { root, depth, x, y, width, height, index, name } = props
  if (depth !== 1) return null

  const fill = treemapColorAt(index, root?.children?.length ?? 1)
  const showLabel = width > 44 && height > 28

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
          fontSize={width > 70 ? 12 : 10}
          style={{ fontFamily: "var(--font-sans)", direction: "rtl" }}
        >
          {name}
        </text>
      ) : null}
    </g>
  )
}

/**
 * با type="nest"، کلیک روی گرهٔ والد بزرگ‌نمایی می‌کند و فرزندان را نشان می‌دهد.
 * برای برگشت، از مسیر ناوبری پایین نمودار استفاده کنید.
 */
export default function NestedTreemapDemo() {
  return (
    <ChartContainer
      config={chartConfig}
      dir="ltr"
      className="mx-auto aspect-[4/3] h-auto w-full max-w-[500px] max-h-[80vh] font-sans text-xs"
    >
      <Treemap
        data={TREEMAP_DATA_NESTED}
        dataKey="size"
        nameKey="name"
        aspectRatio={4 / 3}
        type="nest"
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
  )
}
