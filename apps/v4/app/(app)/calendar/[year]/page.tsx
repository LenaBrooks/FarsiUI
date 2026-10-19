import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { CalendarDataGuide } from "@/components/calendar-data-guide"
import { IranCalendarApp } from "@/components/iran-calendar-app"
import { CALENDAR_AVAILABLE_YEARS } from "@/lib/calendar/data"
import { toPersianDigits } from "@/lib/digits"

export const dynamic = "force-static"
export const revalidate = false

type Props = {
  params: Promise<{ year: string }>
}

export function generateStaticParams() {
  return CALENDAR_AVAILABLE_YEARS.map((year) => ({ year: String(year) }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year: yearParam } = await params
  const year = Number(yearParam)
  if (!CALENDAR_AVAILABLE_YEARS.includes(year)) {
    return { title: "تقویم ایران" }
  }
  return {
    title: `تقویم ${toPersianDigits(year)}`,
    description: `تقویم شمسی سال ${toPersianDigits(year)} با تعطیلات رسمی و مناسبت‌ها.`,
    alternates: {
      canonical: `/calendar/${year}`,
    },
  }
}

export default async function CalendarYearPage({ params }: Props) {
  const { year: yearParam } = await params
  const year = Number(yearParam)
  if (!Number.isInteger(year) || !CALENDAR_AVAILABLE_YEARS.includes(year)) {
    notFound()
  }
  return (
    <div className="flex w-full flex-col gap-10 pb-10">
      <IranCalendarApp year={year} />
      <CalendarDataGuide />
    </div>
  )
}
