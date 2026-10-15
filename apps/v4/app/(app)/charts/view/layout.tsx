"use client"

import { useParams } from "next/navigation"

import { getChartExample } from "@/lib/chart-catalog"
import { ChartShell } from "@/components/chart-shell"

/**
 * Persist the charts detail shell across /charts/view/[id] navigations
 * so the sidebar does not remount (no open/scroll jump).
 */
export default function ChartsViewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useParams<{ id: string }>()
  const id = typeof params.id === "string" ? params.id : params.id?.[0]
  const example = id ? getChartExample(id) : undefined

  if (!example) {
    return children
  }

  return (
    <ChartShell
      activeCategoryId={example.category}
      activeExampleId={example.id}
    >
      {children}
    </ChartShell>
  )
}
