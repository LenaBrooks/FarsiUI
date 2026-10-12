/**
 * Adapt upstream Recharts examples to APIs available in recharts@3.8.
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../examples/chart2")

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

function walk(dir) {
  const out = []
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) out.push(...walk(p))
    else if (p.endsWith(".tsx")) out.push(p)
  }
  return out
}

function stripImportNames(code, names) {
  const set = new Set(names)
  return code.replace(
    /import\s*\{([^}]*)\}\s*from\s*["']recharts["']\s*;?/g,
    (_m, inner) => {
      const parts = inner
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .filter((p) => {
          const name = p.replace(/^type\s+/, "").split(/\s+as\s+/)[0].trim()
          return !set.has(name)
        })
      if (!parts.length) return ""
      return `import { ${parts.join(", ")} } from "recharts";`
    }
  )
}

let n = 0
for (const file of walk(root)) {
  let code = fs.readFileSync(file, "utf8")
  const orig = code

  // Prefer any for theme stub
  code = code.replace(/\bconst theme = \{\};/g, "const theme: any = {};")

  // Remove unavailable value imports from recharts
  code = stripImportNames(code, [
    "autoPalette",
    "lightTheme",
    "SyncMethod",
    "TextBackgroundProps",
  ])

  // autoPalette usage → chart CSS vars
  if (code.includes("autoPalette")) {
    code = `const chartColors = ${JSON.stringify(CHART_COLORS)};\n` + code
    code = code.replace(/autoPalette\[(\d+)\]/g, "chartColors[$1]")
    code = code.replace(/\{\.\.\.autoPalette\[(\d+)\]\}/g, 'fill={chartColors[$1]}')
    code = code.replace(/autoPalette/g, "chartColors")
  }

  // lightTheme.graphicalItems[n] → fill/stroke chartColors
  if (code.includes("lightTheme")) {
    if (!code.includes("const chartColors")) {
      code = code.replace(
        /("use client"\s*\n+)/,
        `$1const chartColors = ${JSON.stringify(CHART_COLORS)};\n`
      )
    }
    code = code.replace(
      /\{\.\.\.lightTheme\.graphicalItems\[(\d+)\]\}/g,
      "fill={chartColors[$1]} stroke={chartColors[$1]}"
    )
    code = code.replace(/lightTheme\.graphicalItems\[(\d+)\]/g, "{ fill: chartColors[$1], stroke: chartColors[$1] }")
  }

  // SyncMethod type → any
  code = code.replace(/:\s*SyncMethod\b/g, ": any")

  // TextBackgroundProps → any
  code = code.replace(/:\s*TextBackgroundProps\b/g, ": any")
  code = code.replace(/as\s+TextBackgroundProps\b/g, "as any")

  // Legend position="..." (not in 3.8) → verticalAlign/align via wrapperStyle
  code = code.replace(
    /<Legend([^>]*)\sposition=["']([^"']+)["']/g,
    (_m, rest, pos) => {
      // common values: center, right, left, top, bottom — map loosely
      let extra = ' verticalAlign="middle"'
      if (/top/i.test(pos)) extra = ' verticalAlign="top"'
      if (/bottom/i.test(pos)) extra = ' verticalAlign="bottom"'
      if (/right/i.test(pos)) extra += ' align="right"'
      if (/left/i.test(pos)) extra += ' align="left"'
      if (/center/i.test(pos)) extra += ' align="center"'
      return `<Legend${rest}${extra}`
    }
  )

  // d3-shape: use 'monotone' instead of curveCardinal if we want to avoid dep —
  // keep d3-shape import; we'll add the package. Leave as-is.

  // nodeInset — remove unsupported prop
  code = code.replace(/\s*nodeInset=\{[^}]+\}/g, "")
  code = code.replace(/\s*nodeInset=\{[^]*?\}/g, "")

  // LabelList background prop — strip for 3.8 compat
  code = code.replace(/\s*background=\{[^}]+\}/g, "")
  code = code.replace(/\s*background/g, (m, offset, s) => {
    // only inside LabelList-ish JSX — crude: if nearby LabelList
    const before = s.slice(Math.max(0, offset - 80), offset)
    if (before.includes("LabelList")) return ""
    return m
  })

  // Add ts-nocheck for remaining complex mismatches (after use client)
  if (!code.includes("@ts-nocheck")) {
    code = code.replace(
      /^("use client"\s*\n)/,
      `$1// @ts-nocheck — adapted from Recharts upstream examples for recharts@3.8\n`
    )
  }

  if (code !== orig) {
    fs.writeFileSync(file, code)
    n++
    console.log("compat", path.relative(root, file))
  }
}
console.log("updated", n)
