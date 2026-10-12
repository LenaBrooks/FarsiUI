"use client"

/**
 * Tremor-inspired Area Chart variants (practical set), stacked like synchronized demos.
 * Patterns adapted from https://www.tremor.so/charts — rebuilt with FarsiUI chart primitives.
 */

import * as React from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Label,
  XAxis,
  YAxis,
} from "recharts"

import {
  FA_CHART,
  FA_MONTHS_FULL,
  formatPersianNumber,
  toPersianDigits,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

const chartData = FA_MONTHS_FULL.map((month, i) => {
  const store = [2890, 2756, 3322, 3470, 3475, 3129, 3490, 2903, 2643, 2837, 2954, 3239][i]!
  const online = [2338, 2103, 2194, 2108, 1812, 1726, 1982, 2012, 2342, 2473, 3848, 3736][i]!
  return { month, store, online }
})

/** Uses theme chart tokens (Default = Tremor-like blue / emerald). */
const chartConfig = {
  store: {
    label: FA_CHART.store,
    color: "var(--chart-1)",
  },
  online: {
    label: FA_CHART.online,
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

const panelClass =
  "aspect-[2] h-auto w-full max-w-[700px] max-h-[28vh] font-sans"

function Section({
  title,
  hint,
  children,
}: {
  title: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <section className="flex w-full flex-col gap-2">
      <div className="px-1">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        {hint ? (
          <p className="text-xs text-muted-foreground">{hint}</p>
        ) : null}
      </div>
      {children}
    </section>
  )
}

function TremorAxes({
  percent,
  startEndOnly,
  xLabel,
  yLabel,
  yFormatter,
}: {
  percent?: boolean
  startEndOnly?: boolean
  xLabel?: string
  yLabel?: string
  yFormatter?: (v: number) => string
}) {
  const ticks = startEndOnly
    ? [chartData[0]!.month, chartData[chartData.length - 1]!.month]
    : undefined

  return (
    <>
      <CartesianGrid vertical={false} />
      <XAxis
        dataKey="month"
        reversed
        ticks={ticks}
        interval={startEndOnly ? "preserveStartEnd" : 0}
        tickLine={false}
        axisLine={false}
        tickMargin={8}
        minTickGap={startEndOnly ? 0 : 12}
      >
        {xLabel ? (
          <Label
            value={xLabel}
            position="insideBottom"
            offset={-12}
            className="fill-foreground text-[11px] font-medium"
          />
        ) : null}
      </XAxis>
      <YAxis
        orientation="right"
        width={yLabel ? 56 : 48}
        tickLine={false}
        axisLine={false}
        tickMargin={10}
        tickFormatter={
          percent
            ? (v: number) => `${toPersianDigits(Math.round(v * 100))}٪`
            : yFormatter ?? ((v: number) => formatPersianNumber(v))
        }
      >
        {yLabel ? (
          <Label
            value={yLabel}
            angle={90}
            position="insideRight"
            offset={8}
            className="fill-foreground text-[11px] font-medium"
          />
        ) : null}
      </YAxis>
      <ChartTooltip content={<ChartTooltipContent />} />
    </>
  )
}

function AreaGradients({ idPrefix }: { idPrefix: string }) {
  return (
    <defs>
      <linearGradient id={`${idPrefix}-store`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="var(--color-store)" stopOpacity={0.35} />
        <stop offset="95%" stopColor="var(--color-store)" stopOpacity={0} />
      </linearGradient>
      <linearGradient id={`${idPrefix}-online`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="var(--color-online)" stopOpacity={0.35} />
        <stop offset="95%" stopColor="var(--color-online)" stopOpacity={0} />
      </linearGradient>
    </defs>
  )
}

function DefaultArea() {
  return (
    <ChartContainer config={chartConfig} className={panelClass}>
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{ top: 12, right: 8, left: 0, bottom: 8 }}
      >
        <AreaGradients idPrefix="tremor-default" />
        <TremorAxes />
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          type="linear"
          dataKey="store"
          stroke="var(--color-store)"
          strokeWidth={2}
          fill="url(#tremor-default-store)"
          isAnimationActive={false}
        />
        <Area
          type="linear"
          dataKey="online"
          stroke="var(--color-online)"
          strokeWidth={2}
          fill="url(#tremor-default-online)"
          isAnimationActive={false}
        />
      </AreaChart>
    </ChartContainer>
  )
}

function StackedArea() {
  return (
    <ChartContainer config={chartConfig} className={panelClass}>
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{ top: 12, right: 8, left: 0, bottom: 8 }}
      >
        <AreaGradients idPrefix="tremor-stacked" />
        <TremorAxes />
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          type="linear"
          dataKey="store"
          stackId="a"
          stroke="var(--color-store)"
          strokeWidth={2}
          fill="url(#tremor-stacked-store)"
          isAnimationActive={false}
        />
        <Area
          type="linear"
          dataKey="online"
          stackId="a"
          stroke="var(--color-online)"
          strokeWidth={2}
          fill="url(#tremor-stacked-online)"
          isAnimationActive={false}
        />
      </AreaChart>
    </ChartContainer>
  )
}

function PercentArea() {
  return (
    <ChartContainer config={chartConfig} className={panelClass}>
      <AreaChart
        accessibilityLayer
        data={chartData}
        stackOffset="expand"
        margin={{ top: 12, right: 8, left: 0, bottom: 8 }}
      >
        <defs>
          <linearGradient id="tremor-percent-store" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-store)" stopOpacity={0.7} />
            <stop offset="95%" stopColor="var(--color-store)" stopOpacity={0.2} />
          </linearGradient>
          <linearGradient id="tremor-percent-online" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-online)" stopOpacity={0.7} />
            <stop offset="95%" stopColor="var(--color-online)" stopOpacity={0.2} />
          </linearGradient>
        </defs>
        <TremorAxes percent />
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          type="linear"
          dataKey="store"
          stackId="a"
          stroke="var(--color-store)"
          strokeWidth={2}
          fill="url(#tremor-percent-store)"
          isAnimationActive={false}
        />
        <Area
          type="linear"
          dataKey="online"
          stackId="a"
          stroke="var(--color-online)"
          strokeWidth={2}
          fill="url(#tremor-percent-online)"
          isAnimationActive={false}
        />
      </AreaChart>
    </ChartContainer>
  )
}

function AxisTitlesArea() {
  return (
    <ChartContainer config={chartConfig} className={panelClass}>
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{ top: 12, right: 28, left: 0, bottom: 28 }}
      >
        <defs>
          <linearGradient id="tremor-axis-store" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-store)" stopOpacity={0.45} />
            <stop offset="95%" stopColor="var(--color-store)" stopOpacity={0.15} />
          </linearGradient>
        </defs>
        <TremorAxes xLabel="ماه" yLabel="فروش" />
        <Area
          type="linear"
          dataKey="store"
          stroke="var(--color-store)"
          strokeWidth={2}
          fill="url(#tremor-axis-store)"
          isAnimationActive={false}
        />
      </AreaChart>
    </ChartContainer>
  )
}

function StartEndLabelsArea() {
  return (
    <ChartContainer config={chartConfig} className={panelClass}>
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{ top: 12, right: 8, left: 0, bottom: 8 }}
      >
        <AreaGradients idPrefix="tremor-ends" />
        <TremorAxes startEndOnly />
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          type="linear"
          dataKey="store"
          stroke="var(--color-store)"
          strokeWidth={2}
          fill="url(#tremor-ends-store)"
          isAnimationActive={false}
        />
        <Area
          type="linear"
          dataKey="online"
          stroke="var(--color-online)"
          strokeWidth={2}
          fill="url(#tremor-ends-online)"
          isAnimationActive={false}
        />
      </AreaChart>
    </ChartContainer>
  )
}

function TooltipCallbackArea() {
  const [activeMonth, setActiveMonth] = React.useState(chartData[0]!.month)
  const active = chartData.find((row) => row.month === activeMonth) ?? chartData[0]!
  const total = active.store + active.online

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="px-1">
        <p className="text-xs text-muted-foreground">درآمد ماه</p>
        <p className="font-sans text-2xl font-semibold tracking-tight text-foreground [font-family:var(--font-sans)]">
          {formatPersianNumber(total)} تومان
        </p>
        <p className="text-xs text-muted-foreground">{activeMonth}</p>
      </div>
      <ChartContainer config={chartConfig} className={panelClass}>
        <AreaChart
          accessibilityLayer
          data={chartData}
          margin={{ top: 12, right: 8, left: 0, bottom: 8 }}
          onMouseMove={(state) => {
            const label = state?.activeLabel
            if (typeof label === "string" && label !== activeMonth) {
              setActiveMonth(label)
            }
          }}
        >
          <AreaGradients idPrefix="tremor-callback" />
          <TremorAxes />
          <ChartLegend content={<ChartLegendContent />} />
          <Area
            type="linear"
            dataKey="store"
            stroke="var(--color-store)"
            strokeWidth={2}
            fill="url(#tremor-callback-store)"
            isAnimationActive={false}
          />
          <Area
            type="linear"
            dataKey="online"
            stroke="var(--color-online)"
            strokeWidth={2}
            fill="url(#tremor-callback-online)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}

export default function TremorAreaChartsDemo() {
  return (
    <div className="flex w-full flex-col gap-10">
      <Section
        title="ناحیه‌ای ساده"
        hint="دو سری فروش — الگوی پیش‌فرض Tremor"
      >
        <DefaultArea />
      </Section>
      <Section
        title="دسته‌های روی‌هم"
        hint="type=stacked — مجموع انباشته"
      >
        <StackedArea />
      </Section>
      <Section
        title="درصدی"
        hint="type=percent — سهم نسبی هر سری"
      >
        <PercentArea />
      </Section>
      <Section
        title="با عنوان محور"
        hint="برچسب محور X/Y برای داشبورد"
      >
        <AxisTitlesArea />
      </Section>
      <Section
        title="فقط ابتدا و انتها"
        hint="startEndOnly — محور X خلوت"
      >
        <StartEndLabelsArea />
      </Section>
      <Section
        title="تولتیپ با متریک زنده"
        hint="با حرکت موس، مجموع ماه بالا به‌روز می‌شود"
      >
        <TooltipCallbackArea />
      </Section>
    </div>
  )
}
