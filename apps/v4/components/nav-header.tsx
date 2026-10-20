"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/registry/new-york-v4/ui/navigation-menu"
import { cn } from "cn"

const navLinkClass = cn(
  "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
  "data-[active=true]:bg-primary/10 data-[active=true]:font-semibold data-[active=true]:text-primary",
  "data-[active=true]:hover:bg-primary/15 data-[active=true]:hover:text-primary",
  "data-[active=true]:focus:bg-primary/15 data-[active=true]:focus:text-primary"
)

export function NavHeader() {
  const pathname = usePathname()

  return (
    <NavigationMenu className="hidden sm:flex">
      <NavigationMenuList className="gap-2 *:data-[slot=navigation-menu-item]:h-7 **:data-[slot=navigation-menu-link]:py-1 **:data-[slot=navigation-menu-link]:font-medium">
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={navLinkClass}
            data-active={pathname === "/" ? true : undefined}
          >
            <Link href="/">خانه</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={navLinkClass}
            data-active={
              pathname === "/charts" || pathname.startsWith("/charts/")
                ? true
                : undefined
            }
          >
            <Link href="/charts">نمودارها</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={navLinkClass}
            data-active={
              pathname === "/fonts" || pathname.startsWith("/fonts/")
                ? true
                : undefined
            }
          >
            <Link href="/fonts">فونت‌ها</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={navLinkClass}
            data-active={
              pathname === "/calendar" || pathname.startsWith("/calendar/")
                ? true
                : undefined
            }
          >
            <Link href="/calendar">تقویم</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={navLinkClass}
            data-active={pathname === "/forms" ? true : undefined}
          >
            <Link href="/forms">فرم‌ها</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
