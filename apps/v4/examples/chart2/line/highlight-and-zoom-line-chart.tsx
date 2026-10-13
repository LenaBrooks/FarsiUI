"use client"

import { useCallback, useState } from "react"
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  XAxis,
  YAxis,
} from "recharts"
import type { MouseHandlerDataParam } from "recharts"

import { useChart2ToolbarStart } from "@/components/chart2-live"
import {
  CHART2_BAR_COLORS,
  formatChart2Number,
  toPersianDigits,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

type Impressions = { name: number; cost: number; impression: number }

const impressionsData: Impressions[] = [
  { name: 1, cost: 4.11, impression: 100 },
  { name: 2, cost: 2.39, impression: 120 },
  { name: 3, cost: 1.37, impression: 150 },
  { name: 4, cost: 1.16, impression: 180 },
  { name: 5, cost: 2.29, impression: 200 },
  { name: 6, cost: 3, impression: 499 },
  { name: 7, cost: 0.53, impression: 50 },
  { name: 8, cost: 2.52, impression: 100 },
  { name: 9, cost: 1.79, impression: 200 },
  { name: 10, cost: 2.94, impression: 222 },
  { name: 11, cost: 4.3, impression: 210 },
  { name: 12, cost: 4.41, impression: 300 },
  { name: 13, cost: 2.1, impression: 50 },
  { name: 14, cost: 8, impression: 190 },
  { name: 15, cost: 0, impression: 300 },
  { name: 16, cost: 9, impression: 400 },
  { name: 17, cost: 3, impression: 200 },
  { name: 18, cost: 2, impression: 50 },
  { name: 19, cost: 3, impression: 100 },
  { name: 20, cost: 7, impression: 100 },
]

type ZoomAndHighlightState = {
  left: string | number
  right: string | number
  refAreaLeft: string | number | undefined
  refAreaRight: string | number | undefined
  top: string | number
  bottom: string | number
  top2: string | number
  bottom2: string | number
  animation: boolean
}

type AxisDomain = [string | number, string | number]

const initialState: ZoomAndHighlightState = {
  left: "dataMin",
  right: "dataMax",
  refAreaLeft: undefined,
  refAreaRight: undefined,
  top: "dataMax+1",
  bottom: "dataMin-1",
  top2: "dataMax+20",
  bottom2: "dataMin-20",
  animation: true,
}

const chartConfig = {
  cost: { label: "هزینه", color: CHART2_BAR_COLORS[0] },
  impression: { label: "بازدید", color: CHART2_BAR_COLORS[1] },
} satisfies ChartConfig

const getAxisYDomain = (
  from: string | number | undefined,
  to: string | number | undefined,
  ref: keyof Impressions,
  offset: number
): AxisDomain => {
  if (from != null && to != null) {
    const refData = impressionsData.slice(Number(from) - 1, Number(to))
    const firstDatum = refData[0]
    if (firstDatum == null) {
      return [initialState.bottom, initialState.top]
    }
    let bottom = firstDatum[ref]
    let top = firstDatum[ref]
    refData.forEach((d) => {
      if (d[ref] > top) top = d[ref]
      if (d[ref] < bottom) bottom = d[ref]
    })

    return [(bottom | 0) - offset, (top | 0) + offset]
  }
  return [initialState.bottom, initialState.top]
}

export default function HighlightAndZoomLineChartDemo() {
  const [zoomGraph, setZoomGraph] =
    useState<ZoomAndHighlightState>(initialState)

  const zoom = useCallback(() => {
    setZoomGraph((prev): ZoomAndHighlightState => {
      let { refAreaLeft, refAreaRight } = prev

      if (refAreaLeft === refAreaRight || !refAreaRight) {
        return {
          ...prev,
          refAreaLeft: undefined,
          refAreaRight: undefined,
        }
      }

      if (refAreaLeft && refAreaRight && refAreaLeft > refAreaRight) {
        ;[refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft]
      }

      const [bottom, top] = getAxisYDomain(refAreaLeft, refAreaRight, "cost", 1)
      const [bottom2, top2] = getAxisYDomain(
        refAreaLeft,
        refAreaRight,
        "impression",
        50
      )

      return {
        ...prev,
        refAreaLeft: undefined,
        refAreaRight: undefined,
        left: refAreaLeft ?? initialState.left,
        right: refAreaRight ?? initialState.right,
        bottom,
        top,
        bottom2,
        top2,
      }
    })
  }, [])

  const zoomOut = useCallback(() => {
    setZoomGraph(initialState)
  }, [])

  const onMouseDown = useCallback((e: MouseHandlerDataParam) => {
    setZoomGraph((prev) => ({ ...prev, refAreaLeft: e.activeLabel }))
  }, [])

  const onMouseMove = useCallback((e: MouseHandlerDataParam) => {
    setZoomGraph((prev) => {
      if (prev.refAreaLeft) {
        return { ...prev, refAreaRight: e.activeLabel }
      }
      return prev
    })
  }, [])

  const { refAreaLeft, refAreaRight, left, right, top, bottom, top2, bottom2 } =
    zoomGraph

  const isZoomed =
    left !== initialState.left || right !== initialState.right

  useChart2ToolbarStart(
    () => (
      <>
        <p className="max-w-[20rem] text-start text-xs leading-relaxed text-muted-foreground">
          با کشیدن ماوس روی نمودار، بازه‌ای را انتخاب کنید تا زوم شود.
        </p>
        <button
          type="button"
          className="shrink-0 cursor-pointer border-0 bg-transparent p-0 text-xs font-medium text-foreground/70 transition-colors hover:bg-transparent hover:text-foreground disabled:cursor-default disabled:opacity-40 disabled:hover:text-foreground/70"
          disabled={!isZoomed}
          onClick={zoomOut}
        >
          نمایش کامل
        </button>
      </>
    ),
    [isZoomed, zoomOut]
  )

  return (
    <div className="w-full" style={{ userSelect: "none" }}>
      <ChartContainer
        config={chartConfig}
        className="aspect-[1.618] h-auto w-full max-w-[700px] max-h-[70vh] font-sans [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-muted-foreground/32 dark:[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-muted-foreground/38"
      >
        <LineChart
          accessibilityLayer
          data={impressionsData}
          margin={{ top: 8, right: 12, left: 12, bottom: 36 }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={zoom}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <ChartLegend
            verticalAlign="top"
            content={<ChartLegendContent className="pt-0 pb-3" />}
          />
          <XAxis
            allowDataOverflow
            dataKey="name"
            domain={[left, right]}
            type="number"
            reversed
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            minTickGap={28}
            tickFormatter={(v) => toPersianDigits(v)}
            label={{
              value: "روز کمپین",
              position: "insideBottom",
              offset: -22,
              style: { fontFamily: "var(--font-sans)", fontSize: 11 },
            }}
          />
          <YAxis
            allowDataOverflow
            domain={[bottom, top]}
            type="number"
            yAxisId="1"
            orientation="right"
            width={56}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tickFormatter={formatChart2Number}
            label={{
              value: "هزینه",
              angle: -90,
              position: "insideRight",
              offset: 0,
              style: {
                textAnchor: "middle",
                fontFamily: "var(--font-sans)",
                fontSize: 11,
              },
            }}
          />
          <YAxis
            orientation="left"
            allowDataOverflow
            domain={[bottom2, top2]}
            type="number"
            yAxisId="2"
            width={56}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tickFormatter={formatChart2Number}
            label={{
              value: "بازدید",
              angle: -90,
              position: "insideLeft",
              offset: 0,
              style: {
                textAnchor: "middle",
                fontFamily: "var(--font-sans)",
                fontSize: 11,
              },
            }}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            yAxisId="1"
            type="natural"
            dataKey="cost"
            name="هزینه"
            stroke="var(--color-cost)"
            strokeWidth={2.75}
            animationDuration={300}
            dot={false}
          />
          <Line
            yAxisId="2"
            type="natural"
            dataKey="impression"
            name="بازدید"
            stroke="var(--color-impression)"
            strokeWidth={2.25}
            animationDuration={300}
            dot={false}
          />
          {refAreaLeft && refAreaRight ? (
            <ReferenceArea
              yAxisId="1"
              x1={refAreaLeft}
              x2={refAreaRight}
              stroke="var(--primary)"
              strokeOpacity={0.55}
              strokeWidth={1}
              fill="var(--primary)"
              fillOpacity={0.18}
            />
          ) : null}
        </LineChart>
      </ChartContainer>
    </div>
  )
}
