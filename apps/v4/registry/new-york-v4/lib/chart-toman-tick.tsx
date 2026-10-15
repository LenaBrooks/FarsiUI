"use client"

import type { ReactNode } from "react"
import type {
  XAxisTickContentProps,
  YAxisTickContentProps,
} from "recharts"

import { splitTomanCompact } from "@/lib/chart-locale"

type TomanAxisTickFields = {
  x?: string | number
  y?: string | number
  payload?: { value?: unknown }
  textAnchor?: string
  index?: number
  visibleTicksCount?: number
  /** `y` = vertical value axis (default). `x` = horizontal value axis (vertical charts). */
  axis?: "x" | "y"
}

function toFiniteNumber(value: unknown) {
  if (value == null || value === "") return null
  const n = typeof value === "number" ? value : Number(value)
  return Number.isFinite(n) ? n : null
}

/**
 * Stacked toman axis tick: number on top, unit below.
 * Y-axis: edge ticks shift so the top value never clips into the card chrome.
 * X-axis: all ticks sit below the axis — never reuse Y edge shifts (they shove the
 * last tick into the footer).
 */
function TomanAxisTickImpl({
  x,
  y,
  payload,
  textAnchor = "start",
  index = 0,
  visibleTicksCount,
  axis = "y",
}: TomanAxisTickFields): ReactNode {
  const px = toFiniteNumber(x)
  const py = toFiniteNumber(y)
  const raw = toFiniteNumber(payload?.value)
  if (px == null || py == null || raw == null) return null
  const { amount, unit: rawUnit } = splitTomanCompact(raw)
  // Zero needs no unit label — “۰ تومان” is noisy and collides on vertical charts.
  const unit = raw === 0 ? "" : rawUnit

  const count = visibleTicksCount ?? 0
  const isFirst = count > 0 && index === 0
  const isLast = count > 0 && index === count - 1

  let amountDy = "0.35em"
  let anchor: "start" | "middle" | "end" =
    textAnchor === "start" || textAnchor === "middle" || textAnchor === "end"
      ? textAnchor
      : "start"
  let tickX = px

  if (axis === "x") {
    // Keep the whole stack under the axis line for every tick.
    amountDy = "0.95em"
    // Edge ticks: pin inward so “۰” / max don’t collide with the Y rail.
    if (isFirst) {
      anchor = "start"
      tickX = px + 2
    } else if (isLast) {
      anchor = "end"
      tickX = px - 2
    } else {
      anchor = "middle"
    }
  } else {
    // Y-axis: index 0 ≈ bottom, last ≈ top.
    if (isLast) amountDy = "0.95em"
    else if (isFirst) amountDy = "-1.15em"
  }

  return (
    <text
      x={tickX}
      y={py}
      textAnchor={anchor}
      direction="ltr"
      className="recharts-text recharts-cartesian-axis-tick-value fill-muted-foreground"
      style={{
        userSelect: "none",
        direction: "ltr",
        unicodeBidi: "isolate",
        fontFamily: "var(--font-sans)",
        fontSize: 11,
      }}
    >
      <tspan x={tickX} dy={amountDy} style={{ letterSpacing: 0 }}>
        {amount}
      </tspan>
      {unit ? (
        <tspan x={tickX} dy="1.15em" fontSize={9} fillOpacity={0.8}>
          {unit}
        </tspan>
      ) : null}
    </text>
  )
}

/** Compatible with Recharts `YAxis` / `XAxis` `tick` render props. */
export const TomanAxisTick = TomanAxisTickImpl as (
  props: YAxisTickContentProps
) => ReactNode

/** Horizontal value axis (vertical layout charts). */
export const TomanXAxisTick = ((props: XAxisTickContentProps) =>
  TomanAxisTickImpl({ ...props, axis: "x" })) as (
  props: XAxisTickContentProps
) => ReactNode
