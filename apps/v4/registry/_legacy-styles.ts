import { cookies } from "next/headers"

import {
  DESIGN_SYSTEM_COOKIE,
  normalizeDesignSystemId,
  type DesignSystemCookieId,
} from "@/lib/design-system"
import { DS_TO_REGISTRY_STYLE } from "@/lib/ds-qa-checklist"
import { BASES } from "@/registry/bases"
import { STYLES } from "@/registry/styles"

/** Legacy source registries still used by some /view and chart paths. */
const LEGACY_SOURCE_STYLES = [
  {
    name: "new-york-v4",
    title: "New York",
  },
] as const

/** Installable base × style combinations (includes glass/rose/nili/khesht). */
const COMBINATION_STYLES = BASES.flatMap((base) =>
  STYLES.map((style) => ({
    name: `${base.name}-${style.name}`,
    title: `${base.title} ${style.title}`,
  }))
)

export const legacyStyles = [
  ...LEGACY_SOURCE_STYLES,
  ...COMBINATION_STYLES,
] as const

export type Style = (typeof legacyStyles)[number]

function registryNameForDesignSystem(id: DesignSystemCookieId) {
  return DS_TO_REGISTRY_STYLE[id] ?? "base-nova"
}

/**
 * Resolves the active installable style from the design-system cookie
 * so /blocks and SSR previews follow the site picker (WYSIWYG).
 */
export async function getActiveStyle() {
  let ds: DesignSystemCookieId = "default"
  try {
    const cookieStore = await cookies()
    ds = normalizeDesignSystemId(
      cookieStore.get(DESIGN_SYSTEM_COOKIE)?.value
    )
  } catch {
    // No request context (build-time) — fall back to Nova.
  }
  const name = registryNameForDesignSystem(ds)
  return (
    legacyStyles.find((style) => style.name === name) ??
    legacyStyles.find((style) => style.name === "base-nova") ??
    legacyStyles[0]
  )
}

export function getStyle(name: string) {
  return legacyStyles.find((style) => style.name === name)
}
