"use client"

import { formatChart2Number } from "@/lib/chart2-fa"

type ScatterUnitTickProps = {
  x?: number
  y?: number
  payload?: { value?: number | string }
  unit: string
  index?: number
  visibleTicksCount?: number
  /** When Y axes sit on both sides, also skip the max-value X tick (left edge). */
  hideBothEnds?: boolean
}

const tickTextStyle = {
  userSelect: "none",
  direction: "rtl",
  unicodeBidi: "isolate",
  fontFamily: "var(--font-sans)",
  fontSize: 11,
} as const

/** محور عمودی: عدد بالا، واحد پایین — هم‌اندازه و وسط‌چین. */
export function ScatterYUnitTick({
  x,
  y,
  payload,
  unit,
  index = 0,
  visibleTicksCount = 0,
}: ScatterUnitTickProps) {
  if (x == null || y == null || payload?.value == null) return null
  const value = formatChart2Number(payload.value)
  const isBottom = index === 0
  const isTop = visibleTicksCount > 0 && index === visibleTicksCount - 1
  // پایین: فاصله از محور X — بالا: نیفتادن از لبهٔ کارت
  const yPos = isBottom ? y - 14 : isTop ? y + 10 : y
  return (
    <text
      x={x}
      y={yPos}
      textAnchor="middle"
      direction="rtl"
      className="recharts-text recharts-cartesian-axis-tick-value fill-muted-foreground"
      style={tickTextStyle}
    >
      <tspan x={x} dy="0.35em">
        {value}
      </tspan>
      <tspan x={x} dy="1.35em">
        {unit}
      </tspan>
    </text>
  )
}

/**
 * محور افقی: عدد + واحد با RTL.
 * تیک مین (index 0 در آرایهٔ صعودی) با X معکوس کنار محور Y راست است — حذف می‌شود.
 */
export function ScatterXUnitTick({
  x,
  y,
  payload,
  unit,
  index = 0,
  visibleTicksCount = 0,
  hideBothEnds = false,
}: ScatterUnitTickProps) {
  if (x == null || y == null || payload?.value == null) return null
  const raw = Number(payload.value)
  const isMinCorner = index === 0 || raw === 0
  const isMaxCorner =
    hideBothEnds && visibleTicksCount > 1 && index === visibleTicksCount - 1
  if (isMinCorner || isMaxCorner) return null

  const value = formatChart2Number(payload.value)
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      direction="rtl"
      className="recharts-text recharts-cartesian-axis-tick-value fill-muted-foreground"
      style={tickTextStyle}
    >
      <tspan x={x} dy="0.71em">
        {value} {unit}
      </tspan>
    </text>
  )
}
