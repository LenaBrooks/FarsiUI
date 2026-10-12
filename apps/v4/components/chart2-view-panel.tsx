"use client"

import type { Chart2Example } from "@/lib/chart2-catalog"
import { Chart2Shell } from "@/components/chart2-shell"
import { Chart2View } from "@/components/chart2-view"

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
    <Chart2Shell
      activeCategoryId={example.category}
      activeExampleId={example.id}
    >
      <Chart2View
        example={example}
        sourceFigure={sourceFigure}
        usageFigures={usageFigures}
        embedded
      />
    </Chart2Shell>
  )
}
