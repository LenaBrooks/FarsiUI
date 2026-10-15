"use client"

/**
 * Custom arc lengths — traffic-light palette from the library demo.
 * Soft traffic arcs from GAUGE_TRAFFIC_COLORS
 */

import { ChartGauge, GAUGE_TRAFFIC_COLORS } from "./gauge-shared"

export default function GaugeCustomArcsDemo() {
  return (
    <ChartGauge
      id="chart-gauge-custom-arcs"
      nrOfLevels={420}
      arcsLength={[0.3, 0.5, 0.2]}
      colors={[...GAUGE_TRAFFIC_COLORS]}
      percent={0.37}
      arcPadding={0.02}
      caption="طول کمان سفارشی با پالت سبز / زرد / قرمز"
    />
  )
}
