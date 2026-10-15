"use client"

/**
 * Installable stub for gallery chart-live hooks.
 * Site docs use `@/components/chart-live` with a real provider; CLI installs
 * this no-op module so demos run without DesignSystemPreview / ChartLiveProvider.
 */

import * as React from "react"

import { generatePersianMockData } from "@/lib/chart-fa"

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
  // no-op without provider
}

export function useChartCaption(
  _render: () => React.ReactNode,
  _deps: React.DependencyList = []
) {
  // no-op without provider
}

export function ChartToolbarStart() {
  return null
}

export function useChartRandomSeed(baseSeed: number) {
  return baseSeed
}

export function usePersianMockData(length: number, baseSeed: number) {
  return React.useMemo(
    () => generatePersianMockData(length, baseSeed),
    [length, baseSeed]
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
  // no-op in consumer installs
}

export function ChartExportPngButton(_props: {
  targetRef: React.RefObject<HTMLElement | null>
  filename?: string
}) {
  return null
}
