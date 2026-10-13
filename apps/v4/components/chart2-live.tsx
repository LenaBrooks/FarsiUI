"use client"

import * as React from "react"
import { RotateCcwIcon } from "lucide-react"

import { generatePersianMockData } from "@/lib/chart2-fa"
import { Button } from "@/registry/new-york-v4/ui/button"

type Chart2LiveContextValue = {
  nonce: number
  randomize: () => void
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
  const [toolbarStart, setToolbarStart] = React.useState<React.ReactNode>(null)
  const randomize = React.useCallback(() => {
    setNonce((n) => n + 1 + Math.floor(Math.random() * 10_000))
  }, [])

  const value = React.useMemo(
    () => ({ nonce, randomize, toolbarStart, setToolbarStart }),
    [nonce, randomize, toolbarStart]
  )

  return (
    <Chart2LiveContext.Provider value={value}>
      {children}
    </Chart2LiveContext.Provider>
  )
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

export function Chart2RandomizeButton() {
  const live = useChart2Live()
  if (!live) return null

  return (
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
  )
}
