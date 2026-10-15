"use client"

/**
 * Custom colors + thicker arc — demo palette preserved.
 * Soft rose → sand (chart-aligned)
 */

import { ChartGauge } from "./gauge-shared"

export default function GaugeCustomColorsDemo() {
  return (
    <ChartGauge
      id="chart-gauge-custom-colors"
      nrOfLevels={30}
      colors={["#d97986", "#c4a574"]}
      arcWidth={0.3}
      percent={0.37}
      caption="سی سطح با رنگ سفارشی و کمان ضخیم‌تر"
    />
  )
}
