"use client"

/**
 * Custom colors + thicker arc — demo palette preserved.
 * colors: #FF5F6D → #FFC371
 */

import { Chart2Gauge } from "./gauge-shared"

export default function GaugeCustomColorsDemo() {
  return (
    <Chart2Gauge
      id="chart2-gauge-custom-colors"
      nrOfLevels={30}
      colors={["#FF5F6D", "#FFC371"]}
      arcWidth={0.3}
      percent={0.37}
      caption="سی سطح با رنگ سفارشی و کمان ضخیم‌تر"
    />
  )
}
