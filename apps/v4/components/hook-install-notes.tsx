"use client"

import {
  CodeBlockCommand,
  toCodeBlockProps,
} from "@/components/code-block-command"
import { CopyButton } from "@/components/copy-button"
import {
  getDocumentedHookInstalls,
  getHookInstallCopy,
  DOCUMENTED_HOOK_INSTALLS,
  type DocumentedHookName,
} from "@/lib/hook-install-notes"
import type { HighlightedPackageManagerCommands } from "@/lib/highlight-code"
import { cn } from "cn"

function renderHookLabel(text: string) {
  const parts = text.split(/(`[^`]+`)/g)
  return parts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={index}
          className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8125rem]"
        >
          {part.slice(1, -1)}
        </code>
      )
    }
    return <span key={index}>{part}</span>
  })
}

function HookInstallCommand({
  command,
  highlighted,
}: {
  command: string
  highlighted?: HighlightedPackageManagerCommands | null
}) {
  if (highlighted) {
    return (
      <div className="relative mt-2 overflow-hidden rounded-xl bg-code text-code-foreground">
        <figure data-rehype-pretty-code-figure="" data-not-typeset="" className="m-0!">
          <CodeBlockCommand {...toCodeBlockProps(highlighted)} />
        </figure>
      </div>
    )
  }

  return (
    <div className="relative mt-2 overflow-hidden rounded-xl bg-code text-code-foreground">
      <CopyButton value={command} />
      <pre dir="ltr" className="overflow-x-auto px-4 py-3.5 font-mono text-sm">
        <code>{command}</code>
      </pre>
    </div>
  )
}

export function HookInstallNotes({
  dependencies,
  scope,
  className,
  highlightedCommands,
}: {
  dependencies?: string[]
  scope: "example" | "component"
  className?: string
  highlightedCommands?: Partial<
    Record<DocumentedHookName, HighlightedPackageManagerCommands>
  >
}) {
  const hooks = getDocumentedHookInstalls(dependencies)
  if (hooks.length === 0) {
    return null
  }

  return (
    <div className={cn("not-typeset space-y-4", className)}>
      {hooks.map((hookName: DocumentedHookName) => (
        <div key={hookName}>
          <p className="text-sm leading-relaxed text-foreground">
            {renderHookLabel(getHookInstallCopy(hookName, scope))}
          </p>
          <HookInstallCommand
            command={DOCUMENTED_HOOK_INSTALLS[hookName].command}
            highlighted={highlightedCommands?.[hookName]}
          />
        </div>
      ))}
    </div>
  )
}
