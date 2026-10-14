"use client"

import * as React from "react"
import { getDaysInMonth, getYear, newDate } from "date-fns-jalali"

import { cn } from "cn"

import { Button } from "@/registry/bases/base/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/bases/base/ui/card"

const MONTHS_FA = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
] as const

const ITEM_HEIGHT = 40
const VISIBLE_COUNT = 5

function toFa(n: number) {
  return n.toLocaleString("fa-IR", { useGrouping: false })
}

function formatJalali(date: Date) {
  return date.toLocaleDateString("fa-IR", {
    calendar: "persian",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function clampDay(year: number, monthIndex: number, day: number) {
  const days = getDaysInMonth(newDate(year, monthIndex, 1))
  return Math.min(day, days)
}

type WheelColumnProps = {
  label: string
  items: { value: number; label: string }[]
  value: number
  onChange: (value: number) => void
}

function WheelColumn({ label, items, value, onChange }: WheelColumnProps) {
  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const settleTimerRef = React.useRef(0)
  const settlingRef = React.useRef(false)

  const selectedIndex = Math.max(
    0,
    items.findIndex((item) => item.value === value)
  )

  const scrollToIndex = React.useCallback((index: number, smooth: boolean) => {
    const el = scrollerRef.current
    if (!el) return
    settlingRef.current = true
    el.scrollTo({
      top: index * ITEM_HEIGHT,
      behavior: smooth ? "smooth" : "instant",
    })
    window.setTimeout(() => {
      settlingRef.current = false
    }, smooth ? 180 : 0)
  }, [])

  React.useEffect(() => {
    scrollToIndex(selectedIndex, false)
  }, [selectedIndex, items.length, scrollToIndex])

  React.useEffect(
    () => () => window.clearTimeout(settleTimerRef.current),
    []
  )

  const commitFromScroll = React.useCallback(() => {
    const el = scrollerRef.current
    if (!el || settlingRef.current) return
    const index = Math.round(el.scrollTop / ITEM_HEIGHT)
    const clamped = Math.max(0, Math.min(items.length - 1, index))
    const next = items[clamped]
    if (!next) return
    if (Math.abs(el.scrollTop - clamped * ITEM_HEIGHT) > 1) {
      scrollToIndex(clamped, true)
    }
    if (next.value !== value) onChange(next.value)
  }, [items, onChange, scrollToIndex, value])

  const onScroll = () => {
    window.clearTimeout(settleTimerRef.current)
    settleTimerRef.current = window.setTimeout(commitFromScroll, 80)
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
      <div className="text-sm font-semibold text-foreground">{label}</div>
      <div className="relative h-[200px] w-full">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-1 top-1/2 z-10 h-10 -translate-y-1/2 rounded-md bg-muted"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-20 h-16 bg-gradient-to-b from-card to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-16 bg-gradient-to-t from-card to-transparent"
        />
        <div
          ref={scrollerRef}
          onScroll={onScroll}
          className="h-full snap-y snap-mandatory overflow-y-auto overscroll-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{
            paddingBlock: ITEM_HEIGHT * Math.floor(VISIBLE_COUNT / 2),
          }}
        >
          {items.map((item) => {
            const selected = item.value === value
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => {
                  onChange(item.value)
                  const index = items.findIndex((x) => x.value === item.value)
                  scrollToIndex(index, true)
                }}
                className={cn(
                  "flex h-10 w-full shrink-0 snap-center items-center justify-center text-base transition-colors",
                  selected
                    ? "relative z-10 font-bold text-primary"
                    : "text-muted-foreground"
                )}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function DatetimePickerWheel() {
  const nowYear = getYear(new Date())
  const minYear = nowYear - 90
  const maxYear = nowYear

  const [year, setYear] = React.useState(1384)
  const [month, setMonth] = React.useState(0)
  const [day, setDay] = React.useState(1)
  const [confirmed, setConfirmed] = React.useState<Date | null>(null)

  const daysInMonth = getDaysInMonth(newDate(year, month, 1))
  const safeDay = Math.min(day, daysInMonth)

  React.useEffect(() => {
    if (day !== safeDay) setDay(safeDay)
  }, [day, safeDay])

  const years = React.useMemo(
    () =>
      Array.from({ length: maxYear - minYear + 1 }, (_, i) => {
        const y = maxYear - i
        return { value: y, label: toFa(y) }
      }),
    [maxYear, minYear]
  )

  const months = React.useMemo(
    () =>
      MONTHS_FA.map((label, index) => ({
        value: index,
        label,
      })),
    []
  )

  const days = React.useMemo(
    () =>
      Array.from({ length: daysInMonth }, (_, i) => {
        const d = i + 1
        return { value: d, label: toFa(d) }
      }),
    [daysInMonth]
  )

  return (
    <section
      dir="rtl"
      lang="fa"
      className="mx-auto flex min-h-svh max-w-sm flex-col items-center justify-center px-6 py-16 md:px-10"
    >
      <Card className="w-full max-w-[340px]">
        <CardHeader className="text-start">
          <CardTitle>انتخاب تاریخ</CardTitle>
          <CardDescription>
            چرخ روز، ماه و سال · مناسب موبایل و تاریخ تولد
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 pb-2">
          <div className="flex gap-1">
            {/* DOM: day → month → year so RTL paints سال | ماه | روز left→right */}
            <WheelColumn
              label="روز"
              items={days}
              value={safeDay}
              onChange={setDay}
            />
            <WheelColumn
              label="ماه"
              items={months}
              value={month}
              onChange={(nextMonth) => {
                setMonth(nextMonth)
                setDay((prev) => clampDay(year, nextMonth, prev))
              }}
            />
            <WheelColumn
              label="سال"
              items={years}
              value={year}
              onChange={(nextYear) => {
                setYear(nextYear)
                setDay((prev) => clampDay(nextYear, month, prev))
              }}
            />
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-3">
          <Button
            className="w-full"
            onClick={() => setConfirmed(newDate(year, month, safeDay))}
          >
            تایید
          </Button>
          {confirmed ? (
            <p className="text-center text-sm text-muted-foreground">
              {formatJalali(confirmed)}
            </p>
          ) : null}
        </CardFooter>
      </Card>
    </section>
  )
}
