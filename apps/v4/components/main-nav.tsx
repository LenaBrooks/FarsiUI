"use client"

import { usePathname } from "next/navigation"
import { cn } from "cn"

import type { SiteNavItem } from "@/lib/config"
import { PrefetchLink } from "@/components/prefetch-link"
import { Button } from "@/registry/new-york-v4/ui/button"

export function MainNav({
  items,
  className,
  ...props
}: React.ComponentProps<"nav"> & {
  items: SiteNavItem[]
}) {
  const pathname = usePathname()
  const activeHref = items
    .filter(
      (item) =>
        !("external" in item && item.external) &&
        (item.href === "/"
          ? pathname === "/"
          : pathname === item.href || pathname.startsWith(`${item.href}/`))
    )
    .sort((a, b) => b.href.length - a.href.length)[0]?.href

  return (
    <nav className={cn("items-center gap-0", className)} {...props}>
      {items.map((item) => {
        const isExternal = "external" in item && item.external
        const isActive = !isExternal && item.href === activeHref

        return (
          <Button
            key={item.href}
            variant="ghost"
            asChild
            size="sm"
            className={cn(
              "h-auto rounded-none bg-transparent px-2.5 py-1 shadow-none hover:bg-transparent",
              isActive
                ? "text-primary hover:text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isExternal ? (
              <a
                href={item.href}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="relative inline-flex items-center font-medium"
              >
                {item.label}
              </a>
            ) : (
              <PrefetchLink
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative inline-flex items-center font-medium",
                  isActive && "underline decoration-primary decoration-2 underline-offset-8"
                )}
              >
                {item.label}
              </PrefetchLink>
            )}
          </Button>
        )
      })}
    </nav>
  )
}
