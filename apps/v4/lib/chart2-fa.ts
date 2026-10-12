/**
 * Shared Persian / RTL helpers for chart2 demos.
 * Uses FarsiUI locale + digit utilities so gallery demos match installable charts.
 */

import {
  FA_CHART,
  FA_MONTHS,
  formatPersianNumber,
  toPersianDigits,
} from "@/lib/chart-locale"
import {
  generateMockData,
  type MockDataType,
} from "@/lib/chart2-mock-data"
import type { ChartConfig } from "@/registry/new-york-v4/ui/chart"

export {
  FA_CHART,
  FA_MONTHS,
  FA_MONTHS_FULL,
  formatJalaliDate,
  formatPersianNumber,
  toPersianDigits,
} from "@/lib/chart-locale"

export type { MockDataType }

/** Default series labels for x / y / z mock keys. */
export const CHART2_SERIES_LABELS = {
  x: FA_CHART.store,
  y: FA_CHART.online,
  z: FA_CHART.orders,
} as const

export const chart2MockConfig = {
  x: {
    label: CHART2_SERIES_LABELS.x,
    color: "var(--chart-1)",
  },
  y: {
    label: CHART2_SERIES_LABELS.y,
    color: "var(--chart-2)",
  },
  z: {
    label: CHART2_SERIES_LABELS.z,
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

/** Same LCG values as Recharts demos, with Persian category labels. */
export function generatePersianMockData(
  length: number,
  seed: number
): MockDataType[] {
  return generateMockData(length, seed).map((row, i) => ({
    ...row,
    label:
      length <= FA_MONTHS.length
        ? FA_MONTHS[i]!
        : `دوره ${toPersianDigits(i + 1)}`,
  }))
}

export function formatChart2Number(value: number | string) {
  return formatPersianNumber(value)
}

export function formatChart2Tick(value: unknown) {
  if (typeof value === "number") return formatPersianNumber(value)
  if (value == null) return ""
  return toPersianDigits(String(value))
}

/** Shared ChartContainer sizing for gallery demos. */
export const chart2ContainerClassName =
  "aspect-[1.618] h-auto w-full max-w-[700px] max-h-[70vh] font-sans text-xs"
