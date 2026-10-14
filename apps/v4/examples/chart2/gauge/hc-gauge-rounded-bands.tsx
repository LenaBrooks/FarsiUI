"use client"

/**
 * Highcharts Gauge Inspiration #10 — Rounded bands
 * Colors: #a9cce3, #5dade2, #8e44ad
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
    startAngle: -150,
    endAngle: 150,
    background: undefined,
    borderRadius: "25%",
  },
  yAxis: {
    min: 0,
    max: 100,
    plotBands: [
      {
        from: 0,
        to: 50,
        color: "#a8c4d8",
        borderWidth: 1,
        borderColor: "var(--background)",
        borderRadius: { radius: 4, scope: "individual", where: "all" },
      },
      {
        from: 50,
        to: 75,
        color: "#6ea1c7",
        borderWidth: 1,
        borderColor: "var(--background)",
        borderRadius: { radius: 4, scope: "individual", where: "all" },
      },
      {
        from: 75,
        to: 100,
        color: "#8b9dc3",
        borderWidth: 1,
        borderColor: "var(--background)",
        borderRadius: { radius: 4, scope: "individual", where: "all" },
      },
    ],
  },
  series: [
    {
      type: "gauge",
      name: "مقدار",
      data: [55],
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

export default function HcGaugeRoundedBandsDemo() {
  return (
    <Chart2HighchartsGauge
      options={options}
      caption="نوارهای گرد جدا — آبی روشن تا بنفش (#a9cce3 → #8e44ad)"
    />
  )
}
