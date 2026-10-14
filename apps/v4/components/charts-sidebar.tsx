"use client"

import * as React from "react"
import { PrefetchLink } from "@/components/prefetch-link"
import { usePathname } from "next/navigation"

import {
  chartTypeMeta,
  getChartTypeMeta,
} from "@/app/(app)/charts/chart-catalog"
import { ListIndexNav } from "@/components/list-index-nav"
import {
  matchesNavQuery,
  normalizeNavSearch,
  SidebarNavSearch,
} from "@/components/sidebar-nav-search"
import {
  SIDEBAR_EMPTY_CLASS,
  SIDEBAR_NESTED_ITEM_CLASS,
  SIDEBAR_NESTED_LABEL_CLASS,
  SIDEBAR_SEARCH_INPUT_CLASS,
  SIDEBAR_SEARCH_WRAP_CLASS,
  SIDEBAR_SHELL_CLASS,
  SIDEBAR_TOP_LINK_CLASS,
  SidebarNavBullet,
  sidebarItemStateClass,
} from "@/components/sidebar-nav-ui"
import { cn } from "cn"
import { PersianDigits } from "@/registry/bases/base/ui/persian-digits"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
} from "@/registry/new-york-v4/ui/sidebar"

const SEARCH_DEBOUNCE_MS = 200

function ChartsNavBody({ showSearch = true }: { showSearch?: boolean }) {
  const pathname = usePathname()
  const [searchValue, setSearchValue] = React.useState("")
  const [debouncedQuery, setDebouncedQuery] = React.useState("")

  React.useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedQuery(normalizeNavSearch(searchValue))
    }, SEARCH_DEBOUNCE_MS)
    return () => window.clearTimeout(timeout)
  }, [searchValue])

  const clearSearch = React.useCallback(() => {
    setSearchValue("")
    setDebouncedQuery("")
  }, [])

  const filteredTypes = React.useMemo(() => {
    return chartTypeMeta.filter(
      (item) =>
        matchesNavQuery(item.title, debouncedQuery) ||
        matchesNavQuery(item.en, debouncedQuery) ||
        matchesNavQuery(item.type, debouncedQuery) ||
        matchesNavQuery(item.description, debouncedQuery)
    )
  }, [debouncedQuery])

  const introVisible =
    !debouncedQuery ||
    matchesNavQuery("معرفی", debouncedQuery) ||
    matchesNavQuery("charts", debouncedQuery) ||
    matchesNavQuery("نمودار", debouncedQuery)

  const hasResults = introVisible || filteredTypes.length > 0

  return (
    <>
      {showSearch ? (
        <div className={SIDEBAR_SEARCH_WRAP_CLASS}>
          <SidebarNavSearch
            value={searchValue}
            onValueChange={setSearchValue}
            onClear={clearSearch}
            inputClassName={SIDEBAR_SEARCH_INPUT_CLASS}
          />
        </div>
      ) : null}

      <SidebarContent
        data-charts-sidebar-content=""
        className="w-full scroll-fade scrollbar-soft overflow-x-hidden pe-1 [--scroll-fade-t-size:0px]"
      >
        <SidebarGroup className="pt-1">
          <SidebarGroupContent>
            {!hasResults ? (
              <div className={SIDEBAR_EMPTY_CLASS}>نتیجه‌ای پیدا نشد.</div>
            ) : null}

            <SidebarMenu className="gap-0.5">
              {introVisible ? (
                <SidebarMenuItem>
                  <PrefetchLink
                    href="/charts"
                    className={cn(
                      SIDEBAR_TOP_LINK_CLASS,
                      sidebarItemStateClass(pathname === "/charts")
                    )}
                  >
                    <SidebarNavBullet featured />
                    <span className={SIDEBAR_NESTED_LABEL_CLASS}>معرفی</span>
                  </PrefetchLink>
                </SidebarMenuItem>
              ) : null}

              {filteredTypes.map((item, index) => {
                const active =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`)
                return (
                  <SidebarMenuItem key={item.type}>
                    <PrefetchLink
                      href={item.href}
                      title={item.en}
                      className={cn(
                        SIDEBAR_NESTED_ITEM_CLASS,
                        sidebarItemStateClass(active)
                      )}
                    >
                      <SidebarNavBullet featured={index === 0} />
                      <span className={SIDEBAR_NESTED_LABEL_CLASS}>
                        {item.title}
                      </span>
                    </PrefetchLink>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </>
  )
}

export function ChartsListIndex() {
  const pathname = usePathname()
  const current =
    pathname === "/charts"
      ? null
      : (getChartTypeMeta(pathname.split("/")[2] ?? "")?.title ?? null)

  return (
    <PersianDigits>
      <ListIndexNav title="فهرست نمودارها" current={current}>
        <SidebarProvider className="min-h-0! flex h-full w-full flex-col">
          <ChartsNavBody showSearch />
        </SidebarProvider>
      </ListIndexNav>
    </PersianDigits>
  )
}

export function ChartsSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <PersianDigits>
      <Sidebar
        className={SIDEBAR_SHELL_CLASS}
        collapsible="none"
        dir="rtl"
        lang="fa"
        {...props}
      >
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <ChartsNavBody showSearch />
        </div>
      </Sidebar>
    </PersianDigits>
  )
}
