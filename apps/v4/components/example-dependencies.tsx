"use client"

import { HookInstallNotes } from "@/components/hook-install-notes"
import type { DocumentedHookName } from "@/lib/hook-install-notes"
import type { HighlightedPackageManagerCommands } from "@/lib/highlight-code"
import { cn } from "cn"

/** Example-only hook install notes. Shown only when the example imports the hook. */
export function ExampleDependencies({
  dependencies,
  className,
  highlightedCommands,
}: {
  dependencies?: string[]
  className?: string
  highlightedCommands?: Partial<
    Record<DocumentedHookName, HighlightedPackageManagerCommands>
  >
}) {
  return (
    <HookInstallNotes
      dependencies={dependencies}
      scope="example"
      className={cn("mt-3", className)}
      highlightedCommands={highlightedCommands}
    />
  )
}
