"use client"

/**
 * Highcharts Gauge Inspiration #3 — Thin ring
 * Colors: #d2b4de, #8e44ad
 */

import type { Options } from "highcharts"

import {
  ChartHighchartsGauge,
  faNum,
  faTooltipValue,
  HC_DIAL,
} from "./hc-gauge-shared"

const options: Options = {
  chart: { type: "gauge" },
  pane: {
    borderRadius: "50%",
    background: undefined,
    margin: 20,
  },
  yAxis: {
    labels: { distance: "20%" },
    lineWidth: 1,
    min: 0,
    max: 100,
    offset: 0,
    tickPosition: "outside",
    minorTickPosition: "outside",
    plotBands: [
      {
        from: 0,
        to: 70,
        color: "#b8a8c8",
        outerRadius: "90%",
        innerRadius: "80%",
      },
      {
        from: 70,
        to: 100,
        color: "#8b9dc3",
        outerRadius: "90%",
        innerRadius: "80%",
      },
    ],
  },
  plotOptions: {
    gauge: {
      dial: {
        baseWidth: 6,
        backgroundColor: HC_DIAL,
      },
      pivot: {
        backgroundColor: HC_DIAL,
        radius: 6,
      },
    },
  },
  series: [
    {
      type: "gauge",
      name: "امتیاز",
      data: [45],
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

export default function HcGaugeThinRingDemo() {
  return (
    <ChartHighchartsGauge
      options={options}
      caption="حلقهٔ نازک بنفش (#d2b4de / #8e44ad)"
    />
  )
}
