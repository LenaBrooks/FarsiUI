"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
  type BarShapeProps,
  type TooltipContentProps,
} from "recharts"

import {
  CHART2_BAR_COLORS,
  chart2BarContainerClassName,
  toPersianDigits,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

type CategoryRow = {
  name: string
  sales: number
  color: string
}

/** فروش ماهانهٔ دسته‌ها (میلیون تومان) */
const data: CategoryRow[] = [
  { name: "دیجیتال", sales: 48, color: CHART2_BAR_COLORS[0] },
  { name: "پوشاک", sales: 36, color: CHART2_BAR_COLORS[1] },
  { name: "خانه", sales: 29, color: CHART2_BAR_COLORS[2] },
  { name: "زیبایی", sales: 41, color: CHART2_BAR_COLORS[3] },
  { name: "خوراکی", sales: 33, color: CHART2_BAR_COLORS[4] },
  { name: "ورزش", sales: 22, color: CHART2_BAR_COLORS[0] },
  { name: "کتاب", sales: 18, color: CHART2_BAR_COLORS[1] },
]

const maxSales = Math.max(...data.map((d) => d.sales))

const chartConfig = {
  sales: { label: "فروش", color: CHART2_BAR_COLORS[0] },
} satisfies ChartConfig

/** میله با گوشهٔ بالای گرد و برش مورب پایین — شکل سفارشی واضح و تمیز */
function CapsuleBar(props: BarShapeProps) {
  const { x = 0, y = 0, width = 0, height = 0, index = 0, isActive } = props
  const row = data[index ?? 0]
  if (!row || Number(height) <= 0) return null

  const nx = Number(x)
  const ny = Number(y)
  const nw = Math.max(Number(width), 1)
  const nh = Number(height)
  const r = Math.min(nw / 2, 14)
  const gradId = `bar-cap-${index}`
  const isTop = row.sales === maxSales

  // مستطیل با دو گوشهٔ بالای گرد (path)
  const path = [
    `M${nx},${ny + nh}`,
    `L${nx},${ny + r}`,
    `Q${nx},${ny} ${nx + r},${ny}`,
    `L${nx + nw - r},${ny}`,
    `Q${nx + nw},${ny} ${nx + nw},${ny + r}`,
    `L${nx + nw},${ny + nh}`,
    "Z",
  ].join(" ")

  return (
    <g>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={row.color} stopOpacity={1} />
          <stop offset="100%" stopColor={row.color} stopOpacity={0.55} />
        </linearGradient>
      </defs>
      <path
        d={path}
        fill={`url(#${gradId})`}
        stroke={row.color}
        strokeWidth={isActive || isTop ? 1.25 : 0}
        strokeOpacity={0.9}
        style={{
          transition: "opacity 0.2s ease-out, stroke-width 0.2s ease-out",
          opacity: isActive ? 1 : 0.9,
        }}
      />
      {/* نوار براق نازک روی لبهٔ بالا */}
      <rect
        x={nx + r * 0.35}
        y={ny + 3}
        width={Math.max(nw - r * 0.7, 0)}
        height={3}
        rx={1.5}
        fill="var(--background)"
        opacity={0.35}
        pointerEvents="none"
      />
    </g>
  )
}

function ValueLabel(props: {
  x?: number | string
  y?: number | string
  width?: number | string
  index?: number
}) {
  const row = data[props.index ?? -1]
  if (!row) return null
  const x = Number(props.x) + Number(props.width) / 2
  const y = Number(props.y) - 10

  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fill="var(--foreground)"
      fontSize={12}
      fontFamily="var(--font-sans)"
      fontWeight={600}
    >
      {toPersianDigits(row.sales)}
    </text>
  )
}

function TooltipContent({ active, payload }: TooltipContentProps) {
  if (!(active && payload?.length)) return null
  const row = payload[0]?.payload as CategoryRow | undefined
  if (!row) return null
  return (
    <div className="rounded-lg border bg-background px-3 py-2 text-xs shadow-md font-sans">
      <p className="mb-1 font-medium text-foreground">{row.name}</p>
      <p className="text-muted-foreground">
        فروش:{" "}
        <span className="font-medium tabular-nums text-foreground">
          {toPersianDigits(row.sales)} میلیون تومان
        </span>
      </p>
    </div>
  )
}

export default function CustomShapeBarChartDemo() {
  return (
    <ChartContainer
      config={chartConfig}
      className={`${chart2BarContainerClassName} max-w-none aspect-[1.5]`}
    >
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ top: 36, right: 8, left: 4, bottom: 8 }}
        barCategoryGap="22%"
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          reversed
          tickLine={false}
          axisLine={false}
          tickMargin={12}
          tick={{ fontSize: 12, fontFamily: "var(--font-sans)" }}
        />
        <YAxis
          orientation="right"
          width={36}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          domain={[0, 50]}
          ticks={[0, 10, 20, 30, 40, 50]}
          tickFormatter={(v) => toPersianDigits(v)}
        />
        <ChartTooltip cursor={false} content={TooltipContent} />
        <Bar
          dataKey="sales"
          shape={CapsuleBar}
          activeBar={CapsuleBar}
          isAnimationActive
          animationDuration={600}
          animationEasing="ease-out"
        >
          <LabelList dataKey="sales" content={<ValueLabel />} />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
