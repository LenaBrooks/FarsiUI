/** Exact doc URLs with a green sidebar bullet (top-level pages, etc.). */
export const PAGES_NEW: string[] = []

export const PAGES_UPDATED: string[] = []

/**
 * Component slugs with a green sidebar bullet — Iran-special / high-signal only.
 * Matched by last path segment so base/radix/aria all work.
 */
export const FEATURED_COMPONENT_SLUGS = [
  "iran-division-picker",
  "phone-input",
  "national-code-input",
  "sheba-input",
  "bank-card-input",
  "price-input",
  "address-form",
  "signature-pad",
] as const

/** Green nav bullet for featured / new docs pages. */
export function isFeaturedDocsPage(url: string) {
  if (PAGES_NEW.includes(url)) return true
  const slug = url.split("/").filter(Boolean).pop() ?? ""
  return (FEATURED_COMPONENT_SLUGS as readonly string[]).includes(slug)
}

/** True only for `/docs/components` and `/docs/components/*` — not `components-json`, etc. */
export function isComponentsDocsPath(pathname: string) {
  return (
    pathname === "/docs/components" || pathname.startsWith("/docs/components/")
  )
}

/** Split `"فارسی (English)"` titles into sides for UI. */
export function splitDocTitle(title: string) {
  const match = title.match(/^(.*?)\s*\(([^)]+)\)\s*$/)
  if (!match) {
    return { fa: title, en: null as string | null }
  }
  return { fa: match[1].trim(), en: match[2].trim() }
}
