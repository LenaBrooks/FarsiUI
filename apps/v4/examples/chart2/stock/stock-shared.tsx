import {
  Rectangle,
  type BarShapeProps,
  type TooltipContentProps,
} from "recharts"

import {
  formatToman as formatTomanLocale,
  splitTomanCompact,
} from "@/lib/chart-locale"
import { JalaliDayMonthTick } from "@/lib/chart-jalali-tick"
import {
  CHART2_DOWN,
  CHART2_UP,
  formatJalaliDate,
  toPersianDigits,
} from "@/lib/chart2-fa"
import {
  between,
  random,
  type MarketCandle,
} from "@/lib/chart2-mock-data"

/** نام قدیمی گالری سهام — همان JalaliDayMonthTick. */
export const JalaliDayTick = JalaliDayMonthTick

export function timestampToMinutes(timestamp: number) {
  const date = new Date(timestamp)
  const h = date.getUTCHours()
  const m = String(date.getUTCMinutes()).padStart(2, "0")
  return toPersianDigits(`${h}:${m}`)
}

/** ترتیب منطقی فارسی برای متن RTL: روز سپس ماه. */
export function timestampToDay(timestamp: number) {
  const date = new Date(timestamp)
  const day = formatJalaliDate(date, { day: "numeric" })
  const month = formatJalaliDate(date, { month: "short" })
  return `${day} ${month}`
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
  const compact = Math.abs(value) >= 1_000
  const normalized = compact ? Math.round(value) : +value.toFixed(2)
  return formatTomanLocale(normalized, { compact, suffix: true })
}

/** تومان فشرده یک‌خط برای هدر داشبورد. */
export function formatMoneyOneLine(value: number) {
  const { amount, unit } = splitTomanCompact(value)
  // FSI…PDI تا RTL رقم‌ها را دور ممیز جابه‌جا نکند (مثلاً ۲٫۴۷ → ۳۷ ، ۲).
  return `\u2068${amount}\u2069\u00A0${unit}`
}

export function formatPctChange(value: number) {
  const sign = value > 0 ? "+" : ""
  return `${sign}${toPersianDigits(value.toFixed(1))}٪`
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

/** رنگ نرم صعود/نزول — هم‌خانواده پالت chart2. */
export const CANDLE_UP = CHART2_UP
export const CANDLE_DOWN = CHART2_DOWN

/** @deprecated از CANDLE_UP استفاده کنید */
export const BINANCE_CANDLE_UP = CANDLE_UP
/** @deprecated از CANDLE_DOWN استفاده کنید */
export const BINANCE_CANDLE_DOWN = CANDLE_DOWN

export function isBullish(entry: Pick<MarketCandle, "open" | "close">) {
  return entry.close >= entry.open
}

export function candleColor(entry: Pick<MarketCandle, "open" | "close">) {
  return isBullish(entry) ? CANDLE_UP : CANDLE_DOWN
}

/** بج درصد سبز/قرمز — هم‌سبک اسپارک‌لاین. */
export function ChangeBadge({
  value,
  good,
}: {
  value: number
  good: boolean
}) {
  return (
    <span
      className="shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-medium"
      style={{
        color: good ? CANDLE_UP : CANDLE_DOWN,
        background: good ? `${CANDLE_UP}18` : `${CANDLE_DOWN}18`,
      }}
    >
      {formatPctChange(value)}
    </span>
  )
}

/** تولتیپ فارسی OHLC — بدون نام انگلیسی سری (مثل candleRangeKey). */
export function StockCandleTooltip({
  active,
  payload,
  labelKey = "time",
  dayLabel = false,
  compact = false,
}: TooltipContentProps & {
  labelKey?: "time" | "label"
  dayLabel?: boolean
  /** فقط تاریخ + باز/بسته — بدون کمینه/بیشینه/درصد. */
  compact?: boolean
}) {
  if (!(active && payload?.length)) return null
  const entry = payload[0]?.payload as
    | (MarketCandle & { label?: string })
    | undefined
  if (!entry) return null
  const heading =
    labelKey === "label" && entry.label
      ? entry.label
      : dayLabel
        ? timestampToDay(entry.time)
        : `زمان: ${timestampToMinutes(entry.time)}`
  const bullish = isBullish(entry)
  const changePct = entry.open === 0 ? 0 : ((entry.close - entry.open) / entry.open) * 100
  return (
    <div
      className="rounded-lg border bg-background px-3 py-2.5 text-xs shadow-xl font-sans min-w-[9rem]"
      dir="rtl"
    >
      <div className="mb-2 flex items-center gap-2">
        <span
          className="size-2.5 shrink-0 rounded-[2px]"
          style={{ background: candleColor(entry) }}
          aria-hidden
        />
        <p className="font-medium leading-none">{heading}</p>
      </div>
      <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-muted-foreground">
        <span>باز</span>
        <span className="text-end text-foreground">{formatToman(entry.open)}</span>
        <span>بسته</span>
        <span className="text-end text-foreground">{formatToman(entry.close)}</span>
        {compact ? null : (
          <>
            <span>کمینه</span>
            <span className="text-end text-foreground">
              {formatToman(entry.low)}
            </span>
            <span>بیشینه</span>
            <span className="text-end text-foreground">
              {formatToman(entry.high)}
            </span>
          </>
        )}
      </div>
      {compact ? null : (
        <p
          className="mt-2 border-t pt-1.5 text-end"
          style={{ color: candleColor(entry) }}
        >
          {bullish ? "+" : ""}
          {toPersianDigits(changePct.toFixed(2))}٪
        </p>
      )}
    </div>
  )
}

/** بدنه و فتیله با نسبت طبیعی‌تر (بدنه باریک‌تر، فتیله ظریف). */
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
  const bodyH = Math.max(1.5, Math.abs(yClose - yOpen))
  const slot = Number(width)
  const bodyW = Math.max(4, slot * 0.88)
  const bodyX = cx - bodyW / 2

  return (
    <g>
      <line
        x1={cx}
        x2={cx}
        y1={yHigh}
        y2={yLow}
        stroke={color}
        strokeWidth={1.15}
        strokeLinecap="round"
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

/** سری روزانه با نوسان درصدی — پایهٔ مشترک دموهای سهام. */
export function generateNaturalCandles(
  length = 48,
  seed = 2141,
  startPrice = 2_420_000,
  startTime = Date.UTC(2025, 8, 1)
): MarketCandle[] {
  const gen = random(seed)
  const candles: MarketCandle[] = []
  const dayMs = 24 * 60 * 60 * 1000
  let lastClose = startPrice

  for (let i = 0; i < length; i++) {
    const time = startTime + i * dayMs
    const open = lastClose
    const drift = between(gen, -18, 20) / 10_000
    const shock = between(gen, 0, 100) > 86 ? between(gen, -40, 40) / 10_000 : 0
    const close = Math.max(10_000, Math.round(open * (1 + drift + shock)))
    const bodyTop = Math.max(open, close)
    const bodyBottom = Math.min(open, close)
    const upperWick = Math.round(bodyTop * (between(gen, 8, 70) / 10_000))
    const lowerWick = Math.round(bodyBottom * (between(gen, 8, 70) / 10_000))
    const high = bodyTop + upperWick
    const low = Math.max(1_000, bodyBottom - lowerWick)
    const volume = between(gen, 12_000, 95_000)
    candles.push({ time, open, close, low, high, volume })
    lastClose = close
  }

  return candles
}

export function toHeikinAshi(candles: MarketCandle[]): MarketCandle[] {
  const out: MarketCandle[] = []
  for (let i = 0; i < candles.length; i++) {
    const c = candles[i]!
    const haClose = Math.round((c.open + c.high + c.low + c.close) / 4)
    const prev = out[i - 1]
    const haOpen = prev
      ? Math.round((prev.open + prev.close) / 2)
      : Math.round((c.open + c.close) / 2)
    const haHigh = Math.max(c.high, haOpen, haClose)
    const haLow = Math.min(c.low, haOpen, haClose)
    out.push({
      time: c.time,
      open: haOpen,
      close: haClose,
      high: haHigh,
      low: haLow,
      volume: c.volume,
    })
  }
  return out
}

export type RenkoBrick = {
  time: number
  open: number
  close: number
  low: number
  high: number
  volume: number
  up: boolean
}

export function toRenko(
  candles: MarketCandle[],
  brickSize: number
): RenkoBrick[] {
  if (!candles.length || brickSize <= 0) return []
  const bricks: RenkoBrick[] = []
  let lastClose = candles[0]!.close
  let brickOpen = Math.floor(lastClose / brickSize) * brickSize

  for (const c of candles) {
    let price = c.close
    while (price >= brickOpen + brickSize) {
      const open = brickOpen
      const close = brickOpen + brickSize
      bricks.push({
        time: c.time + bricks.length,
        open,
        close,
        low: open,
        high: close,
        volume: c.volume,
        up: true,
      })
      brickOpen = close
      lastClose = close
    }
    while (price <= brickOpen - brickSize) {
      const open = brickOpen
      const close = brickOpen - brickSize
      bricks.push({
        time: c.time + bricks.length,
        open,
        close,
        low: close,
        high: open,
        volume: c.volume,
        up: false,
      })
      brickOpen = close
      lastClose = close
    }
  }
  return bricks
}

export function sma(values: number[], period: number): (number | null)[] {
  const out: (number | null)[] = []
  for (let i = 0; i < values.length; i++) {
    if (i + 1 < period) {
      out.push(null)
      continue
    }
    let sum = 0
    for (let j = i - period + 1; j <= i; j++) sum += values[j]!
    out.push(sum / period)
  }
  return out
}

export function stdev(values: number[], period: number): (number | null)[] {
  const means = sma(values, period)
  const out: (number | null)[] = []
  for (let i = 0; i < values.length; i++) {
    const mean = means[i]
    if (mean == null) {
      out.push(null)
      continue
    }
    let sum = 0
    for (let j = i - period + 1; j <= i; j++) {
      const d = values[j]! - mean
      sum += d * d
    }
    out.push(Math.sqrt(sum / period))
  }
  return out
}

export function ema(values: number[], period: number): (number | null)[] {
  const out: (number | null)[] = []
  const k = 2 / (period + 1)
  let prev: number | null = null
  for (let i = 0; i < values.length; i++) {
    const v = values[i]!
    if (i + 1 < period) {
      out.push(null)
      continue
    }
    if (prev == null) {
      let sum = 0
      for (let j = i - period + 1; j <= i; j++) sum += values[j]!
      prev = sum / period
      out.push(prev)
      continue
    }
    prev = v * k + prev * (1 - k)
    out.push(prev)
  }
  return out
}

/** RSI کلاسیک (Wilder). */
export function rsi(closes: number[], period = 14): (number | null)[] {
  const out: (number | null)[] = Array(closes.length).fill(null)
  if (closes.length <= period) return out

  let avgGain = 0
  let avgLoss = 0
  for (let i = 1; i <= period; i++) {
    const diff = closes[i]! - closes[i - 1]!
    if (diff >= 0) avgGain += diff
    else avgLoss -= diff
  }
  avgGain /= period
  avgLoss /= period
  out[period] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss)

  for (let i = period + 1; i < closes.length; i++) {
    const diff = closes[i]! - closes[i - 1]!
    const gain = diff > 0 ? diff : 0
    const loss = diff < 0 ? -diff : 0
    avgGain = (avgGain * (period - 1) + gain) / period
    avgLoss = (avgLoss * (period - 1) + loss) / period
    out[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss)
  }
  return out
}

export function macd(
  closes: number[],
  fast = 12,
  slow = 26,
  signalPeriod = 9
) {
  const fastEma = ema(closes, fast)
  const slowEma = ema(closes, slow)
  const macdLine: (number | null)[] = closes.map((_, i) => {
    if (fastEma[i] == null || slowEma[i] == null) return null
    return fastEma[i]! - slowEma[i]!
  })
  const macdValues = macdLine.map((v) => v ?? 0)
  const firstValid = macdLine.findIndex((v) => v != null)
  const signalRaw = ema(
    macdValues.slice(firstValid >= 0 ? firstValid : 0),
    signalPeriod
  )
  const signal: (number | null)[] = Array(closes.length).fill(null)
  const hist: (number | null)[] = Array(closes.length).fill(null)
  for (let i = 0; i < signalRaw.length; i++) {
    const idx = (firstValid >= 0 ? firstValid : 0) + i
    const s = signalRaw[i]
    signal[idx] = s
    if (macdLine[idx] != null && s != null) {
      hist[idx] = macdLine[idx]! - s
    }
  }
  return { macdLine, signal, hist }
}

export function runningDrawdown(closes: number[]) {
  let peak = closes[0] ?? 0
  return closes.map((c) => {
    peak = Math.max(peak, c)
    return peak === 0 ? 0 : ((c - peak) / peak) * 100
  })
}
