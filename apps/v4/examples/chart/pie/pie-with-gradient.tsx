"use client"

import { useId, useState } from "react"
import {
  Cell,
  Label,
  Pie,
  PieChart,
  Sector,
  type PieSectorShapeProps,
  type TooltipContentProps,
  type TooltipIndex,
} from "recharts"

import { CHART_BAR_COLORS, toPersianDigits } from "@/lib/chart-fa"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

type Slice = {
  key: string
  name: string
  value: number
  color: string
}

/** سهم کانال‌های فروش — میلیون تومان */
const data: Slice[] = [
  { key: "online", name: "آنلاین", value: 42, color: CHART_BAR_COLORS[0] },
  { key: "store", name: "فروشگاه", value: 28, color: CHART_BAR_COLORS[1] },
  { key: "app", name: "اپلیکیشن", value: 18, color: CHART_BAR_COLORS[2] },
  { key: "partner", name: "همکار", value: 12, color: CHART_BAR_COLORS[3] },
]

const total = data.reduce((sum, row) => sum + row.value, 0)

const chartConfig = {
  value: { label: "فروش" },
  online: { label: "آنلاین", color: CHART_BAR_COLORS[0] },
  store: { label: "فروشگاه", color: CHART_BAR_COLORS[1] },
  app: { label: "اپلیکیشن", color: CHART_BAR_COLORS[2] },
  partner: { label: "همکار", color: CHART_BAR_COLORS[3] },
} satisfies ChartConfig

function GradientSlice({
  props,
  active,
  uid,
}: {
  props: PieSectorShapeProps
  active: number | undefined
  uid: string
}) {
  const {
    cx = 0,
    cy = 0,
    innerRadius = 0,
    outerRadius = 0,
    startAngle,
    endAngle,
    index = 0,
  } = props
  const slice = data[index]
  if (!slice) return null

  const isActive = active === index
  const ir = Number(innerRadius)
  const or = Number(outerRadius) + (isActive ? 6 : 0)
  const gradId = `${uid}-grad-${slice.key}`
  const shineId = `${uid}-shine-${slice.key}`

  return (
    <g style={{ cursor: "pointer" }}>
      <defs>
        <radialGradient
          id={gradId}
          cx={cx}
          cy={cy}
          r={or}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.55} />
          <stop offset="38%" stopColor={slice.color} stopOpacity={0.88} />
          <stop offset="100%" stopColor={slice.color} stopOpacity={1} />
        </radialGradient>
        <linearGradient
          id={shineId}
          x1={cx - or}
          y1={cy - or}
          x2={cx + or}
          y2={cy + or}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.28} />
          <stop offset="45%" stopColor="#ffffff" stopOpacity={0} />
          <stop offset="100%" stopColor="#000000" stopOpacity={0.08} />
        </linearGradient>
      </defs>

      {/* سایهٔ نرم زیر برش فعال */}
      {isActive ? (
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={ir}
          outerRadius={or + 2}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={slice.color}
          fillOpacity={0.18}
          stroke="none"
          cornerRadius={10}
        />
      ) : null}

      <Sector
        cx={cx}
        cy={cy}
        innerRadius={ir}
        outerRadius={or}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={`url(#${gradId})`}
        stroke="var(--background)"
        strokeWidth={3}
        cornerRadius={10}
      />
      {/* هایلایت براق روی سطح */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={ir}
        outerRadius={or}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={`url(#${shineId})`}
        stroke="none"
        cornerRadius={10}
        style={{ pointerEvents: "none" }}
      />

      {/* حلقهٔ بیرونی روی برش فعال */}
      {isActive ? (
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={or + 5}
          outerRadius={or + 9}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={slice.color}
          stroke="none"
          cornerRadius={4}
        />
      ) : null}
    </g>
  )
}

function TooltipContent({ active, payload }: TooltipContentProps) {
  if (!(active && payload?.length)) return null
  const row = payload[0]?.payload as Slice | undefined
  if (!row) return null
  const pct = (row.value / total) * 100
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
          {toPersianDigits(row.value)} میلیون تومان
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

function CenterLabel({ active }: { active: number | undefined }) {
  const slice = active != null ? data[active] : null
  const pct = slice ? (slice.value / total) * 100 : null

  return (
    <Label
      content={({ viewBox }) => {
        if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) return null
        const { cx, cy } = viewBox
        const ir =
          "innerRadius" in viewBox && typeof viewBox.innerRadius === "number"
            ? viewBox.innerRadius
            : 70
        const discR = Math.max(ir * 0.72, 36)
        const labelSize = Math.max(10, Math.round(discR * 0.2))
        const valueSize = Math.max(18, Math.round(discR * 0.42))
        return (
          <g style={{ direction: "ltr" }}>
            <circle
              cx={cx}
              cy={cy}
              r={discR}
              fill="var(--background)"
              stroke="var(--border)"
              strokeWidth={1}
              opacity={0.95}
            />
            <text
              x={cx}
              y={cy - discR * 0.22}
              textAnchor="middle"
              fill="var(--muted-foreground)"
              style={{
                fontSize: labelSize,
                fontFamily: "var(--font-sans)",
                letterSpacing: 0,
              }}
            >
              {slice ? slice.name : "جمع فروش"}
            </text>
            <text
              x={cx}
              y={cy + discR * 0.28}
              textAnchor="middle"
              fill={slice ? slice.color : "var(--foreground)"}
              style={{
                fontSize: valueSize,
                fontWeight: 700,
                fontFamily: "var(--font-sans)",
                letterSpacing: 0,
              }}
            >
              {slice
                ? `${toPersianDigits(pct!.toFixed(0))}٪`
                : `${toPersianDigits(total)} م`}
            </text>
          </g>
        )
      }}
    />
  )
}

export default function PieWithGradientDemo({
  isAnimationActive = true,
  defaultIndex,
}: {
  isAnimationActive?: boolean
  defaultIndex?: TooltipIndex
}) {
  const uid = useId().replace(/:/g, "")
  const [active, setActive] = useState<number | undefined>(
    typeof defaultIndex === "number" ? defaultIndex : undefined
  )

  return (
    <div
      dir="rtl"
      className="mx-auto flex w-full max-w-[440px] flex-col items-center gap-5 font-sans tracking-[0]"
    >
      <ChartContainer
        config={chartConfig}
        className="aspect-square h-auto w-full max-w-[400px] max-h-[70vh] font-sans text-xs"
      >
        <PieChart
          accessibilityLayer
          margin={{ top: 12, right: 12, bottom: 12, left: 12 }}
        >
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius="56%"
            outerRadius="82%"
            paddingAngle={3}
            cornerRadius={10}
            isAnimationActive={isAnimationActive}
            shape={(props) => (
              <GradientSlice props={props} active={active} uid={uid} />
            )}
            onMouseEnter={(_, index) => setActive(index)}
            onMouseLeave={() => setActive(undefined)}
          >
            {data.map((entry) => (
              <Cell key={entry.key} fill={entry.color} />
            ))}
            <CenterLabel active={active} />
          </Pie>
          <ChartTooltip content={TooltipContent} />
        </PieChart>
      </ChartContainer>

      <ul className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4">
        {data.map((slice, index) => {
          const pct = (slice.value / total) * 100
          const selected = active === index
          return (
            <li key={slice.key}>
              <button
                type="button"
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onMouseLeave={() => setActive(undefined)}
                onBlur={() => setActive(undefined)}
                className="flex w-full flex-col gap-1.5 rounded-xl border px-2.5 py-2.5 text-start transition-[border-color,background-color,box-shadow] duration-200"
                style={{
                  borderColor: selected ? slice.color : "var(--border)",
                  background: selected
                    ? `color-mix(in oklab, ${slice.color} 12%, var(--background))`
                    : "var(--background)",
                  boxShadow: selected
                    ? `0 0 0 1px color-mix(in oklab, ${slice.color} 35%, transparent)`
                    : undefined,
                }}
              >
                <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span
                    className="size-2 rounded-full"
                    style={{ background: slice.color }}
                  />
                  {slice.name}
                </span>
                <span className="text-base font-semibold leading-none text-foreground">
                  {toPersianDigits(pct.toFixed(0))}٪
                </span>
                <span
                  className="mt-0.5 h-1 w-full overflow-hidden rounded-full"
                  style={{
                    background: `color-mix(in oklab, ${slice.color} 18%, transparent)`,
                  }}
                >
                  <span
                    className="block h-full rounded-full transition-[width] duration-300"
                    style={{
                      width: `${pct}%`,
                      background: slice.color,
                      opacity: selected ? 1 : 0.75,
                    }}
                  />
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {toPersianDigits(slice.value)} میلیون
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
