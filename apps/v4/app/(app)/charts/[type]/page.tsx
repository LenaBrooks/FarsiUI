"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"

/** Legacy /charts/{area|bar|…} hubs → unified gallery section. */
const TYPE_TO_CATEGORY: Record<string, string> = {
  area: "area",
  bar: "bar",
  line: "line",
  pie: "pie",
  radar: "radar",
  radial: "radial-bar",
  tooltip: "tooltip",
}

export default function LegacyChartTypeRedirect() {
  const params = useParams<{ type: string }>()
  const router = useRouter()
  const type = typeof params.type === "string" ? params.type : params.type?.[0]
  const category = type ? TYPE_TO_CATEGORY[type] : undefined

  useEffect(() => {
    router.replace(
      category ? `/charts#chart-type-${category}` : "/charts"
    )
  }, [category, router])

  return null
}
