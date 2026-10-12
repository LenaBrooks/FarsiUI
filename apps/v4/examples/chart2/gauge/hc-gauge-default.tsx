"use client"

/**
 * Highcharts Gauge Inspiration #1 — Default look
 * Colors: #55BF3B, #DDDF0D, #DF5353
 */

import type { Options } from "highcharts"

import {
  Chart2HighchartsGauge,
  faNum,
  faTooltipValue,
} from "./hc-gauge-shared"

const options: Options = {
  chart: { type: "gauge" },
  yAxis: {
    min: 0,
    max: 100,
    plotBands: [
      { from: 0, to: 50, color: "#55BF3B" },
      { from: 50, to: 75, color: "#DDDF0D" },
      { from: 75, to: 100, color: "#DF5353" },
    ],
  },
  series: [
    {
      type: "gauge",
      name: "امتیاز",
      data: [68],
      tooltip: {
        pointFormatter() {
          return `<span style="font-size:0.9em">${this.series.name}</span><br/><b>${faTooltipValue(this.y ?? 0, " از ۱۰۰")}</b>`
        },
      },
      dataLabels: {
        formatter() {
          return faNum(this.y ?? 0)
        },
      },
    },
  ],
}

export default function HcGaugeDefaultDemo() {
  return (
    <Chart2HighchartsGauge
      options={options}
      caption="ظاهر پیش‌فرض — سبز / زرد / قرمز (#55BF3B, #DDDF0D, #DF5353)"
    />
  )
}
