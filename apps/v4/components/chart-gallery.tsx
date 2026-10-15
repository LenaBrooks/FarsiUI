"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { cn } from "cn"

import {
  chartCategories,
  getChartExamples,
  type ChartCategoryId,
} from "@/lib/chart-catalog"
import { ChartShell } from "@/components/chart-shell"

/** Gallery thumbs: `public/chart/{id}-light.webp` + `{id}-dark.webp`. */
export function chartThumbSrc(id: string, theme: "light" | "dark") {
  return `/chart/${id}-${theme}.webp`
}

/** First viewport thumbs load eagerly; the rest stay lazy. */
const CHART_THUMB_EAGER_COUNT = 8

function ExampleCard({
  id,
  title,
  en,
  loading = "lazy",
}: {
  id: string
  title: string
  en: string
  loading?: "eager" | "lazy"
}) {
  const router = useRouter()
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [thumbLoaded, setThumbLoaded] = React.useState(false)
  const [thumbFailed, setThumbFailed] = React.useState(false)
  const theme = resolvedTheme === "dark" ? "dark" : "light"

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    setThumbLoaded(false)
    setThumbFailed(false)
  }, [id, theme])

  const showSkeleton = !mounted || (!thumbLoaded && !thumbFailed)

  return (
    <button
      type="button"
      aria-label={`${title} — ${en}`}
      onClick={() => router.push(`/charts/view/${id}`)}
      className={cn(
        "group flex w-full cursor-pointer flex-col overflow-hidden rounded-lg border border-border/50 bg-background text-start outline-none",
        "transition-[border-color,background-color] hover:border-border hover:bg-muted/20",
        "focus-visible:ring-2 focus-visible:ring-ring"
      )}
    >
      <div
        aria-hidden
        className="relative aspect-16/10 w-full overflow-hidden bg-muted/40"
      >
        {showSkeleton ? (
          <div className="absolute inset-0 animate-pulse bg-muted/50" />
        ) : null}
        {mounted && !thumbFailed ? (
          <img
            src={chartThumbSrc(id, theme)}
            alt=""
            className={cn(
              "size-full object-cover object-center transition-[opacity,transform] duration-300 ease-out group-hover:scale-110",
              thumbLoaded ? "opacity-100" : "opacity-0"
            )}
            loading={loading}
            onLoad={() => setThumbLoaded(true)}
            onError={() => {
              setThumbFailed(true)
              setThumbLoaded(false)
            }}
          />
        ) : null}
      </div>
      <div className="flex min-w-0 flex-col gap-0.5 px-2.5 py-2 md:px-3 md:py-2.5">
        <span className="truncate text-[13px] font-medium text-foreground md:text-sm">
          {title}
        </span>
        <span
          dir="ltr"
          lang="en"
          className="truncate font-sans text-[11px] text-muted-foreground/70"
        >
          {en}
        </span>
      </div>
    </button>
  )
}

export function ChartGallery() {
  const [activeId, setActiveId] =
    React.useState<ChartCategoryId>("line")
  const activeIdRef = React.useRef(activeId)
  activeIdRef.current = activeId
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const sectionRefs = React.useRef<Map<ChartCategoryId, HTMLElement>>(
    new Map()
  )
  const scrollingToRef = React.useRef<ChartCategoryId | null>(null)

  const eagerThumbIds = React.useMemo(() => {
    const ids = new Set<string>()
    for (const category of chartCategories) {
      for (const example of getChartExamples(category.id)) {
        if (ids.size >= CHART_THUMB_EAGER_COUNT) return ids
        ids.add(example.id)
      }
    }
    return ids
  }, [])

  const setSectionRef = React.useCallback(
    (id: ChartCategoryId, node: HTMLElement | null) => {
      if (node) sectionRefs.current.set(id, node)
      else sectionRefs.current.delete(id)
    },
    []
  )

  const scrollSectionToTop = React.useCallback(
    (id: ChartCategoryId, behavior: ScrollBehavior = "smooth") => {
      const node = sectionRefs.current.get(id)
      const scroller = scrollRef.current
      if (!node || !scroller) return
      const scrollerRect = scroller.getBoundingClientRect()
      const nodeRect = node.getBoundingClientRect()
      const top = nodeRect.top - scrollerRect.top + scroller.scrollTop
      scroller.scrollTo({ top: Math.max(0, top), behavior })
    },
    []
  )

  const selectCategory = React.useCallback(
    (id: ChartCategoryId) => {
      setActiveId(id)
      scrollingToRef.current = id
      window.history.replaceState(null, "", `#chart-type-${id}`)
      scrollSectionToTop(id, "smooth")
      window.setTimeout(() => {
        if (scrollingToRef.current === id) scrollingToRef.current = null
      }, 600)
    },
    [scrollSectionToTop]
  )

  React.useEffect(() => {
    const hash = window.location.hash.replace(/^#chart-type-/, "")
    if (hash && chartCategories.some((item) => item.id === hash)) {
      const id = hash as ChartCategoryId
      setActiveId(id)
      requestAnimationFrame(() => {
        scrollSectionToTop(id, "auto")
      })
    }
  }, [scrollSectionToTop])

  React.useEffect(() => {
    const scroller = scrollRef.current
    if (!scroller) return

    const updateActiveFromScroll = () => {
      if (scrollingToRef.current) return

      const rootRect = scroller.getBoundingClientRect()
      const midpoint = rootRect.top + rootRect.height / 2

      let current: ChartCategoryId = chartCategories[0].id
      let bestDistance = Number.POSITIVE_INFINITY

      for (const item of chartCategories) {
        const node = sectionRefs.current.get(item.id)
        if (!node) continue
        const rect = node.getBoundingClientRect()
        const sectionMid = rect.top + rect.height / 2
        const distance = Math.abs(sectionMid - midpoint)
        if (distance < bestDistance) {
          bestDistance = distance
          current = item.id
        }
      }

      if (activeIdRef.current === current) return
      activeIdRef.current = current
      setActiveId(current)
      window.history.replaceState(null, "", `#chart-type-${current}`)
    }

    scroller.addEventListener("scroll", updateActiveFromScroll, {
      passive: true,
    })
    updateActiveFromScroll()
    return () => scroller.removeEventListener("scroll", updateActiveFromScroll)
  }, [])

  return (
    <ChartShell
      activeCategoryId={activeId}
      onSelectCategory={selectCategory}
      mainRef={scrollRef}
      mainClassName="px-3 py-3 md:px-5 md:py-4"
    >
      <div className="flex flex-col gap-10 md:gap-12">
        {chartCategories.map((item) => {
          const examples = getChartExamples(item.id)
          const SectionIcon = item.icon
          return (
            <section
              key={item.id}
              id={`chart-type-${item.id}`}
              ref={(node) => setSectionRef(item.id, node)}
              data-chart-section={item.id}
              className="scroll-mt-0"
            >
              <div className="mb-3 flex min-w-0 items-baseline gap-2 border-b border-border/50 pb-2 md:mb-4">
                <SectionIcon
                  className="size-4 shrink-0 text-muted-foreground"
                  aria-hidden
                />
                <h2 className="text-sm font-semibold tracking-tight md:text-base">
                  {item.title}
                </h2>
                <span
                  aria-hidden
                  className="mb-0.5 min-w-4 flex-1 border-b border-dashed border-border/50"
                />
                <span
                  dir="ltr"
                  lang="en"
                  className="shrink-0 font-sans text-xs text-muted-foreground/70"
                >
                  {item.en}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                {examples.map((example) => (
                  <ExampleCard
                    key={example.id}
                    id={example.id}
                    title={example.title}
                    en={example.en}
                    loading={
                      eagerThumbIds.has(example.id) ? "eager" : "lazy"
                    }
                  />
                ))}
              </div>
            </section>
          )
        })}
        {/* Room so the last category can scroll clear of the mobile edge. */}
        <div aria-hidden className="h-[min(45svh,18rem)] shrink-0 md:h-24" />
      </div>
    </ChartShell>
  )
}
