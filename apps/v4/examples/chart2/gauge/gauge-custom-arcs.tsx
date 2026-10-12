"use client"

/**
 * Custom arc lengths — traffic-light palette from the library demo.
 * colors: #5BE12C, #F5CD19, #EA4228
 */

import { Chart2Gauge, GAUGE_TRAFFIC_COLORS } from "./gauge-shared"

export default function GaugeCustomArcsDemo() {
  return (
    <Chart2Gauge
      id="chart2-gauge-custom-arcs"
      nrOfLevels={420}
      arcsLength={[0.3, 0.5, 0.2]}
      colors={[...GAUGE_TRAFFIC_COLORS]}
      percent={0.37}
      arcPadding={0.02}
      caption="طول کمان سفارشی با پالت سبز / زرد / قرمز"
    />
  )
}
