"use client"

import {
  Bar,
  BarChart,
  Brush,
  CartesianGrid,
  Cell,
  ReferenceLine,
  XAxis,
  YAxis,
  type TooltipContentProps,
  type TooltipIndex,
} from "recharts"

import { useChartCaption } from "@/registry/new-york-v4/lib/chart-live"
import {
  chartBarContainerClassName,
  chartDashedGridClassName,
  toPersianDigits,
} from "@/lib/chart-fa"
import {
  generateMockMarketData,
  type MarketCandle,
} from "@/lib/chart-mock-data"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

import {
  BINANCE_CANDLE_DOWN,
  BINANCE_CANDLE_UP,
  candleRangeKey,
  CandlestickShape,
  formatTomanTick,
  StockCandleTooltip,
  timestampToMinutes,
} from "./stock-shared"

type CandleWithChange = MarketCandle & { change: number }

const raw = generateMockMarketData(80, 1911, 100, 1768145757834)
const data: CandleWithChange[] = raw.map((candle, i, arr) => ({
  ...candle,
  change: i === 0 ? 0 : +(candle.close - arr[i - 1]!.close).toFixed(2),
}))

const priceConfig = {
  candle: { label: "کندل", color: BINANCE_CANDLE_UP },
} satisfies ChartConfig

const changeConfig = {
  change: { label: "تغییر", color: BINANCE_CANDLE_UP },
} satisfies ChartConfig

function ChangeTooltip({ active, payload }: TooltipContentProps) {
  if (!(active && payload?.length)) return null
  const entry = payload[0]?.payload as CandleWithChange | undefined
  if (!entry) return null
  return (
    <div className="rounded-lg border bg-background px-3 py-2 text-xs shadow-xl font-sans">
      <p className="mb-1 font-medium">زمان: {timestampToMinutes(entry.time)}</p>
      <p className="text-muted-foreground">
        تغییر: {toPersianDigits(entry.change.toFixed(2))}
      </p>
    </div>
  )
}

export default function CandlestickBarDemo({
  defaultIndex,
}: {
  defaultIndex?: TooltipIndex
}) {
  useChartCaption(() => (
    <>
      کندل به‌همراه میله تغییر قیمت — مشابه{" "}
      <span dir="ltr">Candlestick + Bar</span> در ApexCharts
    </>
  ))

  return (
    <div className="flex w-full max-w-[700px] flex-col gap-2 font-sans">
      <ChartContainer
        config={priceConfig}
        className={`${chartBarContainerClassName} aspect-[2/1] max-h-[280px]`}
      >
        <BarChart
          accessibilityLayer
          data={data}
          syncId="candle-bar"
          margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="time" reversed hide />
          <YAxis
            orientation="right"
            width={52}
            tickMargin={8}
            domain={["dataMin - 1", "dataMax + 1"]}
            tickFormatter={formatTomanTick}
          />
          <Bar
            name="قیمت"
            dataKey={candleRangeKey}
            shape={CandlestickShape}
            isAnimationActive={false}
          />
          <ChartTooltip
            defaultIndex={defaultIndex}
            content={StockCandleTooltip}
          />
        </BarChart>
      </ChartContainer>

      <ChartContainer
        config={changeConfig}
        className={`aspect-[5/1.2] h-auto w-full max-w-[700px] font-sans text-xs ${chartDashedGridClassName}`}
      >
        <BarChart
          accessibilityLayer
          data={data}
          syncId="candle-bar"
          margin={{ top: 4, right: 8, bottom: 8, left: 0 }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            reversed
            tickMargin={6}
            tickFormatter={timestampToMinutes}
            minTickGap={28}
          />
          <YAxis
            orientation="right"
            width={52}
            tickMargin={8}
            tickFormatter={(v) => toPersianDigits(Number(v).toFixed(1))}
          />
          <ReferenceLine y={0} stroke="var(--border)" />
          <Bar name="تغییر" dataKey="change" radius={[2, 2, 0, 0]}>
            {data.map((entry) => (
              <Cell
                key={entry.time}
                fill={
                  entry.change >= 0
                    ? BINANCE_CANDLE_UP
                    : BINANCE_CANDLE_DOWN
                }
                fillOpacity={0.75}
              />
            ))}
          </Bar>
          <Brush
            dataKey="time"
            height={22}
            stroke="var(--chart-1)"
            tickFormatter={timestampToMinutes}
            travellerWidth={8}
          />
          <ChartTooltip content={ChangeTooltip} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
