"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { ListIndexNav } from "@/components/list-index-nav"
import {
  matchesNavQuery,
  normalizeNavSearch,
  SidebarNavSearch,
} from "@/components/sidebar-nav-search"
import {
  SIDEBAR_EMPTY_CLASS,
  SIDEBAR_NESTED_ITEM_CLASS,
  SIDEBAR_SEARCH_INPUT_CLASS,
  SIDEBAR_SEARCH_WRAP_CLASS,
  SIDEBAR_SHELL_CLASS,
  SidebarNavBilingualLabel,
  SidebarNavBullet,
  sidebarItemStateClass,
} from "@/components/sidebar-nav-ui"
import { CALENDAR_AVAILABLE_YEARS } from "@/lib/calendar/data"
import { toPersianDigits } from "@/lib/digits"
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

const YEAR_ITEMS = [...CALENDAR_AVAILABLE_YEARS]
  .sort((a, b) => b - a)
  .map((year) => ({
    year,
    href: `/calendar/${year}`,
    nameFa: `سال ${toPersianDigits(year)}`,
  }))

function getCalendarNavCurrent(pathname: string) {
  const match = pathname.match(/^\/calendar\/(\d{4})\/?$/)
  if (match) {
    const year = Number(match[1])
    return `سال ${toPersianDigits(year)}`
  }
  return null
}

function CalendarNavBody({ showSearch = true }: { showSearch?: boolean }) {
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

  const filtered = React.useMemo(() => {
    return YEAR_ITEMS.filter(
      (item) =>
        matchesNavQuery(item.nameFa, debouncedQuery) ||
        matchesNavQuery(String(item.year), debouncedQuery) ||
        matchesNavQuery(toPersianDigits(item.year), debouncedQuery)
    )
  }, [debouncedQuery])

  const currentActive =
    pathname.match(/^\/calendar\/(\d{4})\/?$/)?.[1] ?? null

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
      <SidebarContent className="min-h-0 w-full scroll-fade scrollbar-soft overflow-x-hidden overflow-y-auto pe-1 [--scroll-fade-t-size:0px]">
        {filtered.length === 0 ? (
          <div className={SIDEBAR_EMPTY_CLASS}>نتیجه‌ای پیدا نشد.</div>
        ) : (
          <SidebarGroup className="pt-1">
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {filtered.map((item) => {
                  const active = currentActive === String(item.year)
                  const featured = item.year === 1405
                  return (
                    <SidebarMenuItem key={item.year}>
                      <Link
                        href={item.href}
                        data-active={active ? "true" : undefined}
                        aria-label={item.nameFa}
                        className={cn(
                          SIDEBAR_NESTED_ITEM_CLASS,
                          sidebarItemStateClass(active)
                        )}
                      >
                        <SidebarNavBullet featured={featured} />
                        <SidebarNavBilingualLabel fa={item.nameFa} />
                      </Link>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </>
  )
}

export function CalendarListIndex() {
  const pathname = usePathname()
  const current = getCalendarNavCurrent(pathname)

  return (
    <PersianDigits>
      <ListIndexNav title="فهرست سال‌ها" current={current}>
        <SidebarProvider className="min-h-0! flex h-full w-full flex-col">
          <CalendarNavBody showSearch />
        </SidebarProvider>
      </ListIndexNav>
    </PersianDigits>
  )
}

export function CalendarSidebar({
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
          <CalendarNavBody showSearch />
        </div>
      </Sidebar>
    </PersianDigits>
  )
}
