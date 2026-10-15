"use client"

import * as React from "react"
import { format } from "date-fns-jalali"

import { useChartCaption } from "@/registry/new-york-v4/lib/chart-live"
import {
  FA_MONTHS_FULL,
  formatJalaliDate,
  formatPersianNumber,
  toPersianDigits,
} from "@/lib/chart-fa"
import { cn } from "@/lib/utils"

export const FA_WEEKDAYS_FULL = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنج‌شنبه",
  "جمعه",
] as const

export const FA_WEEKDAYS_SHORT = [
  "ش",
  "ی",
  "د",
  "س",
  "چ",
  "پ",
  "ج",
] as const

export type HeatDayValue = { date: Date | string; value: number }

/** Sat=0 … Fri=6 (Iranian week). */
export function satWeekday(date: Date) {
  return (date.getDay() + 1) % 7
}

export function dayKey(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function addDays(date: Date, n: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + n)
  return next
}

export function startOfLocalDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

/** Deterministic LCG for demo data. */
export function seededRandom(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0
    return s / 0x100000000
  }
}

export function generateCalendarHeatData(
  days: number,
  seed: number,
  end: Date = new Date()
): HeatDayValue[] {
  const rnd = seededRandom(seed)
  const last = startOfLocalDay(end)
  const out: HeatDayValue[] = []
  for (let i = days - 1; i >= 0; i--) {
    const date = addDays(last, -i)
    const dow = satWeekday(date)
    const weekendBoost = dow >= 5 ? 1.35 : 1
    const spike = rnd() > 0.92 ? 2.4 : 1
    const value = Math.floor(rnd() * 14 * weekendBoost * spike)
    if (value > 0) out.push({ date, value })
  }
  return out
}

export function generateMatrixHeatData(
  rows: number,
  cols: number,
  seed: number
): number[][] {
  const rnd = seededRandom(seed)
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => {
      const hourPeak = Math.exp(-Math.pow((c - 14) / 6, 2))
      const evening = Math.exp(-Math.pow((c - 21) / 3.5, 2))
      const friBoost = r === 6 ? 1.25 : 1
      return Math.round((8 + rnd() * 40 + hourPeak * 90 + evening * 70) * friBoost)
    })
  )
}

const LEVEL_OPACITY = [0.08, 0.28, 0.48, 0.72, 1] as const

function levelOf(value: number, max: number) {
  if (!value || value <= 0) return 0
  return Math.min(4, 1 + Math.floor((value / (max || 1)) * 3.999))
}

function HeatLegend({ color }: { color: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
      <span>کمتر</span>
      <div className="flex items-center gap-1">
        {LEVEL_OPACITY.map((opacity, i) => (
          <span
            key={i}
            className="size-2.5 rounded-[3px] ring-1 ring-foreground/10"
            style={{
              background:
                i === 0
                  ? "color-mix(in oklab, var(--foreground) 10%, transparent)"
                  : color,
              opacity: i === 0 ? 1 : opacity,
            }}
          />
        ))}
      </div>
      <span>بیشتر</span>
    </div>
  )
}

function useContainerWidth<T extends HTMLElement>() {
  const ref = React.useRef<T | null>(null)
  const [width, setWidth] = React.useState(0)
  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      setWidth(Math.round(entry.contentRect.width))
    })
    ro.observe(el)
    setWidth(Math.round(el.clientWidth))
    return () => ro.disconnect()
  }, [])
  return [ref, width] as const
}

type TooltipState = {
  x: number
  y: number
  title: string
  value: string
}

function FloatingTip({ tip, width }: { tip: TooltipState | null; width: number }) {
  if (!tip) return null
  const flip = tip.x < Math.min(180, width * 0.4)
  return (
    <div
      role="tooltip"
      className="pointer-events-none absolute z-20 min-w-36 max-w-56 rounded-xl border border-border/80 bg-popover/95 px-3 py-2 text-xs shadow-lg backdrop-blur-md"
      style={{
        left: tip.x,
        top: tip.y,
        transform: `translate(${flip ? "12px" : "calc(-100% - 12px)"}, -50%)`,
      }}
    >
      <p className="font-medium text-foreground">{tip.title}</p>
      <p className="mt-0.5 text-muted-foreground">{tip.value}</p>
    </div>
  )
}

export type CalendarHeatmapProps = {
  data: HeatDayValue[]
  caption?: string
  days?: number
  end?: Date
  holidays?: (Date | string)[]
  unit?: string
  color?: string
  className?: string
}

export function CalendarHeatmap({
  data,
  caption,
  days = 365,
  end,
  holidays,
  unit = "سفارش",
  color = "var(--chart-1)",
  className,
}: CalendarHeatmapProps) {
  useChartCaption(() => caption ?? null, [caption])

  const last = React.useMemo(
    () => startOfLocalDay(end ?? new Date()),
    [end]
  )
  const holidaySet = React.useMemo(
    () =>
      new Set(
        (holidays ?? []).map((d) =>
          typeof d === "string" ? d.slice(0, 10) : dayKey(d)
        )
      ),
    [holidays]
  )

  const { cells, weekCount, max, total } = React.useMemo(() => {
    const map = new Map<string, number>()
    for (const row of data) {
      const key =
        typeof row.date === "string" ? row.date.slice(0, 10) : dayKey(row.date)
      map.set(key, (map.get(key) ?? 0) + row.value)
    }
    let first = addDays(last, -(days - 1))
    first = addDays(first, -satWeekday(first))
    const out: {
      date: Date
      key: string
      value: number
      week: number
      dow: number
      inRange: boolean
    }[] = []
    const rangeStart = addDays(last, -(days - 1))
    for (let d = first, i = 0; d <= last; d = addDays(d, 1), i++) {
      const key = dayKey(d)
      out.push({
        date: d,
        key,
        value: map.get(key) ?? 0,
        week: Math.floor(i / 7),
        dow: satWeekday(d),
        inRange: d >= rangeStart,
      })
    }
    const inRange = out.filter((c) => c.inRange)
    return {
      cells: out,
      weekCount: Math.ceil(out.length / 7),
      max: Math.max(1, ...inRange.map((c) => c.value)),
      total: inRange.reduce((sum, cell) => sum + cell.value, 0),
    }
  }, [data, days, last])

  const [wrapRef, width] = useContainerWidth<HTMLDivElement>()
  const [active, setActive] = React.useState<number | null>(null)
  const [tip, setTip] = React.useState<TooltipState | null>(null)

  const describe = React.useCallback(
    (c: (typeof cells)[number]) => {
      const label = formatJalaliDate(c.date, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      return holidaySet.has(c.key) ? `${label} (تعطیل)` : label
    },
    [holidaySet]
  )

  const side = 22
  const head = 20
  const gap = 3
  const fit = (w: number) => {
    const ideal = (w - side) / weekCount - gap
    if (ideal >= 10) return { cell: Math.min(15, ideal), skip: 0 }
    const shown = Math.max(1, Math.floor((w - side) / (10 + gap)))
    return { cell: 10, skip: Math.max(0, weekCount - shown) }
  }

  const { cell, skip } = width > 0 ? fit(width) : { cell: 12, skip: 0 }
  const pitch = cell + gap
  const height = head + 7 * pitch
  const gridRight = Math.max(side, width - side)

  const months = React.useMemo(() => {
    const list: { week: number; label: string }[] = []
    for (const c of cells) {
      if (!c.inRange || c.week < skip) continue
      const day = Number(format(c.date, "d"))
      const monthIdx = Number(format(c.date, "M")) - 1
      if (day === 1 || (list.length === 0 && c.dow === 0)) {
        list.push({
          week: c.week,
          label: FA_MONTHS_FULL[monthIdx] ?? format(c.date, "MMMM"),
        })
      }
    }
    return list.filter((m, i, arr) => {
      if (i === 0) return true
      return (m.week - arr[i - 1]!.week) * pitch > 28
    })
  }, [cells, pitch, skip])

  const cx = (week: number) => gridRight - (week - skip + 1) * pitch + gap / 2
  const cy = (dow: number) => head + dow * pitch

  const showTip = (index: number, el: SVGRectElement) => {
    const c = cells[index]!
    const box = el.ownerSVGElement?.getBoundingClientRect()
    const rect = el.getBoundingClientRect()
    if (!box) return
    setActive(index)
    setTip({
      x: rect.left - box.left + rect.width / 2,
      y: rect.top - box.top + rect.height / 2,
      title: describe(c),
      value: c.value
        ? `${formatPersianNumber(c.value)} ${unit}`
        : `بدون ${unit}`,
    })
  }

  return (
    <div className={cn("w-full max-w-[760px] space-y-3 font-sans", className)}>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <p className="text-[12px] text-muted-foreground">
          جمع {formatPersianNumber(total)} {unit} در {toPersianDigits(days)} روز
        </p>
        <HeatLegend color={color} />
      </div>
      <div
        ref={wrapRef}
        className="relative w-full outline-none"
        onPointerLeave={() => {
          setActive(null)
          setTip(null)
        }}
      >
        {width > 0 && (
          <svg
            width={width}
            height={height}
            direction="rtl"
            className="overflow-visible"
            role="img"
            aria-label="نقشه حرارتی تقویم"
          >
            {months.map((m) => (
              <text
                key={`${m.week}-${m.label}`}
                x={cx(m.week) + cell / 2}
                y={11}
                textAnchor="middle"
                className="fill-muted-foreground text-[10px]"
              >
                {m.label}
              </text>
            ))}
            {FA_WEEKDAYS_SHORT.map((d, i) =>
              cell < 11 && i % 2 === 1 ? null : (
                <text
                  key={d + i}
                  x={width - 4}
                  y={cy(i) + cell * 0.72}
                  textAnchor="end"
                  className="fill-muted-foreground text-[9px]"
                >
                  {d}
                </text>
              )
            )}
            {cells.map((c, i) => {
              if (!c.inRange || c.week < skip) return null
              const lvl = levelOf(c.value, max)
              const isActive = active === i
              const isHoliday = holidaySet.has(c.key)
              return (
                <rect
                  key={c.key}
                  x={cx(c.week)}
                  y={cy(c.dow)}
                  width={cell}
                  height={cell}
                  rx={Math.min(4, cell / 3.2)}
                  fill={
                    lvl === 0
                      ? "color-mix(in oklab, var(--foreground) 10%, transparent)"
                      : color
                  }
                  fillOpacity={lvl === 0 ? 1 : LEVEL_OPACITY[lvl]}
                  stroke={
                    isActive
                      ? "var(--foreground)"
                      : isHoliday
                        ? "var(--destructive)"
                        : "transparent"
                  }
                  strokeWidth={isActive ? 1.75 : isHoliday ? 1.25 : 0}
                  className="cursor-pointer transition-[filter,opacity] duration-150"
                  style={{
                    filter: isActive
                      ? "drop-shadow(0 0 6px color-mix(in oklab, var(--foreground) 35%, transparent))"
                      : undefined,
                  }}
                  onPointerEnter={(e) => showTip(i, e.currentTarget)}
                />
              )
            })}
          </svg>
        )}
        <FloatingTip tip={tip} width={width} />
      </div>
    </div>
  )
}

export type MatrixHeatmapProps = {
  rows: string[]
  cols: string[]
  values: number[][]
  caption?: string
  color?: string
  showValues?: boolean
  className?: string
}

export function MatrixHeatmap({
  rows,
  cols,
  values,
  caption,
  color = "var(--chart-2)",
  showValues = false,
  className,
}: MatrixHeatmapProps) {
  useChartCaption(() => caption ?? null, [caption])

  const [wrapRef, width] = useContainerWidth<HTMLDivElement>()
  const [active, setActive] = React.useState<[number, number] | null>(null)
  const [tip, setTip] = React.useState<TooltipState | null>(null)
  const max = Math.max(1, ...values.flat())
  // Gutter for row labels (LTR coords): labels sit just outside the grid, no overflow.
  const labelW = Math.min(
    58,
    Math.max(36, Math.max(...rows.map((r) => r.length)) * 5.5 + 6)
  )
  const labelGap = 5
  const sideW = labelW + labelGap
  const head = 18
  const gap = 2

  const cw = width > 0 ? (width - sideW) / cols.length : 14
  const ch = Math.max(16, Math.min(32, cw * 0.85))
  const height = head + rows.length * ch
  const gridRight = width - sideW

  const showTip = (i: number, j: number, el: SVGRectElement) => {
    const box = el.ownerSVGElement?.getBoundingClientRect()
    const rect = el.getBoundingClientRect()
    if (!box) return
    const v = values[i]?.[j] ?? 0
    setActive([i, j])
    setTip({
      x: rect.left - box.left + rect.width / 2,
      y: rect.top - box.top + rect.height / 2,
      title: `${rows[i]} · ساعت ${toPersianDigits(cols[j] ?? "")}`,
      value: `${formatPersianNumber(v)} بازدید`,
    })
  }

  return (
    <div className={cn("w-full max-w-[760px] space-y-3 font-sans", className)}>
      <div className="flex justify-end">
        <HeatLegend color={color} />
      </div>
      <div
        ref={wrapRef}
        className="relative w-full overflow-hidden"
        onPointerLeave={() => {
          setActive(null)
          setTip(null)
        }}
      >
        {width > 0 && (
          <svg
            width={width}
            height={height}
            className="block overflow-hidden"
            role="img"
            aria-label="نقشه حرارتی ماتریسی"
          >
            {cols.map((c, j) =>
              j % Math.max(1, Math.ceil(24 / Math.max(cw, 1))) === 0 ? (
                <text
                  key={c}
                  x={gridRight - (j + 0.5) * cw}
                  y={12}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[9px]"
                >
                  {toPersianDigits(c)}
                </text>
              ) : null
            )}
            {rows.map((r, i) => (
              <text
                key={r}
                x={width - 1}
                y={head + i * ch + ch * 0.68}
                textAnchor="end"
                className="fill-muted-foreground text-[10px]"
              >
                {r}
              </text>
            ))}
            {rows.map((_, i) =>
              cols.map((_, j) => {
                const v = values[i]?.[j] ?? 0
                const on = active?.[0] === i && active?.[1] === j
                const t = v / max
                const x = gridRight - (j + 1) * cw + gap / 2
                const y = head + i * ch + gap / 2
                return (
                  <g key={`${i}-${j}`}>
                    <rect
                      x={x}
                      y={y}
                      width={Math.max(1, cw - gap)}
                      height={Math.max(1, ch - gap)}
                      rx={4}
                      fill={
                        v <= 0
                          ? "color-mix(in oklab, var(--foreground) 8%, transparent)"
                          : color
                      }
                      fillOpacity={v <= 0 ? 1 : 0.18 + t * 0.82}
                      stroke={on ? "var(--foreground)" : "transparent"}
                      strokeWidth={on ? 1.5 : 0}
                      className="cursor-pointer transition-[filter] duration-150"
                      style={{
                        filter: on
                          ? "drop-shadow(0 0 8px color-mix(in oklab, var(--foreground) 30%, transparent))"
                          : undefined,
                      }}
                      onPointerEnter={(e) => showTip(i, j, e.currentTarget)}
                    />
                    {showValues && cw > 28 && v > 0 && (
                      <text
                        x={x + (cw - gap) / 2}
                        y={y + (ch - gap) * 0.68}
                        textAnchor="middle"
                        className="pointer-events-none text-[9px]"
                        fill={
                          t > 0.55
                            ? "var(--background)"
                            : "var(--foreground)"
                        }
                      >
                        {formatPersianNumber(v)}
                      </text>
                    )}
                  </g>
                )
              })
            )}
          </svg>
        )}
        <FloatingTip tip={tip} width={width} />
      </div>
    </div>
  )
}
