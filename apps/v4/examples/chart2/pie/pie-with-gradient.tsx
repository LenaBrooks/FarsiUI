"use client"

import {
  Pie,
  PieChart,
  Sector,
  type PieSectorShapeProps,
  type TooltipIndex,
} from "recharts"

import {
  FA_CHART,
  formatChart2Number,
  generatePersianMockData,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
]

const KEYS = ["tehran", "isfahan", "fars", "khorasan"] as const

const data = generatePersianMockData(4, 1000).map((entry, index) => ({
  ...entry,
  name: KEYS[index % KEYS.length],
  fill: COLORS[index % COLORS.length],
}))

const chartConfig = {
  x: { label: FA_CHART.sales },
  tehran: { label: FA_CHART.tehran, color: "var(--chart-1)" },
  isfahan: { label: FA_CHART.isfahan, color: "var(--chart-2)" },
  fars: { label: FA_CHART.fars, color: "var(--chart-3)" },
  khorasan: { label: FA_CHART.khorasan, color: "var(--chart-4)" },
} satisfies ChartConfig

function PieGradient(props: PieSectorShapeProps) {
  return (
    <>
      <defs>
        <radialGradient
          id={`fillGradient${props.index}`}
          cx={props.cx}
          cy={props.cy}
          r={props.outerRadius}
          gradientUnits="userSpaceOnUse"
        >
          <stop
            offset="0%"
            stopColor={COLORS[props.index % COLORS.length]}
            stopOpacity={0}
          />
          <stop
            offset="100%"
            stopColor={COLORS[props.index % COLORS.length]}
            stopOpacity={0.8}
          />
        </radialGradient>
        <radialGradient
          id={`borderGradient${props.index}`}
          cx={(typeof props.width === "number" ? props.width : 0) / 2}
          cy={(typeof props.height === "number" ? props.height : 0) / 2}
        >
          <stop
            offset="0%"
            stopColor={COLORS[props.index % COLORS.length]}
            stopOpacity={0}
          />
          <stop
            offset="100%"
            stopColor={COLORS[props.index % COLORS.length]}
            stopOpacity={0.8}
          />
        </radialGradient>
        <clipPath id={`clipPath${props.index}`}>
          <Sector {...props} />
        </clipPath>
      </defs>
      <Sector
        {...props}
        clipPath={`url(#clipPath${props.index})`}
        fill={`url(#fillGradient${props.index})`}
        stroke={`url(#borderGradient${props.index})`}
        strokeWidth={props.isActive ? "100%" : 0}
      />
    </>
  )
}

export default function PieWithGradientDemo({
  isAnimationActive = true,
  defaultIndex,
}: {
  isAnimationActive?: boolean
  defaultIndex?: TooltipIndex
}) {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-auto w-full max-w-[500px] max-h-[80vh] font-sans text-xs"
    >
      <PieChart accessibilityLayer>
        <Pie
          data={data}
          dataKey="x"
          nameKey="name"
          isAnimationActive={isAnimationActive}
          shape={PieGradient}
          innerRadius="20%"
        />
        <ChartTooltip
          defaultIndex={defaultIndex}
          content={
            <ChartTooltipContent
              nameKey="name"
              formatter={(value) => formatChart2Number(value as number)}
            />
          }
        />
      </PieChart>
    </ChartContainer>
  )
}
