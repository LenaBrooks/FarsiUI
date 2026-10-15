"use client"

import * as React from "react"
import { DownloadIcon, Grid2X2Icon, RotateCcwIcon } from "lucide-react"
import { cn } from "cn"

import { generatePersianMockData } from "@/lib/chart-fa"
import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/new-york-v4/ui/tooltip"

type ChartLiveContextValue = {
  nonce: number
  randomize: () => void
  showGrid: boolean
  toggleGrid: () => void
  toolbarStart: React.ReactNode
  setToolbarStart: (node: React.ReactNode) => void
}

const ChartLiveContext = React.createContext<ChartLiveContextValue | null>(
  null
)

export function ChartLiveProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [nonce, setNonce] = React.useState(0)
  const [showGrid, setShowGrid] = React.useState(true)
  const [toolbarStart, setToolbarStart] = React.useState<React.ReactNode>(null)
  const randomize = React.useCallback(() => {
    setNonce((n) => n + 1 + Math.floor(Math.random() * 10_000))
  }, [])
  const toggleGrid = React.useCallback(() => {
    setShowGrid((v) => !v)
  }, [])

  const value = React.useMemo(
    () => ({
      nonce,
      randomize,
      showGrid,
      toggleGrid,
      toolbarStart,
      setToolbarStart,
    }),
    [nonce, randomize, showGrid, toggleGrid, toolbarStart]
  )

  return (
    <ChartLiveContext.Provider value={value}>
      {children}
    </ChartLiveContext.Provider>
  )
}

/**
 * CSS: mute Recharts/Highcharts/Polar grid strokes when off.
 * Baselines use [data-chart-baseline] and stay visible via JS + :not().
 */
export function chartGridHiddenClass(showGrid: boolean | undefined) {
  if (showGrid !== false) return undefined
  return [
    "[&_.recharts-cartesian-grid_line:not([data-chart-baseline])]:opacity-0",
    "[&_.recharts-polar-grid]:opacity-0",
    "[&_.recharts-polar-grid_line]:opacity-0",
    "[&_.recharts-polar-grid_path]:opacity-0",
    "[&_.recharts-cartesian-axis-line]:opacity-0",
    // Bar track backgrounds look like leftover grid columns when grid is off.
    "[&_.recharts-bar-background-rectangle]:opacity-0",
    // Cartesian Highcharts grids only — radial gauge grids are not plot grids.
    "[&_.highcharts-grid:not(.highcharts-radial-axis-grid)]:hidden",
    "[&_.highcharts-xaxis-grid:not(.highcharts-radial-axis-grid)]:hidden",
    "[&_.highcharts-yaxis-grid:not(.highcharts-radial-axis-grid)]:hidden",
  ].join(" ")
}

const BASELINE_ATTR = "data-chart-baseline"

function isChartBaseline(line: Element) {
  return line.hasAttribute(BASELINE_ATTR)
}

function removeChartBaselines(root: HTMLElement) {
  root.querySelectorAll(`[${BASELINE_ATTR}]`).forEach((node) => node.remove())
}

/** Restore native grid/axis visibility (grid toggle back on, or unmount). */
function restoreChartGridLines(root: HTMLElement) {
  root
    .querySelectorAll<SVGElement>(
      ".recharts-cartesian-grid line, .recharts-polar-grid, .recharts-polar-grid line, .recharts-polar-grid path, .recharts-cartesian-axis-line, .recharts-bar-background-rectangle"
    )
    .forEach((el) => {
      if (isChartBaseline(el)) return
      el.style.removeProperty("opacity")
      el.style.removeProperty("pointer-events")
      el.style.removeProperty("stroke-dasharray")
    })
}

function hideNativeGridLines(root: HTMLElement) {
  root
    .querySelectorAll<SVGLineElement>(".recharts-cartesian-grid line")
    .forEach((line) => {
      if (isChartBaseline(line)) return
      line.style.opacity = "0"
      line.style.pointerEvents = "none"
    })
  root
    .querySelectorAll<SVGElement>(
      ".recharts-polar-grid, .recharts-polar-grid line, .recharts-polar-grid path"
    )
    .forEach((el) => {
      el.style.opacity = "0"
      el.style.pointerEvents = "none"
    })
  root
    .querySelectorAll<SVGElement>(".recharts-cartesian-axis-line")
    .forEach((el) => {
      el.style.opacity = "0"
    })
  root
    .querySelectorAll<SVGElement>(".recharts-bar-background-rectangle")
    .forEach((el) => {
      el.style.opacity = "0"
      el.style.pointerEvents = "none"
    })
}

/** When grid is off: hide all grid/axis/bar-background strokes — no baselines. */
function syncChartGridBaselines(root: HTMLElement, showGrid: boolean) {
  removeChartBaselines(root)

  if (showGrid) {
    restoreChartGridLines(root)
    return
  }

  hideNativeGridLines(root)
}

/** Plot grids only — Highcharts gauge radial grids must not show the toggle. */
const CHART_GRID_SELECTOR = [
  ".recharts-cartesian-grid",
  ".recharts-polar-grid",
  ".highcharts-grid:not(.highcharts-radial-axis-grid)",
  ".highcharts-xaxis-grid:not(.highcharts-radial-axis-grid)",
  ".highcharts-yaxis-grid:not(.highcharts-radial-axis-grid)",
].join(", ")

/** True when the stage actually rendered a plot grid (hide toggle otherwise). */
export function useChartHasGrid(
  containerRef: React.RefObject<HTMLElement | null>,
  deps: React.DependencyList = []
) {
  const [hasGrid, setHasGrid] = React.useState(false)

  React.useEffect(() => {
    const root = containerRef.current
    if (!root) {
      setHasGrid(false)
      return
    }

    let raf = 0
    const check = () => {
      setHasGrid(Boolean(root.querySelector(CHART_GRID_SELECTOR)))
    }
    const schedule = () => {
      window.cancelAnimationFrame(raf)
      raf = window.requestAnimationFrame(check)
    }

    check()
    const timer = window.setTimeout(check, 150)
    const observer = new MutationObserver(schedule)
    observer.observe(root, { childList: true, subtree: true })

    return () => {
      window.cancelAnimationFrame(raf)
      window.clearTimeout(timer)
      observer.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- caller passes deps (e.g. exampleId)
  }, [containerRef, ...deps])

  return hasGrid
}

/** Keep plot-edge baselines in sync while the grid toggle is off. */
export function useChartGridBaselines(
  containerRef: React.RefObject<HTMLElement | null>,
  showGrid: boolean | undefined
) {
  React.useEffect(() => {
    const root = containerRef.current
    if (!root) return

    const gridOn = showGrid !== false
    let raf = 0
    const observer = new MutationObserver(() => {
      window.cancelAnimationFrame(raf)
      raf = window.requestAnimationFrame(run)
    })

    const run = () => {
      observer.disconnect()
      try {
        syncChartGridBaselines(root, gridOn)
      } finally {
        observer.observe(root, { childList: true, subtree: true })
      }
    }

    run()
    const timer = window.setTimeout(run, 150)

    return () => {
      window.cancelAnimationFrame(raf)
      window.clearTimeout(timer)
      observer.disconnect()
      removeChartBaselines(root)
      restoreChartGridLines(root)
    }
  }, [containerRef, showGrid])
}

export function useChartLive() {
  return React.useContext(ChartLiveContext)
}

/** Mount demo-specific controls into the chart card header (clears on unmount). */
export function useChartToolbarStart(
  render: () => React.ReactNode,
  deps: React.DependencyList
) {
  const live = useChartLive()
  const setToolbarStart = live?.setToolbarStart

  React.useEffect(() => {
    if (!setToolbarStart) return
    setToolbarStart(render())
    return () => setToolbarStart(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- caller passes deps
  }, [setToolbarStart, ...deps])
}

/** Description line in the chart card header (replaces captions above the plot). */
export function useChartCaption(
  render: () => React.ReactNode,
  deps: React.DependencyList = []
) {
  useChartToolbarStart(
    () => (
      <p className="min-w-0 max-w-full text-start text-[12px] leading-snug text-muted-foreground">
        {render()}
      </p>
    ),
    deps
  )
}

export function ChartToolbarStart() {
  const live = useChartLive()
  if (!live?.toolbarStart) return null
  return (
    <div className="flex min-w-0 flex-1 flex-wrap items-center justify-start gap-x-4 gap-y-1 pe-2">
      {live.toolbarStart}
    </div>
  )
}

/** Mix gallery live nonce into a demo's base seed (stable until randomize). */
export function useChartRandomSeed(baseSeed: number) {
  const live = useChartLive()
  const nonce = live?.nonce ?? 0
  return React.useMemo(() => {
    if (!nonce) return baseSeed
    return ((baseSeed ^ Math.imul(nonce, 2654435761)) >>> 0) || baseSeed
  }, [baseSeed, nonce])
}

/** Persian mock rows that refresh when the gallery randomize button is pressed. */
export function usePersianMockData(length: number, baseSeed: number) {
  const seed = useChartRandomSeed(baseSeed)
  return React.useMemo(
    () => generatePersianMockData(length, seed),
    [length, seed]
  )
}

export function ChartGridToggleButton() {
  const live = useChartLive()
  if (!live) return null

  const label = live.showGrid ? "مخفی کردن خطوط شبکه" : "نمایش خطوط شبکه"

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={label}
          aria-pressed={live.showGrid}
          className={cn(
            "size-7 cursor-pointer hover:bg-transparent",
            live.showGrid
              ? "text-muted-foreground/60 hover:text-muted-foreground"
              : "text-muted-foreground/35 hover:text-muted-foreground/55"
          )}
          onClick={live.toggleGrid}
        >
          <Grid2X2Icon className="size-3.5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

export function ChartRandomizeButton() {
  const live = useChartLive()
  if (!live) return null

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="بارگذاری دوباره"
          className="size-7 cursor-pointer text-muted-foreground/60 hover:bg-transparent hover:text-muted-foreground"
          onClick={live.randomize}
        >
          <RotateCcwIcon className="size-3.5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>بارگذاری دوباره</TooltipContent>
    </Tooltip>
  )
}

/** Fixed PNG export size (golden-ratio width). Light/dark uses current theme colors. */
export const CHART_EXPORT_SIZE = { width: 800, height: 494 } as const

const CHART_SVG_SELECTOR =
  ".recharts-wrapper svg, svg.recharts-surface, .highcharts-container svg"

/** Prefer known chart roots; fall back to largest non-icon SVG (e.g. react-gauge-chart). */
function findChartSvg(root: HTMLElement): SVGSVGElement | null {
  const preferred = root.querySelector(
    CHART_SVG_SELECTOR
  ) as SVGSVGElement | null
  if (preferred) return preferred

  const candidates = Array.from(root.querySelectorAll("svg")).filter((el) => {
    if (el.closest("button")) return false
    const cls = el.getAttribute("class") ?? ""
    if (cls.includes("lucide")) return false
    return true
  }) as SVGSVGElement[]

  if (candidates.length === 0) return null
  return candidates.reduce((best, cur) => {
    const br = best.getBoundingClientRect()
    const cr = cur.getBoundingClientRect()
    return cr.width * cr.height > br.width * br.height ? cur : best
  })
}

const fontFaceCssCache = new Map<string, Promise<string>>()

/** Normalize any CSS color (oklch/lab/rgb) to opaque `rgb(r, g, b)` via canvas. */
function cssColorToRgb(color: string): string | null {
  if (!color || color === "transparent" || color === "rgba(0, 0, 0, 0)") {
    return null
  }
  const canvas = document.createElement("canvas")
  canvas.width = 1
  canvas.height = 1
  const ctx = canvas.getContext("2d", { willReadFrequently: true })
  if (!ctx) return null
  ctx.clearRect(0, 0, 1, 1)
  ctx.fillStyle = "#000000"
  try {
    ctx.fillStyle = color
  } catch {
    return null
  }
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data
  if (a < 250) return null
  return `rgb(${r}, ${g}, ${b})`
}

function resolveThemeBackgroundRgb() {
  const probe = document.createElement("div")
  probe.style.cssText =
    "position:fixed;left:-9999px;top:0;width:1px;height:1px;background-color:var(--background)"
  document.body.appendChild(probe)
  const rgb = cssColorToRgb(getComputedStyle(probe).backgroundColor)
  probe.remove()
  if (rgb) return rgb
  // Fallback matching globals.css light / .dark --background
  return document.documentElement.classList.contains("dark")
    ? "rgb(37, 37, 37)"
    : "rgb(255, 255, 255)"
}

function resolveOpaqueBackground(_start: HTMLElement) {
  // Stage uses muted/20 (translucent). Always bake the theme `--background`
  // so dark exports are actually dark (oklch → canvas rgb).
  return resolveThemeBackgroundRgb()
}

function parseFontFamilyStack(stack: string) {
  const families: string[] = []
  const re = /"([^"]+)"|'([^']+)'|([^,]+)/g
  let match: RegExpExecArray | null
  while ((match = re.exec(stack))) {
    const name = (match[1] ?? match[2] ?? match[3] ?? "").trim()
    if (
      name &&
      !/^(ui-sans-serif|ui-serif|ui-monospace|system-ui|sans-serif|serif|monospace|cursive|fantasy)$/i.test(
        name
      )
    ) {
      families.push(name)
    }
  }
  return families
}

function getPrimaryFontFamily(el: Element) {
  return parseFontFamilyStack(window.getComputedStyle(el).fontFamily)[0] ?? "sans-serif"
}

function collectChartFontFamilies(svg: SVGSVGElement, root: HTMLElement) {
  const families = new Set<string>()
  const sampleEls: Element[] = [
    ...Array.from(svg.querySelectorAll("text, tspan")),
    root.querySelector("[data-slot=chart]") ?? root,
  ]
  for (const el of sampleEls) {
    for (const family of parseFontFamilyStack(
      window.getComputedStyle(el).fontFamily
    )) {
      families.add(family)
    }
  }
  if (families.size === 0) {
    families.add(getPrimaryFontFamily(root))
  }
  return [...families]
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer)
  let binary = ""
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk))
  }
  return btoa(binary)
}

function fontFormatFromUrl(url: string) {
  if (url.includes(".woff2")) return "woff2"
  if (url.includes(".woff")) return "woff"
  if (url.includes(".otf")) return "opentype"
  return "truetype"
}

function mimeFromFormat(format: string) {
  if (format === "woff2") return "font/woff2"
  if (format === "woff") return "font/woff"
  if (format === "opentype") return "font/otf"
  return "font/ttf"
}

/** Embed page webfonts into SVG so PNG export keeps Persian UI face. */
async function buildEmbeddedFontFaceCss(families: string[]) {
  const cacheKey = families.slice().sort().join("|")
  const cached = fontFaceCssCache.get(cacheKey)
  if (cached) return cached

  const familySet = new Set(families)
  const promise = (async () => {
    await document.fonts.ready
    const chunks: string[] = []
    const seen = new Set<string>()

    for (const sheet of Array.from(document.styleSheets)) {
      let rules: CSSRuleList
      try {
        rules = sheet.cssRules
      } catch {
        continue
      }

      for (const rule of Array.from(rules)) {
        if (!(rule instanceof CSSFontFaceRule)) continue
        const ruleFamily = rule.style
          .getPropertyValue("font-family")
          .replace(/^["']|["']$/g, "")
          .trim()
        if (!ruleFamily || !familySet.has(ruleFamily)) continue

        const src = rule.style.getPropertyValue("src")
        const urlMatch = src.match(/url\((["']?)([^"')]+)\1\)/)
        if (!urlMatch?.[2]) continue

        // Never resolve relative `media/…` against /chart — use Next static root.
        const rawSrc = urlMatch[2]
        const fontUrl = /^https?:\/\//i.test(rawSrc)
          ? rawSrc
          : rawSrc.startsWith("/")
            ? `${window.location.origin}${rawSrc}`
            : (() => {
                const media = rawSrc.match(/(?:^|\/)(media\/[^?#]+)/)
                return media
                  ? `${window.location.origin}/_next/static/${media[1]}`
                  : new URL(rawSrc, `${window.location.origin}/_next/static/`)
                      .href
              })()
        const dedupe = `${ruleFamily}|${fontUrl}|${rule.style.getPropertyValue("font-weight")}`
        if (seen.has(dedupe)) continue
        seen.add(dedupe)

        try {
          const res = await fetch(fontUrl)
          if (!res.ok) continue
          const format = fontFormatFromUrl(fontUrl)
          const b64 = arrayBufferToBase64(await res.arrayBuffer())
          const weight = rule.style.getPropertyValue("font-weight") || "100 900"
          const style = rule.style.getPropertyValue("font-style") || "normal"
          chunks.push(
            `@font-face{font-family:${JSON.stringify(ruleFamily)};src:url(data:${mimeFromFormat(format)};base64,${b64}) format(${JSON.stringify(format)});font-weight:${weight};font-style:${style};font-display:block;}`
          )
        } catch {
          // Skip blocked / missing faces.
        }
      }
    }

    return chunks.join("")
  })()

  fontFaceCssCache.set(cacheKey, promise)
  return promise
}

function injectSvgFontStyle(
  clone: SVGSVGElement,
  families: string[],
  fontFaceCss: string
) {
  if (!fontFaceCss || families.length === 0) return
  const stack = families.map((f) => JSON.stringify(f)).join(",")
  const style = document.createElementNS("http://www.w3.org/2000/svg", "style")
  style.setAttribute("type", "text/css")
  style.textContent = `${fontFaceCss}text,tspan{font-family:${stack},sans-serif!important}`
  clone.insertBefore(style, clone.firstChild)
}

/**
 * Resolve `var(--color-*)` / any CSS color against the live chart host.
 * Standalone SVG-as-image cannot see page `[data-chart]` tokens — unresolved
 * stop colors become black (muddy light PNG / invisible dark PNG).
 */
function resolveColorAgainstHost(
  host: HTMLElement,
  expr: string
): string | null {
  const trimmed = expr.trim()
  if (!trimmed || trimmed === "none") return null
  if (trimmed.startsWith("url(")) return null

  const probe = document.createElement("span")
  probe.setAttribute(
    "style",
    `position:fixed;left:-9999px;top:0;width:1px;height:1px;color:${trimmed};background-color:${trimmed}`
  )
  host.appendChild(probe)
  const bg = getComputedStyle(probe).backgroundColor
  const fg = getComputedStyle(probe).color
  probe.remove()

  return cssColorToRgb(bg) ?? cssColorToRgb(fg)
}

function collectChartColorVars(host: HTMLElement) {
  const vars = new Map<string, string>()
  const cs = window.getComputedStyle(host)
  const chartId = host.getAttribute("data-chart")
  const isDark = document.documentElement.classList.contains("dark")

  if (chartId) {
    for (const el of Array.from(document.querySelectorAll("style"))) {
      const text = el.textContent ?? ""
      if (!text.includes(`data-chart=${chartId}`)) continue
      const blockRe =
        /([^{]*)\[\s*data-chart\s*=\s*([^\]]+)\]\s*\{([^}]*)\}/g
      let block: RegExpExecArray | null
      while ((block = blockRe.exec(text))) {
        const preamble = block[1] ?? ""
        const id = (block[2] ?? "").trim()
        if (id !== chartId) continue
        const darkRule = preamble.includes(".dark")
        // Apply light rules always; dark rules only in dark (override).
        if (darkRule && !isDark) continue
        const body = block[3] ?? ""
        for (const match of body.matchAll(
          /--(color-[\w-]+)\s*:\s*([^;]+)/g
        )) {
          const prop = `--${match[1]}`
          const raw = (match[2] ?? "").trim()
          const resolved =
            resolveColorAgainstHost(host, raw) ??
            resolveColorAgainstHost(host, `var(${prop})`) ??
            raw
          if (resolved) vars.set(prop, resolved)
        }
      }
    }
  }

  for (const key of [
    "x",
    "y",
    "z",
    "uv",
    "pv",
    "amt",
    "range",
    "value",
    "mid",
    "temperature",
    "high",
    "low",
  ]) {
    const prop = `--color-${key}`
    if (vars.has(prop)) continue
    const raw = cs.getPropertyValue(prop).trim()
    if (!raw) continue
    const resolved =
      resolveColorAgainstHost(host, raw) ??
      resolveColorAgainstHost(host, `var(${prop})`)
    if (resolved) vars.set(prop, resolved)
  }

  return vars
}

function replaceCssVarsInValue(
  value: string,
  vars: Map<string, string>,
  host: HTMLElement
) {
  if (!value.includes("var(")) return value
  return value.replace(
    /var\(\s*(--[\w-]+)\s*(?:,\s*((?:[^)(]+|\([^)]*\))*))?\)/g,
    (_full, name: string, fallback?: string) => {
      const fromMap = vars.get(name)
      if (fromMap) return fromMap
      const resolved = resolveColorAgainstHost(
        host,
        fallback?.trim() ? `var(${name}, ${fallback.trim()})` : `var(${name})`
      )
      if (resolved) {
        vars.set(name, resolved)
        return resolved
      }
      return fallback?.trim() || _full
    }
  )
}

/** Rewrite every `var(--color-*)` in the clone to opaque rgb/hex. */
function bakeSvgChartColors(source: SVGSVGElement, clone: SVGSVGElement) {
  const host =
    (source.closest("[data-chart]") as HTMLElement | null) ??
    (source.parentElement as HTMLElement | null)
  if (!host) return

  const vars = collectChartColorVars(host)

  const bakeEl = (el: Element) => {
    for (const attr of Array.from(el.attributes)) {
      if (!attr.value.includes("var(")) continue
      el.setAttribute(attr.name, replaceCssVarsInValue(attr.value, vars, host))
    }
    if (el.localName === "stop" || el.tagName === "stop") {
      const raw =
        el.getAttribute("stop-color") ??
        el.getAttribute("stopColor") ??
        ""
      const baked = replaceCssVarsInValue(raw, vars, host)
      const rgb =
        resolveColorAgainstHost(host, baked) ??
        cssColorToRgb(baked) ??
        (baked.includes("var(") ? null : baked)
      if (rgb) {
        el.setAttribute("stop-color", rgb)
        el.removeAttribute("stopColor")
      }
      const op = el.getAttribute("stop-opacity") ?? el.getAttribute("stopOpacity")
      if (op != null && op !== "") {
        el.setAttribute("stop-opacity", op)
        el.removeAttribute("stopOpacity")
      }
    }
    for (const child of Array.from(el.children)) bakeEl(child)
  }
  bakeEl(clone)

  // Mirror baked stops from live computed style when still missing/black.
  const srcStops = source.querySelectorAll("stop")
  const cloneStops = clone.querySelectorAll("stop")
  srcStops.forEach((srcStop, index) => {
    const dest = cloneStops[index]
    if (!dest) return
    const attr = dest.getAttribute("stop-color") ?? ""
    const looksBad =
      !attr ||
      attr.includes("var(") ||
      attr === "rgb(0, 0, 0)" ||
      attr === "#000" ||
      attr === "#000000"
    if (!looksBad) return
    const cs = window.getComputedStyle(srcStop)
    // Probe the original attribute against host — more reliable than stopColor CSSOM.
    const rawAttr =
      srcStop.getAttribute("stop-color") ??
      srcStop.getAttribute("stopColor") ??
      ""
    const fromAttr = replaceCssVarsInValue(rawAttr, vars, host)
    const rgb =
      resolveColorAgainstHost(host, fromAttr) ??
      cssColorToRgb(fromAttr) ??
      resolveColorAgainstHost(host, cs.stopColor) ??
      cssColorToRgb(cs.stopColor)
    if (rgb && rgb !== "rgb(0, 0, 0)") {
      dest.setAttribute("stop-color", rgb)
    }
    if (cs.stopOpacity !== "" && cs.stopOpacity != null) {
      dest.setAttribute("stop-opacity", cs.stopOpacity)
    }
  })
}

function inlineSvgComputedStyles(
  source: SVGSVGElement,
  clone: SVGSVGElement,
  fontFamily: string
) {
  const srcNodes = [source, ...Array.from(source.querySelectorAll("*"))]
  const cloneNodes = [clone, ...Array.from(clone.querySelectorAll("*"))]

  for (let i = 0; i < srcNodes.length; i++) {
    const src = srcNodes[i]
    const dest = cloneNodes[i] as Element | undefined
    if (!(src instanceof Element) || !(dest instanceof Element)) continue

    const cs = window.getComputedStyle(src)
    const fill = cs.fill
    const stroke = cs.stroke
    if (fill && fill !== "none" && !fill.startsWith("url(")) {
      const rgb = cssColorToRgb(fill) ?? fill
      dest.setAttribute("fill", rgb)
    }
    if (stroke && stroke !== "none" && !stroke.startsWith("url(")) {
      const rgb = cssColorToRgb(stroke) ?? stroke
      dest.setAttribute("stroke", rgb)
    }
    if (cs.opacity && cs.opacity !== "1") {
      dest.setAttribute("opacity", cs.opacity)
    }

    if (src.tagName === "text" || src.tagName === "tspan") {
      dest.setAttribute("font-family", fontFamily)
      dest.setAttribute("font-size", cs.fontSize)
      dest.setAttribute("font-weight", cs.fontWeight)
    }
  }
}

export async function downloadChartPng(
  root: HTMLElement,
  filename = "chart.png",
  size: { width: number; height: number } = CHART_EXPORT_SIZE
) {
  const svg = findChartSvg(root)
  if (!svg) return

  const families = collectChartFontFamilies(svg, root)
  const fontFamily = families[0] ?? "sans-serif"
  const fontFaceCss = await buildEmbeddedFontFaceCss(families)

  const clone = svg.cloneNode(true) as SVGSVGElement
  if (!clone.getAttribute("xmlns")) {
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg")
  }
  bakeSvgChartColors(svg, clone)
  inlineSvgComputedStyles(svg, clone, fontFamily)
  injectSvgFontStyle(clone, families, fontFaceCss)

  const { width, height } = size
  clone.setAttribute("width", String(width))
  clone.setAttribute("height", String(height))
  if (!clone.getAttribute("viewBox")) {
    const rect = svg.getBoundingClientRect()
    const vbW = Math.ceil(rect.width) || width
    const vbH = Math.ceil(rect.height) || height
    clone.setAttribute("viewBox", `0 0 ${vbW} ${vbH}`)
  }
  clone.setAttribute("preserveAspectRatio", "xMidYMid meet")

  const bg = resolveOpaqueBackground(root)

  // data: URI (not blob:) so Chromium applies embedded @font-face in SVG-as-image.
  const svgXml = new XMLSerializer().serializeToString(clone)
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgXml)}`

  try {
    const img = new Image()
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => reject(new Error("chart png load failed"))
      img.src = url
    })
    if (typeof img.decode === "function") {
      try {
        await img.decode()
      } catch {
        // Ignore decode errors; onload already succeeded.
      }
    }
    await new Promise<void>((r) => {
      window.setTimeout(() => r(), 50)
    })

    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, width, height)
    ctx.drawImage(img, 0, 0, width, height)

    const a = document.createElement("a")
    a.href = canvas.toDataURL("image/png")
    a.download = filename.endsWith(".png") ? filename : `${filename}.png`
    a.click()
  } catch {
    // Fall through — export aborted.
  }
}

function chartExportThemeSuffix() {
  return document.documentElement.classList.contains("dark") ? "dark" : "light"
}

/** `simple-line-chart` → `simple-line-chart-light.png` (theme at click time). */
function chartExportFilename(base: string) {
  const stem = base.replace(/\.png$/i, "")
  return `${stem}-${chartExportThemeSuffix()}.png`
}

export function ChartExportPngButton({
  containerRef,
  filename = "chart",
}: {
  containerRef: React.RefObject<HTMLElement | null>
  /** Chart id / stem; theme (`light`|`dark`) is appended on download. */
  filename?: string
}) {
  const [busy, setBusy] = React.useState(false)

  if (process.env.NODE_ENV === "production") return null

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="دانلود تصویر"
          disabled={busy}
          className="size-7 cursor-pointer text-muted-foreground/60 hover:bg-transparent hover:text-muted-foreground disabled:opacity-40"
          onClick={() => {
            const root = containerRef.current
            if (!root || busy) return
            setBusy(true)
            void downloadChartPng(root, chartExportFilename(filename)).finally(
              () => setBusy(false)
            )
          }}
        >
          <DownloadIcon className="size-3.5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>دانلود PNG ({CHART_EXPORT_SIZE.width}×{CHART_EXPORT_SIZE.height})</TooltipContent>
    </Tooltip>
  )
}
