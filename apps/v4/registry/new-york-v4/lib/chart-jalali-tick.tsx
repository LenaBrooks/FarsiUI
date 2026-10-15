"use client"

import { formatJalaliDate } from "@/lib/chart-locale"

/**
 * تیک محور افقی تاریخ جلالی (روز + ماه).
 * دو span جدا با dir=rtl تا عدد راست و ماه چپ بماند
 * (SVG text با رشتهٔ ترکیبی ترتیب را به‌هم می‌زند).
 */
export function JalaliDayMonthTick({
  x,
  y,
  payload,
}: {
  x?: number
  y?: number
  payload?: { value?: string | number | Date }
}) {
  if (x == null || y == null || payload?.value == null) return null
  const date =
    payload.value instanceof Date
      ? payload.value
      : new Date(payload.value)
  if (Number.isNaN(date.getTime())) return null
  const day = formatJalaliDate(date, { day: "numeric" })
  const month = formatJalaliDate(date, { month: "short" })
  const width = 80
  const height = 18
  return (
    <foreignObject
      x={x - width / 2}
      y={y}
      width={width}
      height={height}
      style={{ overflow: "visible" }}
    >
      <div
        // @ts-expect-error xmlns for SVG foreignObject HTML
        xmlns="http://www.w3.org/1999/xhtml"
        className="text-muted-foreground flex items-center justify-center gap-1 text-[11px] leading-[18px]"
        style={{ fontFamily: "var(--font-sans)", direction: "rtl" }}
      >
        <span>{day}</span>
        <span>{month}</span>
      </div>
    </foreignObject>
  )
}
