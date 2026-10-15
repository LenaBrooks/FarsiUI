"use client"

/**
 * Default gauge — https://martin36.github.io/react-gauge-chart/
 * Traffic-light colors (same mid yellow as custom-arcs) so yellow reads on light theme.
 */

import { ChartGauge, GAUGE_TRAFFIC_COLORS } from "./gauge-shared"

export default function GaugeDefaultDemo() {
  return (
    <ChartGauge
      id="chart-gauge-default"
      colors={[...GAUGE_TRAFFIC_COLORS]}
      caption="گیج پیش‌فرض — سبز / طلایی / قرمز نرم"
    />
  )
}
