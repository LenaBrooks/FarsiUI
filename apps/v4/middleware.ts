import { NextResponse, type NextRequest } from "next/server"

import { CHART_LIB_SLUGS } from "@/lib/chart-lib-slugs"
import { FONT_REGISTRY_SLUGS } from "@/lib/fonts/registry-slugs"
import { GALLERY_CHART_SLUGS } from "@/lib/gallery-chart-slugs"
import { SKILL_REGISTRY_SLUGS } from "@/lib/skill-registry-slugs"

/**
 * One CLI surface regardless of components.json `style`:
 * - Skills → /r/skills/<slug>.json
 * - Fonts → /r/fonts/<slug>.json
 * - Gallery charts + chart libs → /r/styles/new-york-v4/<id>.json (single copy)
 * - Newer UI missing from legacy styles is mirrored into new-york-v4 at build
 *   time (see syncLegacyRegistryUiFromCanonicalBase); base-* remains canonical.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const match = pathname.match(/^\/r\/styles\/([^/]+)\/([^/]+)\.json$/)
  if (!match) {
    return NextResponse.next()
  }

  const style = match[1]
  const name = match[2]

  if (SKILL_REGISTRY_SLUGS.has(name)) {
    const url = request.nextUrl.clone()
    url.pathname = `/r/skills/${name}.json`
    return NextResponse.rewrite(url)
  }

  if (FONT_REGISTRY_SLUGS.has(name)) {
    const url = request.nextUrl.clone()
    url.pathname = `/r/fonts/${name}.json`
    return NextResponse.rewrite(url)
  }

  if (
    (GALLERY_CHART_SLUGS.has(name) || CHART_LIB_SLUGS.has(name)) &&
    style !== "new-york-v4"
  ) {
    const url = request.nextUrl.clone()
    url.pathname = `/r/styles/new-york-v4/${name}.json`
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/r/styles/:style/:name.json"],
}
