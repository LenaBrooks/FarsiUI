"use client"

import * as React from "react"
import { cn } from "cn"

import { useChart2Live } from "@/components/chart2-live"
import { chart2ContainerClassName } from "@/lib/chart2-fa"
import { getChart2DemoLoader } from "@/lib/chart2-demos"

export function Chart2DemoPreview({ id }: { id: string }) {
  const live = useChart2Live()
  const [Demo, setDemo] = React.useState<React.ComponentType<
    Record<string, unknown>
  > | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false
    const loader = getChart2DemoLoader(id)
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
            chart2ContainerClassName,
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
            chart2ContainerClassName,
            "animate-pulse rounded-md bg-muted/50"
          )}
          aria-busy="true"
          aria-label="در حال بارگذاری نمودار"
        />
      </div>
    )
  }

  return (
    <div
      className="flex w-full min-w-0 justify-center font-sans"
      dir="rtl"
      lang="fa"
    >
      <Demo key={live?.nonce ?? 0} />
    </div>
  )
}
