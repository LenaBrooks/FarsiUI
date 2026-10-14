"use client"

import { DragScroll } from "@/registry/bases/base/ui/drag-scroll"
import { Badge } from "@/registry/bases/base/ui/badge"

const chips = [
  "همه",
  "فرم‌ها",
  "داشبورد",
  "پرداخت",
  "احراز هویت",
  "نمودار",
  "تقویم",
  "جداول",
  "اعلان‌ها",
  "تنظیمات",
]

export default function DragScrollDemo() {
  return (
    <div className="w-full max-w-md space-y-2 p-4" dir="rtl" lang="fa">
      <p className="text-muted-foreground text-xs">
        روی دسکتاپ بکشید؛ روی موبایل با لمس اسکرول کنید.
      </p>
      <DragScroll className="rounded-lg border bg-muted/30 p-3">
        <div className="flex w-max gap-2 pe-1">
          {chips.map((chip) => (
            <Badge
              key={chip}
              variant="outline"
              className="shrink-0 cursor-pointer px-3 py-1.5 text-sm"
            >
              {chip}
            </Badge>
          ))}
        </div>
      </DragScroll>
    </div>
  )
}
