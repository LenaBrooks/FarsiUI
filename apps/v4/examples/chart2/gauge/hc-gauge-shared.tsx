"use client"

import { useEffect, useMemo, useState, type ReactNode } from "react"
import type { Options } from "highcharts"
import Highcharts from "highcharts/esm/highcharts.js"
import "highcharts/esm/highcharts-more.js"
import "highcharts/esm/modules/solid-gauge.js"
import HighchartsReact from "highcharts-react-official"

import { useChart2ToolbarStart } from "@/components/chart2-live"
import { toPersianDigits } from "@/lib/chart2-fa"

/** Highcharts default series colors (v11+). */
/** Softened Highcharts defaults — closer to chart2 intensity on light. */
export const HC_COLOR_0 = "#5aa8d4"
export const HC_COLOR_1 = "#6b66b8"
export const HC_COLOR_2 = "#5cb88a"

/**
 * Always-visible needle on light/dark.
 * Highcharts defaults use undefined CSS vars (`--highcharts-neutral-color-100`) here.
 * Prefer theme foreground so dials stay readable in both modes.
 */
export const HC_DIAL = "var(--foreground)"
export const HC_NEUTRAL = "var(--foreground)"

export function faNum(value: number | string) {
  return toPersianDigits(String(value))
}

/** Fully Persian tooltip value, e.g. faTooltipValue(75, " از ۱۰۰") → "۷۵ از ۱۰۰" */
export function faTooltipValue(value: number | string, suffix = "") {
  return `${faNum(value)}${suffix}`
}

type Chart2HighchartsGaugeProps = {
  options: Options
  caption?: ReactNode
  height?: number
}

function deepMergeOptions(base: Options, extra: Options): Options {
  return Highcharts.merge(base, extra)
}

export function Chart2HighchartsGauge({
  options,
  caption,
  height = 280,
}: Chart2HighchartsGaugeProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useChart2ToolbarStart(
    () =>
      caption ? (
        <p className="min-w-0 max-w-full text-start text-[12px] leading-snug text-muted-foreground">
          {caption}
        </p>
      ) : null,
    [caption]
  )

  const merged = useMemo<Options>(() => {
    const defaults: Options = {
      credits: { enabled: false },
      exporting: { enabled: false },
      accessibility: { enabled: false },
      // Chart chrome titles live in the page header / caption — not inside the SVG.
      title: { text: undefined },
      subtitle: { text: undefined },
      chart: {
        backgroundColor: "transparent",
        animation: false,
        height,
        style: { fontFamily: "inherit" },
      },
      tooltip: {
        style: { fontFamily: "inherit" },
      },
      yAxis: {
        labels: {
          style: {
            color: "var(--foreground)",
            fontFamily: "inherit",
          },
        },
        title: {
          style: {
            color: "var(--muted-foreground)",
            fontFamily: "inherit",
          },
        },
        lineColor: "var(--border)",
        tickColor: "var(--border)",
        minorTickColor: "var(--border)",
      },
      plotOptions: {
        gauge: {
          dial: {
            backgroundColor: HC_DIAL,
            borderColor: HC_DIAL,
          },
          pivot: {
            backgroundColor: HC_DIAL,
            borderColor: HC_DIAL,
          },
          dataLabels: {
            borderWidth: 0,
            backgroundColor: "transparent",
            style: {
              color: "var(--foreground)",
              fontFamily: "inherit",
              fontWeight: "600",
              textOutline: "none",
            },
          },
        },
        solidgauge: {
          dataLabels: {
            borderWidth: 0,
            backgroundColor: "transparent",
            style: {
              color: "var(--foreground)",
              fontFamily: "inherit",
              fontWeight: "600",
              textOutline: "none",
            },
          },
        },
      },
    }

    return deepMergeOptions(defaults, {
      ...options,
      chart: {
        ...options.chart,
        backgroundColor: "transparent",
        animation: false,
        height,
        style: {
          fontFamily: "inherit",
          ...(options.chart?.style ?? {}),
        },
      },
      // Always strip in-chart titles even if a demo still sets one.
      title: { text: undefined },
      subtitle: { text: undefined },
    })
  }, [height, options])

  if (!mounted) {
    return <div className="w-full max-w-[420px]" style={{ height }} />
  }

  return (
    <div className="w-full max-w-[420px] font-sans" dir="ltr">
      <HighchartsReact highcharts={Highcharts} options={merged} />
    </div>
  )
}
