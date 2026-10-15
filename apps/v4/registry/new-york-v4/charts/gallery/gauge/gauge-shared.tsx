"use client"

import type { CSSProperties, ComponentProps } from "react"
import GaugeChart from "react-gauge-chart"

import { useChartToolbarStart } from "@/lib/chart-live"
import { toPersianDigits } from "@/lib/chart-fa"

/** Fixed height avoids the known resize bug in react-gauge-chart. */
export const gaugeChartStyle: CSSProperties = {
  width: "100%",
  height: 250,
  maxWidth: 420,
}

/** Needle/text — soft charcoal, readable on light surfaces. */
export const GAUGE_NEEDLE = "#5a6169"

/**
 * Soft traffic-light arcs (aligned with chart palette intensity).
 * Mid gold stays readable on light backgrounds.
 */
export const GAUGE_TRAFFIC_COLORS = ["#6cb87a", "#d4b45a", "#d96b5c"] as const

/** Build n arc colors green → gold → red so mid yellow stays visible in light theme. */
export function gaugeTrafficRamp(levels: number): string[] {
  if (levels <= 1) return [GAUGE_TRAFFIC_COLORS[0]]
  if (levels === 2) return [GAUGE_TRAFFIC_COLORS[0], GAUGE_TRAFFIC_COLORS[2]]
  if (levels === 3) return [...GAUGE_TRAFFIC_COLORS]

  const [green, yellow, red] = GAUGE_TRAFFIC_COLORS
  const mid = Math.floor((levels - 1) / 2)
  const mix = (a: string, b: string, t: number) => {
    const parse = (hex: string) =>
      [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16))
    const [ar, ag, ab] = parse(a)
    const [br, bg, bb] = parse(b)
    const ch = (x: number) =>
      Math.round(x).toString(16).padStart(2, "0")
    return `#${ch(ar + (br - ar) * t)}${ch(ag + (bg - ag) * t)}${ch(ab + (bb - ab) * t)}`
  }

  return Array.from({ length: levels }, (_, i) => {
    if (i <= mid) return mix(green, yellow, mid === 0 ? 1 : i / mid)
    return mix(yellow, red, (i - mid) / (levels - 1 - mid))
  })
}

export function formatGaugePercent(value: string) {
  return `${toPersianDigits(value)}٪`
}

export function ChartGauge(
  props: ComponentProps<typeof GaugeChart> & { caption?: string }
) {
  const { caption, textColor = GAUGE_NEEDLE, ...gaugeProps } = props

  useChartToolbarStart(
    () =>
      caption ? (
        <p className="min-w-0 max-w-full text-start text-[12px] leading-snug text-muted-foreground">
          {caption}
        </p>
      ) : null,
    [caption]
  )

  return (
    <div className="flex w-full max-w-[420px] justify-center font-sans">
      <GaugeChart
        style={gaugeChartStyle}
        textColor={textColor}
        formatTextValue={formatGaugePercent}
        {...gaugeProps}
      />
    </div>
  )
}
