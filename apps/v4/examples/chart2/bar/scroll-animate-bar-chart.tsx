"use client"

import * as React from "react"
import { startTransition } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { usePersianMockData } from "@/components/chart2-live"
import {
  chart2BarContainerClassName,
  chart2BarMockConfig,
  formatChart2Number,
} from "@/lib/chart2-fa"
import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/registry/new-york-v4/ui/chart"

/**
 * Scroll-scrubbed animation: remounts on scroll progress so bars re-animate.
 * Uses an inner scroller so the effect works on short view pages.
 */
export default function BarAnimateByScrollDemo() {
  const data = usePersianMockData(6, 10)
  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    const el = scrollerRef.current
    if (!el) return

    const handleScroll = () => {
      const max = Math.max(el.scrollHeight - el.clientHeight, 1)
      const next = Math.min(Math.max(el.scrollTop / max, 0), 1)
      startTransition(() => setProgress(next))
    }

    handleScroll()
    el.addEventListener("scroll", handleScroll, { passive: true })
    return () => el.removeEventListener("scroll", handleScroll)
  }, [])

  const step = Math.round(progress * 20)

  return (
    <div className="flex w-full max-w-[700px] flex-col gap-2">
      <p className="text-center text-xs text-muted-foreground">
        داخل قاب زیر اسکرول کنید تا میله‌ها دوباره انیمیت شوند
      </p>
      <div
        ref={scrollerRef}
        className="h-[min(52vh,420px)] w-full overflow-y-auto overscroll-contain rounded-lg border border-border/60 bg-background"
      >
        <div className="sticky top-0 z-10 border-b border-border/40 bg-background/95 px-3 pt-3 pb-2 backdrop-blur-sm">
          <ChartContainer
            config={chart2BarMockConfig}
            className={cn(chart2BarContainerClassName, "max-w-none")}
            key={step}
          >
            <BarChart
              accessibilityLayer
              data={data}
              margin={{ top: 5, right: 8, left: 0, bottom: 5 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="label" reversed tickMargin={8} />
              <YAxis
                orientation="right"
                width={52}
                tickMargin={12}
                tickFormatter={formatChart2Number}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="y"
                fill="var(--color-y)"
                activeBar={{ radius: [8, 8, 0, 0] }}
              />
              <Bar
                dataKey="x"
                fill="var(--color-x)"
                activeBar={{ radius: [8, 8, 0, 0] }}
              />
            </BarChart>
          </ChartContainer>
          <p className="pb-1 text-center font-mono text-[10px] text-muted-foreground tabular-nums">
            {Math.round(progress * 100)}٪
          </p>
        </div>
        {/* Tall track so the inner scroller actually moves */}
        <div className="h-[140vh]" aria-hidden />
      </div>
    </div>
  )
}
