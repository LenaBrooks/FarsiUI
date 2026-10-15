import type { LucideIcon } from "lucide-react"
import {
  AreaChartIcon,
  BarChartBigIcon,
  CandlestickChartIcon,
  CircleDotIcon,
  CombineIcon,
  GaugeIcon,
  Grid3x3Icon,
  HexagonIcon,
  LayoutGridIcon,
  LineChartIcon,
  Maximize2Icon,
  MessageSquareIcon,
  PieChartIcon,
  RadarIcon,
  SunIcon,
  TagsIcon,
} from "lucide-react"

import chartData from "@/lib/chart-examples.json"

export type ChartCategoryId = string

export type ChartCategory = {
  id: ChartCategoryId
  title: string
  en: string
  icon: LucideIcon
}

export type ChartExample = {
  id: string
  category: ChartCategoryId
  title: string
  en: string
}

const ICON_BY_CATEGORY: Record<string, LucideIcon> = {
  line: LineChartIcon,
  area: AreaChartIcon,
  bar: BarChartBigIcon,
  composed: CombineIcon,
  scatter: CircleDotIcon,
  pie: PieChartIcon,
  radar: HexagonIcon,
  "radial-bar": RadarIcon,
  treemap: LayoutGridIcon,
  sunburst: SunIcon,
  tooltip: MessageSquareIcon,
  legend: TagsIcon,
  responsive: Maximize2Icon,
  stock: CandlestickChartIcon,
  gauge: GaugeIcon,
  heatmap: Grid3x3Icon,
}

export const chartCategories: ChartCategory[] = chartData.categories.map(
  (item) => ({
    id: item.id,
    title: item.title,
    en: item.en,
    icon: ICON_BY_CATEGORY[item.id] ?? CircleDotIcon,
  })
)

export const chartExamples: ChartExample[] = chartData.examples

/** Highlighted demos — green dot in the chart sidebar. */
const CHART_FEATURED_IDS = new Set([
  // line
  "simple-line-chart",
  "biaxial-line-chart",
  "customized-dot-line-chart",
  "synchronized-line-chart",
  "synchronized-different-data",
  "line-chart-custom-shape",
  "highlight-and-zoom-line-chart",
  "line-chart-has-multi-series",
  "compare-two-lines",
  "animated-time-series",
  // area
  "area-chart",
  "stacked-area-chart",
  "area-chart-range",
  "cardinal-area-chart",
  "percent-area-chart",
  "synchronized-area-chart",
  "area-chart-fill-by-value",
  "area-chart-custom-animation",
  "range-area-chart-custom-animation",
  "market-cards",
  // bar
  "simple-bar-chart",
  "stacked-bar-chart",
  "population-pyramid",
  "timeline",
  "box-plot",
  "animated-bar-width",
  "waterfall",
  "animated-bar-time-series",
  "mix-bar-chart",
  "custom-shape-bar-chart",
  "positive-and-negative-bar-chart",
  "brush-bar-chart",
  "biaxial-bar-chart",
  // composed
  "line-bar-area-composed-chart",
  "scatter-and-line-of-best-fit",
  "banded-chart",
  "target-price-chart",
  // scatter
  "joint-line-scatter-chart",
  "bubble-chart",
  "custom-animation",
  "scatter-chart-with-cells",
  // pie
  "two-level-pie-chart",
  "custom-active-shape-pie-chart",
  "pie-with-gradient",
  "pie-chart-with-padding-angle",
  // radar / radial
  "simple-radar-chart",
  "specified-domain-radar-chart",
  "range-radar-chart-custom-animation",
  "simple-radial-bar-chart",
  "radial-bar-chart-click-to-focus-legend",
  // treemap / sunburst
  "custom-content-treemap",
  "nested-treemap",
  "treemap-with-padding-and-gaps",
  "sunburst-chart",
  "sunburst-chart-theme-colors",
  "bundle-size-sunburst",
  // tooltip / legend
  "custom-content-of-tooltip",
  "legend-effect-opacity",
  // stock
  "candlestick",
  "candlestick-dashboard",
  "candlestick-bar",
  "candlestick-line",
  "sparklines",
  "stock-ohlc",
  "stock-with-volume",
  "stock-multi-series",
  "stock-trendline",
  "asset-returns",
  "monthly-savings",
  "tremor-area-charts",
  "realtime-mountain-chart",
  "realtime-candlestick",
  "heikin-ashi",
  "renko-chart",
  "volume-profile",
  "order-book-depth",
  "drawdown-chart",
  "bollinger-bands",
  "candlestick-indicators",
  "multi-timeframe",
  // gauge
  "gauge-custom-arcs",
  "gauge-custom-colors",
  "gauge-levels",
  "hc-gauge-default",
  "hc-gauge-rounded-ends",
  "hc-gauge-semicircle",
  "hc-gauge-combo",
  "hc-gauge-fuel",
  "hc-gauge-activity",
  "hc-gauge-kpi",
  "hc-gauge-custom-dial",
  // heatmap
  "heatmap-calendar",
  "heatmap-calendar-emerald",
  "heatmap-matrix",
  "heatmap-matrix-values",
])

export function isChartFeatured(id: string) {
  return CHART_FEATURED_IDS.has(id)
}

export function getChartCategory(id: string) {
  return chartCategories.find((item) => item.id === id)
}

export function getChartExamples(categoryId: ChartCategoryId) {
  return chartExamples.filter((item) => item.category === categoryId)
}

export function getChartExample(id: string) {
  return chartExamples.find((item) => item.id === id)
}

/** Flat gallery order: categories in sidebar order, examples within each. */
function getChartFlatExamples() {
  return chartCategories.flatMap((category) =>
    getChartExamples(category.id)
  )
}

/** Next example across categories (gallery order), or undefined on the last item. */
export function getChartNextExample(id: string) {
  const flat = getChartFlatExamples()
  const index = flat.findIndex((item) => item.id === id)
  if (index < 0 || index >= flat.length - 1) return undefined
  return flat[index + 1]
}
