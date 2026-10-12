"use client"

/**
 * Highcharts Gauge Inspiration #4 — Semicircle
 * Colors: #f0b429, #e07b39, #c0392b
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
    startAngle: -90,
    endAngle: 90,
    borderRadius: "50%",
  },
  yAxis: {
    min: 0,
    max: 200,
    labels: { distance: 20 },
    plotBands: [
      { from: 0, to: 120, color: "#f0b429" },
      { from: 120, to: 160, color: "#e07b39" },
      { from: 160, to: 200, color: "#c0392b" },
    ],
  },
  series: [
    {
      type: "gauge",
      name: "سرعت",
      data: [110],
      tooltip: {
        pointFormatter() {
          return `<span style="font-size:0.9em">${this.series.name}</span><br/><b>${faTooltipValue(this.y ?? 0, " کیلومتر بر ساعت")}</b>`
        },
      },
      dataLabels: {
        formatter() {
          return `${faNum(this.y ?? 0)} کیلومتر بر ساعت`
        },
      },
      dial: {
        radius: "80%",
        baseWidth: "12%",
        topWidth: "1%",
        baseLength: "15%",
        rearLength: "0%",
        borderRadius: "4%",
        backgroundColor: "#c0392b",
        borderColor: "#c0392b",
      },
      pivot: {
        radius: "5%",
        backgroundColor: "#c0392b",
        borderWidth: 0,
      },
    },
  ],
}

export default function HcGaugeSemicircleDemo() {
  return (
    <Chart2HighchartsGauge
      options={options}
      caption="نیم‌دایره سرعت‌سنج — کهربایی تا قرمز (#f0b429 → #c0392b)"
    />
  )
}
