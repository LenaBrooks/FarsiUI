"use client"

import * as React from "react"

import { formatChartNumber } from "@/lib/chart-fa"

const ASCII_NUMBER_RE = /^\d+(\.\d+)?$/

/** Sunburst hardcodes `dataKey` as label text with no formatter — Persianize after paint. */
export function PersianSunburstDigits({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useLayoutEffect(() => {
    const root = ref.current
    if (!root) return

    const apply = () => {
      root.querySelectorAll("text").forEach((node) => {
        const raw = node.textContent?.trim()
        if (!raw || !ASCII_NUMBER_RE.test(raw)) return
        const next = formatChartNumber(Number(raw))
        if (node.textContent !== next) {
          node.textContent = next
        }
      })
    }

    apply()
    const observer = new MutationObserver(apply)
    observer.observe(root, {
      childList: true,
      subtree: true,
      characterData: true,
    })
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
