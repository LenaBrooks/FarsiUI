"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ChevronDownIcon, MenuIcon } from "lucide-react"
import { cn } from "cn"

import {
  chart2Categories,
  getChart2Examples,
  isChart2Featured,
  type Chart2CategoryId,
} from "@/lib/chart2-catalog"
import {
  matchesNavQuery,
  normalizeNavSearch,
  SidebarNavSearch,
} from "@/components/sidebar-nav-search"
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

const COLLAPSIBLE_CONTENT_CLASS = cn(
  "overflow-hidden",
  "data-[state=open]:animate-[docs-collapsible-down_300ms_ease-out]",
  "data-[state=closed]:animate-[docs-collapsible-up_250ms_ease-out]"
)

const SEARCH_DEBOUNCE_MS = 200

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
  const activeRef = React.useRef<HTMLButtonElement>(null)
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

  React.useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest" })
  }, [activeId])

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", className)}>
      <div className="shrink-0 pe-1 pb-3">
        <SidebarNavSearch
          value={searchValue}
          onValueChange={setSearchValue}
          onClear={clearAll}
          inputClassName="text-[13px]"
        />
      </div>
      <nav
        aria-label="انواع نمودار"
        className="scrollbar-soft flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto overscroll-contain pe-1"
      >
        {filteredCategories.length === 0 ? (
          <div className="px-2 py-6 text-center text-[13px] text-muted-foreground">
            نتیجه‌ای پیدا نشد.
          </div>
        ) : null}
        {filteredCategories.map((item) => {
          const Icon = item.icon
          const active = item.id === activeId
          return (
            <button
              key={item.id}
              ref={active ? activeRef : undefined}
              type="button"
              onClick={() => onSelect(item.id)}
              className={cn(
                "flex h-9 w-full min-w-0 cursor-pointer items-center gap-2 rounded-md px-2 text-[13px] font-medium outline-none transition-colors",
                "focus-visible:ring-2 focus-visible:ring-ring",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <Icon className="size-3.5 shrink-0 opacity-80" aria-hidden />
              <CategoryFaEn title={item.title} en={item.en} />
            </button>
          )
        })}
      </nav>
    </div>
  )
}

function DetailCategoryNav({
  activeCategoryId,
  activeExampleId,
  onSelectExample,
  className,
}: {
  activeCategoryId: Chart2CategoryId
  activeExampleId: string
  onSelectExample: (id: string) => void
  className?: string
}) {
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>(
    () => ({ [activeCategoryId]: true })
  )
  const [searchValue, setSearchValue] = React.useState("")
  const { debouncedQuery, clearSearch } = useDebouncedNavQuery(searchValue)
  const activeExampleRef = React.useRef<HTMLButtonElement>(null)

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
    setOpenGroups((prev) =>
      prev[activeCategoryId] ? prev : { ...prev, [activeCategoryId]: true }
    )
  }, [activeCategoryId])

  React.useEffect(() => {
    if (!debouncedQuery) return
    setOpenGroups((prev) => {
      const next = { ...prev }
      for (const group of filteredGroups) {
        next[group.item.id] = true
      }
      return next
    })
  }, [debouncedQuery, filteredGroups])

  React.useEffect(() => {
    activeExampleRef.current?.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    })
  }, [activeExampleId])

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
          inputClassName="text-[13px]"
        />
      </div>
      <nav
        aria-label="انواع و نمونه‌های نمودار"
        className="scrollbar-soft flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto overscroll-contain pe-1"
      >
        {filteredGroups.length === 0 ? (
          <div className="px-2 py-6 text-center text-[13px] text-muted-foreground">
            نتیجه‌ای پیدا نشد.
          </div>
        ) : null}
        {filteredGroups.map(({ item, examples }) => {
          const Icon = item.icon
          const open = openGroups[item.id] ?? Boolean(debouncedQuery)
          const categoryActive = item.id === activeCategoryId

          return (
            <Collapsible
              key={item.id}
              open={open}
              onOpenChange={(next) =>
                setOpenGroups((prev) => ({ ...prev, [item.id]: next }))
              }
              className="group/chart2-folder"
            >
              <CollapsibleTrigger
                className={cn(
                  "flex h-9 w-full min-w-0 cursor-pointer items-center gap-1.5 rounded-md px-2 text-[13px] font-medium outline-none transition-colors",
                  "focus-visible:ring-2 focus-visible:ring-ring",
                  categoryActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <Icon className="size-3.5 shrink-0 opacity-80" aria-hidden />
                <CategoryFaEn title={item.title} en={item.en} />
                <ChevronDownIcon
                  className={cn(
                    "size-3.5 shrink-0 opacity-50 transition-transform duration-200",
                    "group-data-[state=open]/chart2-folder:rotate-180"
                  )}
                  aria-hidden
                />
              </CollapsibleTrigger>

              <CollapsibleContent className={COLLAPSIBLE_CONTENT_CLASS}>
                <div className="mt-0.5 mb-1 ms-2 flex flex-col gap-0.5 border-s border-border/50 ps-2">
                  {examples.map((example) => {
                    const active = example.id === activeExampleId
                    const featured = isChart2Featured(example.id)
                    return (
                      <button
                        key={example.id}
                        ref={active ? activeExampleRef : undefined}
                        type="button"
                        onClick={() => onSelectExample(example.id)}
                        title={example.en}
                        className={cn(
                          "flex h-8 w-full min-w-0 cursor-pointer items-center gap-2 rounded-md px-2 text-start outline-none transition-colors",
                          "focus-visible:ring-2 focus-visible:ring-ring",
                          active
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        )}
                      >
                        {featured ? (
                          <span
                            className="size-1.5 shrink-0 rounded-full bg-emerald-500"
                            title="پیشنهادی"
                            aria-label="پیشنهادی"
                          />
                        ) : (
                          <span
                            aria-hidden
                            className="size-1 shrink-0 rounded-full bg-current opacity-40"
                          />
                        )}
                        <span className="truncate text-[12.5px] font-medium leading-snug">
                          {example.title}
                        </span>
                      </button>
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

  const selectExample = React.useCallback(
    (id: string) => {
      setSheetOpen(false)
      router.push(`/chart2/view/${id}`)
    },
    [router]
  )

  const nav = detailMode ? (
    <DetailCategoryNav
      activeCategoryId={activeCategoryId}
      activeExampleId={activeExampleId!}
      onSelectExample={selectExample}
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
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (!detailMode) {
                        selectCategory(item.id)
                        return
                      }
                      const first = getChart2Examples(item.id)[0]
                      if (first) selectExample(first.id)
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
                  </button>
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
