import { NextResponse, type NextRequest } from "next/server"

import { GALLERY_CHART_SLUGS } from "@/lib/gallery-chart-slugs"
import { SKILL_REGISTRY_SLUGS } from "@/lib/skill-registry-slugs"

/**
 * Skills are style-agnostic and live once under /r/skills/<slug>.json.
 * Gallery charts live once under /r/styles/new-york-v4/<id>.json.
 * CLI always requests /r/styles/<style>/<name>.json — rewrite those names.
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

  if (GALLERY_CHART_SLUGS.has(name) && style !== "new-york-v4") {
    const url = request.nextUrl.clone()
    url.pathname = `/r/styles/new-york-v4/${name}.json`
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/r/styles/:style/:name.json"],
}
