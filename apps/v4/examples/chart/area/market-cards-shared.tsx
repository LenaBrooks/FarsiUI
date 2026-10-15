"use client"

import { useMarketNeon } from "@/examples/chart/area/use-market-neon"
import {
  MARKET_DOWN,
  MARKET_MUTE,
  MARKET_UP,
  chartAreaGradientStops,
  chartSoftFill,
} from "@/lib/chart-fa"
import { formatPersianNumber, toPersianDigits } from "@/lib/digits"
import { cn } from "@/lib/utils"

export type SparkPoint = { x: number; y: number }

function pointsToLinePath(points: SparkPoint[]) {
  return points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ")
}

function pointsToAreaPath(points: SparkPoint[], height: number) {
  if (points.length === 0) return ""
  const line = pointsToLinePath(points)
  const last = points[points.length - 1]!
  const first = points[0]!
  return `${line} L${last.x.toFixed(2)} ${height} L${first.x.toFixed(2)} ${height} Z`
}

export function Sparkline({
  points,
  stroke,
  fillId,
  glow = false,
  className,
  height = 88,
  width = 320,
}: {
  points: SparkPoint[]
  stroke: string
  fillId: string
  glow?: boolean
  className?: string
  height?: number
  width?: number
}) {
  const last = points[points.length - 1]!
  const linePath = pointsToLinePath(points)
  const areaPath = pointsToAreaPath(points, height)
  const stops = chartAreaGradientStops(stroke, {
    startOpacity: glow ? 0.32 : 0.18,
  })

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("h-auto w-full overflow-visible", className)}
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
          {stops.map((s) => (
            <stop
              key={s.offset}
              offset={s.offset}
              stopColor={s.stopColor}
              stopOpacity={s.stopOpacity}
            />
          ))}
        </linearGradient>
        {glow ? (
          <filter
            id={`${fillId}-glow`}
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur stdDeviation="2.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        ) : null}
      </defs>
      <path d={areaPath} fill={`url(#${fillId})`} />
      <path
        d={linePath}
        fill="none"
        stroke={stroke}
        strokeWidth={glow ? 2.35 : 1.85}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        filter={glow ? `url(#${fillId}-glow)` : undefined}
        style={
          glow
            ? { filter: `drop-shadow(0 0 7px ${stroke})` }
            : undefined
        }
      />
      <circle
        cx={last.x}
        cy={last.y}
        r={glow ? 4.4 : 3.4}
        fill={stroke}
        style={
          glow
            ? { filter: `drop-shadow(0 0 6px ${stroke})` }
            : undefined
        }
      />
    </svg>
  )
}

export const GERAMI_POINTS: SparkPoint[] = [
  { x: 0, y: 62 },
  { x: 28, y: 62 },
  { x: 36, y: 38 },
  { x: 78, y: 38 },
  { x: 86, y: 58 },
  { x: 128, y: 58 },
  { x: 136, y: 72 },
  { x: 188, y: 72 },
  { x: 198, y: 48 },
  { x: 248, y: 48 },
  { x: 258, y: 34 },
  { x: 320, y: 28 },
]

export const GREEN_POINTS: SparkPoint[] = [
  { x: 0, y: 78 },
  { x: 18, y: 72 },
  { x: 32, y: 64 },
  { x: 48, y: 58 },
  { x: 62, y: 52 },
  { x: 78, y: 56 },
  { x: 92, y: 44 },
  { x: 108, y: 48 },
  { x: 124, y: 36 },
  { x: 142, y: 40 },
  { x: 158, y: 28 },
  { x: 174, y: 32 },
  { x: 190, y: 22 },
  { x: 208, y: 18 },
  { x: 224, y: 26 },
  { x: 242, y: 20 },
  { x: 258, y: 30 },
  { x: 276, y: 24 },
  { x: 294, y: 34 },
  { x: 320, y: 28 },
]

export const KWD_POINTS: SparkPoint[] = [
  { x: 0, y: 42 },
  { x: 22, y: 48 },
  { x: 40, y: 36 },
  { x: 58, y: 52 },
  { x: 78, y: 40 },
  { x: 98, y: 58 },
  { x: 118, y: 46 },
  { x: 138, y: 62 },
  { x: 158, y: 50 },
  { x: 178, y: 64 },
  { x: 198, y: 54 },
  { x: 218, y: 68 },
  { x: 238, y: 56 },
  { x: 258, y: 70 },
  { x: 278, y: 60 },
  { x: 298, y: 66 },
  { x: 320, y: 58 },
]

/** Transparent fill; keep border only. */
const cardShell =
  "outline-none focus-visible:outline-none w-full rounded-[28px] border border-border/60 bg-transparent p-5 text-foreground shadow-none"

type ChangeTone = "muted" | "up" | "down"

const CHANGE_COLOR: Record<ChangeTone, string | undefined> = {
  muted: MARKET_MUTE,
  up: MARKET_UP,
  down: MARKET_DOWN,
}

export function MarketAssetCard({
  title,
  code,
  price,
  badge,
  footerLabel,
  footerChange,
  changeTone = "muted",
  points,
  stroke,
  fillId,
  glow,
}: {
  title: string
  code?: string
  price: number
  badge: string
  footerLabel: string
  footerChange: string
  changeTone?: ChangeTone
  points: SparkPoint[]
  stroke: string
  fillId: string
  glow?: boolean
}) {
  const toneColor = CHANGE_COLOR[changeTone]
  return (
    <article dir="rtl" className={cardShell}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 text-start">
          <h2 className="truncate text-[17px] font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          {code ? (
            <p className="mt-0.5 font-mono text-[12px] text-muted-foreground">
              {code}
            </p>
          ) : null}
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 text-[11px]",
            toneColor ? "font-medium" : "bg-muted text-muted-foreground"
          )}
          style={
            toneColor
              ? {
                  color: toneColor,
                  backgroundColor: chartSoftFill(toneColor, 0.12),
                }
              : undefined
          }
        >
          {badge}
        </span>
      </div>

      <div className="mt-4 flex items-baseline justify-start gap-2">
        <span className="text-[28px] font-semibold leading-none tracking-tight text-foreground tabular-nums">
          {formatPersianNumber(price, { useGrouping: true })}
        </span>
        <span className="text-[13px] text-muted-foreground">تومان</span>
      </div>

      <div className="mt-5">
        <Sparkline
          points={points}
          stroke={stroke}
          fillId={fillId}
          glow={glow}
          height={92}
        />
      </div>

      <div className="mt-3 flex items-center justify-start gap-2 text-[12px]">
        <span className="text-muted-foreground">{footerLabel}</span>
        <span
          className={toneColor ? "font-medium" : "text-muted-foreground"}
          style={toneColor ? { color: toneColor } : undefined}
        >
          {footerChange}
        </span>
      </div>
    </article>
  )
}

export function MarketGreenTrendCard() {
  const neon = useMarketNeon()
  return (
    <article dir="rtl" className={cn(cardShell, "pb-6 pt-5")}>
      <div className="mb-4 flex items-start justify-between gap-3 text-[12px] text-muted-foreground">
        <span>نمودار ۳۰ روز اخیر</span>
        <span>از ۲۳ شهریور تا امروز</span>
      </div>
      <Sparkline
        points={GREEN_POINTS}
        stroke={MARKET_UP}
        fillId="market-green"
        glow={neon}
        height={140}
      />
    </article>
  )
}

/** کارت خاکستری — همان الگوی glow/گرادیان سبز و صورتی */
export function MarketGeramiCard() {
  const neon = useMarketNeon()
  return (
    <MarketAssetCard
      title="سکه گرمی"
      price={37_000_000}
      badge={`— ${toPersianDigits("0")}٪`}
      footerLabel={`${toPersianDigits(7)} روز`}
      footerChange={`${toPersianDigits("0")}٪`}
      changeTone="muted"
      points={GERAMI_POINTS}
      stroke={MARKET_MUTE}
      fillId="market-gerami"
      glow={neon}
    />
  )
}

/** کارت صورتی نئون — مطابق اسکرین‌شات رفرنس */
export function MarketKwdCard() {
  const neon = useMarketNeon()
  return (
    <MarketAssetCard
      title="دینار کویت"
      code="kwd"
      price={849_140}
      badge={`- ${toPersianDigits("0")}٪`}
      footerLabel={`${toPersianDigits(7)} روز`}
      footerChange={`-${toPersianDigits("0.05").replace(".", "/")}٪`}
      changeTone="down"
      points={KWD_POINTS}
      stroke={MARKET_DOWN}
      fillId="market-kwd"
      glow={neon}
    />
  )
}

export function MarketCards() {
  return (
    <div className="mx-auto grid w-full max-w-3xl grid-cols-1 gap-4 md:grid-cols-2">
      <MarketGreenTrendCard />
      <MarketKwdCard />
      <div className="md:col-span-2">
        <MarketGeramiCard />
      </div>
    </div>
  )
}
