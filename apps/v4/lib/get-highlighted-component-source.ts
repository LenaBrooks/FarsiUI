"use server"

import { formatCode } from "@/lib/format-code"
import { highlightCode } from "@/lib/highlight-code"
import { getDemoItem, getRegistryItem } from "@/lib/registry"

export type HighlightedComponentSource = {
  code: string
  highlightedCode: string
  language: string
}

export async function getHighlightedComponentSource(
  name: string,
  styleName = "base-nova",
  maxLines?: number
): Promise<HighlightedComponentSource | null> {
  const item =
    (await getDemoItem(name, styleName)) ??
    (await getRegistryItem(name, styleName))
  let code = item?.files?.[0]?.content

  if (!code) {
    return null
  }

  code = await formatCode(code, styleName)
  code = code.replaceAll("/* eslint-disable react/no-children-prop */\n", "")

  if (maxLines) {
    code = code.split("\n").slice(0, maxLines).join("\n")
  }

  const language = "tsx"
  const highlightedCode = await highlightCode(code, language)

  return { code, highlightedCode, language }
}
