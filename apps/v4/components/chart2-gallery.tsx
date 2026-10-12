"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { LineChartIcon } from "lucide-react"
import { cn } from "cn"

import {
  chart2Categories,
  getChart2Examples,
  type Chart2CategoryId,
} from "@/lib/chart2-catalog"
import { Chart2Shell } from "@/components/chart2-shell"

function ExampleCard({
  id,
  title,
  en,
}: {
  id: string
  title: string
  en: string
}) {
  const router = useRouter()

  return (
    <button
      type="button"
      aria-label={`${title} — ${en}`}
      onClick={() => router.push(`/chart2/view/${id}`)}
      className={cn(
        "group flex w-full cursor-pointer flex-col overflow-hidden rounded-lg border border-border/50 bg-background text-start outline-none",
        "transition-[border-color,background-color] hover:border-border hover:bg-muted/20",
        "focus-visible:ring-2 focus-visible:ring-ring"
      )}
    >
      <div
        aria-hidden
        className="relative flex aspect-16/10 w-full items-center justify-center bg-muted/40"
      >
        <LineChartIcon
          absoluteStrokeWidth
          strokeWidth={1.25}
          className="pointer-events-none size-20 shrink-0 text-muted-foreground/80 transition-colors group-hover:text-muted-foreground md:size-24"
        />
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

export function Chart2Gallery() {
  const [activeId, setActiveId] =
    React.useState<Chart2CategoryId>("line")
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const sectionRefs = React.useRef<Map<Chart2CategoryId, HTMLElement>>(
    new Map()
  )
  const scrollingToRef = React.useRef<Chart2CategoryId | null>(null)

  const setSectionRef = React.useCallback(
    (id: Chart2CategoryId, node: HTMLElement | null) => {
      if (node) sectionRefs.current.set(id, node)
      else sectionRefs.current.delete(id)
    },
    []
  )

  const scrollSectionToTop = React.useCallback(
    (id: Chart2CategoryId, behavior: ScrollBehavior = "smooth") => {
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
    (id: Chart2CategoryId) => {
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
    if (hash && chart2Categories.some((item) => item.id === hash)) {
      const id = hash as Chart2CategoryId
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

      let current: Chart2CategoryId = chart2Categories[0].id
      let bestDistance = Number.POSITIVE_INFINITY

      for (const item of chart2Categories) {
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

      setActiveId((prev) => {
        if (prev === current) return prev
        window.history.replaceState(null, "", `#chart-type-${current}`)
        return current
      })
    }

    scroller.addEventListener("scroll", updateActiveFromScroll, {
      passive: true,
    })
    updateActiveFromScroll()
    return () => scroller.removeEventListener("scroll", updateActiveFromScroll)
  }, [])

  return (
    <Chart2Shell
      activeCategoryId={activeId}
      onSelectCategory={selectCategory}
      mainRef={scrollRef}
      mainClassName="px-3 py-3 md:px-5 md:py-4"
    >
      <div className="flex flex-col gap-10 md:gap-12">
        {chart2Categories.map((item) => {
          const examples = getChart2Examples(item.id)
          const SectionIcon = item.icon
          return (
            <section
              key={item.id}
              id={`chart-type-${item.id}`}
              ref={(node) => setSectionRef(item.id, node)}
              data-chart2-section={item.id}
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
                  />
                ))}
              </div>
            </section>
          )
        })}
        {/* Room so the last category can scroll clear of the mobile edge. */}
        <div aria-hidden className="h-[min(45svh,18rem)] shrink-0 md:h-24" />
      </div>
    </Chart2Shell>
  )
}
