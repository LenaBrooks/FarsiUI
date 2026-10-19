import { CodeBlockCommand } from "@/components/code-block-command"
import { toCodeBlockProps } from "@/components/code-block-command-shared"
import {
  highlightPackageManagerCommands,
  type HighlightedPackageManagerCommands,
} from "@/lib/highlight-code"

/** Server wrapper: Shiki-highlight a CLI install command for all PMs. */
export async function HighlightedCodeBlockCommand({
  command,
  highlighted,
}: {
  command?: string
  highlighted?: HighlightedPackageManagerCommands | null
}) {
  const result =
    highlighted ??
    (command ? await highlightPackageManagerCommands(command) : null)

  if (!result) {
    return null
  }

  return <CodeBlockCommand {...toCodeBlockProps(result)} />
}

export { toCodeBlockProps }
