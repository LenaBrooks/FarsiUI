"use client"
import { ChevronUp, Eye } from "lucide-react"

import * as React from "react"
import { cn } from "cn"

import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/new-york-v4/ui/collapsible"

const viewCodeButtonClassName =
  "relative z-10 cursor-pointer gap-1.5 rounded-lg border border-border bg-background font-sans text-foreground shadow-none hover:bg-muted dark:bg-background dark:text-foreground dark:hover:bg-muted"

export function CodeCollapsibleWrapper({
  className,
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof Collapsible>) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const isControlled = openProp !== undefined
  const isOpened = isControlled ? openProp : uncontrolledOpen

  const handleOpenChange = (next: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(next)
    }
    onOpenChange?.(next)
  }

  return (
    <Collapsible
      open={isOpened}
      onOpenChange={handleOpenChange}
      className={cn("group/collapsible relative md:-mx-1", className)}
      {...props}
    >
      {isOpened ? (
        <CollapsibleTrigger asChild>
          <div className="absolute top-1.5 end-9 z-10 flex items-center">
            <Button
              variant="outline"
              size="sm"
              className={cn(viewCodeButtonClassName, "h-7 px-2")}
            >
              <ChevronUp className="size-4" />
              بستن
            </Button>
          </div>
        </CollapsibleTrigger>
      ) : null}

      <CollapsibleContent
        forceMount
        className="relative mt-6 overflow-hidden rounded-2xl data-[state=closed]:max-h-64 data-[state=closed]:[content-visibility:auto] [&>figure]:mt-0 [&>figure]:md:mx-0!"
      >
        {children}
      </CollapsibleContent>

      {!isOpened ? (
        <div className="absolute inset-x-0 bottom-0 z-10 flex h-16 items-center justify-center rounded-b-2xl bg-background/95 backdrop-blur-sm">
          <div
            className="absolute inset-0 rounded-b-2xl"
            style={{
              background:
                "linear-gradient(to top, var(--background), color-mix(in oklab, var(--background) 75%, transparent), transparent)",
            }}
          />
          <CollapsibleTrigger asChild>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className={viewCodeButtonClassName}
            >
              <Eye className="size-4" />
              مشاهده کد
            </Button>
          </CollapsibleTrigger>
        </div>
      ) : null}
    </Collapsible>
  )
}
