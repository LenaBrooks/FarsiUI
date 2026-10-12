import {
  Rectangle,
  type BarShapeProps,
  type TooltipContentProps,
} from "recharts"

import type { MarketCandle } from "@/lib/chart2-mock-data"
import { formatJalaliDate, toPersianDigits } from "@/lib/chart2-fa"

export function timestampToMinutes(timestamp: number) {
  const date = new Date(timestamp)
  const h = date.getUTCHours()
  const m = String(date.getUTCMinutes()).padStart(2, "0")
  return toPersianDigits(`${h}:${m}`)
}

export function timestampToDay(timestamp: number) {
  const date = new Date(timestamp)
  const d = date.getUTCDate()
  const m = date.getUTCMonth() + 1
  return toPersianDigits(`${d}/${m}`)
}

/** برچسب دسته‌ای شبیه Apex با تاریخ جلالی + ساعت. */
export function timestampToCategoryLabel(timestamp: number) {
  const date = new Date(timestamp)
  const dayMonth = formatJalaliDate(date, { month: "short", day: "numeric" })
  const h = toPersianDigits(String(date.getUTCHours()).padStart(2, "0"))
  const m = toPersianDigits(String(date.getUTCMinutes()).padStart(2, "0"))
  return `${dayMonth} ${h}:${m}`
}

export function formatToman(value: number) {
  return `${toPersianDigits(value.toFixed(2))} تومان`
}

export function formatTomanTick(value: number) {
  return toPersianDigits(Number(value).toFixed(1))
}

export function formatVolume(value: number) {
  return toPersianDigits(Math.round(value).toLocaleString("en-US"))
}

/** دامنهٔ کامل شمع برای رسم بدنه + فتیله. */
export function candleRangeKey(entry: MarketCandle): [number, number] {
  return [entry.low, entry.high]
}

/** @deprecated برای سازگاری؛ ترجیح با candleRangeKey + CandlestickShape */
export function candleBodyKey(entry: MarketCandle): [number, number] {
  return [Math.min(entry.close, entry.open), Math.max(entry.close, entry.open)]
}

export function candleWhiskerKey(entry: MarketCandle): [number, number] {
  const highEnd = Math.max(entry.close, entry.open)
  return [highEnd - entry.low, entry.high - highEnd]
}

/** رنگ‌های پیش‌فرض کندل بایننس (سبز صعودی / قرمز نزولی). */
export const BINANCE_CANDLE_UP = "#0ECB81"
export const BINANCE_CANDLE_DOWN = "#F6465D"

export function isBullish(entry: Pick<MarketCandle, "open" | "close">) {
  return entry.close >= entry.open
}

export function candleColor(entry: Pick<MarketCandle, "open" | "close">) {
  return isBullish(entry) ? BINANCE_CANDLE_UP : BINANCE_CANDLE_DOWN
}

/** تولتیپ فارسی OHLC — بدون نام انگلیسی سری (مثل candleRangeKey). */
export function StockCandleTooltip({
  active,
  payload,
  labelKey = "time",
}: TooltipContentProps & { labelKey?: "time" | "label" }) {
  if (!(active && payload?.length)) return null
  const entry = payload[0]?.payload as
    | (MarketCandle & { label?: string })
    | undefined
  if (!entry) return null
  const heading =
    labelKey === "label" && entry.label
      ? entry.label
      : `زمان: ${timestampToMinutes(entry.time)}`
  return (
    <div className="rounded-lg border bg-background px-3 py-2 text-xs shadow-xl font-sans">
      <p className="mb-1 font-medium">{heading}</p>
      <p className="text-muted-foreground">باز: {formatToman(entry.open)}</p>
      <p className="text-muted-foreground">بسته: {formatToman(entry.close)}</p>
      <p className="text-muted-foreground">کمینه: {formatToman(entry.low)}</p>
      <p className="text-muted-foreground">بیشینه: {formatToman(entry.high)}</p>
    </div>
  )
}

/** بدنه و فتیله با همان رنگ بایننس. */
export function CandlestickShape(props: BarShapeProps) {
  const {
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    // @ts-expect-error payload OHLC
    open,
    // @ts-expect-error payload OHLC
    close,
    // @ts-expect-error payload OHLC
    low,
    // @ts-expect-error payload OHLC
    high,
  } = props

  if (high == null || low == null || high === low) {
    const color = candleColor({ open, close })
    return <Rectangle {...props} fill={color} stroke="none" />
  }

  const color = candleColor({ open, close })
  const cx = Number(x) + Number(width) / 2
  const scale = Number(height) / (high - low)
  const yHigh = Number(y)
  const yLow = Number(y) + Number(height)
  const yOpen = yHigh + (high - open) * scale
  const yClose = yHigh + (high - close) * scale
  const bodyTop = Math.min(yOpen, yClose)
  const bodyH = Math.max(1, Math.abs(yClose - yOpen))
  const bodyW = Math.max(2, Number(width) * 0.72)
  const bodyX = cx - bodyW / 2

  return (
    <g>
      <line
        x1={cx}
        x2={cx}
        y1={yHigh}
        y2={yLow}
        stroke={color}
        strokeWidth={1.25}
      />
      <rect
        x={bodyX}
        y={bodyTop}
        width={bodyW}
        height={bodyH}
        fill={color}
        stroke="none"
      />
    </g>
  )
}
