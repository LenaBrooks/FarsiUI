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
  SIDEBAR_NESTED_LABEL_CLASS,
  SIDEBAR_SEARCH_INPUT_CLASS,
  SIDEBAR_SEARCH_WRAP_CLASS,
  SIDEBAR_SHELL_CLASS,
  SIDEBAR_TOP_LINK_CLASS,
  SidebarNavBilingualLabel,
  SidebarNavBullet,
  sidebarItemStateClass,
} from "@/components/sidebar-nav-ui"
import { FONTS_CATALOG, isFeaturedFont } from "@/lib/fonts/catalog"
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

function fontHref(id: string) {
  return `/fonts/${id}`
}

function getFontsNavCurrent(pathname: string) {
  if (pathname === "/fonts" || pathname === "/fonts/") return null
  const id = pathname.split("/").filter(Boolean).pop()
  const font = FONTS_CATALOG.find((item) => item.id === id)
  return font?.nameFa ?? null
}

function FontsNavBody({ showSearch = true }: { showSearch?: boolean }) {
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
    return FONTS_CATALOG.filter(
      (font) =>
        matchesNavQuery(font.nameFa, debouncedQuery) ||
        matchesNavQuery(font.nameEn, debouncedQuery) ||
        matchesNavQuery(font.id, debouncedQuery)
    )
  }, [debouncedQuery])

  const introVisible =
    !debouncedQuery ||
    matchesNavQuery("معرفی", debouncedQuery) ||
    matchesNavQuery("fonts", debouncedQuery) ||
    matchesNavQuery("فونت", debouncedQuery)

  const hasResults = introVisible || filtered.length > 0
  const introActive = pathname === "/fonts" || pathname === "/fonts/"

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
        <SidebarGroup className="pt-1">
          <SidebarGroupContent>
            {!hasResults ? (
              <div className={SIDEBAR_EMPTY_CLASS}>نتیجه‌ای پیدا نشد.</div>
            ) : null}
            <SidebarMenu className="gap-0.5">
              {introVisible ? (
                <SidebarMenuItem>
                  <Link
                    href="/fonts"
                    data-active={introActive ? "true" : undefined}
                    className={cn(
                      SIDEBAR_TOP_LINK_CLASS,
                      sidebarItemStateClass(introActive)
                    )}
                  >
                    <SidebarNavBullet featured />
                    <span className={SIDEBAR_NESTED_LABEL_CLASS}>معرفی</span>
                  </Link>
                </SidebarMenuItem>
              ) : null}
              {filtered.map((font) => {
                const href = fontHref(font.id)
                const active = pathname === href

                return (
                  <SidebarMenuItem key={font.id}>
                    <Link
                      href={href}
                      data-active={active ? "true" : undefined}
                      aria-label={`${font.nameFa} — ${font.nameEn}`}
                      className={cn(
                        SIDEBAR_NESTED_ITEM_CLASS,
                        sidebarItemStateClass(active)
                      )}
                    >
                      <SidebarNavBullet featured={isFeaturedFont(font.id)} />
                      <SidebarNavBilingualLabel
                        fa={font.nameFa}
                        en={font.nameEn}
                      />
                    </Link>
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

export function FontsListIndex() {
  const pathname = usePathname()
  const current = getFontsNavCurrent(pathname)

  return (
    <PersianDigits>
      <ListIndexNav title="فهرست فونت‌ها" current={current}>
        <SidebarProvider className="min-h-0! flex h-full w-full flex-col">
          <FontsNavBody showSearch />
        </SidebarProvider>
      </ListIndexNav>
    </PersianDigits>
  )
}

export function FontsSidebar({
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
          <FontsNavBody showSearch />
        </div>
      </Sidebar>
    </PersianDigits>
  )
}
