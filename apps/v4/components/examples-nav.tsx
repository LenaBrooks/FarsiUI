"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "cn"

import { ScrollArea, ScrollBar } from "@/registry/new-york-v4/ui/scroll-area"

const examples: { name: string; href: string; hidden: boolean }[] = []

export function ExamplesNav({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const pathname = usePathname()

  return (
    <div className={cn("flex items-center", className)} {...props}>
      <ScrollArea className="max-w-[96%] md:max-w-[600px] lg:max-w-none">
        <div className="flex items-center">
          <ExampleLink
            example={{ name: "Examples", href: "/", hidden: false }}
            isActive={pathname === "/"}
          />
          {examples.map((example) => (
            <ExampleLink
              key={example.href}
              example={example}
              isActive={pathname?.startsWith(example.href) ?? false}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  )
}

function ExampleLink({
  example,
  isActive,
}: {
  example: (typeof examples)[number]
  isActive: boolean
}) {
  if (example.hidden) {
    return null
  }

  return (
    <Link
      href={example.href}
      key={example.href}
      className="flex h-7 cursor-pointer items-center justify-center gap-2 px-4 text-center text-base font-medium text-muted-foreground transition-colors hover:text-primary data-[active=true]:text-primary"
      data-active={isActive}
    >
      {example.name}
    </Link>
  )
}
