"use client"

/**
 * 20 levels @ 86% — https://martin36.github.io/react-gauge-chart/
 * Ramp through soft mid gold so the middle band stays visible on light backgrounds.
 */

import { ChartGauge, gaugeTrafficRamp } from "./gauge-shared"

const LEVELS = 20

export default function GaugeLevelsDemo() {
  return (
    <ChartGauge
      id="chart-gauge-levels"
      nrOfLevels={LEVELS}
      colors={gaugeTrafficRamp(LEVELS)}
      percent={0.86}
      caption="بیست سطح با عقربه روی ۸۶٪ — طلایی میانی"
    />
  )
}
