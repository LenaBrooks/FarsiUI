"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts"

import { useChart2Caption } from "@/components/chart2-live"
import {
  CHART2_BAR_COLORS,
  chart2BarContainerClassName,
  toPersianDigits,
} from "@/lib/chart2-fa"
import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

type TaskRow = {
  task: string
  /** [روز شروع، روز پایان] — نوار از شروع تا پایان کشیده می‌شود */
  span: [number, number]
}

/**
 * برنامهٔ یک پروژهٔ نمونه — مثل جدول زمانی کارهای ساختمانی/نرم‌افزار.
 * هر ردیف یک کار است؛ جای نوار روی محور افقی = کی شروع و کی تمام می‌شود.
 */
const data: TaskRow[] = [
  { task: "تحقیق و نیازمندی", span: [0, 3] },
  { task: "طراحی رابط", span: [2, 6] },
  { task: "توسعهٔ فرانت", span: [5, 12] },
  { task: "توسعهٔ بک‌اند", span: [4, 11] },
  { task: "تست و بازبینی", span: [10, 15] },
  { task: "انتشار", span: [14, 17] },
]

const chartConfig = {
  span: { label: "بازهٔ کار", color: CHART2_BAR_COLORS[0] },
} satisfies ChartConfig

function dayLabel(n: number) {
  return `روز ${toPersianDigits(n)}`
}

function DurationOnBar(props: {
  x?: number
  y?: number
  width?: number
  height?: number
  value?: [number, number]
}) {
  const { x = 0, y = 0, width = 0, height = 0, value } = props
  if (!Array.isArray(value) || width < 36) return null
  const days = value[1] - value[0]
  return (
    <text
      x={x + width / 2}
      y={y + height / 2}
      textAnchor="middle"
      dominantBaseline="central"
      fill="white"
      fontSize={11}
      fontFamily="var(--font-sans)"
      fontWeight={500}
    >
      {toPersianDigits(days)} روز
    </text>
  )
}

export default function TimelineDemo({
  defaultIndex,
}: {
  defaultIndex?: number
}) {
  useChart2Caption(
    () =>
      "برنامهٔ زمانی پروژه: هر ردیف یک کار است. جای نوار روی محور = از کدام روز تا کدام روز طول می‌کشد."
  )

  return (
    <div dir="rtl" className="flex w-full max-w-[720px] flex-col gap-2 font-sans">
      <p className="text-center text-sm font-medium text-foreground">
        برنامهٔ زمانی انتشار محصول
      </p>
      <ChartContainer
        config={chartConfig}
        className={cn(chart2BarContainerClassName, "max-w-none aspect-[1.45]")}
      >
        <BarChart
          accessibilityLayer
          layout="vertical"
          data={data}
          barCategoryGap="30%"
          margin={{ top: 8, right: 8, left: 4, bottom: 4 }}
        >
          <CartesianGrid horizontal={false} strokeDasharray="3 3" />
          <ChartTooltip
            cursor={{
              fill: "color-mix(in oklab, var(--foreground) 5%, transparent)",
            }}
            defaultIndex={defaultIndex}
            content={
              <ChartTooltipContent
                labelKey="task"
                formatter={(value) => {
                  if (!Array.isArray(value) || value.length < 2) return null
                  const [from, to] = value as [number, number]
                  return (
                    <div className="flex w-full min-w-[9rem] flex-col gap-1 font-sans text-[13px]">
                      <div className="flex justify-between gap-6">
                        <span className="text-muted-foreground">شروع</span>
                        <span className="font-medium">{dayLabel(from)}</span>
                      </div>
                      <div className="flex justify-between gap-6">
                        <span className="text-muted-foreground">پایان</span>
                        <span className="font-medium">{dayLabel(to)}</span>
                      </div>
                      <div className="flex justify-between gap-6 border-t border-border/50 pt-1">
                        <span className="text-muted-foreground">مدت</span>
                        <span className="font-medium">
                          {toPersianDigits(to - from)} روز
                        </span>
                      </div>
                    </div>
                  )
                }}
              />
            }
          />
          <XAxis
            type="number"
            domain={[0, 18]}
            ticks={[0, 3, 6, 9, 12, 15, 18]}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tickFormatter={(v) => dayLabel(Number(v))}
          />
          <YAxis
            type="category"
            dataKey="task"
            orientation="right"
            width={110}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tick={{ fontSize: 12, fontFamily: "var(--font-sans)" }}
          />
          <Bar
            dataKey="span"
            name="span"
            fill="var(--color-span)"
            radius={6}
            maxBarSize={22}
            background={{
              fill: "color-mix(in oklab, var(--muted-foreground) 8%, transparent)",
              radius: 6,
            }}
          >
            <LabelList dataKey="span" content={<DurationOnBar />} />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  )
}
