"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

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
        data-skills-sidebar-content=""
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
                  <Link
                    href="/skills"
                    className={cn(
                      SIDEBAR_TOP_LINK_CLASS,
                      sidebarItemStateClass(pathname === "/skills")
                    )}
                  >
                    <SidebarNavBullet featured />
                    <span className={SIDEBAR_NESTED_LABEL_CLASS}>معرفی</span>
                  </Link>
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
                      <CollapsibleTrigger
                        className={SIDEBAR_GROUP_TRIGGER_CLASS}
                      >
                        <span className="min-w-0 flex-1 truncate text-start">
                          {group.title}
                        </span>
                        <span className={SIDEBAR_GROUP_COUNT_CLASS}>
                          {count.toLocaleString("fa-IR")}
                        </span>
                        <SidebarNavChevron group="skills-cat" />
                      </CollapsibleTrigger>
                      <CollapsibleContent
                        className={SIDEBAR_COLLAPSIBLE_CONTENT_CLASS}
                      >
                        <div className={SIDEBAR_NESTED_RAIL_CLASS}>
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
                                  SIDEBAR_NESTED_ITEM_CLASS,
                                  sidebarItemStateClass(active)
                                )}
                              >
                                <SidebarNavBullet featured={featured} />
                                <span className={SIDEBAR_NESTED_LABEL_CLASS}>
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
        className={SIDEBAR_SHELL_CLASS}
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
