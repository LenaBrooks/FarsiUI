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

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

const chartConfig = {
  size: { label: "اندازه", color: "var(--chart-1)" },
} satisfies ChartConfig

export function renderNodeGapAndPaddingContent(props: TreemapNode) {
  const { root, depth, x, y, width, height, index, name, children } = props
  const isLeaf = !children || children.length === 0

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill:
            depth < 2
              ? COLORS[Math.floor((index / (root?.children?.length ?? 1)) * 5)]
              : "#ffffff00",
          stroke: "var(--background)",
          strokeWidth: 1,
        }}
      />
      {isLeaf && width > 36 && height > 18 ? (
        <text
          x={x + width / 2}
          y={y + height / 2 + 4}
          textAnchor="middle"
          fill="var(--primary-foreground)"
          fontSize={12}
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {name}
        </text>
      ) : null}
    </g>
  )
}

export default function TreemapWithPaddingAndGapsDemo() {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-[4/3] h-auto w-full max-w-[500px] max-h-[80vh] font-sans text-xs"
    >
      <Treemap
        data={TREEMAP_DATA_NESTED}
        dataKey="size"
        nameKey="name"
        aspectRatio={4 / 3}
        nodeGap={6}
        content={renderNodeGapAndPaddingContent}
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
