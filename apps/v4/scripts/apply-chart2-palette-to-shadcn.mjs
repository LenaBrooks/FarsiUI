/**
 * Point kept shadcn gallery demos at Chart_BAR_COLORS (readable on gray skins).
 * Usage: node apps/v4/scripts/apply-Chart-palette-to-shadcn.mjs
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")

const FILES = [
  "examples/chart/area/area-interactive.tsx",
  "examples/chart/area/area-step.tsx",
  "examples/chart/area/area-gradient.tsx",
  "examples/chart/bar/bar-interactive.tsx",
  "examples/chart/bar/bar-horizontal.tsx",
  "examples/chart/bar/bar-active.tsx",
  "examples/chart/line/line-interactive.tsx",
  "examples/chart/line/line-step.tsx",
  "examples/chart/pie/pie-donut-text.tsx",
  "examples/chart/pie/pie-interactive.tsx",
  "examples/chart/pie/pie-stacked.tsx",
  "examples/chart/radar/radar-multiple.tsx",
  "examples/chart/radar/radar-icons.tsx",
  "examples/chart/radar/radar-lines-only.tsx",
  "examples/chart/radial-bar/radial-stacked.tsx",
  "examples/chart/radial-bar/radial-text.tsx",
  "examples/chart/radial-bar/radial-shape.tsx",
  "examples/chart/tooltip/tooltip-advanced.tsx",
]

const IMPORT_LINE =
  'import { Chart_BAR_COLORS } from "@/lib/chart-fa"\n'

function stripBadImports(source) {
  // Remove any Chart-fa import (may sit above "use client").
  return source.replace(
    /^import\s*\{\s*Chart_BAR_COLORS\s*\}\s*from\s*"@\/lib\/Chart-fa"\s*\n+/gm,
    ""
  )
}

function ensureImport(source) {
  if (source.includes('from "@/lib/chart-fa"')) return source

  const localeImport = source.match(
    /^import\s*\{[\s\S]*?\}\s*from\s*"@\/lib\/chart-locale"\s*\n/m
  )
  if (localeImport) {
    const idx = localeImport.index + localeImport[0].length
    return source.slice(0, idx) + IMPORT_LINE + source.slice(idx)
  }

  // After "use client" + following blank line / first imports.
  const useClient = source.match(/^"use client"\s*\n+/)
  if (useClient) {
    // Insert after the last consecutive import at the top (post directive).
    const after = source.slice(useClient[0].length)
    const imports = after.match(/^(?:import[\s\S]*?\n)+/)
    if (imports) {
      const insertAt = useClient[0].length + imports[0].length
      return source.slice(0, insertAt) + IMPORT_LINE + source.slice(insertAt)
    }
    return useClient[0] + IMPORT_LINE + after
  }

  return IMPORT_LINE + source
}

function remapColors(source) {
  return source
    .replaceAll('color: "var(--chart-1)"', "color: Chart_BAR_COLORS[0]")
    .replaceAll('color: "var(--chart-2)"', "color: Chart_BAR_COLORS[1]")
    .replaceAll('color: "var(--chart-3)"', "color: Chart_BAR_COLORS[2]")
    .replaceAll('color: "var(--chart-4)"', "color: Chart_BAR_COLORS[3]")
    .replaceAll('color: "var(--chart-5)"', "color: Chart_BAR_COLORS[4]")
}

const updated = []
for (const rel of FILES) {
  const file = path.join(root, rel)
  if (!fs.existsSync(file)) {
    console.warn("missing", rel)
    continue
  }
  const before = fs.readFileSync(file, "utf8")
  let next = stripBadImports(before)
  next = remapColors(next)
  next = ensureImport(next)
  // "use client" must stay first.
  if (!next.startsWith('"use client"')) {
    throw new Error(`"use client" not first in ${rel}`)
  }
  if (next !== before) {
    fs.writeFileSync(file, next)
    updated.push(rel)
  }
}

console.log(JSON.stringify({ updatedCount: updated.length, updated }, null, 2))
