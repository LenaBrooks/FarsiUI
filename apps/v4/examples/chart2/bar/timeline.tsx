"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
  XAxis,
  YAxis,
  type BarProps,
  type BarShapeProps,
} from "recharts"

import {
  CHART2_BAR_COLORS,
  chart2BarContainerClassName,
  toPersianDigits,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

type TimelineDataType = {
  name: string
  type: string
  outcome: "success" | "error" | "pending"
  firstCycle: [number, number]
  secondCycle: [number, number]
}

const data: Array<TimelineDataType> = [
  {
    name: "آزمایش ۱",
    type: "TR",
    outcome: "success",
    firstCycle: [0, 3],
    secondCycle: [4.11, 14.11],
  },
  {
    name: "آزمایش ۲",
    type: "MT",
    outcome: "error",
    firstCycle: [0, 1.5],
    secondCycle: [9.11, 12.11],
  },
  {
    name: "آزمایش ۳",
    type: "MT",
    outcome: "success",
    firstCycle: [3, 5.37],
    secondCycle: [8.74, 14.48],
  },
  {
    name: "آزمایش ۴",
    type: "MT",
    outcome: "error",
    firstCycle: [5.37, 7.87],
    secondCycle: [9.61, 16.98],
  },
  {
    name: "آزمایش ۵",
    type: "MT",
    outcome: "success",
    firstCycle: [4.87, 8.24],
    secondCycle: [10.74, 17.35],
  },
  {
    name: "آزمایش ۶",
    type: "MT",
    outcome: "success",
    firstCycle: [3.24, 5.74],
    secondCycle: [8.61, 17.85],
  },
  {
    name: "آزمایش ۷",
    type: "MT",
    outcome: "success",
    firstCycle: [2.74, 9.11],
    secondCycle: [9.74, 18.22],
  },
  {
    name: "آزمایش ۸",
    type: "MT",
    outcome: "pending",
    firstCycle: [9.11, 10.61],
    secondCycle: [12.11, 19.72],
  },
]

const chartConfig = {
  firstCycle: { label: "چرخهٔ اول", color: CHART2_BAR_COLORS[0] },
  secondCycle: { label: "چرخهٔ دوم", color: CHART2_BAR_COLORS[1] },
} satisfies ChartConfig

function getBarColor(outcome: TimelineDataType["outcome"]) {
  switch (outcome) {
    case "success":
      return CHART2_BAR_COLORS[0]
    case "error":
      return "var(--destructive)"
    default:
      return "var(--muted-foreground)"
  }
}

function CustomFillRectangle(props: BarShapeProps) {
  // @ts-expect-error props.outcome is injected from the data array
  const { outcome, isActive } = props
  const barColor = getBarColor(outcome)
  return (
    <Rectangle
      {...props}
      stroke={isActive ? CHART2_BAR_COLORS[2] : barColor}
      strokeWidth={isActive ? 3 : 1}
      fill={barColor}
    />
  )
}

function MyBar(props: BarProps) {
  return (
    <Bar
      {...props}
      stackId="a"
      radius={25}
      activeBar
      shape={CustomFillRectangle}
    />
  )
}

export default function TimelineDemo({
  defaultIndex,
}: {
  defaultIndex?: number
}) {
  return (
    <ChartContainer config={chartConfig} className={chart2BarContainerClassName}>
      <BarChart
        accessibilityLayer
        layout="vertical"
        data={data}
        margin={{ top: 8, right: 12, left: 8, bottom: 28 }}
      >
        <CartesianGrid horizontal={false} strokeDasharray="3 3" />
        <ChartTooltip
          shared={false}
          defaultIndex={defaultIndex}
          content={
            <ChartTooltipContent
              formatter={(value) => {
                if (!Array.isArray(value)) {
                  return toPersianDigits(Number(value).toFixed(2))
                }
                return `${toPersianDigits(String(value[0]))} — ${toPersianDigits(String(value[1]))}`
              }}
            />
          }
        />
        <XAxis
          type="number"
          height={50}
          tickFormatter={(v) => toPersianDigits(String(v))}
          label={{
            value: "زمان (ثانیه)",
            position: "insideBottomRight",
            style: { fontFamily: "var(--font-sans)", fontSize: 11 },
            fill: "var(--muted-foreground)",
          }}
        />
        <YAxis
          type="category"
          dataKey="name"
          orientation="right"
          width={72}
          tickMargin={10}
        />
        <MyBar dataKey="firstCycle" />
        <MyBar dataKey="secondCycle" />
      </BarChart>
    </ChartContainer>
  )
}
