"use client"

import { useEffect, useState } from "react"
import { Cell, Pie, PieChart } from "recharts"

import { useChart2Caption } from "@/components/chart2-live"
import {
  chart2AreaContainerClassName,
  chart2NumClassName,
  toPersianDigits,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

import { GAUGE_NEEDLE, GAUGE_TRAFFIC_COLORS } from "./gauge-shared"

/** Score 0–100; needle aims at this value on the semicircle. */
const SCORE = 72

const bands = [
  { key: "low", name: "کم", value: 40, color: GAUGE_TRAFFIC_COLORS[0] },
  { key: "mid", name: "متوسط", value: 30, color: GAUGE_TRAFFIC_COLORS[1] },
  { key: "high", name: "زیاد", value: 30, color: GAUGE_TRAFFIC_COLORS[2] },
] as const

const chartConfig = {
  low: { label: "کم", color: GAUGE_TRAFFIC_COLORS[0] },
  mid: { label: "متوسط", color: GAUGE_TRAFFIC_COLORS[1] },
  high: { label: "زیاد", color: GAUGE_TRAFFIC_COLORS[2] },
} satisfies ChartConfig

const CX = 150
const CY = 150
const INNER_R = 70
const OUTER_R = 120
const PIE_ANIMATION_MS = 1100
const RADIAN = Math.PI / 180

function Needle({
  cx,
  cy,
  innerRadius,
  outerRadius,
  value,
  max,
}: {
  cx: number
  cy: number
  innerRadius: number
  outerRadius: number
  value: number
  max: number
}) {
  const ang = 180 * (1 - Math.min(Math.max(value, 0), max) / max)
  const length = (innerRadius + 2 * outerRadius) / 3
  const sin = Math.sin(-RADIAN * ang)
  const cos = Math.cos(-RADIAN * ang)
  const r = 6
  const x0 = cx + 5 * cos
  const y0 = cy + 5 * sin
  const xba = x0 + r * sin
  const yba = y0 - r * cos
  const xbb = x0 - r * sin
  const ybb = y0 + r * cos
  const xp = cx + length * cos
  const yp = cy + length * sin

  return (
    <g>
      <circle cx={cx} cy={cy} r={r + 2} fill={GAUGE_NEEDLE} stroke="none" />
      <path
        d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} Z`}
        fill={GAUGE_NEEDLE}
        stroke="none"
      />
      <circle
        cx={cx}
        cy={cy}
        r={3}
        fill="var(--background)"
        stroke={GAUGE_NEEDLE}
        strokeWidth={1.5}
      />
    </g>
  )
}

export default function PieChartWithNeedleDemo({
  isAnimationActive = true,
}: {
  isAnimationActive?: boolean
}) {
  const [showNeedle, setShowNeedle] = useState(!isAnimationActive)

  useEffect(() => {
    if (!isAnimationActive) {
      setShowNeedle(true)
      return
    }
    setShowNeedle(false)
    const id = window.setTimeout(() => setShowNeedle(true), PIE_ANIMATION_MS)
    return () => window.clearTimeout(id)
  }, [isAnimationActive])

  useChart2Caption(
    () => (
      <>
        گیج Recharts — امتیاز{" "}
        <span className={chart2NumClassName}>
          {toPersianDigits(String(SCORE))}
        </span>{" "}
        از ۱۰۰
      </>
    )
  )

  return (
    <div className="flex w-full max-w-[420px] flex-col items-center gap-1 font-sans">
      <ChartContainer
        config={chartConfig}
        className={`${chart2AreaContainerClassName} mx-auto h-[180px] max-h-[180px] w-full max-w-[320px] aspect-auto`}
      >
        <PieChart accessibilityLayer width={300} height={180}>
          <Pie
            data={bands.map((b) => ({ ...b }))}
            dataKey="value"
            nameKey="key"
            startAngle={180}
            endAngle={0}
            cx={CX}
            cy={CY}
            innerRadius={INNER_R}
            outerRadius={OUTER_R}
            stroke="none"
            isAnimationActive={isAnimationActive}
            animationDuration={PIE_ANIMATION_MS}
            onAnimationEnd={() => setShowNeedle(true)}
          >
            {bands.map((band) => (
              <Cell key={band.key} fill={band.color} />
            ))}
          </Pie>
          {showNeedle
            ? Needle({
                cx: CX,
                cy: CY,
                innerRadius: INNER_R,
                outerRadius: OUTER_R,
                value: SCORE,
                max: 100,
              })
            : null}
          <text
            x={CX}
            y={CY - 8}
            textAnchor="middle"
            className="fill-foreground text-[22px] font-semibold"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {toPersianDigits(String(SCORE))}
          </text>
          <text
            x={CX}
            y={CY + 14}
            textAnchor="middle"
            className="fill-muted-foreground text-[11px]"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            امتیاز
          </text>
        </PieChart>
      </ChartContainer>
      <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-muted-foreground">
        {bands.map((band) => (
          <span key={band.key} className="inline-flex items-center gap-1.5">
            <span
              className="size-1.5 rounded-full"
              style={{ background: band.color }}
              aria-hidden
            />
            {band.name}
          </span>
        ))}
      </div>
    </div>
  )
}
