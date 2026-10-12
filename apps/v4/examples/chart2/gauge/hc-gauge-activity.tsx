"use client"

/**
 * Highcharts Gauge Inspiration #8 — Activity ring
 * Gradient: #e91e8c → #ff6b6b (works on light + dark)
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
    startAngle: 0,
    endAngle: 360,
    innerSize: "75%",
    margin: 0,
    background: [
      {
        outerRadius: "100%",
        innerRadius: "75%",
        // Readable track in both themes (not Highcharts CSS vars).
        backgroundColor:
          "color-mix(in oklab, var(--foreground) 16%, transparent)",
        borderWidth: 0,
      },
    ],
  },
  tooltip: {
    pointFormatter() {
      return `<span style="font-size:0.9em">${this.series.name}</span><br/><b>${faTooltipValue(this.y ?? 0, "٪")}</b>`
    },
  },
  yAxis: { min: 0, max: 100, lineWidth: 0, tickPositions: [] },
  series: [
    {
      type: "solidgauge",
      name: "قدم",
      data: [
        {
          color: {
            linearGradient: { x1: 0, y1: 0, x2: 1, y2: 0 },
            stops: [
              [0, "#e91e8c"],
              [1, "#ff6b6b"],
            ],
          },
          y: 79,
        },
      ],
      dataLabels: {
        formatter() {
          return `${faNum(this.y ?? 0)}٪<br/><span style="font-size:0.8em;color:var(--muted-foreground)">قدم</span>`
        },
        useHTML: true,
      },
      rounded: true,
    },
  ],
}

export default function HcGaugeActivityDemo() {
  return (
    <Chart2HighchartsGauge
      options={options}
      caption="حلقهٔ فعالیت — گرادیان صورتی به قرمز (#e91e8c → #ff6b6b)"
    />
  )
}
