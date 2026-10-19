"use client"

import type { ChartExample } from "@/lib/chart-catalog"
import type { HighlightedPackageManagerCommands } from "@/lib/highlight-code"
import { ChartView } from "@/components/chart-view"

/** Detail page body only — shell lives in `app/(app)/charts/view/layout.tsx`. */
export function ChartViewPanel({
  example,
  sourceFigure,
  usageFigures,
  cliHighlighted,
}: {
  example: ChartExample
  sourceFigure: React.ReactNode
  usageFigures: React.ReactNode
  cliHighlighted?: HighlightedPackageManagerCommands | null
}) {
  return (
    <ChartView
      example={example}
      sourceFigure={sourceFigure}
      usageFigures={usageFigures}
      cliHighlighted={cliHighlighted}
      embedded
    />
  )
}
