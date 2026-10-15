"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  type TooltipContentProps,
  type TooltipIndex,
} from "recharts"

import { useChartCaption } from "@/lib/chart-live"
import { CHART_TOMAN_AXIS_WIDTH } from "@/lib/chart-locale"
import { TomanAxisTick } from "@/lib/chart-toman-tick"
import { chartBarContainerClassName } from "@/lib/chart-fa"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

import {
  CANDLE_UP,
  candleRangeKey,
  CandlestickShape,
  generateNaturalCandles,
  JalaliDayTick,
  StockCandleTooltip,
  toHeikinAshi,
} from "./stock-shared"

const raw = generateNaturalCandles(36, 3101)
const data = toHeikinAshi(raw)

const lows = data.map((c) => c.low)
const highs = data.map((c) => c.high)
const priceMin = Math.min(...lows)
const priceMax = Math.max(...highs)
const pad = (priceMax - priceMin) * 0.06 || priceMin * 0.01
const domainMin = Math.floor((priceMin - pad) / 2_000) * 2_000
const domainMax = Math.ceil((priceMax + pad) / 2_000) * 2_000

const chartConfig = {
  candle: { label: "هیکن‌آشی", color: CANDLE_UP },
} satisfies ChartConfig

function HaTooltip(props: TooltipContentProps) {
  return <StockCandleTooltip {...props} dayLabel compact />
}

export default function HeikinAshiDemo({
  defaultIndex,
}: {
  defaultIndex?: TooltipIndex
}) {
  useChartCaption(() => <>کندل‌های هموارشده برای خواندن راحت‌تر روند</>)

  return (
    <div className="w-full max-w-[760px] overflow-hidden rounded-xl border border-border/60 bg-background font-sans">
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-2.5">
        <p className="text-sm font-medium">هیکن‌آشی · شپنا</p>
        <p className="text-muted-foreground text-[11px]">روند هموار</p>
      </div>
      <ChartContainer
        config={chartConfig}
        className={`${chartBarContainerClassName} max-h-[380px] max-w-none`}
      >
        <BarChart
          accessibilityLayer
          data={data}
          margin={{ top: 16, right: 4, left: 4, bottom: 4 }}
          barCategoryGap="1%"
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            reversed
            tickMargin={10}
            minTickGap={40}
            tick={JalaliDayTick}
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
          <ChartTooltip defaultIndex={defaultIndex} content={HaTooltip} />
          <Bar
            dataKey={candleRangeKey}
            shape={CandlestickShape}
            isAnimationActive={false}
          />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
