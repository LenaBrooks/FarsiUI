"use client"

import { RelativeTime } from "@/registry/bases/base/ui/relative-time"

export default function RelativeTimeDemo() {
  const now = Date.now()
  const samples = [
    { label: "همین الان", date: now - 10_000 },
    { label: "دقایق", date: now - 5 * 60_000 },
    { label: "ساعات", date: now - 3 * 60 * 60_000 },
    { label: "دیروز", date: now - 26 * 60 * 60_000 },
    { label: "هفته", date: now - 10 * 24 * 60 * 60_000 },
    { label: "آینده", date: now + 2 * 60 * 60_000 },
  ]

  return (
    <div className="w-full max-w-sm space-y-3 p-4" dir="rtl" lang="fa">
      {samples.map((item) => (
        <div
          key={item.label}
          className="flex items-center justify-between gap-3 text-sm"
        >
          <span className="text-muted-foreground">{item.label}</span>
          <RelativeTime date={item.date} className="font-medium" />
        </div>
      ))}
    </div>
  )
}
