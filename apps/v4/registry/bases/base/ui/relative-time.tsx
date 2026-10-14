"use client"

import * as React from "react"
import { format as formatJalali } from "date-fns-jalali"
import { faIR } from "date-fns-jalali/locale"
import { cn } from "cn"

import { toPersianDigits } from "@/registry/bases/base/lib/digits"
import { formatRelativeFa } from "@/registry/bases/base/lib/relative-time"

export type RelativeTimeProps = Omit<
  React.ComponentProps<"time">,
  "dateTime" | "children"
> & {
  date: Date | number | string
  /** Recompute interval in ms (default 60s). Set 0 to disable. */
  updateInterval?: number
  absoluteFormat?: string
  format?: typeof formatRelativeFa
}

function RelativeTime({
  date,
  className,
  updateInterval = 60_000,
  absoluteFormat,
  format = formatRelativeFa,
  ...props
}: RelativeTimeProps) {
  const [now, setNow] = React.useState(() => Date.now())

  React.useEffect(() => {
    if (!updateInterval || updateInterval <= 0) return
    const id = window.setInterval(() => setNow(Date.now()), updateInterval)
    return () => window.clearInterval(id)
  }, [updateInterval])

  const target = date instanceof Date ? date : new Date(date)
  const label = format(target, { now, absoluteFormat })
  const iso = Number.isNaN(target.getTime()) ? undefined : target.toISOString()
  const title =
    iso &&
    toPersianDigits(
      formatJalali(target, absoluteFormat ?? "d MMMM yyyy · HH:mm", {
        locale: faIR,
      })
    )

  return (
    <time
      dateTime={iso}
      title={title || undefined}
      className={cn("whitespace-nowrap tabular-nums", className)}
      {...props}
    >
      {label}
    </time>
  )
}

export { RelativeTime, formatRelativeFa }
