"use client"

/**
 * 20 levels @ 86% — https://martin36.github.io/react-gauge-chart/
 * Ramp through #F5CD19 so the mid yellow stays visible on light backgrounds.
 */

import { Chart2Gauge, gaugeTrafficRamp } from "./gauge-shared"

const LEVELS = 20

export default function GaugeLevelsDemo() {
  return (
    <Chart2Gauge
      id="chart2-gauge-levels"
      nrOfLevels={LEVELS}
      colors={gaugeTrafficRamp(LEVELS)}
      percent={0.86}
      caption="بیست سطح با عقربه روی ۸۶٪ — زرد میانی #F5CD19"
    />
  )
}
