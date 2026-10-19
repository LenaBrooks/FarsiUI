"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { cn } from "cn"

import {
  CALENDAR_AVAILABLE_YEARS,
  getOccasionsForMonth,
  isHolidayDate,
} from "@/lib/calendar/data"
import {
  JALALI_MONTHS,
  WEEKDAYS_SHORT,
  addJalaliMonths,
  buildMonthGrid,
  dayParts,
  formatGregorianLong,
  formatHijriLong,
  formatJalaliLong,
  formatJalaliSlash,
  getZodiacFa,
  isFriday,
  monthGregorianRangeLabel,
  monthHijriRangeLabel,
  todayJalali,
  type JalaliYMD,
} from "@/lib/calendar/jalali"
import type { CalendarOccasion } from "@/lib/calendar/types"
import { formatPersianText, toPersianDigits } from "@/lib/digits"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york-v4/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"

function sameDay(a: JalaliYMD, b: JalaliYMD) {
  return a.year === b.year && a.month === b.month && a.day === b.day
}

/** Fixed hour-mark positions — rounded so SSR/CSR styles match. */
const CLOCK_MARKS = Array.from({ length: 12 }, (_, i) => {
  const n = i + 1
  const angle = (n * 30 - 90) * (Math.PI / 180)
  const r = 40
  return {
    n,
    left: `${(50 + r * Math.cos(angle)).toFixed(3)}%`,
    top: `${(50 + r * Math.sin(angle)).toFixed(3)}%`,
  }
})

function useNow() {
  const [now, setNow] = React.useState<Date | null>(null)
  React.useEffect(() => {
    setNow(new Date())
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])
  return now
}

function AnalogClock() {
  const hourRef = React.useRef<HTMLSpanElement>(null)
  const minuteRef = React.useRef<HTMLSpanElement>(null)
  const secondRef = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    let frame = 0
    const tick = () => {
      const now = new Date()
      const ms = now.getMilliseconds()
      const s = now.getSeconds() + ms / 1000
      const m = now.getMinutes() + s / 60
      const h = (now.getHours() % 12) + m / 60
      const secondDeg = s * 6
      const minuteDeg = m * 6
      const hourDeg = h * 30
      if (hourRef.current) {
        hourRef.current.style.transform = `translate(-50%, -100%) rotate(${hourDeg}deg)`
      }
      if (minuteRef.current) {
        minuteRef.current.style.transform = `translate(-50%, -100%) rotate(${minuteDeg}deg)`
      }
      if (secondRef.current) {
        secondRef.current.style.transform = `translate(-50%, -100%) rotate(${secondDeg}deg)`
      }
      frame = window.requestAnimationFrame(tick)
    }
    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [])

  return (
    <div className="relative mx-auto size-[100px] rounded-full border border-border bg-background shadow-sm sm:size-[120px]">
      {CLOCK_MARKS.map(({ n, left, top }) => (
        <span
          key={n}
          className="absolute text-xs font-medium text-foreground"
          style={{
            left,
            top,
            transform: "translate(-50%, -50%)",
          }}
        >
          {n}
        </span>
      ))}
      <span
        ref={hourRef}
        className="absolute left-1/2 top-1/2 h-[24%] w-[3px] origin-bottom rounded-full bg-foreground"
      />
      <span
        ref={minuteRef}
        className="absolute left-1/2 top-1/2 h-[32%] w-[2.5px] origin-bottom rounded-full bg-foreground/85"
      />
      <span
        ref={secondRef}
        className="absolute left-1/2 top-1/2 h-[36%] w-[1.5px] origin-bottom rounded-full bg-primary"
      />
      <span className="absolute left-1/2 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground" />
    </div>
  )
}

function DateColumn({
  label,
  primary,
  secondary,
  persianDigits = true,
  children,
}: {
  label: string
  primary: string
  secondary?: string
  persianDigits?: boolean
  children?: React.ReactNode
}) {
  const p = persianDigits ? toPersianDigits(primary) : primary
  const s =
    secondary == null
      ? null
      : persianDigits
        ? toPersianDigits(secondary)
        : secondary
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-1 px-2 py-2 text-center">
      <p className="text-sm font-semibold text-primary">{label}</p>
      {children ?? (
        <>
          <p className="text-base font-semibold tracking-tight tabular-nums text-foreground">
            {p}
          </p>
          {s ? (
            <p className="text-xs leading-5 text-muted-foreground">{s}</p>
          ) : null}
        </>
      )}
    </div>
  )
}

function OccasionRow({ item }: { item: CalendarOccasion }) {
  const day = Number(item.date.slice(-2))
  return (
    <li
      className={cn(
        "flex items-baseline gap-2 py-1.5 text-sm leading-6",
        item.isHoliday && "text-destructive"
      )}
    >
      <span className="shrink-0 font-semibold tracking-tight tabular-nums">
        {toPersianDigits(day)} {JALALI_MONTHS[Number(item.date.slice(5, 7)) - 1]}
      </span>
      <span
        className={cn("min-w-0", !item.isHoliday && "text-muted-foreground")}
      >
        {formatPersianText(item.title.fa)}
      </span>
    </li>
  )
}

export function IranCalendarApp({ year }: { year?: number }) {
  const router = useRouter()
  const today = React.useMemo(() => todayJalali(), [])
  const now = useNow()
  const availableYears = React.useMemo(
    () => [...CALENDAR_AVAILABLE_YEARS].sort((a, b) => b - a),
    []
  )
  const initialYear =
    year && CALENDAR_AVAILABLE_YEARS.includes(year) ? year : today.year
  const [cursor, setCursor] = React.useState<JalaliYMD>(() => ({
    year: initialYear,
    month: year && year !== today.year ? 1 : today.month,
    day: 1,
  }))
  const [selected, setSelected] = React.useState<JalaliYMD>(() =>
    year && year !== today.year
      ? { year, month: 1, day: 1 }
      : today
  )
  const [monthPickerOpen, setMonthPickerOpen] = React.useState(false)
  const [yearPickerOpen, setYearPickerOpen] = React.useState(false)
  const [pendingYear, setPendingYear] = React.useState(String(initialYear))

  React.useEffect(() => {
    if (year == null) {
      setCursor({ year: today.year, month: today.month, day: 1 })
      setSelected(today)
      return
    }
    if (!CALENDAR_AVAILABLE_YEARS.includes(year)) return
    if (year === today.year) {
      setCursor({ year: today.year, month: today.month, day: 1 })
      setSelected(today)
      return
    }
    setCursor({ year, month: 1, day: 1 })
    setSelected({ year, month: 1, day: 1 })
  }, [year, today])

  const grid = React.useMemo(
    () => buildMonthGrid(cursor.year, cursor.month),
    [cursor.year, cursor.month]
  )

  const monthOccasions = React.useMemo(
    () => getOccasionsForMonth(cursor.year, cursor.month),
    [cursor.year, cursor.month]
  )

  const greg = formatGregorianLong(selected)
  const hijri = formatHijriLong(selected)
  const zodiac = getZodiacFa(selected)
  const hasYearData = CALENDAR_AVAILABLE_YEARS.includes(cursor.year)
  const digital =
    now == null
      ? "-- : -- : -- --"
      : now
          .toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          })
          .replace(/:/g, " : ")

  function goMonth(delta: number) {
    setCursor((prev) => addJalaliMonths({ ...prev, day: 1 }, delta))
  }

  function goToday() {
    setCursor({ year: today.year, month: today.month, day: 1 })
    setSelected(today)
    if (CALENDAR_AVAILABLE_YEARS.includes(today.year)) {
      router.push(`/calendar/${today.year}`)
    } else {
      router.push("/calendar")
    }
  }

  function goToYear(nextYear: number) {
    if (!CALENDAR_AVAILABLE_YEARS.includes(nextYear)) return
    const nextSelected =
      nextYear === today.year
        ? today
        : { year: nextYear, month: 1, day: 1 }
    setCursor({
      year: nextYear,
      month: nextYear === today.year ? today.month : 1,
      day: 1,
    })
    setSelected(nextSelected)
    setYearPickerOpen(false)
    router.push(`/calendar/${nextYear}`)
  }

  function selectDay(ymd: JalaliYMD) {
    setSelected(ymd)
    setCursor((prev) => ({ ...prev, year: ymd.year, month: ymd.month }))
  }

  return (
    <div
      className="mx-auto flex w-full max-w-6xl flex-col gap-4 text-foreground"
      dir="rtl"
      lang="fa"
    >
      <section className="flex flex-col items-center gap-4 sm:gap-5 lg:flex-row-reverse lg:items-center">
        <div className="flex shrink-0 flex-col items-center gap-1.5">
          <AnalogClock />
          <p className="text-sm font-bold tabular-nums tracking-wide text-foreground sm:text-base">
            {digital}
          </p>
        </div>

        <div className="min-w-0 w-full flex-1 rounded-xl border border-border bg-card px-4 py-4 shadow-sm sm:px-5">
          <div className="flex flex-col items-center gap-1 border-b border-border pb-3 text-center sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-center sm:gap-x-2 sm:gap-y-1">
            <h1 className="text-base font-semibold tracking-tight text-primary sm:text-lg">
              ساعت و تقویم ایران
            </h1>
            <span className="hidden text-muted-foreground sm:inline" aria-hidden>
              |
            </span>
            <p className="text-sm font-medium text-primary sm:text-base">
              {toPersianDigits(formatJalaliLong(selected))}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-2 gap-y-4 pt-4 sm:flex sm:flex-wrap sm:justify-center sm:gap-y-2 lg:justify-between">
            <DateColumn
              label="تاریخ خورشیدی"
              primary={formatJalaliSlash(selected)}
              secondary={formatJalaliLong(selected)}
            />
            <DateColumn
              label="تاریخ میلادی"
              primary={greg.slash}
              secondary={greg.line}
              persianDigits={false}
            />
            <DateColumn
              label="تاریخ قمری"
              primary={hijri.slash}
              secondary={hijri.line}
            />
            <DateColumn label="برج فلکی" primary={zodiac.name}>
              <p className="flex items-center justify-center gap-2 text-base font-semibold tracking-tight text-foreground">
                <span aria-hidden className="text-primary">
                  {zodiac.symbol}
                </span>
                <span>{zodiac.name}</span>
              </p>
            </DateColumn>
          </div>
        </div>
      </section>

      <div className="flex flex-col items-start gap-4 lg:flex-row">
        <section className="w-full max-w-[570px] shrink-0 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-start justify-between gap-2 px-3 pt-4 sm:px-4 md:px-5">
            <button
              type="button"
              onClick={() => goMonth(-1)}
              className="mt-1 inline-flex !cursor-pointer items-center gap-1 text-xs font-medium text-primary"
            >
              <ChevronRightIcon className="size-4" />
              ماه قبل
            </button>

            <div className="relative flex flex-col items-center gap-1 text-center">
              <div className="inline-flex items-center gap-2 text-lg font-semibold tracking-tight text-primary">
                <Popover open={monthPickerOpen} onOpenChange={setMonthPickerOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex cursor-pointer items-center gap-1.5"
                      aria-label="انتخاب ماه"
                    >
                      <span className="inline-flex size-6 items-center justify-center rounded-full border border-primary text-primary">
                        <ChevronDownIcon className="size-3.5" />
                      </span>
                      {JALALI_MONTHS[cursor.month - 1]}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    dir="rtl"
                    align="center"
                    sideOffset={8}
                    className="w-[min(100vw-2rem,28rem)] rounded-xl border border-border p-0 shadow-md"
                  >
                    <p className="border-b border-border px-4 py-3 text-center text-sm text-muted-foreground">
                      ماه مورد نظر خود را انتخاب کنید.
                    </p>
                    <div className="grid grid-cols-3 gap-x-3 gap-y-1 px-3 py-3">
                      {JALALI_MONTHS.map((name, index) => {
                        const month = index + 1
                        const active = cursor.month === month
                        return (
                          <button
                            key={name}
                            type="button"
                            onClick={() => {
                              setCursor((prev) => ({
                                ...prev,
                                month,
                                day: 1,
                              }))
                              setMonthPickerOpen(false)
                            }}
                            className="flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg px-1 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                          >
                            <span
                              className={cn(
                                "relative flex size-4 shrink-0 items-center justify-center rounded-full border",
                                active
                                  ? "border-primary"
                                  : "border-muted-foreground/40"
                              )}
                              aria-hidden
                            >
                              {active ? (
                                <span className="size-2 rounded-full bg-primary" />
                              ) : null}
                            </span>
                            <span
                              className={cn(
                                "whitespace-nowrap tabular-nums",
                                active && "font-semibold text-primary"
                              )}
                            >
                              {toPersianDigits(month)}.&nbsp;{name}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </PopoverContent>
                </Popover>

                <Popover
                  open={yearPickerOpen}
                  onOpenChange={(open) => {
                    setYearPickerOpen(open)
                    if (open) setPendingYear(String(cursor.year))
                  }}
                >
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex cursor-pointer items-center gap-1.5 tabular-nums"
                      aria-label="انتخاب سال"
                    >
                      {toPersianDigits(cursor.year)}
                      <span className="inline-flex size-6 items-center justify-center rounded-full border border-primary text-primary">
                        <ChevronDownIcon className="size-3.5" />
                      </span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    dir="rtl"
                    align="center"
                    sideOffset={8}
                    className="w-[min(100vw-2rem,22rem)] rounded-xl border border-border p-0 shadow-md"
                  >
                    <p className="border-b border-border px-4 py-3 text-center text-sm text-muted-foreground">
                      سال مورد نظر خود را انتخاب کنید.
                    </p>
                    <form
                      className="px-3 py-3"
                      onSubmit={(event) => {
                        event.preventDefault()
                        goToYear(Number(pendingYear))
                      }}
                    >
                      <div className="flex h-10 overflow-hidden rounded-lg border border-border bg-background">
                        <button
                          type="submit"
                          className="shrink-0 cursor-pointer bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                          برو
                        </button>
                        <Select
                          dir="rtl"
                          value={pendingYear}
                          onValueChange={setPendingYear}
                        >
                          <SelectTrigger
                            size="sm"
                            className="h-full min-w-0 flex-1 rounded-none border-0 border-x border-border bg-transparent shadow-none focus-visible:ring-0"
                          >
                            <SelectValue placeholder="انتخاب سال" />
                          </SelectTrigger>
                          <SelectContent
                            dir="rtl"
                            className="max-h-64"
                            position="popper"
                          >
                            {availableYears.map((y) => (
                              <SelectItem
                                key={y}
                                value={String(y)}
                                className="tabular-nums"
                              >
                                {toPersianDigits(y)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <span className="flex shrink-0 items-center px-3 text-sm text-muted-foreground">
                          به سال
                        </span>
                      </div>
                    </form>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="mt-1 flex flex-col gap-1.5 text-xs leading-relaxed text-muted-foreground">
                <p dir="ltr" className="tabular-nums">
                  {monthGregorianRangeLabel(cursor.year, cursor.month)}
                </p>
                <p>
                  {toPersianDigits(
                    monthHijriRangeLabel(cursor.year, cursor.month)
                  )}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => goMonth(1)}
              className="mt-1 inline-flex !cursor-pointer items-center gap-1 text-xs font-medium text-primary"
            >
              ماه بعد
              <ChevronLeftIcon className="size-4" />
            </button>
          </div>

          <div className="mx-auto w-full max-w-[522px] px-2 sm:px-3">
            <div className="flex min-h-[360px] w-full flex-col overflow-hidden rounded-xl border border-border bg-background sm:min-h-[429px]">
              <div className="mx-1.5 mt-2 grid grid-cols-7 rounded-lg bg-primary text-center text-[11px] font-medium text-primary-foreground sm:mx-2 sm:text-sm">
                {WEEKDAYS_SHORT.map((day) => (
                  <div key={day} className="px-0.5 py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid min-h-0 flex-1 grid-cols-7 content-evenly justify-items-center gap-y-0.5 px-1.5 py-1.5 sm:px-2 sm:py-1">
                {grid.map((cell) => {
                  const holiday = isHolidayDate(cell.ymd.year, cell.date)
                  const friday = isFriday(cell.ymd)
                  const isToday = sameDay(cell.ymd, today)
                  const isSelected = sameDay(cell.ymd, selected)
                  const weekend = holiday || friday
                  const parts = dayParts(cell.ymd)
                  const outside = !cell.inMonth

                  return (
                    <button
                      key={cell.date}
                      type="button"
                      onClick={() => selectDay(cell.ymd)}
                      className={cn(
                        "flex h-11 w-full max-w-[57px] cursor-pointer flex-col items-center justify-center gap-0.5 rounded-lg transition-colors sm:h-[53px]",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        outside && "text-muted-foreground/50",
                        weekend && !outside && "bg-destructive/10",
                        !weekend && !outside && "hover:bg-muted/60",
                        isSelected &&
                          "bg-transparent text-primary ring-2 ring-primary ring-inset",
                        isToday &&
                          !isSelected &&
                          "ring-2 ring-primary/35 ring-inset"
                      )}
                    >
                      <span
                        className={cn(
                          "text-lg font-semibold tabular-nums leading-none sm:text-xl",
                          outside && "text-muted-foreground/45",
                          !outside && weekend && "text-destructive",
                          !outside &&
                            !weekend &&
                            !isSelected &&
                            "text-foreground",
                          isSelected && "text-primary"
                        )}
                      >
                        {toPersianDigits(parts.jalaliDay)}
                      </span>
                      <div
                        className={cn(
                          "flex items-center justify-center gap-1 text-[10px] font-normal tabular-nums leading-none sm:gap-1.5 sm:text-xs",
                          outside && "text-muted-foreground/40",
                          !outside && weekend && "text-destructive/70",
                          !outside &&
                            !weekend &&
                            !isSelected &&
                            "text-muted-foreground",
                          isSelected && "text-primary/80"
                        )}
                      >
                        <span>{toPersianDigits(pad2(parts.hijriDay))}</span>
                        <span dir="ltr">{String(parts.gregorianDay)}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="pb-3 pt-2">
              <button
                type="button"
                onClick={goToday}
                className="w-full cursor-pointer rounded-xl border border-border bg-background py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                برو به امروز
              </button>
            </div>
          </div>
        </section>

        <section className="min-w-0 w-full flex-1 rounded-xl border border-border bg-card px-4 py-4 shadow-sm sm:px-5 lg:max-w-md">
          <h2 className="mb-3 text-base font-semibold tracking-tight">
            مناسبت‌های ماه {JALALI_MONTHS[cursor.month - 1]}
          </h2>
          {!hasYearData ? (
            <p className="text-sm text-muted-foreground">
              دادهٔ این سال هنوز اضافه نشده است.
            </p>
          ) : monthOccasions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              مناسبتی برای این ماه ثبت نشده است.
            </p>
          ) : (
            <ul className="max-h-[34rem] overflow-y-auto pe-1">
              {monthOccasions.map((item) => (
                <OccasionRow key={item.id} item={item} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}

function pad2(n: number) {
  return String(n).padStart(2, "0")
}
