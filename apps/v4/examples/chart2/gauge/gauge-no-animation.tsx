"use client"

/**
 * Animation disabled — needle color from the library demo (#345243).
 */

import { Chart2Gauge } from "./gauge-shared"

export default function GaugeNoAnimationDemo() {
  return (
    <Chart2Gauge
      id="chart2-gauge-no-animation"
      animate={false}
      nrOfLevels={15}
      percent={0.56}
      needleColor="#5a6169"
      needleBaseColor="#5a6169"
      caption="پانزده سطح بدون انیمیشن عقربه"
    />
  )
}
