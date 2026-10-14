"use client"

import * as React from "react"
import { Grid2X2Icon, RotateCcwIcon } from "lucide-react"
import { cn } from "cn"

import { generatePersianMockData } from "@/lib/chart2-fa"
import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/new-york-v4/ui/tooltip"

type Chart2LiveContextValue = {
  nonce: number
  randomize: () => void
  showGrid: boolean
  toggleGrid: () => void
  toolbarStart: React.ReactNode
  setToolbarStart: (node: React.ReactNode) => void
}

const Chart2LiveContext = React.createContext<Chart2LiveContextValue | null>(
  null
)

export function Chart2LiveProvider({
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
    <Chart2LiveContext.Provider value={value}>
      {children}
    </Chart2LiveContext.Provider>
  )
}

/**
 * CSS: mute Recharts/Highcharts/Polar grid strokes when off.
 * Baselines use [data-chart2-baseline] and stay visible via JS + :not().
 */
export function chart2GridHiddenClass(showGrid: boolean | undefined) {
  if (showGrid !== false) return undefined
  return [
    "[&_.recharts-cartesian-grid_line:not([data-chart2-baseline])]:opacity-0",
    "[&_.recharts-polar-grid]:opacity-0",
    "[&_.recharts-polar-grid_line]:opacity-0",
    "[&_.recharts-polar-grid_path]:opacity-0",
    "[&_.recharts-cartesian-axis-line]:opacity-0",
    // Bar track backgrounds look like leftover grid columns when grid is off.
    "[&_.recharts-bar-background-rectangle]:opacity-0",
    "[&_.highcharts-grid]:hidden",
    "[&_.highcharts-xaxis-grid]:hidden",
    "[&_.highcharts-yaxis-grid]:hidden",
  ].join(" ")
}

const BASELINE_ATTR = "data-chart2-baseline"

function isChart2Baseline(line: Element) {
  return line.hasAttribute(BASELINE_ATTR)
}

function removeChart2Baselines(root: HTMLElement) {
  root.querySelectorAll(`[${BASELINE_ATTR}]`).forEach((node) => node.remove())
}

/** Restore native grid/axis visibility (grid toggle back on, or unmount). */
function restoreChart2GridLines(root: HTMLElement) {
  root
    .querySelectorAll<SVGElement>(
      ".recharts-cartesian-grid line, .recharts-polar-grid, .recharts-polar-grid line, .recharts-polar-grid path, .recharts-cartesian-axis-line, .recharts-bar-background-rectangle"
    )
    .forEach((el) => {
      if (isChart2Baseline(el)) return
      el.style.removeProperty("opacity")
      el.style.removeProperty("pointer-events")
      el.style.removeProperty("stroke-dasharray")
    })
}

function hideNativeGridLines(root: HTMLElement) {
  root
    .querySelectorAll<SVGLineElement>(".recharts-cartesian-grid line")
    .forEach((line) => {
      if (isChart2Baseline(line)) return
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
function syncChart2GridBaselines(root: HTMLElement, showGrid: boolean) {
  removeChart2Baselines(root)

  if (showGrid) {
    restoreChart2GridLines(root)
    return
  }

  hideNativeGridLines(root)
}

const CHART2_GRID_SELECTOR = [
  ".recharts-cartesian-grid",
  ".recharts-polar-grid",
  ".highcharts-grid",
  ".highcharts-xaxis-grid",
  ".highcharts-yaxis-grid",
].join(", ")

/** True when the stage actually rendered a plot grid (hide toggle otherwise). */
export function useChart2HasGrid(
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
      setHasGrid(Boolean(root.querySelector(CHART2_GRID_SELECTOR)))
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
export function useChart2GridBaselines(
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
        syncChart2GridBaselines(root, gridOn)
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
      removeChart2Baselines(root)
      restoreChart2GridLines(root)
    }
  }, [containerRef, showGrid])
}

export function useChart2Live() {
  return React.useContext(Chart2LiveContext)
}

/** Mount demo-specific controls into the chart card header (clears on unmount). */
export function useChart2ToolbarStart(
  render: () => React.ReactNode,
  deps: React.DependencyList
) {
  const live = useChart2Live()
  const setToolbarStart = live?.setToolbarStart

  React.useEffect(() => {
    if (!setToolbarStart) return
    setToolbarStart(render())
    return () => setToolbarStart(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- caller passes deps
  }, [setToolbarStart, ...deps])
}

/** Description line in the chart card header (replaces captions above the plot). */
export function useChart2Caption(
  render: () => React.ReactNode,
  deps: React.DependencyList = []
) {
  useChart2ToolbarStart(
    () => (
      <p className="min-w-0 max-w-full text-start text-[12px] leading-snug text-muted-foreground">
        {render()}
      </p>
    ),
    deps
  )
}

export function Chart2ToolbarStart() {
  const live = useChart2Live()
  if (!live?.toolbarStart) return null
  return (
    <div className="flex min-w-0 flex-1 flex-wrap items-center justify-start gap-x-4 gap-y-1 pe-2">
      {live.toolbarStart}
    </div>
  )
}

/** Mix gallery live nonce into a demo's base seed (stable until randomize). */
export function useChart2RandomSeed(baseSeed: number) {
  const live = useChart2Live()
  const nonce = live?.nonce ?? 0
  return React.useMemo(() => {
    if (!nonce) return baseSeed
    return ((baseSeed ^ Math.imul(nonce, 2654435761)) >>> 0) || baseSeed
  }, [baseSeed, nonce])
}

/** Persian mock rows that refresh when the gallery randomize button is pressed. */
export function usePersianMockData(length: number, baseSeed: number) {
  const seed = useChart2RandomSeed(baseSeed)
  return React.useMemo(
    () => generatePersianMockData(length, seed),
    [length, seed]
  )
}

export function Chart2GridToggleButton() {
  const live = useChart2Live()
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

export function Chart2RandomizeButton() {
  const live = useChart2Live()
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
