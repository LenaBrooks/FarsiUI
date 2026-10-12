"use client"

/**
 * Highcharts Gauge Inspiration #6 — Gauge + solidgauge combo
 * Stops: #1abc9c, #2980b9, #8e44ad
 * Needle and solid fill share the same value so they align.
 */

import type { Options } from "highcharts"

import {
  Chart2HighchartsGauge,
  faNum,
  faTooltipValue,
  HC_DIAL,
} from "./hc-gauge-shared"

const VALUE = 74

const options: Options = {
  chart: {},
  pane: {
    // No 50% borderRadius — rounded solid fills visually lag behind the dial.
    borderRadius: 0,
    background: [
      {
        outerRadius: "100%",
        innerRadius: "60%",
        backgroundColor:
          "color-mix(in oklab, var(--muted-foreground) 20%, transparent)",
        borderWidth: 0,
      },
    ],
  },
  yAxis: {
    min: 0,
    max: 100,
    tickPositions: [0, 20, 40, 60, 80, 100],
    // Keep demo palette, but stop colors apply as the series color at VALUE.
    stops: [
      [0.3, "#1abc9c"],
      [0.6, "#2980b9"],
      [0.9, "#8e44ad"],
    ],
  },
  plotOptions: {
    solidgauge: {
      rounded: false,
      borderRadius: 0,
      radius: "100%",
      innerRadius: "60%",
    },
    gauge: {
      dial: {
        // Tip sits mid-band so it reads as the end of the solid fill.
        radius: "80%",
        baseWidth: 3,
        topWidth: 1,
        rearLength: 0,
        borderRadius: 0,
        backgroundColor: HC_DIAL,
        borderColor: HC_DIAL,
      },
      pivot: {
        radius: 5,
        backgroundColor: HC_DIAL,
        borderColor: HC_DIAL,
      },
    },
  },
  series: [
    {
      type: "solidgauge",
      name: "مقدار",
      data: [{ y: VALUE, color: "#2980b9" }],
      dataLabels: { enabled: false },
      enableMouseTracking: false,
      rounded: false,
      radius: "100%",
      innerRadius: "60%",
    },
    {
      type: "gauge",
      name: "مقدار",
      data: [VALUE],
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

export default function HcGaugeComboDemo() {
  return (
    <Chart2HighchartsGauge
      options={options}
      caption="ترکیب solidgauge + عقربه روی یک مقدار — فیروزه / آبی / بنفش"
    />
  )
}
