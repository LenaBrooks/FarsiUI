"use client"

import * as React from "react"
import { cn } from "cn"

import { useChartLive } from "@/components/chart-live"
import { chartContainerClassName } from "@/lib/chart-fa"
import { getChartDemoLoader } from "@/lib/chart-demos"

export function ChartDemoPreview({ id }: { id: string }) {
  const live = useChartLive()
  const [Demo, setDemo] = React.useState<React.ComponentType<
    Record<string, unknown>
  > | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false
    const loader = getChartDemoLoader(id)
    if (!loader) {
      setError("دمو یافت نشد")
      return
    }
    setDemo(null)
    setError(null)
    loader()
      .then((mod) => {
        if (!cancelled) setDemo(() => mod.default)
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "خطا در بارگذاری دمو")
        }
      })
    return () => {
      cancelled = true
    }
  }, [id])

  if (error) {
    return (
      <div
        className="flex w-full min-w-0 justify-center font-sans"
        dir="rtl"
        lang="fa"
      >
        <div
          className={cn(
            chartContainerClassName,
            "flex items-center justify-center"
          )}
        >
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        </div>
      </div>
    )
  }

  if (!Demo) {
    return (
      <div
        className="flex w-full min-w-0 justify-center font-sans"
        dir="rtl"
        lang="fa"
      >
        <div
          className={cn(
            chartContainerClassName,
            "animate-pulse rounded-md bg-muted/50"
          )}
          aria-busy="true"
          aria-label="در حال بارگذاری نمودار"
        />
      </div>
    )
  }

  return (
    // Block host (not flex): bare ChartContainer + aspect-video collapses to 0×0 in flex.
    <div className="w-full min-w-0 font-sans" dir="rtl" lang="fa">
      <Demo key={live?.nonce ?? 0} />
    </div>
  )
}
