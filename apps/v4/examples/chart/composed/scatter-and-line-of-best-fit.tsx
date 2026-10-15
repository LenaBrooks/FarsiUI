"use client"

import {
  CartesianGrid,
  ComposedChart,
  Line,
  Scatter,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts"

import {
  CHART_BAR_COLORS,
  chartContainerClassName,
  chartDashedGridClassName,
  toPersianDigits,
} from "@/lib/chart-fa"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

type Point = { spend: number; sales: number }

/**
 * هزینهٔ تبلیغات → فروش — با پراکندگی واقعی حول روند
 * (نه نقاط روی یک خط صاف)
 */
const points: Point[] = [
  { spend: 1.8, sales: 7.2 },
  { spend: 2.4, sales: 11.5 },
  { spend: 3.1, sales: 8.4 },
  { spend: 3.8, sales: 14.8 },
  { spend: 4.6, sales: 12.1 },
  { spend: 5.2, sales: 18.6 },
  { spend: 6.0, sales: 15.3 },
  { spend: 6.8, sales: 21.0 },
  { spend: 7.5, sales: 17.4 },
  { spend: 8.3, sales: 24.8 },
  { spend: 9.1, sales: 20.2 },
  { spend: 9.8, sales: 27.5 },
  { spend: 10.6, sales: 23.1 },
  { spend: 11.4, sales: 30.4 },
  { spend: 12.2, sales: 25.8 },
  { spend: 13.0, sales: 33.2 },
  { spend: 14.1, sales: 28.6 },
  { spend: 15.0, sales: 36.0 },
  { spend: 15.8, sales: 31.5 },
  { spend: 16.8, sales: 38.4 },
]

function linearFit(rows: Point[]) {
  const n = rows.length
  const sumX = rows.reduce((s, r) => s + r.spend, 0)
  const sumY = rows.reduce((s, r) => s + r.sales, 0)
  const sumXY = rows.reduce((s, r) => s + r.spend * r.sales, 0)
  const sumXX = rows.reduce((s, r) => s + r.spend * r.spend, 0)
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n
  return { slope, intercept }
}

const { slope, intercept } = linearFit(points)

type ChartRow = {
  spend: number
  sales?: number
  fit?: number
}

/** نقاط پراکنده + فقط دو سر خط برازش */
const data: ChartRow[] = [
  ...points.map((p) => ({ spend: p.spend, sales: p.sales })),
  { spend: 1.2, fit: intercept + slope * 1.2 },
  { spend: 17.5, fit: intercept + slope * 17.5 },
]

const chartConfig = {
  sales: { label: "فروش واقعی", color: CHART_BAR_COLORS[0] },
  fit: { label: "خط برازش", color: CHART_BAR_COLORS[1] },
} satisfies ChartConfig

function TooltipContent({ active, payload }: TooltipContentProps) {
  if (!(active && payload?.length)) return null
  const row = payload[0]?.payload as ChartRow | undefined
  if (!row || row.sales == null) return null
  const expected = intercept + slope * row.spend
  const delta = row.sales - expected
  return (
    <div className="min-w-[10.5rem] rounded-lg border bg-background px-3 py-2.5 text-xs shadow-md font-sans tracking-[0]">
      <p className="mb-1 text-muted-foreground">
        تبلیغات:{" "}
        <span className="font-medium text-foreground">
          {toPersianDigits(row.spend.toFixed(1))} م
        </span>
      </p>
      <p className="text-muted-foreground">
        فروش:{" "}
        <span className="font-medium text-foreground">
          {toPersianDigits(row.sales.toFixed(1))} م
        </span>
      </p>
      <p
        className="mt-1.5 border-t pt-1.5 font-medium"
        style={{
          color: delta >= 0 ? CHART_BAR_COLORS[2] : CHART_BAR_COLORS[1],
        }}
      >
        {delta >= 0 ? "+" : "−"}
        {toPersianDigits(Math.abs(delta).toFixed(1))} نسبت به خط برازش
      </p>
    </div>
  )
}

export default function ScatterAndLineOfBestFitDemo() {
  return (
    <ChartContainer
      config={chartConfig}
      className={`${chartContainerClassName} ${chartDashedGridClassName} max-w-none`}
    >
      <ComposedChart
        accessibilityLayer
        data={data}
        margin={{ top: 8, right: 12, bottom: 36, left: 4 }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="spend"
          type="number"
          reversed
          domain={[0, 18]}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(v) => toPersianDigits(v)}
          tick={{
            fontSize: 11,
            fontFamily: "var(--font-sans)",
            letterSpacing: 0,
          }}
          label={{
            value: "هزینهٔ تبلیغات (میلیون تومان)",
            position: "bottom",
            offset: 12,
            style: {
              fontFamily: "var(--font-sans)",
              fontSize: 11,
              fill: "var(--muted-foreground)",
            },
          }}
        />
        <YAxis
          type="number"
          orientation="right"
          width={36}
          domain={[0, 44]}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(v) => toPersianDigits(v)}
          tick={{
            fontSize: 11,
            fontFamily: "var(--font-sans)",
            letterSpacing: 0,
          }}
        />
        <ChartTooltip shared={false} content={TooltipContent} />
        <ChartLegend
          verticalAlign="top"
          height={28}
          content={(props) => (
            <ChartLegendContent
              {...props}
              payload={props.payload?.filter(
                (item) => item.dataKey === "sales" || item.dataKey === "fit"
              )}
            />
          )}
        />
        <Scatter
          dataKey="sales"
          fill="var(--color-sales)"
          stroke="none"
          r={5}
          name="فروش واقعی"
        />
        <Line
          dataKey="fit"
          stroke="var(--color-fit)"
          strokeWidth={2}
          strokeDasharray="5 4"
          dot={false}
          activeDot={false}
          connectNulls
          name="خط برازش"
        />
      </ComposedChart>
    </ChartContainer>
  )
}
