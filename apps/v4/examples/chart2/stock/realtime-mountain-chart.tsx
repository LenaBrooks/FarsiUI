"use client"

/**
 * Realtime Mountain Chart — inspired by
 * https://www.scichart.com/demo/react/realtime-mountain-chart
 * Rebuilt with FarsiUI chart primitives (Recharts Area + live random walk).
 */

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { useChart2ToolbarStart } from "@/components/chart2-live"
import { chart2ContainerClassName } from "@/lib/chart2-fa"
import { Button } from "@/registry/new-york-v4/ui/button"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

import {
  formatToman,
  formatTomanTick,
  timestampToMinutes,
} from "./stock-shared"

/** Theme tokens — Default maps chart-1/2 to Tremor-like blue / emerald. */
const MOUNTAIN_STROKE = "var(--chart-1)"
const PULSE_TEAL = "var(--chart-2)"

const WINDOW = 50
const TICK_MS = 1000
const STEP_MS = 1000
const START_PRICE = 100

type MountainPoint = {
  time: number
  price: number
}

function randomWalkStep(prev: number) {
  return prev + (Math.random() - 0.48) * 3.2
}

function seedSeries(length: number, startPrice: number, endTime: number) {
  const points: MountainPoint[] = []
  let price = startPrice
  const startTime = endTime - (length - 1) * STEP_MS
  for (let i = 0; i < length; i++) {
    if (i > 0) price = randomWalkStep(price)
    points.push({
      time: startTime + i * STEP_MS,
      price: Math.round(price * 100) / 100,
    })
  }
  return points
}

function PulsingLiveDot({
  cx,
  cy,
  index,
  lastIndex,
}: {
  cx?: number
  cy?: number
  index?: number
  lastIndex: number
}) {
  if (
    index !== lastIndex ||
    cx == null ||
    cy == null ||
    Number.isNaN(cx) ||
    Number.isNaN(cy)
  ) {
    return null
  }

  return (
    <g>
      <circle cx={cx} cy={cy} fill={PULSE_TEAL} r={5}>
        <animate
          attributeName="r"
          from="5"
          to="20"
          dur="1s"
          begin="0s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          from="0.85"
          to="0"
          dur="1s"
          begin="0s"
          repeatCount="indefinite"
        />
      </circle>
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill={MOUNTAIN_STROKE}
        stroke="var(--background)"
        strokeWidth={1.5}
      />
    </g>
  )
}

const chartConfig = {
  price: {
    label: "قیمت زنده",
    color: MOUNTAIN_STROKE,
  },
} satisfies ChartConfig

export default function RealtimeMountainChartDemo() {
  const gradientId = React.useId().replace(/:/g, "")
  const [running, setRunning] = React.useState(true)
  const [data, setData] = React.useState<MountainPoint[]>(() =>
    seedSeries(WINDOW, START_PRICE, Date.now())
  )

  React.useEffect(() => {
    if (!running) return

    const id = window.setInterval(() => {
      setData((prev) => {
        const last = prev[prev.length - 1]
        if (!last) return prev
        const next: MountainPoint = {
          time: last.time + STEP_MS,
          price: Math.round(randomWalkStep(last.price) * 100) / 100,
        }
        const nextData = [...prev, next]
        return nextData.length > WINDOW
          ? nextData.slice(nextData.length - WINDOW)
          : nextData
      })
    }, TICK_MS)

    return () => window.clearInterval(id)
  }, [running])

  useChart2ToolbarStart(
    () => (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-7 gap-1.5 px-2 text-[12px] text-muted-foreground"
        onClick={() => setRunning((v) => !v)}
      >
        <span
          className={
            running
              ? "size-1.5 shrink-0 rounded-full bg-emerald-500"
              : "size-1.5 shrink-0 rounded-full bg-muted-foreground/50"
          }
          aria-hidden
        />
        {running ? "زنده" : "توقف"}
      </Button>
    ),
    [running]
  )

  const lastIndex = data.length - 1

  return (
    <ChartContainer config={chartConfig} className={chart2ContainerClassName}>
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{ top: 16, right: 10, bottom: 8, left: 0 }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={MOUNTAIN_STROKE} stopOpacity={0.45} />
            <stop offset="100%" stopColor={MOUNTAIN_STROKE} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="time"
          reversed
          tickMargin={8}
          minTickGap={36}
          tickFormatter={timestampToMinutes}
        />
        <YAxis
          orientation="right"
          width={56}
          tickMargin={10}
          domain={["dataMin - 2", "dataMax + 2"]}
          tickFormatter={formatTomanTick}
          label={{
            value: "تومان",
            angle: 90,
            position: "insideRight",
            style: { fontFamily: "var(--font-sans)", fontSize: 11 },
            fill: "var(--muted-foreground)",
          }}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(_, payload) => {
                const time = payload?.[0]?.payload?.time
                return time != null ? `زمان: ${timestampToMinutes(time)}` : ""
              }}
              formatter={(value) => formatToman(Number(value))}
            />
          }
        />
        <Area
          type="monotone"
          dataKey="price"
          stroke={MOUNTAIN_STROKE}
          strokeWidth={3}
          fill={`url(#${gradientId})`}
          fillOpacity={1}
          isAnimationActive={false}
          dot={(props) => (
            <PulsingLiveDot
              key={props.index}
              cx={props.cx}
              cy={props.cy}
              index={props.index}
              lastIndex={lastIndex}
            />
          )}
          activeDot={false}
        />
      </AreaChart>
    </ChartContainer>
  )
}
