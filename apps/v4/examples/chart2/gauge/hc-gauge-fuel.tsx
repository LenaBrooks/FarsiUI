"use client"

/**
 * Highcharts Gauge Inspiration #7 — Fuel level solidgauge
 * Soft fuel stops (rose → gold → green)
 */

import type { Options } from "highcharts"

import {
  Chart2HighchartsGauge,
  faNum,
  faTooltipValue,
} from "./hc-gauge-shared"

const options: Options = {
  chart: { type: "solidgauge" },
  pane: {
    startAngle: -90,
    endAngle: 90,
    innerSize: "60%",
    background: [
      {
        outerRadius: "100%",
        innerRadius: "60%",
        backgroundColor:
          "color-mix(in oklab, var(--muted-foreground) 22%, transparent)",
        borderWidth: 0,
      },
    ],
  },
  tooltip: {
    pointFormatter() {
      return `<b>${faTooltipValue(this.y ?? 0, "٪")}</b>`
    },
  },
  yAxis: {
    min: 0,
    max: 100,
    stops: [
      [0.1, "#d96b5c"],
      [0.5, "#d4b45a"],
      [0.9, "#6cb87a"],
    ],
    tickAmount: 2,
    title: { text: undefined },
  },
  plotOptions: {
    solidgauge: {
      dataLabels: {
        formatter() {
          return `${faNum(this.y ?? 0)}٪`
        },
        style: {
          fontSize: "1.4em",
          fontWeight: "bold",
        },
        y: -8,
      },
    },
  },
  series: [{ type: "solidgauge", name: "سوخت", data: [64] }],
}

export default function HcGaugeFuelDemo() {
  return (
    <Chart2HighchartsGauge
      options={options}
      caption="نیم‌دایره سوخت — قرمز / طلایی / سبز نرم"
    />
  )
}
