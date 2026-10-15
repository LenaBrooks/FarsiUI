/**
 * Shared Persian / RTL helpers for chart demos.
 * Uses FarsiUI locale + digit utilities so gallery demos match installable charts.
 */

import {
  FA_CHART,
  FA_MONTHS,
  formatPersianNumber,
  toPersianDigits,
} from "@/lib/chart-locale"
import {
  generateMockData,
  type MockDataType,
} from "@/lib/chart-mock-data"
import type { ChartConfig } from "@/registry/new-york-v4/ui/chart"

export {
  FA_CHART,
  FA_MONTHS,
  FA_MONTHS_FULL,
  formatJalaliDate,
  formatPersianNumber,
  toPersianDigits,
} from "@/lib/chart-locale"

export type { MockDataType }

/** Default series labels for x / y / z mock keys. */
export const CHART_SERIES_LABELS = {
  x: FA_CHART.store,
  y: FA_CHART.online,
  z: FA_CHART.orders,
} as const

/**
 * Soft bar palette (population-pyramid blues/pinks + muted companions).
 * Prefer these over theme `--chart-*` so demos stay readable on gray skins.
 * Light values are the source of truth; dark variants land via CSS vars later.
 * Demos should consume CHART_BAR_COLORS / chartBarMockConfig — not hardcode hex.
 */
export const CHART_BAR_COLORS = [
  "#6ea1c7",
  "#ed7485",
  "#7eb8a0",
  "#c4a574",
  "#8b9dc3",
] as const

/** Soft up/down — same family as palette greens/pinks (stock, waterfall, badges). */
export const CHART_UP = "#5a9e7a"
export const CHART_DOWN = "#d97986"
/** Neutral spark / reference stroke. */
export const CHART_MUTE = "#71717a"

/**
 * Neon market-card triad (green / pink / gray) — screenshots + stacked-area.
 * Prefer over soft CHART_* when matching the three-card glow pattern.
 */
export const MARKET_UP = "#4ADE80"
export const MARKET_DOWN = "#F07289"
export const MARKET_MUTE = "#A1A1AA"

/**
 * Semantic CSS vars (track DS `--chart-up|down|mute`) — prefer for themed strokes.
 * Hex constants above remain for shade math / static SVG when vars cannot resolve.
 */
export const CHART_UP_VAR = "var(--chart-up)"
export const CHART_DOWN_VAR = "var(--chart-down)"
export const CHART_MUTE_VAR = "var(--chart-mute)"

/** Label ink on soft filled shapes (sunburst / treemap / bar end labels). */
export const CHART_LABEL_INK = "#1f2937"

/** Soft tint for badge/chip backgrounds when color may be a CSS var. */
export function chartSoftFill(color: string, opacity = 0.094) {
  const pct = Math.round(opacity * 1000) / 10
  return `color-mix(in srgb, ${color} ${pct}%, transparent)`
}

/** Shared area/spark gradient stops under the stroke line. */
export function chartAreaGradientStops(
  color: string,
  opts?: { startOpacity?: number; endOpacity?: number }
) {
  const startOpacity = opts?.startOpacity ?? 0.28
  const endOpacity = opts?.endOpacity ?? 0
  return [
    { offset: "0%", stopColor: color, stopOpacity: startOpacity },
    { offset: "100%", stopColor: color, stopOpacity: endOpacity },
  ] as const
}

/** Stroke weight matching market-cards neon glow lines. */
export const CHART_NEON_STROKE_WIDTH = 2.25

/**
 * Soft neon edge — set on Recharts Area/Line Layer.
 * Nova (پیشفرض) kills glow via style-nova override.
 */
export function chartNeonGlowProps(color: string) {
  return {
    strokeWidth: CHART_NEON_STROKE_WIDTH,
    style: { ["--chart-glow" as string]: color },
    className:
      "[&_.recharts-area-curve]:[filter:drop-shadow(0_0_6px_var(--chart-glow))] [&_.recharts-line-curve]:[filter:drop-shadow(0_0_6px_var(--chart-glow))] style-nova:[&_.recharts-area-curve]:![filter:none] style-nova:[&_.recharts-line-curve]:![filter:none]",
  } as const
}

/** ChartContainer must not clip the bloom. */
export const chartNeonOverflowClassName =
  "overflow-visible [&_.recharts-surface]:overflow-visible [&_.recharts-wrapper]:overflow-visible"

/** Darken/lighten a #rrggbb (or #rgb) for labels and nested sunburst shades. */
export function chartShade(hex: string, amount: number) {
  const raw = hex.replace("#", "")
  const n = Number.parseInt(
    raw.length === 3 ? raw.replace(/(.)/g, "$1$1") : raw,
    16
  )
  const clamp = (v: number) => Math.min(255, Math.max(0, v))
  const r = clamp(((n >> 16) & 0xff) + amount)
  const g = clamp(((n >> 8) & 0xff) + amount)
  const b = clamp((n & 0xff) + amount)
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`
}

export const chartMockConfig = {
  x: {
    label: CHART_SERIES_LABELS.x,
    color: "var(--chart-1)",
  },
  y: {
    label: CHART_SERIES_LABELS.y,
    color: "var(--chart-2)",
  },
  z: {
    label: CHART_SERIES_LABELS.z,
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

/** Mock series colors for bar gallery demos only. */
export const chartBarMockConfig = {
  x: {
    label: CHART_SERIES_LABELS.x,
    color: CHART_BAR_COLORS[0],
  },
  y: {
    label: CHART_SERIES_LABELS.y,
    color: CHART_BAR_COLORS[1],
  },
  z: {
    label: CHART_SERIES_LABELS.z,
    color: CHART_BAR_COLORS[2],
  },
} satisfies ChartConfig

/** Same LCG values as Recharts demos, with Persian category labels. */
export function generatePersianMockData(
  length: number,
  seed: number
): MockDataType[] {
  return generateMockData(length, seed).map((row, i) => ({
    ...row,
    label:
      length <= FA_MONTHS.length
        ? FA_MONTHS[i]!
        : `دوره ${toPersianDigits(i + 1)}`,
  }))
}

export function formatChartNumber(value: number | string) {
  return formatPersianNumber(value)
}

export function formatChartTick(value: unknown) {
  if (typeof value === "number") return formatPersianNumber(value)
  if (value == null) return ""
  return toPersianDigits(String(value))
}

/** Soften Recharts default #ccc grid so dashed lines match theme (line/area). */
export const chartDashedGridClassName =
  "[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-muted-foreground/32 dark:[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-muted-foreground/38"

/**
 * Persian figure runs — no tnum padding / inherited tracking gaps («۴٪»).
 * Prefer with formatPersianNumber / toPersianDigits output.
 */
export const chartNumClassName =
  "fa-num tracking-normal [letter-spacing:0] [font-variant-numeric:normal]"

/** Shared ChartContainer sizing for gallery demos. */
export const chartContainerClassName =
  "aspect-[1.618] h-auto w-full max-w-[700px] max-h-[70vh] font-sans text-xs"

/** Area demos — same footprint as default container + line-style dashed grid. */
export const chartAreaContainerClassName = `${chartContainerClassName} ${chartDashedGridClassName}`

/** Bar demos — dashed horizontal grid (keep `vertical={false}` on CartesianGrid). */
export const chartBarContainerClassName = `${chartContainerClassName} ${chartDashedGridClassName}`
