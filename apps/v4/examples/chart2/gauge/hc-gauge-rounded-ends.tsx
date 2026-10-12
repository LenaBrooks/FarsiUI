"use client"

/**
 * Highcharts Gauge Inspiration #2 — Rounded ends
 * Colors: #85c1e9, #2980b9, #1a5276
 */

import type { Options } from "highcharts"

import {
  Chart2HighchartsGauge,
  faNum,
  faTooltipValue,
} from "./hc-gauge-shared"

const options: Options = {
  chart: { type: "gauge" },
  pane: {
    innerSize: "75%",
    borderRadius: "50%",
  },
  yAxis: {
    min: 0,
    max: 100,
    gridLineWidth: 1,
    gridLineColor: "var(--background)",
    tickWidth: 0,
    minorTickWidth: 0,
    plotBands: [
      { from: 0, to: 60, color: "#85c1e9" },
      { from: 60, to: 80, color: "#2980b9" },
      { from: 80, to: 100, color: "#1a5276" },
    ],
  },
  series: [
    {
      type: "gauge",
      name: "امتیاز",
      data: [72],
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
      dial: {
        radius: "80%",
        backgroundColor: "#2980b9",
        baseWidth: "5%",
        topWidth: "1%",
        rearLength: "0%",
        borderRadius: "50%",
      },
      pivot: {
        radius: "5%",
        backgroundColor: "#2980b9",
        borderWidth: 0,
      },
    },
  ],
}

export default function HcGaugeRoundedEndsDemo() {
  return (
    <Chart2HighchartsGauge
      options={options}
      caption="انتهای گرد — آبی روشن تا تیره (#85c1e9 → #1a5276)"
    />
  )
}
