"use client"

/**
 * Animation disabled — needle color from the library demo (#345243).
 */

import { ChartGauge } from "./gauge-shared"

export default function GaugeNoAnimationDemo() {
  return (
    <ChartGauge
      id="chart-gauge-no-animation"
      animate={false}
      nrOfLevels={15}
      percent={0.56}
      needleColor="#5a6169"
      needleBaseColor="#5a6169"
      caption="پانزده سطح بدون انیمیشن عقربه"
    />
  )
}
