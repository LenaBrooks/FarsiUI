import {
  DOCUMENTED_HOOK_INSTALLS,
  getDocumentedHookInstalls,
  type DocumentedHookName,
} from "@/lib/hook-install-notes"
import {
  highlightPackageManagerCommands,
  type HighlightedPackageManagerCommands,
} from "@/lib/highlight-code"

export async function highlightDocumentedHookCommands(
  dependencies?: string[]
): Promise<Partial<Record<DocumentedHookName, HighlightedPackageManagerCommands>>> {
  const hooks = getDocumentedHookInstalls(dependencies)
  if (hooks.length === 0) return {}

  const entries = await Promise.all(
    hooks.map(async (hookName) => {
      const highlighted = await highlightPackageManagerCommands(
        DOCUMENTED_HOOK_INSTALLS[hookName].command
      )
      return [hookName, highlighted] as const
    })
  )

  const result: Partial<
    Record<DocumentedHookName, HighlightedPackageManagerCommands>
  > = {}
  for (const [hookName, highlighted] of entries) {
    if (highlighted) result[hookName] = highlighted
  }
  return result
}
