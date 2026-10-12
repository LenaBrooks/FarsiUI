"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { usePersianMockData } from "@/components/chart2-live"
import {
  chart2ContainerClassName,
  chart2MockConfig,
  formatChart2Number,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/registry/new-york-v4/ui/chart"

/**
 * Scroll-scrubbed animation proxy: remounts on scroll progress so bars
 * re-animate as the user scrolls.
 */
export default function BarAnimateByScrollDemo() {
  const data = usePersianMockData(6, 10)
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const finishAt = Math.max(docHeight / 2, 1)
      setProgress(Math.min(Math.max(scrollTop / finishAt, 0), 1))
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <ChartContainer
      config={chart2MockConfig}
      className={chart2ContainerClassName}
      key={Math.round(progress * 20)}
    >
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ top: 5, right: 8, left: 0, bottom: 5 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis dataKey="label" reversed tickMargin={8} />
        <YAxis
          orientation="right"
          width={52}
          tickMargin={12}
          tickFormatter={formatChart2Number}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="y" fill="var(--color-y)" activeBar={{ radius: [8, 8, 0, 0] }} />
        <Bar dataKey="x" fill="var(--color-x)" activeBar={{ radius: [8, 8, 0, 0] }} />
      </BarChart>
    </ChartContainer>
  )
}
