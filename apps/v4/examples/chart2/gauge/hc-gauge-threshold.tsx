"use client"

/**
 * Highcharts Gauge Inspiration #11 — Threshold solidgauge
 * Stops: #DF5353 / #55BF3B around 0
 */

import type { Options } from "highcharts"

import {
  Chart2HighchartsGauge,
  faNum,
  faTooltipValue,
  HC_NEUTRAL,
} from "./hc-gauge-shared"

const options: Options = {
  chart: { type: "solidgauge" },
  pane: {
    borderRadius: 0,
    innerSize: "80%",
    background: [
      {
        outerRadius: "100%",
        innerRadius: "80%",
        backgroundColor:
          "color-mix(in oklab, var(--muted-foreground) 20%, transparent)",
        borderWidth: 0,
      },
    ],
  },
  tooltip: {
    pointFormatter() {
      return `<span style="font-size:0.9em">${this.series.name}</span><br/><b>${faTooltipValue(this.y ?? 0, "٪")}</b>`
    },
  },
  yAxis: {
    min: -4,
    max: 4,
    tickAmount: 2,
    stops: [
      [0.4999, "#DF5353"],
      [0.5, "#55BF3B"],
    ],
    title: { text: undefined },
    plotLines: [
      {
        value: 0,
        color: HC_NEUTRAL,
        width: 2,
        zIndex: 5,
      },
    ],
  },
  series: [
    {
      type: "solidgauge",
      name: "سود/زیان",
      data: [-1.2],
      threshold: 0,
      dataLabels: {
        formatter() {
          return faNum(this.y ?? 0)
        },
        style: {
          fontSize: "1.2em",
          fontWeight: "bold",
        },
      },
    },
  ],
}

export default function HcGaugeThresholdDemo() {
  return (
    <Chart2HighchartsGauge
      options={options}
      caption="آستانهٔ صفر — قرمز زیر صفر / سبز بالای صفر"
    />
  )
}
