"use client"

import * as React from "react"
import { PrefetchLink } from "@/components/prefetch-link"
import { usePathname } from "next/navigation"

import { getNavCategoryBlockCounts } from "@/lib/blocks-counts"
import {
  findBlocksNavMatch,
  getVisibleBlocksNav,
  type BlocksNavCategory,
} from "@/lib/blocks-nav"
import { ListIndexNav } from "@/components/list-index-nav"
import {
  matchesNavQuery,
  normalizeNavSearch,
  SidebarNavSearch,
} from "@/components/sidebar-nav-search"
import {
  SIDEBAR_COLLAPSIBLE_CONTENT_CLASS,
  SIDEBAR_EMPTY_CLASS,
  SIDEBAR_GROUP_COUNT_CLASS,
  SIDEBAR_GROUP_TRIGGER_CLASS,
  SIDEBAR_NESTED_ITEM_CLASS,
  SIDEBAR_NESTED_LABEL_CLASS,
  SIDEBAR_NESTED_RAIL_CLASS,
  SIDEBAR_SEARCH_INPUT_CLASS,
  SIDEBAR_SEARCH_WRAP_CLASS,
  SIDEBAR_SHELL_CLASS,
  SIDEBAR_TOP_LINK_CLASS,
  SidebarNavBullet,
  SidebarNavChevron,
  sidebarItemStateClass,
} from "@/components/sidebar-nav-ui"
import { cn } from "cn"
import { PersianDigits } from "@/registry/bases/base/ui/persian-digits"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/new-york-v4/ui/collapsible"
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

function BlocksNavBody({ showSearch = true }: { showSearch?: boolean }) {
  const pathname = usePathname()
  const categories = React.useMemo(() => getVisibleBlocksNav(), [])
  const categoryCounts = React.useMemo(() => getNavCategoryBlockCounts(), [])
  const match = React.useMemo(
    () => findBlocksNavMatch(pathname),
    [pathname]
  )
  const [openCategories, setOpenCategories] = React.useState<
    Record<string, boolean>
  >({})
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

  React.useEffect(() => {
    if (match?.category) {
      setOpenCategories((prev) => ({
        ...prev,
        [match.category.slug]: true,
      }))
    }
  }, [match?.category?.slug])

  const filteredCategories = React.useMemo(() => {
    return categories.flatMap((category) => {
      const categoryMatches =
        matchesNavQuery(category.title, debouncedQuery) ||
        matchesNavQuery(category.en, debouncedQuery)

      const items = category.items.filter(
        (item) =>
          categoryMatches ||
          matchesNavQuery(item.title, debouncedQuery) ||
          matchesNavQuery(item.en, debouncedQuery) ||
          matchesNavQuery(item.slug, debouncedQuery)
      )

      if (items.length === 0) {
        return []
      }

      return [{ ...category, items } satisfies BlocksNavCategory]
    })
  }, [categories, debouncedQuery])

  const introVisible =
    !debouncedQuery ||
    matchesNavQuery("معرفی", debouncedQuery) ||
    matchesNavQuery("blocks", debouncedQuery)

  const hasResults = introVisible || filteredCategories.length > 0

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
        data-blocks-sidebar-content=""
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
                    href="/blocks"
                    className={cn(
                      SIDEBAR_TOP_LINK_CLASS,
                      sidebarItemStateClass(pathname === "/blocks")
                    )}
                  >
                    <SidebarNavBullet featured />
                    <span className={SIDEBAR_NESTED_LABEL_CLASS}>معرفی</span>
                  </PrefetchLink>
                </SidebarMenuItem>
              ) : null}

              {filteredCategories.map((category) => {
                const isCategoryOpen =
                  Boolean(debouncedQuery) ||
                  (openCategories[category.slug] ??
                    match?.category.slug === category.slug)
                const count = categoryCounts[category.slug] ?? 0

                return (
                  <Collapsible
                    key={category.slug}
                    open={isCategoryOpen}
                    onOpenChange={(open) =>
                      setOpenCategories((prev) => ({
                        ...prev,
                        [category.slug]: open,
                      }))
                    }
                    className="group/blocks-cat"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger
                        className={SIDEBAR_GROUP_TRIGGER_CLASS}
                      >
                        <span className="min-w-0 flex-1 truncate text-start">
                          {category.title}
                        </span>
                        <span className={SIDEBAR_GROUP_COUNT_CLASS}>
                          {count.toLocaleString("fa-IR")}
                        </span>
                        <SidebarNavChevron group="blocks-cat" />
                      </CollapsibleTrigger>
                      <CollapsibleContent
                        className={SIDEBAR_COLLAPSIBLE_CONTENT_CLASS}
                      >
                        <div className={SIDEBAR_NESTED_RAIL_CLASS}>
                          {category.items.map((item, index) => {
                            const active =
                              pathname === item.href ||
                              pathname.startsWith(`${item.href}/`)
                            return (
                              <PrefetchLink
                                key={item.href}
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
                            )
                          })}
                        </div>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </>
  )
}

export function BlocksListIndex() {
  const pathname = usePathname()
  const match = React.useMemo(
    () => findBlocksNavMatch(pathname),
    [pathname]
  )
  const current = pathname === "/blocks" ? null : (match?.item.title ?? null)

  return (
    <PersianDigits>
      <ListIndexNav title="فهرست بلوک‌ها" current={current}>
        <SidebarProvider className="min-h-0! flex h-full w-full flex-col">
          <BlocksNavBody showSearch />
        </SidebarProvider>
      </ListIndexNav>
    </PersianDigits>
  )
}

export function BlocksSidebar({
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
          <BlocksNavBody showSearch />
        </div>
      </Sidebar>
    </PersianDigits>
  )
}
