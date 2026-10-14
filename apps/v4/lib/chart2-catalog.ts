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

import chart2Data from "@/lib/chart2-examples.json"

export type Chart2CategoryId = string

export type Chart2Category = {
  id: Chart2CategoryId
  title: string
  en: string
  icon: LucideIcon
}

export type Chart2Example = {
  id: string
  category: Chart2CategoryId
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

export const chart2Categories: Chart2Category[] = chart2Data.categories.map(
  (item) => ({
    id: item.id,
    title: item.title,
    en: item.en,
    icon: ICON_BY_CATEGORY[item.id] ?? CircleDotIcon,
  })
)

export const chart2Examples: Chart2Example[] = chart2Data.examples

/** Highlighted demos — green dot in the chart2 sidebar. */
const CHART2_FEATURED_IDS = new Set([
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
  "pie-chart-with-needle",
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

export function isChart2Featured(id: string) {
  return CHART2_FEATURED_IDS.has(id)
}

export function getChart2Category(id: string) {
  return chart2Categories.find((item) => item.id === id)
}

export function getChart2Examples(categoryId: Chart2CategoryId) {
  return chart2Examples.filter((item) => item.category === categoryId)
}

export function getChart2Example(id: string) {
  return chart2Examples.find((item) => item.id === id)
}

/** Flat gallery order: categories in sidebar order, examples within each. */
function getChart2FlatExamples() {
  return chart2Categories.flatMap((category) =>
    getChart2Examples(category.id)
  )
}

/** Next example across categories (gallery order), or undefined on the last item. */
export function getChart2NextExample(id: string) {
  const flat = getChart2FlatExamples()
  const index = flat.findIndex((item) => item.id === id)
  if (index < 0 || index >= flat.length - 1) return undefined
  return flat[index + 1]
}
