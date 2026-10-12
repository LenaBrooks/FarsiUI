"use client"

import { Treemap, type TreemapNode } from "recharts"

import { toPersianDigits } from "@/lib/chart2-fa"
import {
  ChartContainer,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

import { TREEMAP_DATA } from "./data"
import { treemapColorAt } from "./treemap-colors"

const chartConfig = {
  size: { label: "اندازه", color: "#8fa0c4" },
} satisfies ChartConfig

function CustomizedContent(props: TreemapNode) {
  const { root, depth, x, y, width, height, index, name } = props
  const fill =
    depth < 2
      ? treemapColorAt(index, root?.children?.length ?? 1)
      : "transparent"
  const showLabel = depth === 1 && width > 48 && height > 32

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
          strokeWidth: 2 / (depth + 1e-10),
          strokeOpacity: 1 / (depth + 1e-10),
        }}
      />
      {showLabel ? (
        <>
          <text
            x={x + 8}
            y={y + 18}
            fill="#1f2937"
            fontSize={13}
            fillOpacity={0.85}
            style={{ fontFamily: "var(--font-sans)", direction: "ltr" }}
          >
            {toPersianDigits(index + 1)}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 6}
            textAnchor="middle"
            fill="#1f2937"
            fontSize={width > 80 ? 13 : 11}
            style={{ fontFamily: "var(--font-sans)", direction: "rtl" }}
          >
            {name}
          </text>
        </>
      ) : null}
    </g>
  )
}

export default function CustomContentTreemapDemo() {
  return (
    <ChartContainer
      config={chartConfig}
      dir="ltr"
      className="mx-auto aspect-[4/3] h-auto w-full max-w-[500px] max-h-[80vh] font-sans text-xs"
    >
      <Treemap
        data={TREEMAP_DATA}
        dataKey="size"
        nameKey="name"
        content={CustomizedContent}
        isAnimationActive
      />
    </ChartContainer>
  )
}
