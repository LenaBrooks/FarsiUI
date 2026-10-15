"use client"

import {
  Bar,
  BarChart,
  BarStack,
  CartesianGrid,
  XAxis,
  YAxis,
  type TooltipContentProps,
  type TooltipIndex,
} from "recharts"

import {
  CHART_BAR_COLORS,
  FA_MONTHS,
  chartBarContainerClassName,
  toPersianDigits,
} from "@/lib/chart-fa"
import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

type StageRange = [number, number]

type OrderMonth = {
  name: string
  prep: StageRange
  pack: StageRange
  ship: StageRange
}

const data: OrderMonth[] = [
  {
    name: FA_MONTHS[0],
    prep: [0, 18],
    pack: [18, 30],
    ship: [30, 55],
  },
  {
    name: FA_MONTHS[1],
    prep: [0, 14],
    pack: [14, 28],
    ship: [28, 48],
  },
  {
    name: FA_MONTHS[2],
    prep: [0, 22],
    pack: [22, 40],
    ship: [40, 70],
  },
  {
    name: FA_MONTHS[3],
    prep: [0, 12],
    pack: [12, 24],
    ship: [24, 42],
  },
  {
    name: FA_MONTHS[4],
    prep: [0, 16],
    pack: [16, 32],
    ship: [32, 58],
  },
  {
    name: FA_MONTHS[5],
    prep: [0, 20],
    pack: [20, 36],
    ship: [36, 62],
  },
]

const STAGE_KEYS = ["prep", "pack", "ship"] as const

function duration(range: StageRange) {
  return range[1] - range[0]
}

function TooltipContent({
  active,
  payload,
  label,
  chartConfig,
}: TooltipContentProps & {
  chartConfig: ChartConfig
}) {
  if (!(active && payload?.length)) return null
  const row = payload[0]?.payload as OrderMonth | undefined
  if (!row) return null
  const total = duration(row.prep) + duration(row.pack) + duration(row.ship)

  return (
    <div className="min-w-[12rem] rounded-lg border bg-background px-3 py-2.5 text-xs shadow-md font-sans tracking-[0]">
      <p className="mb-2 font-medium text-foreground">{String(label)}</p>
      <ul className="space-y-1.5">
        {STAGE_KEYS.map((key) => {
          const range = row[key]
          const cfg = chartConfig[key]
          return (
            <li key={key} className="flex flex-col gap-0.5">
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{ background: cfg?.color }}
                />
                {cfg?.label}
              </span>
              <span className="ps-3.5 text-foreground">
                دقیقه{" "}
                <span className="font-medium">
                  {toPersianDigits(range[0])}
                </span>
                {" تا "}
                <span className="font-medium">
                  {toPersianDigits(range[1])}
                </span>
                <span className="text-muted-foreground">
                  {" "}
                  ({toPersianDigits(duration(range))} دقیقه)
                </span>
              </span>
            </li>
          )
        })}
      </ul>
      <p className="mt-2 border-t pt-2 text-muted-foreground">
        کل فرآیند:{" "}
        <span className="font-medium text-foreground">
          {toPersianDigits(total)} دقیقه
        </span>
      </p>
    </div>
  )
}

export default function RangedStackedBarChartDemo({
  isAnimationActive = true,
  defaultIndex,
}: {
  isAnimationActive?: boolean
  defaultIndex?: TooltipIndex
}) {
  const [c0, c1, c2] = CHART_BAR_COLORS

  const chartConfig = {
    prep: { label: "آماده‌سازی", color: c0 },
    pack: { label: "بسته‌بندی", color: c1 },
    ship: { label: "ارسال", color: c2 },
  } satisfies ChartConfig

  return (
    <ChartContainer
      config={chartConfig}
      className={cn(
        chartBarContainerClassName,
        "max-w-none aspect-[1.55]"
      )}
    >
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ top: 12, right: 8, left: 4, bottom: 4 }}
        barCategoryGap="22%"
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          reversed
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tick={{ fontSize: 12, fontFamily: "var(--font-sans)", letterSpacing: 0 }}
        />
        <YAxis
          orientation="right"
          width={40}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          domain={[0, 80]}
          ticks={[0, 20, 40, 60, 80]}
          tickFormatter={(v) => toPersianDigits(v)}
          tick={{ fontSize: 11, fontFamily: "var(--font-sans)", letterSpacing: 0 }}
          label={{
            value: "دقیقه",
            position: "insideTopRight",
            offset: 8,
            style: {
              fill: "var(--muted-foreground)",
              fontSize: 11,
              fontFamily: "var(--font-sans)",
            },
          }}
        />
        <ChartTooltip
          defaultIndex={defaultIndex}
          content={(props) => (
            <TooltipContent {...props} chartConfig={chartConfig} />
          )}
        />
        <ChartLegend content={<ChartLegendContent />} />
        <BarStack radius={[4, 4, 4, 4]}>
          <Bar
            dataKey="prep"
            fill="var(--color-prep)"
            stroke="var(--color-prep)"
            maxBarSize={48}
            isAnimationActive={isAnimationActive}
          />
          <Bar
            dataKey="pack"
            fill="var(--color-pack)"
            stroke="var(--color-pack)"
            maxBarSize={48}
            isAnimationActive={isAnimationActive}
          />
          <Bar
            dataKey="ship"
            fill="var(--color-ship)"
            stroke="var(--color-ship)"
            maxBarSize={48}
            isAnimationActive={isAnimationActive}
          />
        </BarStack>
      </BarChart>
    </ChartContainer>
  )
}
