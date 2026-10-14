"use client"

/**
 * Highcharts Gauge Inspiration #5 — Custom pivot
 * Colors: #76d7c4, #148f77
 */

import type { Options } from "highcharts"

import {
  Chart2HighchartsGauge,
  faNum,
  faTooltipValue,
} from "./hc-gauge-shared"

const TEAL = "#4a9e88"
const TEAL_LIGHT = "#7eb8a0"

const options: Options = {
  chart: { type: "gauge" },
  pane: {
    startAngle: -150,
    endAngle: 150,
    innerSize: "70%",
    borderRadius: 0,
  },
  yAxis: {
    min: 0,
    max: 100,
    tickWidth: 0,
    minorTickWidth: 0,
    plotBands: [
      { from: 0, to: 60, color: TEAL_LIGHT },
      { from: 60, to: 100, color: TEAL },
    ],
  },
  plotOptions: {
    gauge: {
      dataLabels: {
        verticalAlign: "middle",
        y: 0,
        zIndex: 3,
        style: {
          color: TEAL,
          textOutline: "none",
        },
        formatter() {
          return faNum(this.y ?? 0)
        },
      },
      dial: {
        radius: "60%",
        backgroundColor: TEAL,
        borderColor: TEAL,
        baseLength: "70%",
        baseWidth: "60%",
        borderRadius: 0,
        topWidth: 0,
      },
      pivot: {
        radius: "50%",
        borderWidth: 5,
        borderColor: TEAL,
        backgroundColor: "var(--background)",
      },
    },
  },
  series: [
    {
      type: "gauge",
      name: "امتیاز",
      data: [78],
      tooltip: {
        pointFormatter() {
          return `<span style="font-size:0.9em">${this.series.name}</span><br/><b>${faTooltipValue(this.y ?? 0, " از ۱۰۰")}</b>`
        },
      },
    },
  ],
}

export default function HcGaugeCustomPivotDemo() {
  return (
    <Chart2HighchartsGauge
      options={options}
      caption="محور توخالی بزرگ — فیروزه‌ای (#76d7c4 / #148f77)"
    />
  )
}
