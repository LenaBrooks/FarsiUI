import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "cn"

/** Shared sidebar list chrome — docs / blocks / skills / charts / Chart. */

export const SIDEBAR_SHELL_CLASS =
  "sticky top-[calc(var(--header-height)+0.6rem)] z-30 hidden h-[calc(100svh-10rem)] overflow-hidden overscroll-none bg-transparent [--sidebar-menu-width:--spacing(56)] lg:flex"

export const SIDEBAR_SEARCH_WRAP_CLASS = "shrink-0 pe-2 pt-2 pb-3"

export const SIDEBAR_SEARCH_INPUT_CLASS = "text-[13px]"

export const SIDEBAR_EMPTY_CLASS =
  "px-2 py-6 text-center text-[13px] text-muted-foreground"

/** Top-level link (e.g. معرفی) — same weight/size as nested labels. */
export const SIDEBAR_TOP_LINK_CLASS = cn(
  "flex h-8 w-full min-w-0 cursor-pointer items-center gap-2 rounded-md px-2 text-start outline-none transition-colors",
  "focus-visible:ring-2 focus-visible:ring-ring",
  "text-[12.5px] font-medium leading-snug"
)

export const SIDEBAR_ITEM_ACTIVE = "bg-primary/10 text-primary"
export const SIDEBAR_ITEM_IDLE =
  "text-muted-foreground hover:bg-muted/50 hover:text-foreground"

/** Collapsible category / folder row. Chevron is always last. */
export const SIDEBAR_GROUP_TRIGGER_CLASS = cn(
  "flex h-9 w-full min-w-0 cursor-pointer items-center gap-1.5 rounded-md px-2 text-[13px] font-medium outline-none transition-colors",
  "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
  "focus-visible:ring-2 focus-visible:ring-ring"
)

export const SIDEBAR_GROUP_COUNT_CLASS =
  "shrink-0 text-[12px] font-normal tracking-normal text-muted-foreground/80"

export const SIDEBAR_CHEVRON_CLASS =
  "size-3.5 shrink-0 opacity-50 transition-transform duration-200"

export const SIDEBAR_NESTED_RAIL_CLASS =
  "mt-0.5 mb-1 ms-2 flex flex-col gap-0.5 border-s border-border/50 ps-2"

export const SIDEBAR_NESTED_ITEM_CLASS = cn(
  "flex h-8 w-full min-w-0 cursor-pointer items-center gap-1.5 rounded-md px-2 text-start outline-none transition-colors",
  "focus-visible:ring-2 focus-visible:ring-ring"
)

export const SIDEBAR_NESTED_LABEL_CLASS =
  "truncate text-[12.5px] font-medium leading-snug"

/** Persian label + dashed leader + small English (docs / blocks sidebars). */
export function SidebarNavBilingualLabel({
  fa,
  en,
}: {
  fa: string
  en?: string | null
}) {
  if (!en) {
    return <span className={SIDEBAR_NESTED_LABEL_CLASS}>{fa}</span>
  }

  return (
    <span className="flex min-w-0 flex-1 items-baseline gap-1.5">
      <span className="max-w-[58%] shrink-0 truncate text-[12.5px] font-medium leading-snug">
        {fa}
      </span>
      <span
        aria-hidden
        className="mb-0.5 min-w-2 flex-1 border-b border-dashed border-muted-foreground/25"
      />
      <span
        dir="ltr"
        lang="en"
        className="max-w-[42%] shrink-0 truncate text-[10.5px] font-normal tracking-wide text-muted-foreground/70"
      >
        {en}
      </span>
    </span>
  )
}

export const SIDEBAR_COLLAPSIBLE_CONTENT_CLASS = cn(
  "overflow-hidden",
  "data-[state=open]:animate-[docs-collapsible-down_300ms_ease-out]",
  "data-[state=closed]:animate-[docs-collapsible-up_250ms_ease-out]"
)

export function SidebarNavBullet({
  featured = false,
  className,
}: {
  featured?: boolean
  className?: string
}) {
  if (featured) {
    return (
      <span
        className={cn(
          "size-1.5 shrink-0 rounded-full bg-[var(--chart-up)]",
          className
        )}
        title="ویژه"
        aria-label="ویژه"
      />
    )
  }

  return (
    <span
      aria-hidden
      className={cn(
        "size-1 shrink-0 rounded-full bg-current opacity-40",
        className
      )}
    />
  )
}

export function SidebarNavChevron({
  group,
  className,
}: {
  /** CSS group name used on the Collapsible, e.g. `docs-folder` → `group/docs-folder` */
  group: string
  className?: string
}) {
  return (
    <ChevronDownIcon
      className={cn(
        SIDEBAR_CHEVRON_CLASS,
        `group-data-[state=open]/${group}:rotate-180`,
        className
      )}
      aria-hidden
    />
  )
}

export function sidebarItemStateClass(active: boolean) {
  return active ? SIDEBAR_ITEM_ACTIVE : SIDEBAR_ITEM_IDLE
}
