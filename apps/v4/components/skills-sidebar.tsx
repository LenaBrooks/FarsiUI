"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDownIcon } from "lucide-react"

import {
  getSkillCategory,
  getSkills,
  getSkillsNavCategoryId,
  getSkillsNavCurrent,
  skillMatchesQuery,
  type Skill,
  type SkillCategoryId,
} from "@/lib/skills-data"
import { cn } from "cn"
import { ListIndexNav } from "@/components/list-index-nav"
import {
  matchesNavQuery,
  normalizeNavSearch,
  SidebarNavSearch,
} from "@/components/sidebar-nav-search"
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
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/registry/new-york-v4/ui/sidebar"

const SIDEBAR_CLASS =
  "sticky top-[calc(var(--header-height)+0.6rem)] z-30 hidden h-[calc(100svh-10rem)] overflow-hidden overscroll-none bg-transparent [--sidebar-menu-width:--spacing(56)] lg:flex"

const ACTIVE_ITEM_CLASS =
  "relative h-10 w-full overflow-visible border border-transparent pe-1.5 text-[14px] font-medium after:absolute after:inset-x-0 after:-inset-y-1 after:z-0 after:rounded-md data-[active=true]:border-primary/20 data-[active=true]:bg-primary/10 data-[active=true]:text-primary lg:h-8"

const SEARCH_DEBOUNCE_MS = 200

type CategoryGroup = {
  id: SkillCategoryId
  title: string
  titleEn: string
  skills: Skill[]
}

function SkillsNavBody({ showSearch = true }: { showSearch?: boolean }) {
  const pathname = usePathname()
  const skillItems = React.useMemo(() => getSkills(), [])
  const activeCategoryId = getSkillsNavCategoryId(pathname)
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
    if (activeCategoryId) {
      setOpenCategories((prev) => ({
        ...prev,
        [activeCategoryId]: true,
      }))
    }
  }, [activeCategoryId])

  const filteredGroups = React.useMemo(() => {
    const groups = new Map<SkillCategoryId, CategoryGroup>()

    for (const skill of skillItems) {
      const category = getSkillCategory(skill.category)
      if (!category) continue

      const categoryMatches =
        matchesNavQuery(category.title, debouncedQuery) ||
        matchesNavQuery(category.titleEn, debouncedQuery) ||
        matchesNavQuery(category.id, debouncedQuery)

      if (
        debouncedQuery &&
        !categoryMatches &&
        !skillMatchesQuery(skill, debouncedQuery)
      ) {
        continue
      }

      const existing = groups.get(category.id)
      if (existing) {
        existing.skills.push(skill)
      } else {
        groups.set(category.id, {
          id: category.id,
          title: category.title,
          titleEn: category.titleEn,
          skills: [skill],
        })
      }
    }

    return [...groups.values()]
  }, [skillItems, debouncedQuery])

  const introVisible =
    !debouncedQuery ||
    matchesNavQuery("معرفی", debouncedQuery) ||
    matchesNavQuery("skills", debouncedQuery)

  const hasResults = introVisible || filteredGroups.length > 0

  return (
    <>
      {showSearch ? (
        <div className="shrink-0 pe-2 pt-2 pb-3">
          <SidebarNavSearch
            value={searchValue}
            onValueChange={setSearchValue}
            onClear={clearSearch}
            inputClassName="text-[14px]"
          />
        </div>
      ) : null}

      <SidebarContent
        data-skills-sidebar-content=""
        className="w-full scroll-fade scrollbar-soft overflow-x-hidden pe-1 [--scroll-fade-t-size:0px]"
      >
        <SidebarGroup className="pt-1">
          <SidebarGroupContent>
            {!hasResults ? (
              <div className="px-2 py-6 text-center text-[14px] text-muted-foreground">
                نتیجه‌ای پیدا نشد.
              </div>
            ) : null}

            <SidebarMenu className="gap-0.5">
              {introVisible ? (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/skills"}
                    className={ACTIVE_ITEM_CLASS}
                  >
                    <Link href="/skills">معرفی</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : null}

              {filteredGroups.map((group) => {
                const isCategoryOpen =
                  Boolean(debouncedQuery) ||
                  (openCategories[group.id] ?? activeCategoryId === group.id)
                const count = group.skills.length

                return (
                  <Collapsible
                    key={group.id}
                    open={isCategoryOpen}
                    onOpenChange={(open) =>
                      setOpenCategories((prev) => ({
                        ...prev,
                        [group.id]: open,
                      }))
                    }
                    className="group/skills-cat"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger className="flex h-10 w-full cursor-pointer items-center gap-1.5 rounded-md px-2 text-[13px] font-medium text-muted-foreground outline-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground lg:h-8">
                        <span className="min-w-0 flex-1 truncate text-start">
                          {group.title}
                        </span>
                        <span className="shrink-0 text-[12px] font-normal tracking-normal text-muted-foreground/80">
                          {count.toLocaleString("fa-IR")}
                        </span>
                        <ChevronDownIcon className="size-3.5 shrink-0 opacity-50 transition-transform duration-200 group-data-[state=open]/skills-cat:rotate-180" />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="mt-0.5 mb-1 ms-2 flex flex-col gap-0.5 border-s border-border/50 ps-2">
                          {group.skills.map((skill) => {
                            const active =
                              pathname === `/skills/${skill.slug}`
                            const featured = !skill.source
                            return (
                              <Link
                                key={skill.slug}
                                href={`/skills/${skill.slug}`}
                                title={skill.slug}
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
                                  {skill.title}
                                </span>
                              </Link>
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

export function SkillsListIndex() {
  const pathname = usePathname()
  const current = getSkillsNavCurrent(pathname)

  return (
    <PersianDigits>
      <ListIndexNav title="فهرست مهارت‌ها" current={current}>
        <SidebarProvider className="min-h-0! flex h-full w-full flex-col">
          <SkillsNavBody showSearch />
        </SidebarProvider>
      </ListIndexNav>
    </PersianDigits>
  )
}

export function SkillsSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <PersianDigits>
      <Sidebar
        className={SIDEBAR_CLASS}
        collapsible="none"
        dir="rtl"
        lang="fa"
        {...props}
      >
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <SkillsNavBody showSearch />
        </div>
      </Sidebar>
    </PersianDigits>
  )
}
