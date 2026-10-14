"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { MenuIcon } from "lucide-react"
import { cn } from "cn"

import {
  chart2Categories,
  getChart2Examples,
  isChart2Featured,
  type Chart2CategoryId,
} from "@/lib/chart2-catalog"
import { PrefetchLink } from "@/components/prefetch-link"
import {
  matchesNavQuery,
  normalizeNavSearch,
  SidebarNavSearch,
} from "@/components/sidebar-nav-search"
import {
  SIDEBAR_COLLAPSIBLE_CONTENT_CLASS,
  SIDEBAR_EMPTY_CLASS,
  SIDEBAR_GROUP_TRIGGER_CLASS,
  SIDEBAR_ITEM_ACTIVE,
  SIDEBAR_NESTED_ITEM_CLASS,
  SIDEBAR_NESTED_LABEL_CLASS,
  SIDEBAR_NESTED_RAIL_CLASS,
  SIDEBAR_SEARCH_INPUT_CLASS,
  SidebarNavBullet,
  SidebarNavChevron,
  sidebarItemStateClass,
} from "@/components/sidebar-nav-ui"
import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/new-york-v4/ui/collapsible"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/registry/new-york-v4/ui/sheet"

const SIDEBAR_EN_CLASS =
  "max-w-[42%] shrink-0 truncate font-sans text-[11px] font-normal tracking-normal text-muted-foreground"

const SEARCH_DEBOUNCE_MS = 200
const CHART2_DETAIL_SCROLL_KEY = "chart2-sidebar-detail-scroll"
const CHART2_DETAIL_OPEN_KEY = "chart2-sidebar-detail-open"
const CHART2_GALLERY_SCROLL_KEY = "chart2-sidebar-gallery-scroll"

function readSessionJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null
  try {
    return JSON.parse(sessionStorage.getItem(key) ?? "") as T
  } catch {
    return null
  }
}

function writeSessionJson(key: string, value: unknown) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore quota / private mode
  }
}

/** Keep sidebar scroll across navigations without yanking on every active change. */
function usePersistedNavScroll(
  storageKey: string,
  activeKey: string,
  activeRef: React.RefObject<HTMLElement | null>
) {
  const navRef = React.useRef<HTMLElement>(null)
  const didRestoreRef = React.useRef(false)

  React.useLayoutEffect(() => {
    const container = navRef.current
    if (!container) return

    // Restore saved scroll only once per mount (layout may persist across ids).
    if (!didRestoreRef.current) {
      const saved = readSessionJson<{ scrollTop: number }>(storageKey)
      if (saved && typeof saved.scrollTop === "number") {
        container.scrollTop = saved.scrollTop
      }
      didRestoreRef.current = true
    }

    const active = activeRef.current
    if (!active) return

    const containerRect = container.getBoundingClientRect()
    const activeRect = active.getBoundingClientRect()
    const fullyVisible =
      activeRect.top >= containerRect.top + 4 &&
      activeRect.bottom <= containerRect.bottom - 4
    if (fullyVisible) return

    // Soft nudge only when the active link left the viewport.
    container.scrollTop +=
      activeRect.top -
      containerRect.top -
      (container.clientHeight - activeRect.height) / 2
  }, [storageKey, activeKey, activeRef])

  React.useEffect(() => {
    const container = navRef.current
    if (!container) return

    const onScroll = () => {
      writeSessionJson(storageKey, { scrollTop: container.scrollTop })
    }
    container.addEventListener("scroll", onScroll, { passive: true })
    return () => container.removeEventListener("scroll", onScroll)
  }, [storageKey])

  return navRef
}

function useDebouncedNavQuery(searchValue: string) {
  const [debouncedQuery, setDebouncedQuery] = React.useState("")

  React.useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedQuery(normalizeNavSearch(searchValue))
    }, SEARCH_DEBOUNCE_MS)
    return () => window.clearTimeout(timeout)
  }, [searchValue])

  const clearSearch = React.useCallback(() => {
    setDebouncedQuery("")
  }, [])

  return { debouncedQuery, clearSearch }
}

function CategoryFaEn({ title, en }: { title: string; en: string }) {
  return (
    <>
      <span className="min-w-0 shrink truncate">{title}</span>
      <span
        aria-hidden
        className="mb-0.5 min-w-2 flex-1 border-b border-dashed border-border/60"
      />
      <span dir="ltr" lang="en" title={en} className={SIDEBAR_EN_CLASS}>
        {en}
      </span>
    </>
  )
}

function GalleryCategoryNav({
  activeId,
  onSelect,
  className,
}: {
  activeId: Chart2CategoryId
  onSelect: (id: Chart2CategoryId) => void
  className?: string
}) {
  const activeRef = React.useRef<HTMLAnchorElement>(null)
  const navRef = usePersistedNavScroll(
    CHART2_GALLERY_SCROLL_KEY,
    activeId,
    activeRef
  )
  const [searchValue, setSearchValue] = React.useState("")
  const { debouncedQuery, clearSearch } = useDebouncedNavQuery(searchValue)

  const filteredCategories = React.useMemo(() => {
    return chart2Categories.filter(
      (item) =>
        matchesNavQuery(item.title, debouncedQuery) ||
        matchesNavQuery(item.en, debouncedQuery) ||
        matchesNavQuery(item.id, debouncedQuery)
    )
  }, [debouncedQuery])

  const clearAll = React.useCallback(() => {
    setSearchValue("")
    clearSearch()
  }, [clearSearch])

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", className)}>
      <div className="shrink-0 pe-1 pb-3">
        <SidebarNavSearch
          value={searchValue}
          onValueChange={setSearchValue}
          onClear={clearAll}
          inputClassName={SIDEBAR_SEARCH_INPUT_CLASS}
        />
      </div>
      <nav
        ref={navRef}
        aria-label="انواع نمودار"
        className="scrollbar-soft flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto overscroll-contain pe-1 pb-32"
      >
        {filteredCategories.length === 0 ? (
          <div className={SIDEBAR_EMPTY_CLASS}>نتیجه‌ای پیدا نشد.</div>
        ) : null}
        {filteredCategories.map((item) => {
          const Icon = item.icon
          const active = item.id === activeId
          const href = `/chart2#chart-type-${item.id}`
          return (
            <PrefetchLink
              key={item.id}
              ref={active ? activeRef : undefined}
              href={href}
              onClick={(event) => {
                // Same-tab: keep in-page scroll handler. Modified clicks use href.
                if (
                  event.metaKey ||
                  event.ctrlKey ||
                  event.shiftKey ||
                  event.altKey ||
                  event.button !== 0
                ) {
                  return
                }
                event.preventDefault()
                onSelect(item.id)
              }}
              className={cn(
                SIDEBAR_GROUP_TRIGGER_CLASS,
                active ? SIDEBAR_ITEM_ACTIVE : undefined
              )}
            >
              <Icon className="size-3.5 shrink-0 opacity-80" aria-hidden />
              <CategoryFaEn title={item.title} en={item.en} />
            </PrefetchLink>
          )
        })}
      </nav>
    </div>
  )
}

function DetailCategoryNav({
  activeCategoryId,
  activeExampleId,
  onNavigate,
  className,
}: {
  activeCategoryId: Chart2CategoryId
  activeExampleId: string
  /** Close mobile sheet / side effects after a same-tab navigate. */
  onNavigate?: () => void
  className?: string
}) {
  // SSR + first client paint must match — restore session after mount.
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>(
    () => ({ [activeCategoryId]: true })
  )
  const [searchValue, setSearchValue] = React.useState("")
  const { debouncedQuery, clearSearch } = useDebouncedNavQuery(searchValue)
  const activeExampleRef = React.useRef<HTMLAnchorElement>(null)
  const navRef = usePersistedNavScroll(
    CHART2_DETAIL_SCROLL_KEY,
    activeExampleId,
    activeExampleRef
  )

  React.useLayoutEffect(() => {
    const saved = readSessionJson<Record<string, boolean>>(CHART2_DETAIL_OPEN_KEY)
    setOpenGroups({
      ...(saved ?? {}),
      [activeCategoryId]: true,
    })
    // Only restore once on mount; activeCategoryId handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount restore
  }, [])

  const filteredGroups = React.useMemo(() => {
    return chart2Categories
      .map((item) => {
        const examples = getChart2Examples(item.id).filter(
          (example) =>
            !debouncedQuery ||
            matchesNavQuery(example.title, debouncedQuery) ||
            matchesNavQuery(example.en, debouncedQuery) ||
            matchesNavQuery(example.id, debouncedQuery)
        )
        const categoryMatch =
          !debouncedQuery ||
          matchesNavQuery(item.title, debouncedQuery) ||
          matchesNavQuery(item.en, debouncedQuery) ||
          matchesNavQuery(item.id, debouncedQuery)

        if (debouncedQuery && !categoryMatch && examples.length === 0) {
          return null
        }

        return {
          item,
          examples: debouncedQuery && categoryMatch && examples.length === 0
            ? getChart2Examples(item.id)
            : examples,
        }
      })
      .filter((group): group is NonNullable<typeof group> => group != null)
  }, [debouncedQuery])

  React.useEffect(() => {
    setOpenGroups((prev) => {
      if (prev[activeCategoryId]) return prev
      const next = { ...prev, [activeCategoryId]: true }
      writeSessionJson(CHART2_DETAIL_OPEN_KEY, next)
      return next
    })
  }, [activeCategoryId])

  React.useEffect(() => {
    if (!debouncedQuery) return
    setOpenGroups((prev) => {
      const next = { ...prev }
      for (const group of filteredGroups) {
        next[group.item.id] = true
      }
      writeSessionJson(CHART2_DETAIL_OPEN_KEY, next)
      return next
    })
  }, [debouncedQuery, filteredGroups])

  const clearAll = React.useCallback(() => {
    setSearchValue("")
    clearSearch()
  }, [clearSearch])

  const setGroupOpen = React.useCallback(
    (id: string, next: boolean) => {
      setOpenGroups((prev) => {
        const updated = { ...prev, [id]: next }
        writeSessionJson(CHART2_DETAIL_OPEN_KEY, updated)
        return updated
      })
    },
    []
  )

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", className)}>
      <div className="shrink-0 pe-1 pb-3">
        <SidebarNavSearch
          value={searchValue}
          onValueChange={setSearchValue}
          onClear={clearAll}
          inputClassName={SIDEBAR_SEARCH_INPUT_CLASS}
        />
      </div>
      <nav
        ref={navRef}
        aria-label="انواع و نمونه‌های نمودار"
        className="scrollbar-soft flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto overscroll-contain pe-1 pb-32"
      >
        {filteredGroups.length === 0 ? (
          <div className={SIDEBAR_EMPTY_CLASS}>نتیجه‌ای پیدا نشد.</div>
        ) : null}
        {filteredGroups.map(({ item, examples }) => {
          const Icon = item.icon
          const open = openGroups[item.id] ?? Boolean(debouncedQuery)
          const categoryActive = item.id === activeCategoryId

          return (
            <Collapsible
              key={item.id}
              open={open}
              onOpenChange={(next) => setGroupOpen(item.id, next)}
              className="group/chart2-folder"
            >
              <CollapsibleTrigger
                className={cn(
                  SIDEBAR_GROUP_TRIGGER_CLASS,
                  categoryActive ? SIDEBAR_ITEM_ACTIVE : undefined
                )}
              >
                <Icon className="size-3.5 shrink-0 opacity-80" aria-hidden />
                <CategoryFaEn title={item.title} en={item.en} />
                <SidebarNavChevron group="chart2-folder" />
              </CollapsibleTrigger>

              <CollapsibleContent
                className={SIDEBAR_COLLAPSIBLE_CONTENT_CLASS}
              >
                <div className={SIDEBAR_NESTED_RAIL_CLASS}>
                  {examples.map((example) => {
                    const active = example.id === activeExampleId
                    const featured = isChart2Featured(example.id)
                    return (
                      <PrefetchLink
                        key={example.id}
                        ref={active ? activeExampleRef : undefined}
                        href={`/chart2/view/${example.id}`}
                        title={example.en}
                        onClick={() => {
                          const container = navRef.current
                          if (container) {
                            writeSessionJson(CHART2_DETAIL_SCROLL_KEY, {
                              scrollTop: container.scrollTop,
                            })
                          }
                          onNavigate?.()
                        }}
                        className={cn(
                          SIDEBAR_NESTED_ITEM_CLASS,
                          sidebarItemStateClass(active)
                        )}
                      >
                        <SidebarNavBullet featured={featured} />
                        <span className={SIDEBAR_NESTED_LABEL_CLASS}>
                          {example.title}
                        </span>
                      </PrefetchLink>
                    )
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )
        })}
      </nav>
    </div>
  )
}

export function Chart2Shell({
  activeCategoryId,
  activeExampleId,
  onSelectCategory,
  children,
  mainClassName,
  mainRef,
}: {
  activeCategoryId: Chart2CategoryId
  /** When set, sidebar shows collapsible example lists under each category. */
  activeExampleId?: string
  onSelectCategory?: (id: Chart2CategoryId) => void
  children: React.ReactNode
  mainClassName?: string
  mainRef?: React.Ref<HTMLDivElement>
}) {
  const router = useRouter()
  const [sheetOpen, setSheetOpen] = React.useState(false)
  const detailMode = Boolean(activeExampleId)

  const selectCategory = React.useCallback(
    (id: Chart2CategoryId) => {
      setSheetOpen(false)
      if (onSelectCategory) {
        onSelectCategory(id)
        return
      }
      router.push(`/chart2#chart-type-${id}`)
    },
    [onSelectCategory, router]
  )

  const closeMobileNav = React.useCallback(() => {
    setSheetOpen(false)
  }, [])

  const nav = detailMode ? (
    <DetailCategoryNav
      activeCategoryId={activeCategoryId}
      activeExampleId={activeExampleId!}
      onNavigate={closeMobileNav}
    />
  ) : (
    <GalleryCategoryNav
      activeId={activeCategoryId}
      onSelect={selectCategory}
    />
  )

  return (
    <div
      dir="rtl"
      lang="fa"
      data-slot="chart2"
      data-chart2-mode={detailMode ? "detail" : "gallery"}
      className="flex h-[calc(100svh-var(--header-height))] min-h-0 w-full overflow-hidden bg-background"
    >
      <aside
        className={cn(
          "hidden h-full shrink-0 flex-col border-s border-border/70 bg-background transition-[width] duration-300 ease-out md:flex",
          detailMode ? "w-[15.5rem] xl:w-[17rem]" : "w-[13.5rem] xl:w-[15.5rem]"
        )}
      >
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-2 py-3">
          {nav}
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="flex shrink-0 items-center gap-1.5 border-b border-border/50 px-2 py-2 md:hidden">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 shrink-0"
            onClick={() => setSheetOpen(true)}
            aria-label="فهرست انواع نمودار"
          >
            <MenuIcon className="size-4" />
          </Button>
          <div className="scrollbar-none min-w-0 flex-1 overflow-x-auto">
            <div className="flex w-max gap-1.5 pe-2">
              {chart2Categories.map((item) => {
                const active = item.id === activeCategoryId
                const ChipIcon = item.icon
                const first = getChart2Examples(item.id)[0]
                const href = detailMode
                  ? first
                    ? `/chart2/view/${first.id}`
                    : `/chart2#chart-type-${item.id}`
                  : `/chart2#chart-type-${item.id}`
                return (
                  <PrefetchLink
                    key={item.id}
                    href={href}
                    onClick={(event) => {
                      if (
                        event.metaKey ||
                        event.ctrlKey ||
                        event.shiftKey ||
                        event.altKey ||
                        event.button !== 0
                      ) {
                        return
                      }
                      if (!detailMode) {
                        event.preventDefault()
                        selectCategory(item.id)
                      }
                    }}
                    className={cn(
                      "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-medium whitespace-nowrap",
                      active
                        ? "border-primary/25 bg-primary/10 text-primary"
                        : "border-border/60 text-muted-foreground"
                    )}
                  >
                    <ChipIcon className="size-3 opacity-70" aria-hidden />
                    {item.title}
                  </PrefetchLink>
                )
              })}
            </div>
          </div>
        </div>

        <div
          ref={mainRef}
          className={cn(
            "scrollbar-soft min-h-0 flex-1 overflow-y-auto overscroll-contain",
            mainClassName
          )}
        >
          {children}
        </div>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="right"
          className="flex w-[min(20rem,90vw)] flex-col p-0"
          dir="rtl"
        >
          <SheetHeader className="border-b px-4 py-3 text-start">
            <SheetTitle>
              {detailMode ? "نمونه‌های نمودار" : "انواع نمودار"}
            </SheetTitle>
          </SheetHeader>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-2 py-3">
            {nav}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
