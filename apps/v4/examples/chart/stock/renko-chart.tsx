"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
  XAxis,
  YAxis,
  type BarShapeProps,
  type TooltipContentProps,
  type TooltipIndex,
} from "recharts"

import { useChartCaption } from "@/components/chart-live"
import { CHART_TOMAN_AXIS_WIDTH } from "@/lib/chart-locale"
import { TomanAxisTick } from "@/lib/chart-toman-tick"
import {
  chartBarContainerClassName,
  toPersianDigits,
} from "@/lib/chart-fa"
import { between, random } from "@/lib/chart-mock-data"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

import {
  CANDLE_DOWN,
  CANDLE_UP,
  candleRangeKey,
  formatMoneyOneLine,
  formatToman,
  toRenko,
  type RenkoBrick,
} from "./stock-shared"

/** مسیر قیمت با نوسان کافی برای ساخت چند ده آجر رنکو. */
function generateVolatileCloses(
  length = 64,
  seed = 4410,
  startPrice = 2_420_000
) {
  const gen = random(seed)
  const closes: number[] = []
  let price = startPrice
  for (let i = 0; i < length; i++) {
    const drift = between(gen, -22, 24) / 1000
    const shock = between(gen, 0, 100) < 16 ? between(gen, -35, 38) / 1000 : 0
    price = Math.max(50_000, Math.round(price * (1 + drift + shock)))
    closes.push(price)
  }
  return closes
}

function RenkoBrickShape(props: BarShapeProps) {
  const {
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    // @ts-expect-error payload
    up,
  } = props
  const color = up ? CANDLE_UP : CANDLE_DOWN
  const gap = Math.max(1, Number(width) * 0.08)
  const w = Math.max(4, Number(width) - gap)
  const h = Math.max(2, Number(height) - 1)
  return (
    <Rectangle
      x={Number(x) + gap / 2}
      y={Number(y)}
      width={w}
      height={h}
      fill={color}
      stroke="none"
      radius={2}
    />
  )
}

const START = 2_420_000
/** حدود ۱٪ قیمت — تعادل بین تعداد آجر و خوانایی. */
const BRICK = Math.round(START * 0.01)
const MAX_BRICKS = 32
const closes = generateVolatileCloses()
const allBricks = toRenko(
  closes.map((close, i) => ({
    time: i,
    open: close,
    close,
    high: close,
    low: close,
    volume: 0,
  })),
  BRICK
)
const bricks =
  allBricks.length > MAX_BRICKS
    ? allBricks.slice(allBricks.length - MAX_BRICKS)
    : allBricks

const data = bricks.map((b, i) => ({
  ...b,
  idx: i + 1,
}))

const upCount = data.filter((b) => b.up).length
const downCount = data.length - upCount

const priceMin = Math.min(...data.map((c) => c.low))
const priceMax = Math.max(...data.map((c) => c.high))
const pad = BRICK * 1.5
const domainMin = Math.floor((priceMin - pad) / 1_000) * 1_000
const domainMax = Math.ceil((priceMax + pad) / 1_000) * 1_000

const chartConfig = {
  brick: { label: "رنکو", color: CANDLE_UP },
} satisfies ChartConfig

function RenkoTooltip({ active, payload }: TooltipContentProps) {
  if (!(active && payload?.length)) return null
  const row = payload[0]?.payload as RenkoBrick & { idx: number } | undefined
  if (!row) return null
  return (
    <div
      className="min-w-[8rem] rounded-lg border bg-background px-3 py-2.5 text-xs shadow-xl font-sans"
      dir="rtl"
    >
      <p className="mb-1.5 font-medium">
        آجر {toPersianDigits(String(row.idx))}
      </p>
      <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-muted-foreground">
        <span>از</span>
        <span className="text-end text-foreground">{formatToman(row.open)}</span>
        <span>تا</span>
        <span className="text-end text-foreground">{formatToman(row.close)}</span>
      </div>
      <p
        className="mt-2 border-t pt-1.5 text-end"
        style={{ color: row.up ? CANDLE_UP : CANDLE_DOWN }}
      >
        {row.up ? "صعودی" : "نزولی"}
      </p>
    </div>
  )
}

export default function RenkoChartDemo({
  defaultIndex,
}: {
  defaultIndex?: TooltipIndex
}) {
  useChartCaption(
    () => <>حرکت قیمت بر اساس اندازهٔ آجر، نه محور زمان</>
  )

  return (
    <div className="w-full max-w-[760px] overflow-hidden rounded-xl border border-border/60 bg-background font-sans">
      <div className="flex flex-wrap items-end justify-between gap-2 border-b border-border/50 px-4 py-2.5">
        <div>
          <p className="text-sm font-medium">رنکو · شپنا</p>
          <p className="text-muted-foreground text-[11px]">
            اندازهٔ آجر {formatMoneyOneLine(BRICK)}
          </p>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1">
            <span
              className="size-2 rounded-[2px]"
              style={{ background: CANDLE_UP }}
            />
            {toPersianDigits(String(upCount))} صعود
          </span>
          <span className="flex items-center gap-1">
            <span
              className="size-2 rounded-[2px]"
              style={{ background: CANDLE_DOWN }}
            />
            {toPersianDigits(String(downCount))} نزول
          </span>
          <span className="text-muted-foreground">
            {toPersianDigits(String(data.length))} آجر
          </span>
        </div>
      </div>
      <ChartContainer
        config={chartConfig}
        className={`${chartBarContainerClassName} max-h-[400px] max-w-none`}
      >
        <BarChart
          accessibilityLayer
          data={data}
          margin={{ top: 16, right: 4, left: 4, bottom: 4 }}
          barCategoryGap="6%"
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="idx"
            reversed
            tickMargin={10}
            minTickGap={20}
            tickFormatter={(v) => toPersianDigits(String(v))}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            orientation="right"
            width={CHART_TOMAN_AXIS_WIDTH}
            tickMargin={6}
            domain={[domainMin, domainMax]}
            tickCount={5}
            axisLine={false}
            tickLine={false}
            tick={TomanAxisTick}
          />
          <ChartTooltip defaultIndex={defaultIndex} content={RenkoTooltip} />
          <Bar
            dataKey={candleRangeKey}
            shape={RenkoBrickShape}
            isAnimationActive={false}
          />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
