"use client"

/**
 * Highcharts Gauge Inspiration #1 — Default look
 * Soft traffic bands (chart2-aligned)
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
      { from: 0, to: 50, color: "#6cb87a" },
      { from: 50, to: 75, color: "#d4b45a" },
      { from: 75, to: 100, color: "#d96b5c" },
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
      caption="ظاهر پیش‌فرض — سبز / طلایی / قرمز نرم"
    />
  )
}
