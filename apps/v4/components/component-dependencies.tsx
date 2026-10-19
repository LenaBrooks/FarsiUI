import { HookInstallNotes } from "@/components/hook-install-notes"
import { filterHookRegistryDependencies } from "@/lib/example-dependencies"
import { highlightDocumentedHookCommands } from "@/lib/highlight-hook-commands"
import { getRegistryMeta } from "@/lib/registry"

/**
 * Component-level hook install notes for Installation sections.
 * Example-only hooks belong under ExampleDependencies, not here.
 */
export async function ComponentDependencies({
  name,
  styleName = "base-nova",
}: {
  name: string
  styleName?: string
}) {
  const meta = getRegistryMeta(name, styleName)
  const hooks = filterHookRegistryDependencies(meta?.registryDependencies)
  const highlightedCommands = await highlightDocumentedHookCommands(hooks)

  return (
    <HookInstallNotes
      dependencies={hooks}
      scope="component"
      className="my-4"
      highlightedCommands={highlightedCommands}
    />
  )
}
