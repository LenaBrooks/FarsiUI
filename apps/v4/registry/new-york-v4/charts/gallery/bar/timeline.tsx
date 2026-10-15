"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
  XAxis,
  YAxis,
  type BarShapeProps,
} from "recharts"

import { useChartCaption } from "@/registry/new-york-v4/lib/chart-live"
import {
  CHART_BAR_COLORS,
  chartBarContainerClassName,
  toPersianDigits,
} from "@/lib/chart-fa"
import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

type Outcome = "success" | "error" | "pending"

type TimelineRow = {
  name: string
  type: string
  label: string
  outcome: Outcome
  firstCycle: [number, number]
  secondCycle: [number, number]
}

const OUTCOME_META: Record<
  Outcome,
  { label: string; color: string; soft: string }
> = {
  success: {
    label: "موفق",
    color: CHART_BAR_COLORS[2],
    soft: "color-mix(in oklab, #7eb8a0 55%, transparent)",
  },
  error: {
    label: "ناموفق",
    color: CHART_BAR_COLORS[1],
    soft: "color-mix(in oklab, #ed7485 55%, transparent)",
  },
  pending: {
    label: "در انتظار",
    color: CHART_BAR_COLORS[3],
    soft: "color-mix(in oklab, #c4a574 55%, transparent)",
  },
}

const data: TimelineRow[] = [
  {
    name: "آزمایش ۱",
    type: "TR",
    label: "آزمایش ۱ · TR",
    outcome: "success",
    firstCycle: [0, 3],
    secondCycle: [4.11, 14.11],
  },
  {
    name: "آزمایش ۲",
    type: "MT",
    label: "آزمایش ۲ · MT",
    outcome: "error",
    firstCycle: [0, 1.5],
    secondCycle: [9.11, 12.11],
  },
  {
    name: "آزمایش ۳",
    type: "MT",
    label: "آزمایش ۳ · MT",
    outcome: "success",
    firstCycle: [3, 5.37],
    secondCycle: [8.74, 14.48],
  },
  {
    name: "آزمایش ۴",
    type: "MT",
    label: "آزمایش ۴ · MT",
    outcome: "error",
    firstCycle: [5.37, 7.87],
    secondCycle: [9.61, 16.98],
  },
  {
    name: "آزمایش ۵",
    type: "MT",
    label: "آزمایش ۵ · MT",
    outcome: "success",
    firstCycle: [4.87, 8.24],
    secondCycle: [10.74, 17.35],
  },
  {
    name: "آزمایش ۶",
    type: "MT",
    label: "آزمایش ۶ · MT",
    outcome: "success",
    firstCycle: [3.24, 5.74],
    secondCycle: [8.61, 17.85],
  },
  {
    name: "آزمایش ۷",
    type: "MT",
    label: "آزمایش ۷ · MT",
    outcome: "success",
    firstCycle: [2.74, 9.11],
    secondCycle: [9.74, 18.22],
  },
  {
    name: "آزمایش ۸",
    type: "MT",
    label: "آزمایش ۸ · MT",
    outcome: "pending",
    firstCycle: [9.11, 10.61],
    secondCycle: [12.11, 19.72],
  },
]

const chartConfig = {
  firstCycle: { label: "چرخهٔ اول", color: CHART_BAR_COLORS[0] },
  secondCycle: { label: "چرخهٔ دوم", color: CHART_BAR_COLORS[1] },
} satisfies ChartConfig

function formatSeconds(value: number) {
  return `${toPersianDigits(value.toFixed(1))} ث`
}

function TimelineBarShape({
  soft,
  ...props
}: BarShapeProps & { soft?: boolean }) {
  // @ts-expect-error outcome comes from the row payload
  const outcome = (props.outcome ?? "pending") as Outcome
  const meta = OUTCOME_META[outcome]
  const isActive = Boolean(props.isActive)
  const fill = soft ? meta.soft : meta.color

  return (
    <Rectangle
      {...props}
      radius={6}
      fill={fill}
      stroke={isActive ? meta.color : "transparent"}
      strokeWidth={isActive ? 2 : 0}
      style={{
        filter: isActive
          ? `drop-shadow(0 0 0 1px ${meta.color})`
          : undefined,
      }}
    />
  )
}

function OutcomeLegend() {
  return (
    <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px] text-muted-foreground">
      {(Object.keys(OUTCOME_META) as Outcome[]).map((key) => (
        <li key={key} className="inline-flex items-center gap-1.5">
          <span
            className="size-2.5 rounded-[3px]"
            style={{ background: OUTCOME_META[key].color }}
            aria-hidden
          />
          {OUTCOME_META[key].label}
        </li>
      ))}
      <li className="inline-flex items-center gap-1.5 text-muted-foreground/80">
        <span
          className="h-2 w-4 rounded-[3px]"
          style={{ background: OUTCOME_META.success.soft }}
          aria-hidden
        />
        چرخهٔ اول
      </li>
      <li className="inline-flex items-center gap-1.5 text-muted-foreground/80">
        <span
          className="h-2 w-4 rounded-[3px]"
          style={{ background: OUTCOME_META.success.color }}
          aria-hidden
        />
        چرخهٔ دوم
      </li>
    </ul>
  )
}

export default function TimelineDemo({
  defaultIndex,
}: {
  defaultIndex?: number
}) {
  useChartCaption(() => "زمان‌بندی دو چرخه برای هر آزمایش — رنگ بر اساس نتیجه")

  return (
    <div
      dir="rtl"
      className="flex w-full max-w-[720px] flex-col gap-3 font-sans"
    >
      <ChartContainer
        config={chartConfig}
        className={cn(chartBarContainerClassName, "max-w-none aspect-[1.35]")}
      >
        <BarChart
          accessibilityLayer
          layout="vertical"
          data={data}
          barCategoryGap="28%"
          margin={{ top: 10, right: 8, left: 4, bottom: 8 }}
        >
          <CartesianGrid
            horizontal={false}
            strokeDasharray="3 3"
            stroke="var(--border)"
            strokeOpacity={0.7}
          />
          <ChartTooltip
            shared={false}
            cursor={{
              fill: "color-mix(in oklab, var(--foreground) 5%, transparent)",
            }}
            defaultIndex={defaultIndex}
            content={
              <ChartTooltipContent
                labelKey="label"
                formatter={(value, name, item) => {
                  const row = item?.payload as TimelineRow | undefined
                  const range = Array.isArray(value)
                    ? (value as [number, number])
                    : null
                  const duration =
                    range != null ? range[1] - range[0] : Number(value)
                  const cycleLabel =
                    name === "firstCycle" ? "چرخهٔ اول" : "چرخهٔ دوم"
                  const outcomeLabel = row
                    ? OUTCOME_META[row.outcome].label
                    : ""

                  return (
                    <div className="flex w-full min-w-[10rem] flex-col gap-0.5 font-sans">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-muted-foreground">{cycleLabel}</span>
                        <span className="fa-num font-medium text-foreground">
                          {range
                            ? `${formatSeconds(range[0])} — ${formatSeconds(range[1])}`
                            : formatSeconds(Number(value))}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4 text-[11px]">
                        <span className="text-muted-foreground">مدت</span>
                        <span className="fa-num">
                          {formatSeconds(duration)}
                        </span>
                      </div>
                      {outcomeLabel ? (
                        <div className="flex items-center justify-between gap-4 text-[11px]">
                          <span className="text-muted-foreground">نتیجه</span>
                          <span>{outcomeLabel}</span>
                        </div>
                      ) : null}
                    </div>
                  )
                }}
              />
            }
          />
          <XAxis
            type="number"
            domain={[0, "dataMax + 1"]}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            minTickGap={28}
            tickFormatter={(v) => toPersianDigits(String(v))}
            label={{
              value: "زمان (ثانیه)",
              position: "insideBottom",
              offset: -2,
              style: {
                fontFamily: "var(--font-sans)",
                fontSize: 11,
                fill: "var(--muted-foreground)",
              },
            }}
          />
          <YAxis
            type="category"
            dataKey="label"
            orientation="right"
            width={96}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tick={{ fontSize: 11, fontFamily: "var(--font-sans)" }}
          />
          <Bar
            dataKey="firstCycle"
            name="firstCycle"
            maxBarSize={18}
            activeBar
            shape={(props) => <TimelineBarShape {...props} soft />}
            isAnimationActive
            animationDuration={700}
          />
          <Bar
            dataKey="secondCycle"
            name="secondCycle"
            maxBarSize={18}
            activeBar
            shape={(props) => <TimelineBarShape {...props} />}
            isAnimationActive
            animationDuration={700}
            animationBegin={80}
          />
        </BarChart>
      </ChartContainer>
      <OutcomeLegend />
    </div>
  )
}
