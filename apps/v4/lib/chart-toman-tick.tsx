"use client"

import { splitTomanCompact } from "@/lib/chart-locale"

type TomanAxisTickProps = {
  x?: number
  y?: number
  payload?: { value?: number }
  textAnchor?: "start" | "middle" | "end"
  index?: number
  visibleTicksCount?: number
  /** `y` = vertical value axis (default). `x` = horizontal value axis (vertical charts). */
  axis?: "x" | "y"
}

/**
 * Stacked toman axis tick: number on top, unit below.
 * Y-axis: edge ticks shift so the top value never clips into the card chrome.
 * X-axis: all ticks sit below the axis — never reuse Y edge shifts (they shove the
 * last tick into the footer).
 */
export function TomanAxisTick({
  x,
  y,
  payload,
  textAnchor = "start",
  index = 0,
  visibleTicksCount,
  axis = "y",
}: TomanAxisTickProps) {
  if (x == null || y == null || payload?.value == null) return null
  const { amount, unit } = splitTomanCompact(payload.value)

  let amountDy = "0.35em"
  if (axis === "x") {
    // Keep the whole stack under the axis line for every tick.
    amountDy = "0.9em"
  } else {
    const count = visibleTicksCount ?? 0
    // Y-axis: index 0 ≈ bottom, last ≈ top.
    const isTop = count > 0 && index === count - 1
    const isBottom = count > 0 && index === 0
    if (isTop) amountDy = "0.95em"
    else if (isBottom) amountDy = "-1.15em"
  }

  return (
    <text
      x={x}
      y={y}
      textAnchor={textAnchor}
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
      <tspan x={x} dy={amountDy} style={{ letterSpacing: 0 }}>
        {amount}
      </tspan>
      {unit ? (
        <tspan x={x} dy="1.15em" fontSize={9} fillOpacity={0.8}>
          {unit}
        </tspan>
      ) : null}
    </text>
  )
}

/** Horizontal value axis (vertical layout charts). */
export function TomanXAxisTick(props: Omit<TomanAxisTickProps, "axis">) {
  return <TomanAxisTick {...props} axis="x" />
}
