"use client"

import type { Chart2Example } from "@/lib/chart2-catalog"
import { Chart2View } from "@/components/chart2-view"

/** Detail page body only — shell lives in `app/(app)/charts/view/layout.tsx`. */
export function Chart2ViewPanel({
  example,
  sourceFigure,
  usageFigures,
}: {
  example: Chart2Example
  sourceFigure: React.ReactNode
  usageFigures: React.ReactNode
}) {
  return (
    <Chart2View
      example={example}
      sourceFigure={sourceFigure}
      usageFigures={usageFigures}
      embedded
    />
  )
}
