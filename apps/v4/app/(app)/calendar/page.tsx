import type { Metadata } from "next"

import { CalendarDataGuide } from "@/components/calendar-data-guide"
import { IranCalendarApp } from "@/components/iran-calendar-app"

export const dynamic = "force-static"
export const revalidate = false

export const metadata: Metadata = {
  title: "تقویم ایران",
  description:
    "تقویم شمسی ایران با تعطیلات رسمی و مناسبت‌ها — تبدیل همزمان به میلادی و قمری.",
  alternates: {
    canonical: "/calendar",
  },
}

export default function CalendarPage() {
  return (
    <div className="flex w-full flex-col gap-10 pb-10">
      <IranCalendarApp />
      <CalendarDataGuide />
    </div>
  )
}
