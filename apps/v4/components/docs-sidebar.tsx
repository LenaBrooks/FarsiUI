"use client"

import * as React from "react"
import { PrefetchLink } from "@/components/prefetch-link"
import { usePathname } from "next/navigation"

import { isComponentsDocsPath, PAGES_NEW, splitDocTitle } from "@/lib/docs"
import { DOCS_SIDEBAR_SCROLL_STORAGE_KEY } from "@/lib/docs-sidebar-scroll"
import { showMcpDocs } from "@/lib/flags"
import { getCurrentBase, getPagesFromFolder } from "@/lib/page-tree"
import type { source } from "@/lib/source"
import { ListIndexNav } from "@/components/list-index-nav"
import {
  matchesNavQuery,
  normalizeNavSearch,
  SidebarNavSearch,
} from "@/components/sidebar-nav-search"
import {
  SIDEBAR_COLLAPSIBLE_CONTENT_CLASS,
  SIDEBAR_EMPTY_CLASS,
  SIDEBAR_GROUP_TRIGGER_CLASS,
  SIDEBAR_NESTED_ITEM_CLASS,
  SIDEBAR_NESTED_LABEL_CLASS,
  SIDEBAR_NESTED_RAIL_CLASS,
  SIDEBAR_SEARCH_INPUT_CLASS,
  SIDEBAR_SEARCH_WRAP_CLASS,
  SIDEBAR_SHELL_CLASS,
  SIDEBAR_TOP_LINK_CLASS,
  SidebarNavBilingualLabel,
  SidebarNavBullet,
  SidebarNavChevron,
  sidebarItemStateClass,
} from "@/components/sidebar-nav-ui"

function sidebarPageLabel(page: { name: unknown; url: string }) {
  const { fa, en } = splitDocTitle(String(page.name))
  if (en) return { fa, en }
  const slug = page.url.split("/").filter(Boolean).pop() ?? ""
  const fromSlug = slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
  return { fa, en: fromSlug || null }
}
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

const TOP_LEVEL_SECTIONS: Array<{
  name: string
  href: string
  /** Green status dot — e.g. live updates feed. */
  statusDot?: "green"
}> = [
  { name: "مقدمه", href: "/docs" },
  {
    name: "نصب",
    href: "/docs/installation",
  },
  {
    name: "CLI",
    href: "/docs/cli",
  },
  {
    name: "سرور MCP",
    href: "/docs/mcp",
  },
  {
    name: "بروزرسانی‌ها",
    href: "/docs/updates",
    statusDot: "green",
  },
]
const EXCLUDED_SECTIONS = ["installation", "dark-mode", "changelog", "rtl"]
const EXCLUDED_PAGES = ["/docs", "/docs/rtl", "/docs/new"]

function isHiddenDocsNavPage(url: string) {
  if (EXCLUDED_PAGES.includes(url)) return true
  // RTL section is linked from root meta in older trees; never show in main nav.
  if (url === "/docs/rtl" || url.startsWith("/docs/rtl/")) return true
  if (url === "/docs/changelog" || url.startsWith("/docs/changelog/")) return true
  if (url === "/docs/typeset" || url === "/typeset") return true
  return false
}
const SEARCH_DEBOUNCE_MS = 200

function readScrollState() {
  try {
    return JSON.parse(
      sessionStorage.getItem(DOCS_SIDEBAR_SCROLL_STORAGE_KEY) ?? ""
    ) as {
      pathname: string
      scrollTop: number
    }
  } catch {
    return null
  }
}

function saveScrollState(container: HTMLElement) {
  try {
    sessionStorage.setItem(
      DOCS_SIDEBAR_SCROLL_STORAGE_KEY,
      JSON.stringify({
        pathname: location.pathname,
        scrollTop: container.scrollTop,
      })
    )
  } catch {}
}

function getActiveItem(container: HTMLElement) {
  const items = container.querySelectorAll<HTMLElement>('[data-active="true"]')
  let active: HTMLElement | null = null
  let activePathLength = -1
  let activeDistance = Infinity
  const containerRect = container.getBoundingClientRect()
  const containerCenter = containerRect.top + container.clientHeight / 2

  for (const item of items) {
    const link = item.querySelector<HTMLAnchorElement>("a[href]")
    const href = item.getAttribute("href") ?? link?.getAttribute("href")
    const pathLength = href?.length ?? 0
    const itemRect = item.getBoundingClientRect()
    const distance = Math.abs(
      itemRect.top + itemRect.height / 2 - containerCenter
    )

    if (
      pathLength > activePathLength ||
      (pathLength === activePathLength && distance < activeDistance)
    ) {
      active = item
      activePathLength = pathLength
      activeDistance = distance
    }
  }

  return active
}

function getDocsCurrentLabel(
  tree: typeof source.pageTree,
  pathname: string,
  currentBase: string
) {
  for (const item of tree.children) {
    if (item.type !== "folder") continue
    for (const page of getPagesFromFolder(item, currentBase)) {
      if (page.url === pathname) {
        return splitDocTitle(String(page.name)).fa
      }
    }
  }

  let best: { name: string; href: string } | null = null
  for (const section of TOP_LEVEL_SECTIONS) {
    const matches =
      section.href === "/docs"
        ? pathname === "/docs"
        : pathname === section.href || pathname.startsWith(`${section.href}/`)

    if (
      matches &&
      (!best || section.href.length > best.href.length)
    ) {
      best = section
    }
  }

  return best?.name ?? null
}

function DocsSidebarBody({
  tree,
  persistScroll = true,
  showSearch = true,
  scope = "all",
}: {
  tree: typeof source.pageTree
  persistScroll?: boolean
  /** Desktop sidebar keeps search; mobile فهرست matches blocks/skills index. */
  showSearch?: boolean
  /** Mobile components index should only list components — not the full docs tree. */
  scope?: "all" | "components"
}) {
  const pathname = usePathname()
  const currentBase = getCurrentBase(pathname)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [searchValue, setSearchValue] = React.useState("")
  const [debouncedQuery, setDebouncedQuery] = React.useState("")
  const componentsOnly =
    scope === "components" || isComponentsDocsPath(pathname)

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

  const filteredSections = React.useMemo(() => {
    if (componentsOnly) {
      return []
    }
    return TOP_LEVEL_SECTIONS.filter(({ name, href }) => {
      if (!showMcpDocs && href.includes("/mcp")) {
        return false
      }
      return matchesNavQuery(name, debouncedQuery)
    })
  }, [componentsOnly, debouncedQuery])

  const filteredGroups = React.useMemo(() => {
    return tree.children.flatMap((item) => {
      if (EXCLUDED_SECTIONS.includes(item.$id ?? "")) {
        return []
      }

      if (item.type !== "folder") {
        return []
      }

      const isComponents =
        item.$id === "components" || String(item.name) === "کامپوننت‌ها"

      if (componentsOnly && !isComponents) {
        return []
      }

      const pages = getPagesFromFolder(item, currentBase).filter((page) => {
        if (!showMcpDocs && page.url.includes("/mcp")) {
          return false
        }
        if (isHiddenDocsNavPage(page.url)) {
          return false
        }
        // Already listed under «بخش‌ها» — don't repeat in شروع کار / other groups.
        if (
          TOP_LEVEL_SECTIONS.some(
            (section) =>
              section.href !== "/docs" &&
              (page.url === section.href ||
                page.url.startsWith(`${section.href}/`))
          )
        ) {
          return false
        }

        const title = String(page.name)
        const { fa, en } = splitDocTitle(title)
        return (
          matchesNavQuery(title, debouncedQuery) ||
          matchesNavQuery(fa, debouncedQuery) ||
          (en ? matchesNavQuery(en, debouncedQuery) : false) ||
          matchesNavQuery(String(item.name), debouncedQuery)
        )
      })

      if (pages.length === 0) {
        return []
      }

      return [
        {
          id: item.$id ?? String(item.name),
          name: item.name,
          pages,
          isComponents,
        },
      ]
    })
  }, [tree.children, currentBase, debouncedQuery, componentsOnly])

  const componentGroup = filteredGroups.find((group) => group.isComponents)
  const otherGroups = componentsOnly
    ? []
    : filteredGroups.filter((group) => !group.isComponents)

  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>(
    {}
  )

  const isGroupOpen = React.useCallback(
    (id: string) => {
      if (debouncedQuery) {
        return true
      }
      return openGroups[id] ?? false
    },
    [debouncedQuery, openGroups]
  )

  const setGroupOpen = React.useCallback((id: string, open: boolean) => {
    setOpenGroups((prev) => ({ ...prev, [id]: open }))
  }, [])

  React.useEffect(() => {
    setOpenGroups((prev) => {
      let next = prev
      for (const group of filteredGroups) {
        if (group.isComponents) continue
        if (
          group.pages.some((page) => page.url === pathname) &&
          !next[group.id]
        ) {
          next = { ...next, [group.id]: true }
        }
      }
      return next
    })
  }, [pathname, filteredGroups])

  const hasResults =
    filteredSections.length > 0 || filteredGroups.length > 0

  React.useLayoutEffect(() => {
    if (!persistScroll) {
      return
    }

    const container = contentRef.current

    if (!container) {
      return
    }

    const scrollState = readScrollState()

    if (scrollState?.pathname === pathname) {
      container.scrollTop = scrollState.scrollTop
    } else {
      // Prefer the longest route because section links also match by prefix.
      // Equal routes keep the item closest to the current viewport.
      const active = getActiveItem(container)

      if (active) {
        const containerRect = container.getBoundingClientRect()
        const activeRect = active.getBoundingClientRect()

        if (
          activeRect.top < containerRect.top ||
          activeRect.bottom > containerRect.bottom
        ) {
          container.scrollTop +=
            activeRect.top -
            containerRect.top -
            (container.clientHeight - activeRect.height) / 2
        }
      }
    }

    saveScrollState(container)
  }, [pathname, persistScroll])

  React.useEffect(() => {
    if (!persistScroll) {
      return
    }

    const container = contentRef.current

    if (!container) {
      return
    }

    const onScroll = () => saveScrollState(container)
    container.addEventListener("scroll", onScroll, { passive: true })
    return () => container.removeEventListener("scroll", onScroll)
  }, [persistScroll])

  return (
    <div
      data-docs-sidebar=""
      className="flex min-h-0 flex-1 flex-col overflow-hidden"
    >
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
        ref={contentRef}
        data-docs-sidebar-content=""
        className="min-h-0 w-full scroll-fade scrollbar-soft overflow-x-hidden overflow-y-auto pe-1 [--scroll-fade-t-size:0px]"
      >
        {!hasResults ? (
          <div className={SIDEBAR_EMPTY_CLASS}>نتیجه‌ای پیدا نشد.</div>
        ) : null}
        {filteredSections.length > 0 ? (
          <SidebarGroup className="pt-1">
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {filteredSections.map(({ name, href, statusDot }) => {
                  const active =
                    href === "/docs"
                      ? pathname === href
                      : pathname === href || pathname.startsWith(`${href}/`)
                  const featured =
                    statusDot === "green" || PAGES_NEW.includes(href)

                  return (
                    <SidebarMenuItem key={name}>
                      <PrefetchLink
                        href={href}
                        data-active={active ? "true" : undefined}
                        className={cn(
                          SIDEBAR_TOP_LINK_CLASS,
                          sidebarItemStateClass(active)
                        )}
                      >
                        <SidebarNavBullet featured={featured} />
                        <span className={SIDEBAR_NESTED_LABEL_CLASS}>
                          {name}
                        </span>
                      </PrefetchLink>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : null}

        {componentsOnly && componentGroup ? (
          <SidebarGroup className="pt-1">
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {componentGroup.pages.map((page) => {
                  const { fa, en } = sidebarPageLabel(page)
                  const active = page.url === pathname
                  const featured = PAGES_NEW.includes(page.url)

                  return (
                    <SidebarMenuItem key={page.url}>
                      <PrefetchLink
                        href={page.url}
                        data-active={active ? "true" : undefined}
                        aria-label={en ? `${fa} — ${en}` : fa}
                        className={cn(
                          SIDEBAR_NESTED_ITEM_CLASS,
                          sidebarItemStateClass(active)
                        )}
                      >
                        <SidebarNavBullet featured={featured} />
                        <SidebarNavBilingualLabel fa={fa} en={en} />
                      </PrefetchLink>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : null}

        {otherGroups.map((group) => (
          <SidebarGroup key={group.id} className="pt-0.5">
            <Collapsible
              open={isGroupOpen(group.id)}
              onOpenChange={(open) => setGroupOpen(group.id, open)}
              className="group/docs-folder"
            >
              <CollapsibleTrigger className={SIDEBAR_GROUP_TRIGGER_CLASS}>
                <span className="min-w-0 flex-1 truncate text-start">
                  {group.name}
                </span>
                <SidebarNavChevron group="docs-folder" />
              </CollapsibleTrigger>
              <CollapsibleContent
                className={SIDEBAR_COLLAPSIBLE_CONTENT_CLASS}
              >
                <div className={SIDEBAR_NESTED_RAIL_CLASS}>
                  {group.pages.map((page) => {
                    const { fa, en } = sidebarPageLabel(page)
                    const active = page.url === pathname
                    const featured = PAGES_NEW.includes(page.url)

                    return (
                      <PrefetchLink
                        key={page.url}
                        href={page.url}
                        data-active={active ? "true" : undefined}
                        aria-label={en ? `${fa} — ${en}` : fa}
                        className={cn(
                          SIDEBAR_NESTED_ITEM_CLASS,
                          sidebarItemStateClass(active)
                        )}
                      >
                        <SidebarNavBullet featured={featured} />
                        <SidebarNavBilingualLabel fa={fa} en={en} />
                      </PrefetchLink>
                    )
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </div>
  )
}

export function DocsListIndex({ tree }: { tree: typeof source.pageTree }) {
  const pathname = usePathname()
  const currentBase = getCurrentBase(pathname)
  const isComponents = isComponentsDocsPath(pathname)
  const current = React.useMemo(
    () => getDocsCurrentLabel(tree, pathname, currentBase),
    [tree, pathname, currentBase]
  )
  const title = isComponents ? "فهرست کامپوننت‌ها" : "فهرست مستندات"

  return (
    <PersianDigits>
      <ListIndexNav title={title} current={current}>
        <SidebarProvider className="min-h-0! flex h-full w-full flex-col">
          <DocsSidebarBody
            tree={tree}
            persistScroll={false}
            showSearch={isComponents}
            scope={isComponents ? "components" : "all"}
          />
        </SidebarProvider>
      </ListIndexNav>
    </PersianDigits>
  )
}

export function DocsSidebar({
  tree,
  ...props
}: React.ComponentProps<typeof Sidebar> & { tree: typeof source.pageTree }) {
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
          <DocsSidebarBody tree={tree} />
        </div>
      </Sidebar>
    </PersianDigits>
  )
}
