"use client"

/**
 * Corner radius + arc padding — demo defaults preserved.
 */

import { ChartGauge } from "./gauge-shared"

export default function GaugeCornerRadiusDemo() {
  return (
    <ChartGauge
      id="chart-gauge-corner-radius"
      nrOfLevels={10}
      arcPadding={0.1}
      cornerRadius={3}
      percent={0.6}
      caption="ده سطح با گوشهٔ گرد و فاصلهٔ بیشتر بین کمان‌ها"
    />
  )
}
