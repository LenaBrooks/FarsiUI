"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "cn"

import type { SiteNavItem } from "@/lib/config"
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
        const linkClassName =
          "relative inline-flex items-center font-medium"

        return (
          <Button
            key={item.href}
            variant="ghost"
            asChild
            size="sm"
            className="px-2.5 text-muted-foreground hover:bg-transparent hover:text-foreground data-[active=true]:bg-transparent data-[active=true]:font-medium data-[active=true]:text-foreground data-[active=true]:hover:bg-transparent data-[active=true]:hover:text-foreground"
          >
            {isExternal ? (
              <a
                href={item.href}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className={linkClassName}
              >
                {item.label}
              </a>
            ) : (
              <Link
                href={item.href}
                data-active={isActive || undefined}
                className={linkClassName}
              >
                {item.label}
              </Link>
            )}
          </Button>
        )
      })}
    </nav>
  )
}
