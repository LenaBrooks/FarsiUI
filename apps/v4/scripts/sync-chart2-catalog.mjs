/**
 * Rebuild chart2 catalog + demos map to match Recharts index order/names.
 * Existing demos are remapped; missing ones must already exist on disk.
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")
const indexesDir = path.join(root, "scripts/recharts-indexes")
const catalogPath = path.join(root, "lib/chart2-examples.json")
const demosPath = path.join(root, "lib/chart2-demos.ts")
const examplesRoot = path.join(root, "examples/chart2")

const CATEGORIES = [
  { id: "line", title: "خطی", en: "LineChart", folder: "LineChart" },
  { id: "area", title: "ناحیه‌ای", en: "AreaChart", folder: "AreaChart" },
  { id: "bar", title: "میله‌ای", en: "BarChart", folder: "BarChart" },
  { id: "composed", title: "ترکیبی", en: "ComposedChart", folder: "ComposedChart" },
  { id: "scatter", title: "پراکندگی", en: "ScatterChart", folder: "ScatterChart" },
  { id: "pie", title: "دایره‌ای", en: "PieChart", folder: "PieChart" },
  { id: "radar", title: "راداری", en: "RadarChart", folder: "RadarChart" },
  { id: "radial-bar", title: "میله شعاعی", en: "RadialBarChart", folder: "RadialBarChart" },
  { id: "treemap", title: "درخت‌نقشه", en: "TreeMap", folder: "TreeMap" },
  { id: "sunburst", title: "خورشیدسان", en: "SunburstChart", folder: "SunburstChart" },
  { id: "tooltip", title: "تولتیپ", en: "Tooltip", folder: "Tooltip" },
  { id: "legend", title: "راهنما", en: "Legend", folder: "Legend" },
  { id: "responsive", title: "واکنش‌گرا", en: "ResponsiveContainer", folder: "ResponsiveContainer" },
  { id: "stock", title: "سهام و ترید", en: "Stock & Trade", folder: "StockChart" },
  { id: "gauge", title: "گیج", en: "GaugeChart", folder: "GaugeChart" },
]

const FA_BY_EN = {
  "Simple Line Chart": "نمودار خطی ساده",
  "Dashed Line Chart": "نمودار خطی خط‌چین",
  "Vertical Line Chart": "نمودار خطی عمودی",
  "Biaxial Line Chart": "نمودار خطی دو‌محوره",
  "Vertical Line Chart With Specified Domain": "نمودار خطی عمودی با دامنهٔ مشخص",
  "Line Chart Connect Nulls": "اتصال مقادیر تهی در خطی",
  "Line Chart With X Axis Padding": "خطی با فاصلهٔ محور X",
  "Line Chart With Reference Lines": "خطی با خطوط مرجع",
  "Customized Dot Line Chart": "خطی با نقطهٔ سفارشی",
  "Customized Label Line Chart": "خطی با برچسب سفارشی",
  "Synchronized Line Chart": "نمودارهای خطی همگام",
  "Synchronized Charts With Different Data": "همگام با داده‌های متفاوت",
  "Line that animates opacity": "خط با انیمیشن شفافیت",
  "Highlight And Zoom Line Chart": "هایلایت و زوم خطی",
  "Line Chart Has Multi Series": "چند سری خطی",
  "Line Chart Axis Interval": "فاصلهٔ تیک محور خطی",
  "Line Chart Negative Values With Reference Lines": "مقادیر منفی با خطوط مرجع",
  "Compare Two Lines": "مقایسهٔ دو خط",
  "Dynamic Z-Index Line Chart": "خطی با z-index پویا",
  "Tiny Line Chart": "نمودار خطی فشرده",
  "Animated Time Series": "سری زمانی متحرک",
  "Simple Area Chart": "نمودار ناحیه‌ای ساده",
  "Stacked Area Chart": "ناحیه‌ای انباشته",
  "Ranged Area Chart": "ناحیه‌ای بازه‌ای",
  "Area Chart Connect Nulls": "اتصال تهی در ناحیه‌ای",
  "Cardinal Area Chart": "ناحیه‌ای Cardinal",
  "Percent Area Chart": "ناحیه‌ای درصدی",
  "Synchronized Area Chart": "ناحیه‌ای همگام",
  "Tiny Area Chart": "ناحیه‌ای فشرده",
  "Area Chart Fill By Value": "پر شدن بر اساس مقدار",
  "Custom Animation Example": "انیمیشن سفارشی",
  "Range Area Custom Animation": "انیمیشن ناحیه‌ای بازه‌ای",
  "Area Chart With Custom Events": "ناحیه‌ای با رویداد سفارشی",
  "Prevent right click menu": "جلوگیری از منوی راست‌کلیک",
  "Simple Bar Chart": "نمودار میله‌ای ساده",
  "Stacked Bar Chart": "میله‌ای انباشته",
  "Population Pyramid": "هرم جمعیتی",
  Timeline: "خط زمانی",
  Candlestick: "کندل",
  "Box Plot": "نمودار جعبه‌ای",
  "Animated Bar Width": "عرض میله متحرک",
  Waterfall: "آبشاری",
  "Animated Bar series": "سری میله‌ای متحرک",
  "Mix Bar Chart": "میله‌ای ترکیبی",
  "Custom Shape Bar Chart": "میله با شکل سفارشی",
  "Positive and Negative Bar Chart": "میله مثبت و منفی",
  "Brush Bar Chart": "میله با برس",
  "Bar Chart With Customized Event": "انتخاب میله با کلیک",
  "Biaxial Bar Chart": "میله دو‌محوره",
  "Bar Chart with background": "میله با پس‌زمینه",
  "Bar Chart with label background": "میله با پس‌زمینهٔ برچسب",
  "Ranged Stacked Bar Chart": "مراحل سفارش به‌صورت بازه",
  "Ranged Bar Chart": "میله بازه‌ای",
  "Tiny Bar Chart": "میله فشرده",
  "Stacked Bar Chart with Horizontal Line": "فروش در برابر هدف",
  "Line Bar Area Composed Chart": "فروش کانال‌ها (ترکیبی)",
  "Same Data Composed Chart": "فروش با خط روند",
  "Vertical Composed Chart": "مقایسهٔ استان‌ها",
  "Composed Chart With Axis Labels": "درآمد و حاشیه با برچسب محور",
  "Scatter And Line Of Best Fit": "تبلیغات و فروش",
  "Banded Chart": "فروش با بازهٔ اطمینان",
  "Target Price Chart with active Label": "قیمت و هدف تحلیلگران",
  "Simple Scatter Chart": "پراکندگی ساده",
  "Joint Line Scatter Chart": "پراکندگی با خط اتصال",
  "Bubble Chart": "نمودار حبابی",
  "Custom Animation": "انیمیشن سفارشی پراکندگی",
  "Scatter Chart With Labels": "پراکندگی با برچسب",
  "Multiple Y Axes Scatter Chart": "پراکندگی با چند محور Y",
  "Scatter Chart With Cells": "پراکندگی با Cell",
  "Scatter Chart with many points (performance test)": "پراکندگی پرتراکم (عملکرد)",
  "Two Level Pie Chart": "دایره‌ای دو سطحی",
  "Straight Angle Pie Chart": "دایره‌ای نیم‌دایره",
  "Custom Active Shape Pie Chart": "دایره‌ای با شکل فعال سفارشی",
  "Pie Chart With Customized Label": "دایره‌ای با برچسب سفارشی",
  "Pie Chart with gap and rounded corners": "دایره‌ای با فاصله و گوشه گرد",
  "Pie Chart With Needle": "دایره‌ای با عقربه",
  "Pie Chart in Grid": "دایره‌ای در Grid",
  "Pie Chart with Gradient": "دایره‌ای گرادیانی",
  "Simple Radar Chart": "راداری ساده",
  "Specified Domain Radar Chart": "راداری با دامنهٔ مشخص",
  "Range Radar Custom Animation": "راداری بازه‌ای با انیمیشن",
  "Simple Radial Bar Chart": "میله شعاعی ساده",
  "Radial Bar Chart with Click to Focus Legend": "میله شعاعی با فوکوس راهنما",
  "Bundle Size Treemap": "درخت‌نقشهٔ حجم باندل",
  "Simple Treemap": "درخت‌نقشهٔ ساده",
  "Custom Content Treemap": "درخت‌نقشه با محتوای سفارشی",
  "Nested Treemap": "درخت‌نقشهٔ تودرتو",
  "Treemap with Padding and Gaps": "درخت‌نقشه با فاصله",
  "Bundle Size Sunburst": "خورشیدسان حجم باندل",
  "Sunburst Chart Example": "نمونهٔ خورشیدسان",
  "Sunburst Chart Theme Colors": "خورشیدسان با رنگ تم",
  "Custom Content Of Tooltip": "محتوای سفارشی تولتیپ",
  "Tooltip Style": "سبک تولتیپ",
  "Legend with Opacity": "راهنما با شفافیت",
  "Legend Position": "موقعیت راهنما",
  "Custom Legend Styles": "سبک سفارشی راهنما",
  "Area Responsive Container": "ناحیه‌ای واکنش‌گرا",
  "Composed Responsive Container": "ترکیبی واکنش‌گرا",
  "Pie Responsive Container": "دایره‌ای واکنش‌گرا",
  "Multiple X Axes": "چند محور X",
  "Automatic X Axis Height": "ارتفاع خودکار محور X",
}

/** Explicit key → id for existing/new demos */
const ID_BY_KEY = {
  SimpleLineChart: "simple-line-chart",
  DashedLineChart: "dashed-line-chart",
  VerticalLineChart: "vertical-line-chart",
  BiaxialLineChart: "biaxial-line-chart",
  LineChartConnectNulls: "line-chart-connect-nulls",
  LineChartWithXAxisPadding: "line-chart-with-x-axis-padding",
  LineChartWithReferenceLines: "line-chart-with-reference-lines",
  CustomizedDotLineChart: "customized-dot-line-chart",
  CustomizedLabelLineChart: "customized-label-line-chart",
  SynchronizedLineChart: "synchronized-line-chart",
  SynchronizedDifferentData: "synchronized-different-data",
  LineChartCustomShapeExample: "line-chart-custom-shape",
  HighlightAndZoomLineChart: "highlight-and-zoom-line-chart",
  LineChartHasMultiSeries: "line-chart-has-multi-series",
  LineChartAxisInterval: "line-chart-axis-interval",
  LineChartNegativeValuesWithReferenceLines: "line-chart-negative-values-with-reference-lines",
  CompareTwoLines: "compare-two-lines",
  DynamicZIndexLineChart: "dynamic-z-index-line-chart",
  TinyLineChart: "tiny-line-chart",
  AnimatedTimeSeriesExample: "animated-time-series",
  AreaChartExample: "area-chart",
  StackedAreaChart: "stacked-area-chart",
  AreaChartRangeExample: "area-chart-range",
  AreaChartConnectNulls: "area-chart-connect-nulls",
  CardinalAreaChart: "cardinal-area-chart",
  PercentAreaChart: "percent-area-chart",
  SynchronizedAreaChart: "synchronized-area-chart",
  TinyAreaChart: "tiny-area-chart",
  AreaChartFillByValue: "area-chart-fill-by-value",
  AreaChartCustomAnimation: "area-chart-custom-animation",
  RangeAreaChartCustomAnimation: "range-area-chart-custom-animation",
  AreaChartWithCustomEvents: "area-chart-with-custom-events",
  PreventRightClickExample: "prevent-right-click",
  SimpleBarChart: "simple-bar-chart",
  StackedBarChart: "stacked-bar-chart",
  PopulationPyramid: "population-pyramid",
  TimelineExample: "timeline",
  Candlestick: "candlestick",
  BoxPlot: "box-plot",
  AnimatedBarWidthExample: "animated-bar-width",
  Waterfall: "waterfall",
  AnimatedBarTimeSeriesExample: "animated-bar-time-series",
  MixBarChart: "mix-bar-chart",
  CustomShapeBarChart: "custom-shape-bar-chart",
  PositiveAndNegativeBarChart: "positive-and-negative-bar-chart",
  BrushBarChart: "brush-bar-chart",
  BarChartWithCustomizedEvent: "bar-chart-with-customized-event",
  BiaxialBarChart: "biaxial-bar-chart",
  BarChartHasBackground: "bar-chart-has-background",
  BarChartWithLabelBackground: "bar-chart-with-label-background",
  RangedStackedBarChart: "ranged-stacked-bar-chart",
  BarChartRangeExample: "bar-chart-range",
  TinyBarChart: "tiny-bar-chart",
  StackedBarChartWithHorizontalLine: "stacked-bar-chart-with-horizontal-line",
  LineBarAreaComposedChart: "line-bar-area-composed-chart",
  SameDataComposedChart: "same-data-composed-chart",
  VerticalComposedChart: "vertical-composed-chart",
  ComposedChartWithAxisLabels: "composed-chart-with-axis-labels",
  ScatterAndLineOfBestFit: "scatter-and-line-of-best-fit",
  BandedChart: "banded-chart",
  TargetPriceChart: "target-price-chart",
  SimpleScatterChart: "simple-scatter-chart",
  JointLineScatterChart: "joint-line-scatter-chart",
  BubbleChart: "bubble-chart",
  CustomAnimation: "custom-animation",
  ScatterChartWithLabels: "scatter-chart-with-labels",
  MultipleYAxesScatterChart: "multiple-y-axes-scatter-chart",
  ScatterChartWithCells: "scatter-chart-with-cells",
  ScatterChartPerformance: "scatter-chart-performance",
  TwoLevelPieChart: "two-level-pie-chart",
  StraightAnglePieChart: "straight-angle-pie-chart",
  CustomActiveShapePieChart: "custom-active-shape-pie-chart",
  PieChartWithCustomizedLabel: "pie-chart-with-customized-label",
  PieChartWithPaddingAngle: "pie-chart-with-padding-angle",
  PieChartInGrid: "pie-chart-in-grid",
  PieWithGradient: "pie-with-gradient",
  SimpleRadarChart: "simple-radar-chart",
  SpecifiedDomainRadarChart: "specified-domain-radar-chart",
  RangeRadarChartCustomAnimation: "range-radar-chart-custom-animation",
  SimpleRadialBarChart: "simple-radial-bar-chart",
  RadialBarChartClickToFocusLegendExample: "radial-bar-chart-click-to-focus-legend",
  BundleSizeTreemap: "bundle-size-treemap",
  SimpleTreemap: "simple-treemap",
  CustomContentTreemap: "custom-content-treemap",
  NestedTreemap: "nested-treemap",
  TreemapWithPaddingAndGaps: "treemap-with-padding-and-gaps",
  BundleSizeSunburst: "bundle-size-sunburst",
  SunburstChartExample: "sunburst-chart",
  SunburstChartThemeColors: "sunburst-chart-theme-colors",
  CustomContentOfTooltip: "custom-content-of-tooltip",
  TooltipStylesDemo: "tooltip-styles",
  LegendEffectOpacity: "legend-effect-opacity",
  LegendPosition: "legend-position",
  LegendStylesExample: "legend-styles",
  AreaResponsiveContainer: "area-responsive-container",
  ComposedResponsiveContainer: "composed-responsive-container",
  PieResponsiveContainer: "pie-responsive-container",
}

function parseIndexKeys(folder) {
  const text = fs.readFileSync(path.join(indexesDir, `${folder}.ts`), "utf8")
  const items = []
  const re = /(\w+)\s*:\s*\{[\s\S]*?name:\s*'([^']+)'/g
  let m
  while ((m = re.exec(text))) {
    items.push({ key: m[1], en: m[2] })
  }
  return items
}

// Rename area-simple → area-prevent-right-click if needed
const oldPrevent = path.join(examplesRoot, "area/area-simple.tsx")
const newPrevent = path.join(examplesRoot, "area/area-prevent-right-click.tsx")
if (fs.existsSync(oldPrevent) && !fs.existsSync(newPrevent)) {
  fs.renameSync(oldPrevent, newPrevent)
  console.log("renamed area-simple -> area-prevent-right-click")
}

const catalog = {
  categories: CATEGORIES.map(({ id, title, en }) => ({ id, title, en })),
  examples: [],
}

const missingFiles = []

for (const cat of CATEGORIES) {
  const items = parseIndexKeys(cat.folder)
  for (const { key, en } of items) {
    const id = ID_BY_KEY[key]
    if (!id) {
      console.error(`No ID mapping for ${cat.folder}/${key}`)
      process.exit(1)
    }
    const file = path.join(examplesRoot, cat.id, `${id}.tsx`)
    if (!fs.existsSync(file)) missingFiles.push(`${cat.id}/${id}.tsx (${key})`)
    catalog.examples.push({
      id,
      title: FA_BY_EN[en] || `نمودار ${en}`,
      en,
      category: cat.id,
    })
  }
}

fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + "\n")

const demosTs = `import type { ComponentType } from "react"

export type Chart2DemoLoader = () => Promise<{
  default: ComponentType<Record<string, unknown>>
}>

/** Relative to apps/v4 — use with fs from the view RSC page. */
export const chart2DemoSourcePath: Record<string, string> = {
${catalog.examples
  .map((e) => `  "${e.id}": "examples/chart2/${e.category}/${e.id}.tsx",`)
  .join("\n")}
}

export const chart2DemoLoaders: Record<string, Chart2DemoLoader> = {
${catalog.examples
  .map(
    (e) =>
      `  "${e.id}": () => import("@/examples/chart2/${e.category}/${e.id}"),`
  )
  .join("\n")}
}

export function getChart2DemoSourcePath(id: string) {
  return chart2DemoSourcePath[id]
}

export function getChart2DemoLoader(id: string) {
  return chart2DemoLoaders[id]
}
`

fs.writeFileSync(demosPath, demosTs)

console.log(
  `catalog: ${catalog.examples.length} examples in Recharts order`
)
if (missingFiles.length) {
  console.log(`MISSING FILES (${missingFiles.length}):`)
  for (const f of missingFiles) console.log(" ", f)
  process.exitCode = 2
} else {
  console.log("all demo files present")
}
