"use client"

/**
 * Highcharts Gauge Inspiration #12 — Custom dial (dot)
 * Accent: Highcharts color-0 (#2caffe)
 */

import type { Options } from "highcharts"

import {
  Chart2HighchartsGauge,
  faNum,
  faTooltipValue,
  HC_COLOR_0,
} from "./hc-gauge-shared"

const options: Options = {
  chart: { type: "gauge" },
  pane: {
    startAngle: -120,
    endAngle: 120,
    innerSize: 160,
    borderRadius: "50%",
    size: 180,
    background: [
      {
        outerRadius: "100%",
        innerRadius: "80%",
        backgroundColor:
          "color-mix(in oklab, var(--muted-foreground) 18%, transparent)",
        borderWidth: 0,
      },
    ],
  },
  yAxis: {
    min: 0,
    max: 100,
    tickWidth: 0,
    minorTickWidth: 0,
    labels: {
      style: { color: "var(--foreground)", fontWeight: "bold" },
    },
  },
  series: [
    {
      type: "solidgauge",
      data: [75],
      enableMouseTracking: false,
      dataLabels: { enabled: false },
      color: HC_COLOR_0,
    },
    {
      type: "gauge",
      name: "مقدار",
      data: [75],
      tooltip: {
        pointFormatter() {
          return `<span style="font-size:0.9em">${this.series.name}</span><br/><b>${faTooltipValue(this.y ?? 0, " از ۱۰۰")}</b>`
        },
      },
      dial: {
        path: [
          ["M", 78, 0],
          ["a", 6, 6, 0, 1, 1, 12, 12],
          ["a", 6, 6, 0, 1, 1, -12, -12],
        ],
        backgroundColor: "var(--background)",
        borderColor: HC_COLOR_0,
        borderWidth: 5,
        radius: "100%",
      },
      pivot: { radius: 0 },
      dataLabels: {
        verticalAlign: "middle",
        y: 0,
        formatter() {
          return faNum(this.y ?? 0)
        },
      },
    },
  ],
}

export default function HcGaugeCustomDialDemo() {
  return (
    <Chart2HighchartsGauge
      options={options}
      caption="نقطه به‌جای عقربه — رنگ پیش‌فرض Highcharts (#2caffe)"
    />
  )
}
