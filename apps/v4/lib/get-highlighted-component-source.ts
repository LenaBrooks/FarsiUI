"use server"

import { formatCode } from "@/lib/format-code"
import { highlightCode } from "@/lib/highlight-code"
import { readFileFromRoot } from "@/lib/read-file"
import { getDemoItem, getRegistryItem } from "@/lib/registry"

export type HighlightedComponentSource = {
  code: string
  highlightedCode: string
  language: string
}

/** Discriminated result for docs/lazy loaders — missing file vs internal failure. */
export type HighlightedSourceResult =
  | { ok: true; data: HighlightedComponentSource }
  | { ok: false; reason: "not_found" }
  | { ok: false; reason: "internal"; message: string }

export type GetHighlightedComponentSourceInput = {
  name?: string
  /** Repo-relative path; leading `/` is stripped (MDX uses `/app/...`, `/registry/...`). */
  src?: string
  styleName?: string
  maxLines?: number
  language?: string
  title?: string
}

function isNotFoundError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as NodeJS.ErrnoException).code === "ENOENT"
  )
}

function normalizeSrc(src: string) {
  return src.replace(/^\/+/, "")
}

function resolveLanguage(language?: string, title?: string) {
  return language ?? title?.split(".").pop() ?? "tsx"
}

function toInternalError(error: unknown): HighlightedSourceResult {
  const message =
    error instanceof Error ? error.message : "Failed to highlight component source"
  console.error("[getHighlightedComponentSource]", error)
  return { ok: false, reason: "internal", message }
}

async function loadCodeByName(
  name: string,
  styleName: string
): Promise<{ code: string } | { notFound: true } | { internal: unknown }> {
  try {
    const item =
      (await getDemoItem(name, styleName)) ??
      (await getRegistryItem(name, styleName))
    const code = item?.files?.[0]?.content
    if (!code) {
      return { notFound: true }
    }
    return { code }
  } catch (error) {
    if (isNotFoundError(error)) {
      return { notFound: true }
    }
    return { internal: error }
  }
}

async function loadCodeBySrc(
  src: string
): Promise<{ code: string } | { notFound: true } | { internal: unknown }> {
  try {
    const code = await readFileFromRoot(normalizeSrc(src))
    if (!code) {
      return { notFound: true }
    }
    return { code }
  } catch (error) {
    if (isNotFoundError(error)) {
      return { notFound: true }
    }
    return { internal: error }
  }
}

/**
 * Typed loader used by future lazy MDX `ComponentSource`.
 * - `not_found`: missing demo/registry entry or ENOENT on `src`
 * - `internal`: format/highlight/unexpected I/O (logged; not collapsed into not_found)
 */
export async function getHighlightedComponentSourceResult(
  input: GetHighlightedComponentSourceInput
): Promise<HighlightedSourceResult> {
  const {
    name,
    src,
    styleName = "base-nova",
    maxLines,
    language: languageInput,
    title,
  } = input

  if (!name && !src) {
    return { ok: false, reason: "not_found" }
  }

  // Prefer `src` when both are set (matches server `ComponentSource` overwrite order).
  const loaded = src
    ? await loadCodeBySrc(src)
    : await loadCodeByName(name!, styleName)

  if ("notFound" in loaded) {
    return { ok: false, reason: "not_found" }
  }
  if ("internal" in loaded) {
    return toInternalError(loaded.internal)
  }

  try {
    let code = await formatCode(loaded.code, styleName)
    code = code.replaceAll("/* eslint-disable react/no-children-prop */\n", "")

    if (maxLines) {
      code = code.split("\n").slice(0, maxLines).join("\n")
    }

    const language = resolveLanguage(languageInput, title)
    const highlightedCode = await highlightCode(code, language)

    return {
      ok: true,
      data: { code, highlightedCode, language },
    }
  } catch (error) {
    return toInternalError(error)
  }
}

/**
 * Backward-compatible server action for [`ComponentSourceLazy`]:
 * - success → data
 * - `not_found` → `null` (existing `if (!result)` branch)
 * - `internal` → throw (existing `.catch` branch)
 */
export async function getHighlightedComponentSource(
  name: string,
  styleName = "base-nova",
  maxLines?: number
): Promise<HighlightedComponentSource | null> {
  const result = await getHighlightedComponentSourceResult({
    name,
    styleName,
    maxLines,
  })

  if (result.ok) {
    return result.data
  }

  if (result.reason === "not_found") {
    return null
  }

  throw new Error(result.message)
}
