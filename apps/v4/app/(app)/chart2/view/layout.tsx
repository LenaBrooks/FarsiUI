"use client"

import { useParams } from "next/navigation"

import { getChart2Example } from "@/lib/chart2-catalog"
import { Chart2Shell } from "@/components/chart2-shell"

/**
 * Persist the chart2 detail shell across /chart2/view/[id] navigations
 * so the sidebar does not remount (no open/scroll jump).
 */
export default function Chart2ViewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useParams<{ id: string }>()
  const id = typeof params.id === "string" ? params.id : params.id?.[0]
  const example = id ? getChart2Example(id) : undefined

  if (!example) {
    return children
  }

  return (
    <Chart2Shell
      activeCategoryId={example.category}
      activeExampleId={example.id}
    >
      {children}
    </Chart2Shell>
  )
}
