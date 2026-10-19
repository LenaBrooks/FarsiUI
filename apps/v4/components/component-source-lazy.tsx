"use client"

import * as React from "react"
import { cn } from "cn"

import {
  getHighlightedComponentSourceResult,
  type HighlightedComponentSource,
} from "@/lib/get-highlighted-component-source"
import { CodeCollapsibleWrapper } from "@/components/code-collapsible-wrapper"
import { CopyButton } from "@/components/copy-button"
import { getIconForLanguageExtension } from "@/components/icons"

const sourceCache = new Map<string, HighlightedComponentSource>()

type LoadError =
  | { reason: "not_found" }
  | { reason: "internal"; message: string }

function cacheKey(input: {
  name?: string
  src?: string
  styleName: string
  maxLines?: number
  language?: string
  title?: string
}) {
  return [
    input.styleName,
    input.name ?? "",
    input.src ?? "",
    input.maxLines ?? "",
    input.language ?? "",
    input.title ?? "",
  ].join("\0")
}

function ComponentCode({
  code,
  highlightedCode,
  language,
  title,
}: {
  code: string
  highlightedCode: string
  language: string
  title: string | undefined
}) {
  return (
    <figure
      data-rehype-pretty-code-figure=""
      className="[&>pre]:max-h-96 [&>pre]:overflow-auto [&>pre]:scrollbar-soft"
    >
      {title ? (
        <figcaption
          data-rehype-pretty-code-title=""
          className="flex items-center gap-2 text-code-foreground [&_svg]:size-4 [&_svg]:text-code-foreground [&_svg]:opacity-70"
          data-language={language}
        >
          {getIconForLanguageExtension(language)}
          {title}
        </figcaption>
      ) : null}
      <CopyButton value={code} />
      <div
        data-not-typeset
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      />
    </figure>
  )
}

function SourceError({ error }: { error: LoadError }) {
  if (error.reason === "not_found") {
    return (
      <p className="p-4 text-sm text-muted-foreground">کد یافت نشد.</p>
    )
  }

  return (
    <p className="p-4 text-sm text-destructive" role="alert">
      خطای داخلی هنگام بارگذاری کد
      {error.message ? `: ${error.message}` : "."}
    </p>
  )
}

function SourceSkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-busy
      className={cn("h-40 animate-pulse rounded-none bg-muted/40", className)}
    />
  )
}

export function ComponentSourceLazy({
  name,
  src,
  title,
  language,
  collapsible = true,
  className,
  styleName = "base-nova",
  maxLines,
}: {
  name?: string
  src?: string
  title?: string
  language?: string
  collapsible?: boolean
  className?: string
  styleName?: string
  maxLines?: number
}) {
  const key = cacheKey({ name, src, styleName, maxLines, language, title })
  const [open, setOpen] = React.useState(!collapsible)
  // Load immediately so closed CodeCollapsibleWrapper can peek real code
  // (same look as server ComponentSource), not an empty placeholder box.
  const [shouldLoad, setShouldLoad] = React.useState(true)
  const [data, setData] = React.useState<HighlightedComponentSource | null>(
    () => sourceCache.get(key) ?? null
  )
  const [error, setError] = React.useState<LoadError | null>(null)

  React.useEffect(() => {
    setData(sourceCache.get(key) ?? null)
    setError(null)
  }, [key])

  React.useEffect(() => {
    if (!shouldLoad) return
    if (!name && !src) {
      setError({ reason: "not_found" })
      return
    }

    const cached = sourceCache.get(key)
    if (cached) {
      setData(cached)
      setError(null)
      return
    }

    let cancelled = false
    setError(null)

    getHighlightedComponentSourceResult({
      name,
      src,
      styleName,
      maxLines,
      language,
      title,
    })
      .then((result) => {
        if (cancelled) return
        if (result.ok) {
          sourceCache.set(key, result.data)
          setData(result.data)
          setError(null)
          return
        }
        setData(null)
        if (result.reason === "not_found") {
          setError({ reason: "not_found" })
          return
        }
        setError({ reason: "internal", message: result.message })
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setData(null)
        setError({
          reason: "internal",
          message:
            err instanceof Error
              ? err.message
              : "Failed to load component source",
        })
      })

    return () => {
      cancelled = true
    }
  }, [shouldLoad, key, name, src, styleName, maxLines, language, title])

  const body = (() => {
    if (error) {
      return <SourceError error={error} />
    }
    if (!data) {
      return <SourceSkeleton />
    }
    return (
      <ComponentCode
        code={data.code}
        highlightedCode={data.highlightedCode}
        language={data.language}
        title={title}
      />
    )
  })()

  if (!collapsible) {
    return <div className={cn("relative", className)}>{body}</div>
  }

  return (
    <CodeCollapsibleWrapper
      className={className}
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) {
          setShouldLoad(true)
        }
      }}
    >
      {body}
    </CodeCollapsibleWrapper>
  )
}
