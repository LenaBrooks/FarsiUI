"use client"

import { useId, useState } from "react"
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
  CHART_BAR_COLORS,
  chartBarContainerClassName,
  toPersianDigits,
} from "@/lib/chart-fa"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

type CategoryRow = {
  key: string
  name: string
  sales: number
  color: string
}

/** فروش ماهانهٔ دسته‌ها (میلیون تومان) */
const data: CategoryRow[] = [
  { key: "digital", name: "دیجیتال", sales: 48, color: CHART_BAR_COLORS[0] },
  { key: "fashion", name: "پوشاک", sales: 36, color: CHART_BAR_COLORS[1] },
  { key: "beauty", name: "زیبایی", sales: 41, color: CHART_BAR_COLORS[3] },
  { key: "home", name: "خانه", sales: 29, color: CHART_BAR_COLORS[2] },
  { key: "food", name: "خوراکی", sales: 33, color: CHART_BAR_COLORS[4] },
]

const total = data.reduce((sum, row) => sum + row.sales, 0)

const chartConfig = {
  sales: { label: "فروش", color: CHART_BAR_COLORS[0] },
  digital: { label: "دیجیتال", color: CHART_BAR_COLORS[0] },
  fashion: { label: "پوشاک", color: CHART_BAR_COLORS[1] },
  beauty: { label: "زیبایی", color: CHART_BAR_COLORS[3] },
  home: { label: "خانه", color: CHART_BAR_COLORS[2] },
  food: { label: "خوراکی", color: CHART_BAR_COLORS[4] },
} satisfies ChartConfig

function CustomBar({
  props,
  active,
  uid,
}: {
  props: BarShapeProps
  active: number | undefined
  uid: string
}) {
  const { x = 0, y = 0, width = 0, height = 0, index = 0 } = props
  const row = data[index ?? 0]
  if (!row || Number(height) <= 0) return null

  const isActive = active === index
  const lift = isActive ? 6 : 0
  const nx = Math.round(Number(x))
  const ny = Math.round(Number(y) - lift)
  const nw = Math.max(Math.round(Number(width)), 1)
  const nh = Math.round(Number(height) + lift)
  const cut = Math.min(Math.floor(nw * 0.28), 14)
  const r = Math.min(Math.floor(nw / 2), 8)
  const gradId = `${uid}-bar-${row.key}`
  const shineId = `${uid}-shine-${row.key}`

  // برش مورب بالای چپ + گوشهٔ گرد راست
  const path = [
    `M${nx} ${ny + nh}`,
    `L${nx} ${ny + cut}`,
    `L${nx + cut} ${ny}`,
    `L${nx + nw - r} ${ny}`,
    `Q${nx + nw} ${ny} ${nx + nw} ${ny + r}`,
    `L${nx + nw} ${ny + nh}`,
    "Z",
  ].join(" ")

  return (
    <g style={{ cursor: "pointer" }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={row.color} stopOpacity={1} />
          <stop offset="100%" stopColor={row.color} stopOpacity={0.85} />
        </linearGradient>
        <linearGradient id={shineId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.22} />
          <stop offset="55%" stopColor="#ffffff" stopOpacity={0} />
        </linearGradient>
      </defs>

      {isActive ? (
        <path
          d={path}
          fill={row.color}
          fillOpacity={0.16}
          transform={`translate(0 4)`}
          shapeRendering="geometricPrecision"
        />
      ) : null}

      <path
        d={path}
        fill={`url(#${gradId})`}
        stroke={isActive ? row.color : "none"}
        strokeWidth={isActive ? 1.5 : 0}
        shapeRendering="geometricPrecision"
      />
      <path
        d={path}
        fill={`url(#${shineId})`}
        style={{ pointerEvents: "none" }}
        shapeRendering="geometricPrecision"
      />
      <path
        d={`M${nx + cut + 2} ${ny + 3} L${nx + nw - r - 2} ${ny + 3}`}
        stroke="var(--background)"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeOpacity={0.28}
        style={{ pointerEvents: "none" }}
      />
    </g>
  )
}

function ValueLabel({
  props,
  active,
}: {
  props: {
    x?: number | string
    y?: number | string
    width?: number | string
    index?: number
  }
  active: number | undefined
}) {
  const row = data[props.index ?? -1]
  if (!row) return null
  const isActive = active === props.index
  const x = Math.round(Number(props.x) + Number(props.width) / 2)
  const y = Math.round(Number(props.y) - (isActive ? 16 : 10))

  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fill={isActive ? row.color : "var(--foreground)"}
      fontSize={isActive ? 13 : 12}
      fontFamily="var(--font-sans)"
      fontWeight={700}
    >
      {toPersianDigits(row.sales)}
    </text>
  )
}

function TooltipContent({ active, payload }: TooltipContentProps) {
  if (!(active && payload?.length)) return null
  const row = payload[0]?.payload as CategoryRow | undefined
  if (!row) return null
  const pct = (row.sales / total) * 100
  return (
    <div className="min-w-[10rem] rounded-xl border bg-background px-3 py-2.5 text-xs shadow-md font-sans tracking-[0]">
      <div className="mb-1.5 flex items-center gap-2">
        <span
          className="size-2.5 rounded-full shadow-sm"
          style={{ background: row.color }}
        />
        <span className="font-medium text-foreground">{row.name}</span>
      </div>
      <p className="text-muted-foreground">
        فروش:{" "}
        <span className="font-semibold text-foreground">
          {toPersianDigits(row.sales)} میلیون تومان
        </span>
      </p>
      <p className="mt-0.5 text-muted-foreground">
        سهم:{" "}
        <span className="font-semibold text-foreground">
          {toPersianDigits(pct.toFixed(1))}٪
        </span>
      </p>
    </div>
  )
}

export default function CustomShapeBarChartDemo({
  isAnimationActive = true,
}: {
  isAnimationActive?: boolean
}) {
  const uid = useId().replace(/:/g, "")
  const [active, setActive] = useState<number | undefined>()

  return (
    <div
      dir="rtl"
      className="mx-auto flex w-full max-w-[560px] flex-col gap-5 font-sans tracking-[0]"
    >
      <div className="flex items-end justify-between gap-3 px-0.5">
        <div className="min-w-0">
          <p className="text-[11px] text-muted-foreground">گزارش ماهانه</p>
          <h3 className="text-base font-semibold tracking-tight text-foreground">
            فروش دسته‌ها
          </h3>
        </div>
        <div className="text-end">
          <p className="text-[11px] text-muted-foreground">جمع</p>
          <p className="fa-num text-sm font-bold text-foreground">
            {toPersianDigits(total)}{" "}
            <span className="text-[11px] font-medium text-muted-foreground">
              م
            </span>
          </p>
        </div>
      </div>

      <ChartContainer
        config={chartConfig}
        className={`${chartBarContainerClassName} max-w-none aspect-[1.55]`}
      >
        <BarChart
          accessibilityLayer
          data={data}
          margin={{ top: 36, right: 8, left: 4, bottom: 8 }}
          barCategoryGap="28%"
          onMouseLeave={() => setActive(undefined)}
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
            domain={[0, 55]}
            ticks={[0, 10, 20, 30, 40, 50]}
            tickFormatter={(v) => toPersianDigits(v)}
          />
          <ChartTooltip cursor={false} content={TooltipContent} />
          <Bar
            dataKey="sales"
            shape={(props) => (
              <CustomBar props={props} active={active} uid={uid} />
            )}
            activeBar={(props) => (
              <CustomBar props={props} active={active} uid={uid} />
            )}
            onMouseEnter={(_, index) => setActive(index)}
            isAnimationActive={isAnimationActive}
            animationDuration={650}
            animationEasing="ease-out"
          >
            <LabelList
              dataKey="sales"
              content={(props) => (
                <ValueLabel props={props} active={active} />
              )}
            />
          </Bar>
        </BarChart>
      </ChartContainer>

      <ul className="grid w-full grid-cols-2 gap-2 sm:grid-cols-5">
        {data.map((row, index) => {
          const pct = (row.sales / total) * 100
          const selected = active === index
          return (
            <li key={row.key}>
              <button
                type="button"
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onMouseLeave={() => setActive(undefined)}
                onBlur={() => setActive(undefined)}
                className="flex w-full flex-col gap-1.5 rounded-xl border px-2.5 py-2.5 text-start transition-[border-color,background-color,box-shadow] duration-200"
                style={{
                  borderColor: selected ? row.color : "var(--border)",
                  background: selected
                    ? `color-mix(in oklab, ${row.color} 12%, var(--background))`
                    : "var(--background)",
                  boxShadow: selected
                    ? `0 0 0 1px color-mix(in oklab, ${row.color} 35%, transparent)`
                    : undefined,
                }}
              >
                <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span
                    className="size-2 rounded-full"
                    style={{ background: row.color }}
                  />
                  {row.name}
                </span>
                <span className="text-base font-semibold leading-none text-foreground">
                  {toPersianDigits(pct.toFixed(0))}٪
                </span>
                <span
                  className="mt-0.5 h-1 w-full overflow-hidden rounded-full"
                  style={{
                    background: `color-mix(in oklab, ${row.color} 18%, transparent)`,
                  }}
                >
                  <span
                    className="block h-full rounded-full transition-[width] duration-300"
                    style={{
                      width: `${pct}%`,
                      background: row.color,
                      opacity: selected ? 1 : 0.75,
                    }}
                  />
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
