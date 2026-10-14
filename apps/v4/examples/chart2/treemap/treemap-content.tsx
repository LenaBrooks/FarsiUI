"use client"

import type { TreemapNode } from "recharts"

import { formatChart2Number, toPersianDigits } from "@/lib/chart2-fa"

import { treemapColorAt } from "./treemap-colors"

const LABEL_FILL = "#1f2937"

function labelFontSize(width: number, height: number) {
  if (width > 120 && height > 56) return 13
  if (width > 72 && height > 40) return 12
  return 11
}

type FlatOptions = {
  showIndex?: boolean
}

/** Depth-1 cells — same polished look as bundle-size treemap. */
export function FlatTreemapContent(
  props: TreemapNode,
  options: FlatOptions = {}
) {
  const { root, depth, x, y, width, height, index, name, value } = props
  if (depth !== 1) return null

  const fill = treemapColorAt(index, root?.children?.length ?? 1)
  const showLabel = width > 52 && height > 30
  const showValue = Boolean(showLabel && value != null && width > 72 && height > 48)
  const fontSize = labelFontSize(width, height)

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={2}
        style={{
          fill,
          stroke: "var(--background)",
          strokeWidth: 2,
        }}
      />
      {showLabel ? (
        <>
          {options.showIndex ? (
            <text
              x={x + 10}
              y={y + 18}
              fill={LABEL_FILL}
              fontSize={12}
              fillOpacity={0.7}
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {toPersianDigits(index + 1)}
            </text>
          ) : null}
          <text
            x={x + width / 2}
            y={y + height / 2 - (showValue ? 7 : 0)}
            textAnchor="middle"
            dominantBaseline="central"
            fill={LABEL_FILL}
            fontSize={fontSize}
            style={{ fontFamily: "var(--font-sans)", direction: "rtl" }}
          >
            {name}
          </text>
          {showValue ? (
            <text
              x={x + width / 2}
              y={y + height / 2 + 12}
              textAnchor="middle"
              dominantBaseline="central"
              fill={LABEL_FILL}
              fontSize={10}
              fillOpacity={0.72}
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {formatChart2Number(Number(value))}
            </text>
          ) : null}
        </>
      ) : null}
    </g>
  )
}

export function SimpleTreemapContent(props: TreemapNode) {
  return FlatTreemapContent(props)
}

export function CustomTreemapContent(props: TreemapNode) {
  return FlatTreemapContent(props, { showIndex: true })
}

export function NestedTreemapContent(props: TreemapNode) {
  return FlatTreemapContent(props)
}

/** Parent tint + leaf labels (for nodeGap demos). */
export function GapsTreemapContent(props: TreemapNode) {
  const { root, depth, x, y, width, height, index, name, children, value } =
    props
  const isLeaf = !children || children.length === 0
  const fill =
    depth < 2
      ? treemapColorAt(index, root?.children?.length ?? 1)
      : "transparent"

  const showLabel = isLeaf && width > 44 && height > 28
  const showValue = Boolean(showLabel && value != null && width > 64 && height > 44)

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={depth === 1 ? 2 : 0}
        style={{
          fill,
          stroke: "var(--background)",
          strokeWidth: depth === 1 ? 2 : 1,
        }}
      />
      {showLabel ? (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - (showValue ? 7 : 0)}
            textAnchor="middle"
            dominantBaseline="central"
            fill={LABEL_FILL}
            fontSize={labelFontSize(width, height)}
            style={{ fontFamily: "var(--font-sans)", direction: "rtl" }}
          >
            {name}
          </text>
          {showValue ? (
            <text
              x={x + width / 2}
              y={y + height / 2 + 12}
              textAnchor="middle"
              dominantBaseline="central"
              fill={LABEL_FILL}
              fontSize={10}
              fillOpacity={0.72}
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {formatChart2Number(Number(value))}
            </text>
          ) : null}
        </>
      ) : null}
    </g>
  )
}
