"use client"

import * as React from "react"
import type { SunburstData } from "recharts"

import {
  CHART2_BAR_COLORS,
  CHART2_LABEL_INK,
  chart2Shade,
  formatPersianNumber,
} from "@/lib/chart2-fa"
import { cn } from "cn"

export { CHART2_BAR_COLORS }

/** @deprecated use chart2Shade from @/lib/chart2-fa */
export const shade = chart2Shade

/** Solid branch colors — children get lighter shades of the parent. */
export function colorizeTree(
  nodes: NonNullable<SunburstData["children"]>,
  palette: readonly string[] = CHART2_BAR_COLORS
): NonNullable<SunburstData["children"]> {
  return nodes.map((node, i) => {
    const base = palette[i % palette.length]!
    return {
      ...node,
      fill: base,
      children: node.children?.map((child, j) => ({
        ...child,
        fill: chart2Shade(base, 18 + j * 12),
        children: child.children?.map((grand, k) => ({
          ...grand,
          fill: chart2Shade(base, 36 + k * 12),
        })),
      })),
    }
  })
}

/** Same DFS order as Recharts SunburstChart.drawArcs. */
export function flattenSunburstNames(
  nodes: NonNullable<SunburstData["children"]>
): string[] {
  const names: string[] = []
  const walk = (list: NonNullable<SunburstData["children"]>) => {
    for (const node of list) {
      names.push(String(node.name ?? ""))
      if (node.children?.length) walk(node.children)
    }
  }
  walk(nodes)
  return names
}

/** Simple labels on arcs — no outline stroke. */
export const sunburstTextOptions = {
  fontFamily: "var(--font-sans)",
  fontWeight: 600,
  fontSize: "10px",
  stroke: "none",
  fill: CHART2_LABEL_INK,
  pointerEvents: "none" as const,
  letterSpacing: "0",
}

/** کوتاه‌کردن لیبل برای جا شدن روی قطاع */
export function shortenSunburstLabel(name: string, maxChars = 9) {
  const t = name.trim()
  if (t.length <= maxChars) return t
  return `${t.slice(0, Math.max(1, maxChars - 1))}…`
}

export type SunburstActive = {
  name: string
  value: number
  fill?: string
} | null

/**
 * Recharts hardcodes dataKey values as label text.
 * Swap them for node names after paint (order matches drawArcs).
 */
export function SunburstNameLabels({
  names,
  children,
  className,
}: {
  names: string[]
  children: React.ReactNode
  className?: string
}) {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useLayoutEffect(() => {
    const root = ref.current
    if (!root) return

    const apply = () => {
      const svg = root.querySelector("svg")
      const svgW = svg?.clientWidth || 400
      const maxLabelPx = svgW * 0.16
      const texts = root.querySelectorAll(".recharts-sunburst g > text")
      texts.forEach((el, i) => {
        const node = el as SVGTextElement
        const raw = names[i]
        if (!raw) return
        let next = shortenSunburstLabel(raw, 10)
        if (node.textContent !== next) node.textContent = next
        node.style.letterSpacing = "0"
        // اگر هنوز از کادر بزند بیرون، بیشتر کوتاه کن یا مخفی کن
        try {
          let w = node.getBBox().width
          if (w > maxLabelPx) {
            next = shortenSunburstLabel(raw, 7)
            node.textContent = next
            w = node.getBBox().width
          }
          if (w > maxLabelPx) {
            node.style.opacity = "0"
            node.setAttribute("aria-hidden", "true")
          } else {
            node.style.opacity = "1"
            node.removeAttribute("aria-hidden")
          }
        } catch {
          /* getBBox قبل از layout ممکن است خطا بدهد */
        }
      })
    }

    apply()
    const observer = new MutationObserver(() => {
      requestAnimationFrame(apply)
    })
    observer.observe(root, {
      childList: true,
      subtree: true,
      characterData: true,
    })
    return () => observer.disconnect()
  }, [names])

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      {children}
    </div>
  )
}

export function SunburstFrame({
  children,
  active,
  total,
  totalLabel,
  unit,
  className,
}: {
  children: React.ReactNode
  active: SunburstActive
  total: number
  totalLabel: string
  unit?: string
  className?: string
}) {
  const title = active?.name ?? totalLabel
  const value = active?.value ?? total
  const accent = active?.fill

  return (
    <div
      dir="rtl"
      className={cn(
        "mx-auto flex w-full max-w-[440px] flex-col items-center font-sans tracking-[0]",
        className
      )}
    >
      <div className="relative w-full max-w-[400px] overflow-hidden">
        {children}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex size-[34%] min-w-[6.5rem] flex-col items-center justify-center rounded-full border border-border/80 bg-background/95 px-2.5 text-center shadow-sm">
            <span className="line-clamp-2 max-w-full truncate text-[10px] leading-tight tracking-[0] text-muted-foreground">
              {title}
            </span>
            <span
              dir="ltr"
              className="mt-0.5 text-xl font-bold leading-none"
              style={{
                color: accent || "var(--foreground)",
                letterSpacing: "-0.03em",
                fontVariantNumeric: "normal",
                fontFeatureSettings: '"tnum" 0, "lnum" 0',
              }}
            >
              {formatPersianNumber(value, { useGrouping: true })}
            </span>
            {unit ? (
              <span className="mt-0.5 text-[10px] tracking-[0] text-muted-foreground">
                {unit}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
