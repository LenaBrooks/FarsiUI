/** پالت ملایم برای درخت‌نقشه — نزدیک نمونهٔ Recharts، بدون رنگ جیغ. */
export const TREEMAP_COLORS = [
  "#8899c9",
  "#7eaf8a",
  "#d4b85c",
  "#c98b6e",
  "#7aabbf",
  "#a88fbf",
] as const

export function treemapColorAt(index: number, count = TREEMAP_COLORS.length) {
  const i = Math.floor((index / Math.max(count, 1)) * TREEMAP_COLORS.length)
  return TREEMAP_COLORS[Math.min(i, TREEMAP_COLORS.length - 1)]!
}
