/**
 * Downloads Recharts official examples, adapts them for FarsiUI Chart,
 * and writes catalog + demo registry.
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, "..")
const outExamples = path.join(root, "examples", "Chart")
const catalogPath = path.join(root, "lib", "Chart-examples.json")
const demosMapPath = path.join(root, "lib", "Chart-demos.ts")
const indexesDir = path.join(__dirname, "recharts-indexes")

const RAW =
  "https://raw.githubusercontent.com/recharts/recharts/main/www/src/docs/exampleComponents"

const CATEGORIES = [
  { id: "line", title: "خطی", en: "LineChart", folder: "LineChart" },
  { id: "area", title: "ناحیه‌ای", en: "AreaChart", folder: "AreaChart" },
  { id: "bar", title: "میله‌ای", en: "BarChart", folder: "BarChart" },
  { id: "composed", title: "ترکیبی", en: "ComposedChart", folder: "ComposedChart" },
  { id: "scatter", title: "پراکندگی", en: "ScatterChart", folder: "ScatterChart" },
  { id: "pie", title: "دایره‌ای", en: "PieChart", folder: "PieChart" },
  { id: "radar", title: "راداری", en: "RadarChart", folder: "RadarChart" },
  {
    id: "radial-bar",
    title: "میله شعاعی",
    en: "RadialBarChart",
    folder: "RadialBarChart",
  },
  { id: "treemap", title: "درخت‌نقشه", en: "TreeMap", folder: "TreeMap" },
  { id: "sunburst", title: "خورشیدسان", en: "SunburstChart", folder: "SunburstChart" },
  { id: "tooltip", title: "تولتیپ", en: "Tooltip", folder: "Tooltip" },
  { id: "legend", title: "راهنما", en: "Legend", folder: "Legend" },
  {
    id: "responsive",
    title: "واکنش‌گرا",
    en: "ResponsiveContainer",
    folder: "ResponsiveContainer",
  },
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

const SKIP_FILES = new Set([
  "index.ts",
  "index.tsx",
  "LineChartNavExample.tsx",
  "AreaChartNavExample.tsx",
  "BarChartNavExample.tsx",
  "ComposedChartNavExample.tsx",
  "ScatterChartNavExample.tsx",
  "PieChartNavExample.tsx",
  "RadarChartNavExample.tsx",
  "RadialBarChartNavExample.tsx",
  "TreeMapNavExample.tsx",
  "SunburstChartNavExample.tsx",
])

/** Examples that are folders / need controls — skip for now or handle specially */
const SKIP_KEYS = new Set([
  "LineChartCustomShapeExample",
  "AnimatedTimeSeriesExample",
  "AnimatedBarTimeSeriesExample",
  "AnimatedBarWidthExample",
  "ScrollAnimateBarChart",
  "RangeAreaChartCustomAnimation",
  "AreaChartWithCustomEvents",
  "CustomAnimationExample", // scatter
  "RangeRadarChartCustomAnimation",
  "BundleSizeTreemap",
  "BundleSizeSunburst",
  "ScatterChartPerformance",
])

function toKebab(name) {
  return name
    .replace(/\.tsx?$/, "")
    .replace(/Example$/, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase()
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

function parseIndexNames(folder) {
  const file = path.join(indexesDir, `${folder}.ts`)
  const text = fs.readFileSync(file, "utf8")
  const map = new Map()
  // Match Key: { ... name: '...' 
  const re =
    /(\w+)\s*:\s*\{[\s\S]*?name:\s*'([^']+)'/g
  let m
  while ((m = re.exec(text))) {
    map.set(m[1], m[2])
  }
  return map
}

async function fetchText(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return res.text()
}

async function listGithubFiles(folder) {
  const res = await fetch(
    `https://api.github.com/repos/recharts/recharts/contents/www/src/docs/exampleComponents/${folder}`
  )
  if (!res.ok) throw new Error(`list ${folder}: ${res.status}`)
  return res.json()
}

function transformSource(code, componentName) {
  let out = code

  // Strip RechartsDevtools usage
  out = out.replace(
    /import\s*\{([^}]*)\}\s*from\s*['"]@recharts\/devtools['"]\s*;?/g,
    (_, inner) => {
      const parts = inner
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .filter((p) => !/^RechartsDevtools$/.test(p.split(/\s+as\s+/).pop()))
      const kept = parts.filter((p) => {
        const name = p.split(/\s+as\s+/)[0].trim()
        return (
          name === "generateMockData" ||
          name === "MockDataType" ||
          name === "generateMockMarketData"
        )
      })
      if (!kept.length) return ""
      // remap to local mock
      const local = kept
        .map((p) => {
          if (p.includes("generateMockMarketData")) {
            return null // drop for now
          }
          return p
            .replace("generateMockData", "generateMockData")
            .replace("MockDataType", "type MockDataType")
        })
        .filter(Boolean)
      if (!local.length) return ""
      // Fix: can't use `type` in import value list that way for all
      const names = kept
        .map((p) => p.trim())
        .filter((p) => !p.includes("generateMockMarketData"))
      const hasType = names.some((n) => n.includes("MockDataType"))
      const values = names
        .filter((n) => !n.includes("MockDataType"))
        .map((n) => n.replace(/\s+as\s+.*/, "").trim())
      const bits = []
      if (values.length) bits.push(...values)
      if (hasType) bits.push("type MockDataType")
      return `import { ${bits.join(", ")} } from "@/lib/chart-mock-data";`
    }
  )

  out = out.replace(/\s*<RechartsDevtools\s*\/>/g, "")
  out = out.replace(/\s*\{?\s*<RechartsDevtools\s*\/>\s*\}?/g, "")

  // useRechartsTheme not in 3.8 — simplify MyLine-style helpers
  if (out.includes("useRechartsTheme")) {
    out = out.replace(
      /import\s*\{([^}]*)\}\s*from\s*['"]recharts['"]\s*;/,
      (match, inner) => {
        const cleaned = inner
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s && !s.includes("useRechartsTheme"))
          .join(", ")
        return `import { ${cleaned} } from "recharts";`
      }
    )
    // Replace theme-based Line with plain Line + chart colors
    out = out.replace(
      /function MyLine\(props:[^)]*\)\s*\{[\s\S]*?return\s*<Line[^;]*;\s*\}/,
      `function MyLine(props: LineProps & { index: number }) {
  const { index, ...rest } = props;
  const colors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];
  return <Line stroke={colors[index % colors.length]} {...rest} />;
}`
    )
  }

  // Ensure client directive
  if (!out.trimStart().startsWith('"use client"') && !out.trimStart().startsWith("'use client'")) {
    out = `"use client"\n\n${out}`
  }

  // Normalize quotes style lightly — keep as-is from upstream mostly
  // Rename default export function if anonymous
  if (!/export\s+default\s+function\s+\w+/.test(out) && /export\s+default\s+\w+/.test(out)) {
    // export default Foo — ok
  } else if (/const\s+(\w+)\s*=\s*\([^)]*\)\s*=>/.test(out) && /export\s+default\s+\1/.test(out)) {
    // ok
  }

  // Ensure named default for clarity — wrap if needed
  const exportDefaultAnon = /export\s+default\s+function\s*\(/
  if (exportDefaultAnon.test(out)) {
    out = out.replace(
      exportDefaultAnon,
      `export default function ${componentName}(`
    )
  }

  // If `export default function Example` rename
  out = out.replace(
    /export\s+default\s+function\s+Example\b/,
    `export default function ${componentName}`
  )

  // Drop relative imports that won't resolve (data files, levers)
  // Keep only if we can map them — otherwise leave and fix later

  // Fix generateMockMarketData leftover
  if (out.includes("generateMockMarketData")) {
    out = out.replace(
      /import\s*\{[^}]*generateMockMarketData[^}]*\}\s*from\s*['"]@\/lib\/Chart-mock-data['"]\s*;?/,
      ""
    )
  }

  return out
}

function pascalFromFile(file) {
  return file.replace(/\.tsx?$/, "").replace(/Example$/, "") + "Demo"
}

async function main() {
  fs.mkdirSync(outExamples, { recursive: true })

  const catalog = {
    categories: CATEGORIES.map(({ id, title, en }) => ({ id, title, en })),
    examples: [],
  }

  const demoEntries = []

  for (const cat of CATEGORIES) {
    const names = parseIndexNames(cat.folder)
    const files = await listGithubFiles(cat.folder)
    const catDir = path.join(outExamples, cat.id)
    fs.mkdirSync(catDir, { recursive: true })

    for (const file of files) {
      if (file.type !== "file") continue
      if (SKIP_FILES.has(file.name)) continue
      if (!/\.tsx?$/.test(file.name)) continue

      const key = file.name.replace(/\.tsx?$/, "")
      if (SKIP_KEYS.has(key)) {
        console.log(`skip ${cat.folder}/${key}`)
        continue
      }

      const enName = names.get(key) || key.replace(/Example$/, "").replace(/([a-z])([A-Z])/g, "$1 $2")
      const id = toKebab(key)
      const title = FA_BY_EN[enName] || `نمودار ${enName}`
      const componentName = key.replace(/Example$/, "") + (key.endsWith("Example") ? "" : "")
      // Prefer PascalCase from key
      const exportName = key.endsWith("Example")
        ? key.replace(/Example$/, "Demo")
        : key + "Demo"

      let source
      try {
        source = await fetchText(`${RAW}/${cat.folder}/${file.name}`)
      } catch (e) {
        console.warn(`fail download ${file.name}:`, e.message)
        continue
      }

      // Skip if heavily depends on missing APIs we can't easily polyfill
      if (
        source.includes("from './") ||
        source.includes('from "./') ||
        source.includes("levers") ||
        source.includes("defaultControlsState")
      ) {
        // relative imports — try only if no local deps besides types
        if (/from\s+['"]\.\.?\/(?!types)/.test(source)) {
          console.log(`skip relative ${cat.folder}/${file.name}`)
          continue
        }
      }

      let adapted = transformSource(source, exportName)

      // Fix export default Foo → keep; ensure function name for default arrow exports
      if (/export\s+default\s+\w+\s*;?\s*$/.test(adapted.trim().split("\n").pop() || "")) {
        // already has export default Name
      }

      // Rename default const component
      adapted = adapted.replace(
        new RegExp(`export default function ${key}\\b`),
        `export default function ${exportName}`
      )
      adapted = adapted.replace(
        new RegExp(`const ${key}\\s*=`),
        `const ${exportName} =`
      )
      adapted = adapted.replace(
        new RegExp(`export default ${key}\\b`),
        `export default ${exportName}`
      )

      // If still exporting as original function name matching key
      adapted = adapted.replace(
        new RegExp(`export default function ${key.replace(/Example$/, "")}\\b`),
        `export default function ${exportName}`
      )

      const outFile = `${id}.tsx`
      const outPath = path.join(catDir, outFile)
      fs.writeFileSync(outPath, adapted)

      catalog.examples.push({
        id,
        title,
        en: enName,
        category: cat.id,
      })

      const importPath = `@/examples/chart/${cat.id}/${id}`
      demoEntries.push({
        id,
        importPath,
        sourcePath: `examples/chart/${cat.id}/${outFile}`,
      })

      console.log(`ok ${cat.id}/${id}`)
    }
  }

  fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + "\n")

  const demosTs = `import type { ComponentType } from "react"

export type ChartDemoLoader = () => Promise<{
  default: ComponentType<Record<string, unknown>>
}>

/** Relative to apps/v4 — use with fs from the view RSC page. */
export const ChartDemoSourcePath: Record<string, string> = {
${demoEntries.map((e) => `  "${e.id}": "${e.sourcePath}",`).join("\n")}
}

export const ChartDemoLoaders: Record<string, ChartDemoLoader> = {
${demoEntries
  .map((e) => `  "${e.id}": () => import("${e.importPath}"),`)
  .join("\n")}
}

export function getChartDemoSourcePath(id: string) {
  return ChartDemoSourcePath[id]
}

export function getChartDemoLoader(id: string) {
  return ChartDemoLoaders[id]
}
`

  fs.writeFileSync(demosMapPath, demosTs)

  console.log(
    `\nDone: ${catalog.examples.length} examples, ${catalog.categories.length} categories`
  )
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
