"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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
  BINANCE_CANDLE_UP,
  candleColor,
  candleRangeKey,
  CandlestickShape,
  formatTomanTick,
  formatVolume,
  StockCandleTooltip,
  timestampToMinutes,
} from "./stock-shared"

const data: ReadonlyArray<MarketCandle> = generateMockMarketData(
  64,
  777,
  100,
  1768145757834
)

const priceConfig = {
  candle: { label: "قیمت", color: BINANCE_CANDLE_UP },
} satisfies ChartConfig

const volumeConfig = {
  volume: { label: "حجم", color: BINANCE_CANDLE_UP },
} satisfies ChartConfig

function VolumeTooltip({ active, payload }: TooltipContentProps) {
  if (!(active && payload?.length)) return null
  const entry = payload[0]?.payload as MarketCandle | undefined
  if (!entry) return null
  return (
    <div className="rounded-lg border bg-background px-3 py-2 text-xs shadow-xl font-sans">
      <p className="mb-1 font-medium">زمان: {timestampToMinutes(entry.time)}</p>
      <p className="text-muted-foreground">حجم: {formatVolume(entry.volume)}</p>
    </div>
  )
}

export default function StockWithVolumeDemo({
  defaultIndex,
}: {
  defaultIndex?: TooltipIndex
}) {
  useChartCaption(
    () => <>پنل قیمت (کندل) و پنل حجم — الگوی رایج نمودار سهام</>
  )

  return (
    <div className="flex w-full max-w-[700px] flex-col gap-2 font-sans">
      <ChartContainer
        config={priceConfig}
        className={`${chartBarContainerClassName} aspect-[2/1] max-h-[280px]`}
      >
        <BarChart
          accessibilityLayer
          data={data as MarketCandle[]}
          syncId="stock-volume"
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
        config={volumeConfig}
        className={`aspect-[5/1] h-auto w-full max-w-[700px] font-sans text-xs ${chartDashedGridClassName}`}
      >
        <BarChart
          accessibilityLayer
          data={data as MarketCandle[]}
          syncId="stock-volume"
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
            tickFormatter={(v) =>
              toPersianDigits(String(Math.round(Number(v) / 1000))) + "هـ"
            }
          />
          <Bar name="حجم" dataKey="volume" radius={[2, 2, 0, 0]}>
            {data.map((entry) => (
              <Cell
                key={entry.time}
                fill={candleColor(entry)}
                fillOpacity={0.55}
              />
            ))}
          </Bar>
          <ChartTooltip content={VolumeTooltip} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
