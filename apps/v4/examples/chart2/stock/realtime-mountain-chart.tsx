"use client"

/**
 * Realtime Mountain Chart — SciChart-inspired, FarsiUI dashboard theme.
 */

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { useChart2ToolbarStart } from "@/components/chart2-live"
import { CHART_TOMAN_AXIS_WIDTH } from "@/lib/chart-locale"
import { TomanAxisTick } from "@/lib/chart-toman-tick"
import {
  chart2BarContainerClassName,
  CHART2_BAR_COLORS,
  toPersianDigits,
} from "@/lib/chart2-fa"
import { Button } from "@/registry/new-york-v4/ui/button"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

import {
  CANDLE_DOWN,
  CANDLE_UP,
  ChangeBadge,
  formatMoneyOneLine,
  formatToman,
} from "./stock-shared"

function timestampToClock(timestamp: number) {
  const date = new Date(timestamp)
  const h = String(date.getHours()).padStart(2, "0")
  const m = String(date.getMinutes()).padStart(2, "0")
  const s = String(date.getSeconds()).padStart(2, "0")
  return toPersianDigits(`${h}:${m}:${s}`)
}

const MOUNTAIN = CHART2_BAR_COLORS[0]
const WINDOW = 48
const TICK_MS = 1000
const STEP_MS = 1000
const START_PRICE = 2_420_000

type MountainPoint = {
  time: number
  price: number
}

function randomWalkStep(prev: number) {
  const pct = (Math.random() - 0.48) * 0.004
  return Math.max(10_000, Math.round(prev * (1 + pct)))
}

function seedSeries(length: number, startPrice: number, endTime: number) {
  const points: MountainPoint[] = []
  let price = startPrice
  const startTime = endTime - (length - 1) * STEP_MS
  for (let i = 0; i < length; i++) {
    if (i > 0) price = randomWalkStep(price)
    points.push({ time: startTime + i * STEP_MS, price })
  }
  return points
}

function PulsingLiveDot({
  cx,
  cy,
  index,
  lastIndex,
  color,
}: {
  cx?: number
  cy?: number
  index?: number
  lastIndex: number
  color: string
}) {
  if (
    index !== lastIndex ||
    cx == null ||
    cy == null ||
    Number.isNaN(cx) ||
    Number.isNaN(cy)
  ) {
    return null
  }

  return (
    <g>
      <circle cx={cx} cy={cy} fill={color} r={5}>
        <animate
          attributeName="r"
          from="5"
          to="18"
          dur="1.1s"
          begin="0s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          from="0.7"
          to="0"
          dur="1.1s"
          begin="0s"
          repeatCount="indefinite"
        />
      </circle>
      <circle
        cx={cx}
        cy={cy}
        r={3.5}
        fill={color}
        stroke="var(--background)"
        strokeWidth={1.5}
      />
    </g>
  )
}

function LiveTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload?: MountainPoint }>
}) {
  if (!(active && payload?.length)) return null
  const row = payload[0]?.payload
  if (!row) return null
  return (
    <div
      className="min-w-[8rem] rounded-lg border bg-background px-3 py-2.5 text-xs shadow-xl font-sans"
      dir="rtl"
    >
      <p className="mb-1 font-medium">
        زمان: {timestampToClock(row.time)}
      </p>
      <p className="text-muted-foreground flex justify-between gap-4">
        <span>قیمت</span>
        <span className="text-foreground">{formatToman(row.price)}</span>
      </p>
    </div>
  )
}

const chartConfig = {
  price: { label: "قیمت زنده", color: MOUNTAIN },
} satisfies ChartConfig

export default function RealtimeMountainChartDemo() {
  const gradientId = React.useId().replace(/:/g, "")
  const [running, setRunning] = React.useState(true)
  const [data, setData] = React.useState<MountainPoint[]>(() =>
    seedSeries(WINDOW, START_PRICE, Date.now())
  )

  React.useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => {
      setData((prev) => {
        const last = prev[prev.length - 1]
        if (!last) return prev
        const next: MountainPoint = {
          time: last.time + STEP_MS,
          price: randomWalkStep(last.price),
        }
        const nextData = [...prev, next]
        return nextData.length > WINDOW
          ? nextData.slice(nextData.length - WINDOW)
          : nextData
      })
    }, TICK_MS)
    return () => window.clearInterval(id)
  }, [running])

  useChart2ToolbarStart(
    () => (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-7 gap-1.5 px-2 text-[12px] text-muted-foreground"
        onClick={() => setRunning((v) => !v)}
      >
        <span
          className={
            running
              ? "size-1.5 shrink-0 animate-pulse rounded-full"
              : "size-1.5 shrink-0 rounded-full bg-muted-foreground/50"
          }
          style={running ? { background: CANDLE_UP } : undefined}
          aria-hidden
        />
        {running ? "زنده" : "توقف"}
      </Button>
    ),
    [running]
  )

  const first = data[0]
  const last = data[data.length - 1]
  const change =
    first && last ? ((last.price - first.price) / first.price) * 100 : 0
  const up = change >= 0
  const stroke = up ? CANDLE_UP : CANDLE_DOWN
  const lastIndex = data.length - 1

  const prices = data.map((d) => d.price)
  const priceMin = Math.min(...prices)
  const priceMax = Math.max(...prices)
  const pad = (priceMax - priceMin) * 0.12 || priceMin * 0.01
  const domainMin = Math.floor((priceMin - pad) / 1_000) * 1_000
  const domainMax = Math.ceil((priceMax + pad) / 1_000) * 1_000

  return (
    <div className="w-full max-w-[760px] font-sans">
      <div className="overflow-hidden rounded-xl border border-border/60 bg-background">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border/50 px-4 py-3">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold tracking-tight">شپنا</p>
              <ChangeBadge value={change} good={up} />
              {running ? (
                <span className="text-muted-foreground flex items-center gap-1 text-[10px]">
                  <span
                    className="size-1.5 animate-pulse rounded-full"
                    style={{ background: CANDLE_UP }}
                  />
                  زنده
                </span>
              ) : (
                <span className="text-muted-foreground text-[10px]">متوقف</span>
              )}
            </div>
            <p className="text-muted-foreground mt-0.5 text-[11px]">
              کوهستانی زنده · پنجرهٔ {toPersianDigits(String(WINDOW))} تیک
            </p>
          </div>
          <div className="text-end">
            <p className="fa-num whitespace-nowrap text-lg font-semibold">
              {last ? formatMoneyOneLine(last.price) : "—"}
            </p>
            <p className="text-muted-foreground text-[11px]">قیمت لحظه‌ای</p>
          </div>
        </div>

        <ChartContainer
          config={chartConfig}
          className={`${chart2BarContainerClassName} max-h-[340px] max-w-none`}
        >
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{ top: 16, right: 8, left: 4, bottom: 4 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={stroke} stopOpacity={0.4} />
                <stop offset="100%" stopColor={stroke} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              reversed
              tickMargin={10}
              minTickGap={36}
              tickFormatter={timestampToClock}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              orientation="right"
              width={CHART_TOMAN_AXIS_WIDTH}
              tickMargin={6}
              domain={[domainMin, domainMax]}
              tickCount={4}
              axisLine={false}
              tickLine={false}
              tick={TomanAxisTick}
            />
            <ChartTooltip
              cursor={{ stroke: stroke, strokeOpacity: 0.35 }}
              content={LiveTooltip}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={stroke}
              strokeWidth={2.5}
              fill={`url(#${gradientId})`}
              fillOpacity={1}
              isAnimationActive={false}
              dot={(props) => (
                <PulsingLiveDot
                  key={props.index}
                  cx={props.cx}
                  cy={props.cy}
                  index={props.index}
                  lastIndex={lastIndex}
                  color={stroke}
                />
              )}
              activeDot={false}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  )
}
