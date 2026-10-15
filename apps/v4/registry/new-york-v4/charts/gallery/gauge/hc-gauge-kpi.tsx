"use client"

/**
 * Highcharts Gauge Inspiration #9 — Multi-ring KPI
 * Colors: Highcharts defaults #2caffe, #544fc5, #00e272
 */

import type { Options } from "highcharts"

import {
  ChartHighchartsGauge,
  faTooltipValue,
  HC_COLOR_0,
  HC_COLOR_1,
  HC_COLOR_2,
} from "./hc-gauge-shared"

const options = {
  chart: { type: "solidgauge" },
  tooltip: {
    backgroundColor: "var(--popover)",
    borderWidth: 0,
    shadow: false,
    style: { color: "var(--popover-foreground)" },
    pointFormatter() {
      return `<span style="color:${this.color};font-weight:bold">${this.series.name}: ${faTooltipValue(this.y ?? 0, "٪")}</span>`
    },
  },
  pane: {
    startAngle: 0,
    endAngle: 360,
    margin: 0,
    background: [
      {
        outerRadius: "100%",
        innerRadius: "78%",
        backgroundColor: "rgba(44, 175, 254, 0.25)",
        borderWidth: 0,
      },
      {
        outerRadius: "77%",
        innerRadius: "56%",
        backgroundColor: "rgba(84, 79, 197, 0.25)",
        borderWidth: 0,
      },
      {
        outerRadius: "55%",
        innerRadius: "34%",
        backgroundColor: "rgba(0, 226, 114, 0.25)",
        borderWidth: 0,
      },
    ],
  },
  yAxis: { min: 0, max: 100, lineWidth: 0, tickPositions: [] },
  plotOptions: {
    solidgauge: {
      dataLabels: { enabled: false },
      linecap: "round",
      stickyTracking: false,
      rounded: true,
    },
  },
  series: [
    {
      type: "solidgauge",
      name: "تبدیل",
      radius: "100%",
      innerRadius: "78%",
      data: [{ color: HC_COLOR_0, y: 82 }],
    },
    {
      type: "solidgauge",
      name: "تعامل",
      radius: "77%",
      innerRadius: "56%",
      data: [{ color: HC_COLOR_1, y: 59 }],
    },
    {
      type: "solidgauge",
      name: "نگهداری",
      radius: "55%",
      innerRadius: "34%",
      data: [{ color: HC_COLOR_2, y: 71 }],
    },
  ],
} satisfies Options

export default function HcGaugeKpiDemo() {
  return (
    <ChartHighchartsGauge
      options={options}
      caption="سه حلقهٔ KPI — #2caffe / #544fc5 / #00e272"
      height={320}
    />
  )
}
