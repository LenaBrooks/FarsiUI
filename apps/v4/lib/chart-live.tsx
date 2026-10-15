"use client"

/**
 * Site resolve target for `@/lib/chart-live` (registry gallery imports).
 * Keep this free of heavy deps so Turbopack can resolve it during docs compile.
 */

import * as React from "react"

export function ChartLiveProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

export function chartGridHiddenClass(_showGrid: boolean | undefined) {
  return undefined
}

export function useChartHasGrid(
  _containerRef: React.RefObject<HTMLElement | null>
) {
  return true
}

export function useChartGridBaselines(
  _containerRef: React.RefObject<HTMLElement | null>
) {
  // no-op
}

export function useChartLive() {
  return null
}

export function useChartToolbarStart(
  _render: () => React.ReactNode,
  _deps: React.DependencyList
) {
  // no-op
}

export function useChartCaption(
  _render: () => React.ReactNode,
  _deps: React.DependencyList = []
) {
  // no-op
}

export function ChartToolbarStart() {
  return null
}

export function useChartRandomSeed(baseSeed: number) {
  return baseSeed
}

export function usePersianMockData(length: number, _baseSeed: number) {
  return React.useMemo(
    () =>
      Array.from({ length }, (_, i) => ({
        month: String(i + 1),
        x: 40 + ((i * 17) % 60),
        y: 30 + ((i * 13) % 50),
        z: 20 + ((i * 11) % 40),
      })),
    [length]
  )
}

export function ChartGridToggleButton() {
  return null
}

export function ChartRandomizeButton() {
  return null
}

export const CHART_EXPORT_SIZE = { width: 800, height: 494 } as const

export async function downloadChartPng(
  _root: HTMLElement | null,
  _filename?: string
) {
  // no-op
}

export function ChartExportPngButton(_props: {
  targetRef: React.RefObject<HTMLElement | null>
  filename?: string
}) {
  return null
}
