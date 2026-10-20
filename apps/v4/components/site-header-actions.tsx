"use client"

import * as React from "react"
import { lazy, Suspense } from "react"
import { SearchIcon } from "lucide-react"

import { type ColorPalette } from "@/lib/colors"
import { siteConfig } from "@/lib/config"
import { type source } from "@/lib/source"
import { Button } from "@/registry/new-york-v4/ui/button"

const CommandMenu = lazy(async () => {
  const mod = await import("@/components/command-menu")
  return { default: mod.CommandMenu }
})

function prefetchCommandMenu() {
  void import("@/components/command-menu")
}

function isEditableSearchTarget(target: EventTarget | null) {
  return (
    (target instanceof HTMLElement && target.isContentEditable) ||
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  )
}

function SearchTriggerButton({
  onActivate,
  onPrefetch,
}: {
  onActivate: () => void
  onPrefetch: () => void
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="size-8 shrink-0 cursor-pointer"
      onClick={onActivate}
      onPointerEnter={onPrefetch}
      onFocus={onPrefetch}
      aria-label="جستجو در مستندات"
    >
      <SearchIcon className="size-4.5" />
      <span className="sr-only">جستجو در مستندات</span>
    </Button>
  )
}

/** Search only — design switcher lives centered in the site header. */
export function SiteHeaderActions({
  tree,
  colors,
  navItems = siteConfig.navItems,
}: {
  tree: typeof source.pageTree
  colors: ColorPalette[]
  navItems?: { href: string; label: string }[]
}) {
  const [ready, setReady] = React.useState(false)
  const [defaultOpen, setDefaultOpen] = React.useState(false)

  const openSearch = React.useCallback(() => {
    setDefaultOpen(true)
    setReady(true)
  }, [])

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (isEditableSearchTarget(e.target)) return
        e.preventDefault()
        openSearch()
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [openSearch])

  if (!ready) {
    return (
      <SearchTriggerButton onActivate={openSearch} onPrefetch={prefetchCommandMenu} />
    )
  }

  return (
    <Suspense
      fallback={
        <SearchTriggerButton onActivate={openSearch} onPrefetch={prefetchCommandMenu} />
      }
    >
      <CommandMenu
        tree={tree}
        colors={colors}
        navItems={navItems}
        defaultOpen={defaultOpen}
      />
    </Suspense>
  )
}
