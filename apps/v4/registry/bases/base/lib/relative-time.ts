import { format as formatJalali } from "date-fns-jalali"
import { faIR } from "date-fns-jalali/locale"

import { toPersianDigits } from "@/registry/bases/base/lib/digits"

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const WEEK = 7 * DAY
const MONTH = 30 * DAY
const YEAR = 365 * DAY

function pluralFa(n: number, one: string, other: string) {
  return n === 1 ? one : other
}

/**
 * Persian relative time: «۵ دقیقه پیش»، «دیروز»، «۲ هفته دیگر».
 * Short ranges use wall-clock deltas; absolute fallback is Jalali.
 */
export function formatRelativeFa(
  date: Date | number | string,
  options?: { now?: Date | number; absoluteFormat?: string }
): string {
  const target = date instanceof Date ? date : new Date(date)
  const now =
    options?.now instanceof Date
      ? options.now
      : options?.now != null
        ? new Date(options.now)
        : new Date()

  if (Number.isNaN(target.getTime()) || Number.isNaN(now.getTime())) {
    return ""
  }

  const diff = target.getTime() - now.getTime()
  const abs = Math.abs(diff)
  const future = diff > 0

  const withDigits = (s: string) => toPersianDigits(s)

  if (abs < 45_000) {
    return future ? "به‌زودی" : "همین الان"
  }

  const unit = (n: number, one: string, other: string) => {
    const label = pluralFa(n, one, other)
    const body = `${withDigits(String(n))} ${label}`
    return future ? `${body} دیگر` : `${body} پیش`
  }

  if (abs < HOUR) {
    const n = Math.max(1, Math.round(abs / MINUTE))
    return unit(n, "دقیقه", "دقیقه")
  }

  if (abs < DAY) {
    const n = Math.max(1, Math.round(abs / HOUR))
    return unit(n, "ساعت", "ساعت")
  }

  // Calendar-aware yesterday / tomorrow (local)
  const startOfDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  const dayDiff = Math.round(
    (startOfDay(target) - startOfDay(now)) / DAY
  )

  if (dayDiff === -1) return "دیروز"
  if (dayDiff === 1) return "فردا"
  if (dayDiff === -2) return "پریروز"
  if (dayDiff === 2) return "پس‌فردا"

  if (abs < WEEK) {
    const n = Math.max(1, Math.abs(dayDiff))
    return unit(n, "روز", "روز")
  }

  if (abs < MONTH) {
    const n = Math.max(1, Math.round(abs / WEEK))
    return unit(n, "هفته", "هفته")
  }

  if (abs < YEAR) {
    const n = Math.max(1, Math.round(abs / MONTH))
    return unit(n, "ماه", "ماه")
  }

  if (abs < 5 * YEAR) {
    const n = Math.max(1, Math.round(abs / YEAR))
    return unit(n, "سال", "سال")
  }

  const pattern = options?.absoluteFormat ?? "d MMMM yyyy"
  return withDigits(
    formatJalali(target, pattern, { locale: faIR })
  )
}
