"use client"

import type { ChartExample } from "@/lib/chart-catalog"
import { ChartView } from "@/components/chart-view"

/** Detail page body only — shell lives in `app/(app)/charts/view/layout.tsx`. */
export function ChartViewPanel({
  example,
  sourceFigure,
  usageFigures,
}: {
  example: ChartExample
  sourceFigure: React.ReactNode
  usageFigures: React.ReactNode
}) {
  return (
    <ChartView
      example={example}
      sourceFigure={sourceFigure}
      usageFigures={usageFigures}
      embedded
    />
  )
}
