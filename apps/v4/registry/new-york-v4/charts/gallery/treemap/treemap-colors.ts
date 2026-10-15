import { CHART_BAR_COLORS } from "@/lib/chart-fa"

/** Same soft palette as bar / pie / radial demos. */
export const TREEMAP_COLORS = [
  CHART_BAR_COLORS[0],
  CHART_BAR_COLORS[1],
  CHART_BAR_COLORS[2],
  CHART_BAR_COLORS[3],
  CHART_BAR_COLORS[4],
  CHART_BAR_COLORS[0],
] as const

export function treemapColorAt(index: number, count = TREEMAP_COLORS.length) {
  const i = Math.floor((index / Math.max(count, 1)) * TREEMAP_COLORS.length)
  return TREEMAP_COLORS[Math.min(i, TREEMAP_COLORS.length - 1)]!
}
