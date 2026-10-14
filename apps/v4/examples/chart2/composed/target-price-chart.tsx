"use client"

import * as React from "react"
import {
  Area,
  CartesianGrid,
  ComposedChart,
  LabelList,
  Line,
  XAxis,
  YAxis,
  type LabelProps,
  type MouseHandlerDataParam,
} from "recharts"

import {
  CHART2_BAR_COLORS,
  FA_MONTHS_FULL,
  chart2ContainerClassName,
  chart2DashedGridClassName,
  toPersianDigits,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

type Row = {
  month: string
  price: number
  target: number
  /** [کف اجماع، سقف اجماع] */
  range: [number, number]
}

/** قیمت سهم نمونه در برابر هدف تحلیلگران — هزار تومان */
const data: Row[] = [
  { month: FA_MONTHS_FULL[0], price: 312, target: 380, range: [290, 420] },
  { month: FA_MONTHS_FULL[1], price: 328, target: 385, range: [300, 430] },
  { month: FA_MONTHS_FULL[2], price: 341, target: 390, range: [310, 440] },
  { month: FA_MONTHS_FULL[3], price: 355, target: 400, range: [320, 450] },
  { month: FA_MONTHS_FULL[4], price: 348, target: 405, range: [325, 455] },
  { month: FA_MONTHS_FULL[5], price: 372, target: 415, range: [340, 470] },
  { month: FA_MONTHS_FULL[6], price: 389, target: 425, range: [350, 480] },
  { month: FA_MONTHS_FULL[7], price: 401, target: 430, range: [360, 490] },
  { month: FA_MONTHS_FULL[8], price: 396, target: 435, range: [365, 495] },
  { month: FA_MONTHS_FULL[9], price: 412, target: 445, range: [380, 510] },
  { month: FA_MONTHS_FULL[10], price: 428, target: 455, range: [390, 520] },
  { month: FA_MONTHS_FULL[11], price: 441, target: 460, range: [400, 530] },
]

const chartConfig = {
  range: { label: "بازهٔ اجماع", color: CHART2_BAR_COLORS[0] },
  price: { label: "قیمت", color: CHART2_BAR_COLORS[0] },
  target: { label: "هدف تحلیلگران", color: CHART2_BAR_COLORS[1] },
} satisfies ChartConfig

const MONTH_SHORT = [
  "فرو",
  "ارد",
  "خرد",
  "تیر",
  "مرد",
  "شهر",
  "مهر",
  "آبا",
  "آذر",
  "دی",
  "بهم",
  "اسف",
] as const

function ActiveLabel(props: LabelProps & { color?: string }) {
  if (props.x == null || props.y == null || props.value == null) return null
  return (
    <g>
      <rect
        x={Number(props.x) + 8}
        y={Number(props.y) - 12}
        width={36}
        height={18}
        rx={4}
        fill="var(--background)"
        stroke="var(--border)"
      />
      <text
        x={Number(props.x) + 26}
        y={Number(props.y) - 2}
        textAnchor="middle"
        fill={props.color ?? "var(--foreground)"}
        fontSize={11}
        fontWeight={600}
        style={{ fontFamily: "var(--font-sans)", letterSpacing: 0 }}
      >
        {toPersianDigits(Math.round(Number(props.value)))}
      </text>
    </g>
  )
}

export default function TargetPriceChartDemo({
  isAnimationActive = true,
  defaultIndex,
}: {
  isAnimationActive?: boolean
  defaultIndex?: number
}) {
  const [activeIndex, setActiveIndex] = React.useState<number | undefined>(
    defaultIndex
  )

  const onMove = React.useCallback((state: MouseHandlerDataParam) => {
    if (state?.activeTooltipIndex != null) {
      setActiveIndex(Number(state.activeTooltipIndex))
    }
  }, [])

  return (
    <ChartContainer
      config={chartConfig}
      className={`${chart2ContainerClassName} ${chart2DashedGridClassName} max-w-none max-h-[420px]`}
    >
      <ComposedChart
        accessibilityLayer
        data={data}
        margin={{ top: 16, right: 40, bottom: 4, left: 4 }}
        onMouseMove={onMove}
        onMouseLeave={() => setActiveIndex(undefined)}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          reversed
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          interval={0}
          tickFormatter={(_, i) => MONTH_SHORT[i] ?? ""}
          tick={{ fontSize: 11, fontFamily: "var(--font-sans)", letterSpacing: 0 }}
        />
        <YAxis
          orientation="right"
          width={40}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          domain={[260, 560]}
          tickFormatter={(v) => toPersianDigits(v)}
          tick={{ fontSize: 11, fontFamily: "var(--font-sans)", letterSpacing: 0 }}
        />
        <Area
          dataKey="range"
          fill="var(--color-range)"
          stroke="none"
          fillOpacity={0.14}
          isAnimationActive={isAnimationActive}
          activeDot={false}
          name="بازهٔ اجماع"
        />
        <Line
          dataKey="price"
          stroke="var(--color-price)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
          isAnimationActive={isAnimationActive}
          name="قیمت"
        >
          <LabelList
            content={(props) =>
              activeIndex === props.index ? (
                <ActiveLabel {...props} color={CHART2_BAR_COLORS[0]} />
              ) : null
            }
          />
        </Line>
        <Line
          dataKey="target"
          stroke="var(--color-target)"
          strokeWidth={2}
          strokeDasharray="5 4"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
          isAnimationActive={isAnimationActive}
          name="هدف تحلیلگران"
        >
          <LabelList
            content={(props) =>
              activeIndex === props.index ? (
                <ActiveLabel {...props} color={CHART2_BAR_COLORS[1]} />
              ) : null
            }
          />
        </Line>
        <ChartTooltip
          defaultIndex={defaultIndex}
          content={({ active, payload, label }) => {
            if (!(active && payload?.length)) return null
            const row = payload[0]?.payload as Row | undefined
            if (!row) return null
            return (
              <div className="min-w-[11rem] rounded-lg border bg-background px-3 py-2.5 text-xs shadow-md font-sans tracking-[0]">
                <p className="mb-2 font-medium text-foreground">
                  {String(label)}
                </p>
                <ul className="space-y-1">
                  <li className="flex justify-between gap-4">
                    <span className="text-muted-foreground">قیمت</span>
                    <span className="font-medium">
                      {toPersianDigits(row.price)}
                    </span>
                  </li>
                  <li className="flex justify-between gap-4">
                    <span className="text-muted-foreground">هدف</span>
                    <span className="font-medium">
                      {toPersianDigits(row.target)}
                    </span>
                  </li>
                  <li className="flex justify-between gap-4">
                    <span className="text-muted-foreground">بازه</span>
                    <span className="font-medium">
                      {toPersianDigits(row.range[0])} —{" "}
                      {toPersianDigits(row.range[1])}
                    </span>
                  </li>
                </ul>
              </div>
            )
          }}
        />
      </ComposedChart>
    </ChartContainer>
  )
}
