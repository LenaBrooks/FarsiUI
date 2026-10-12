"use client"

import * as React from "react"
import { cn } from "cn"

import { useThemeConfig } from "@/components/active-theme"
import { useDesignSystemPreview } from "@/components/design-system-preview"

// Style CSS chunks are owned by DesignSystemPreviewProvider (lazy per picker).

/** Map docs `styleName` (e.g. base-nova) → style root class (style-nova). */
export function getPreviewStyleRootClass(styleName = "base-nova") {
  const match = styleName.match(/^(?:base|radix|aria)-(.+)$/)
  return match ? `style-${match[1]}` : "style-nova"
}

/**
 * Rewrite `/view/{style}/{name}` so the iframe always loads the Header
 * Design System bake (base-glass, base-nili, …), not a stale registry style.
 */
export function resolveDesignSystemViewSrc(
  src: string,
  designSystemStyleName: string
) {
  try {
    const url = new URL(src, "https://farsiui.local")
    const parts = url.pathname.split("/").filter(Boolean)
    if (parts[0] === "view" && parts[1] && parts[2]) {
      parts[1] = designSystemStyleName
      return `/${parts.join("/")}${url.search}`
    }
  } catch {
    // Fall through to the original src.
  }
  return src
}

/**
 * Scopes the live site Primary Color + global Design System to a docs preview.
 * Style root comes from DesignSystemPreviewProvider (Header picker), not from
 * per-preview local state. Keep outside Copy / ComponentSource so copied
 * registry code stays theme-agnostic.
 *
 * Structure must match legacy-themes.css: ancestor `.theme-*` → descendant
 * `.theme-container` (same-node classes do not activate the palette overrides).
 */
export function PreviewThemeScope({
  styleName: _styleName,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  /** @deprecated Ignored — global Design System picker owns the style root. */
  styleName?: string
}) {
  const { activeTheme } = useThemeConfig()
  const { styleRootClass } = useDesignSystemPreview()
  const theme = activeTheme === "default" ? "neutral" : activeTheme
  const atmospheric =
    styleRootClass === "style-glass" ||
    styleRootClass === "style-rose" ||
    styleRootClass === "style-nili" ||
    styleRootClass === "style-khesht"

  return (
    <div
      data-slot="preview-theme"
      className={cn(
        `theme-${theme}`,
        styleRootClass,
        atmospheric && "overflow-hidden rounded-xl"
      )}
    >
      <div
        className={cn(
          "theme-container",
          atmospheric && "bg-transparent",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  )
}

/** Same-origin /view iframe that remounts when Design System or theme changes. */
export function PreviewThemeIframe({
  src,
  className,
  styleName: _styleName,
}: {
  src: string
  className?: string
  /** @deprecated Ignored — global Design System picker owns the style root. */
  styleName?: string
}) {
  const { activeTheme } = useThemeConfig()
  const { styleRootClass, styleName: designSystemStyleName } =
    useDesignSystemPreview()
  const theme = activeTheme === "default" ? "neutral" : activeTheme
  const resolvedSrc = resolveDesignSystemViewSrc(src, designSystemStyleName)
  const hostRef = React.useRef<HTMLDivElement>(null)
  const iframeRef = React.useRef<HTMLIFrameElement>(null)
  const [shouldLoad, setShouldLoad] = React.useState(false)

  React.useEffect(() => {
    const host = hostRef.current
    if (!host || shouldLoad) return

    if (typeof IntersectionObserver === "undefined") {
      setShouldLoad(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { rootMargin: "200px 0px", threshold: 0.01 }
    )
    observer.observe(host)
    return () => observer.disconnect()
  }, [shouldLoad])

  const sync = React.useCallback(() => {
    try {
      const body = iframeRef.current?.contentDocument?.body
      if (!body) return

      Array.from(body.classList)
        .filter(
          (className) =>
            className.startsWith("theme-") || className.startsWith("style-")
        )
        .forEach((className) => {
          body.classList.remove(className)
        })

      body.classList.add(`theme-${theme}`)
      body.classList.add(styleRootClass)
      if (theme.endsWith("-scaled")) {
        body.classList.add("theme-scaled")
      }
    } catch {
      // Ignore cross-origin frames.
    }
  }, [styleRootClass, theme])

  React.useEffect(() => {
    if (!shouldLoad) return
    sync()
  }, [shouldLoad, sync])

  return (
    <div ref={hostRef} className={cn("size-full", className)}>
      {shouldLoad ? (
        <iframe
          key={`${resolvedSrc}:${styleRootClass}:${theme}`}
          ref={iframeRef}
          src={resolvedSrc}
          className="size-full border-0"
          onLoad={sync}
          title="Component preview"
          loading="lazy"
        />
      ) : (
        <div aria-hidden className="size-full animate-pulse bg-muted/40" />
      )}
    </div>
  )
}
