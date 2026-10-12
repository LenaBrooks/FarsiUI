"use client"

import * as React from "react"
import { cn } from "cn"

import {
  getHighlightedComponentSource,
  type HighlightedComponentSource,
} from "@/lib/get-highlighted-component-source"
import { CopyButton } from "@/components/copy-button"

const sourceCache = new Map<string, HighlightedComponentSource>()

function cacheKey(name: string, styleName: string) {
  return `${styleName}:${name}`
}

export function ComponentSourceLazy({
  name,
  styleName = "base-nova",
  className,
}: {
  name: string
  styleName?: string
  className?: string
}) {
  const key = cacheKey(name, styleName)
  const [data, setData] = React.useState<HighlightedComponentSource | null>(
    () => sourceCache.get(key) ?? null
  )
  const [error, setError] = React.useState(false)

  React.useEffect(() => {
    const cached = sourceCache.get(key)
    if (cached) {
      setData(cached)
      return
    }

    let cancelled = false
    setError(false)

    getHighlightedComponentSource(name, styleName)
      .then((result) => {
        if (cancelled) return
        if (!result) {
          setError(true)
          return
        }
        sourceCache.set(key, result)
        setData(result)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })

    return () => {
      cancelled = true
    }
  }, [key, name, styleName])

  if (error) {
    return (
      <p className="p-4 text-sm text-muted-foreground">
        نتوانستیم کد را بارگذاری کنیم.
      </p>
    )
  }

  if (!data) {
    return (
      <div
        aria-busy
        className={cn("h-40 animate-pulse rounded-none bg-muted/40", className)}
      />
    )
  }

  return (
    <div className={cn("relative", className)}>
      <figure data-rehype-pretty-code-figure="" className="[&>pre]:max-h-96">
        <CopyButton value={data.code} />
        <div
          data-not-typeset
          dangerouslySetInnerHTML={{ __html: data.highlightedCode }}
        />
      </figure>
    </div>
  )
}
