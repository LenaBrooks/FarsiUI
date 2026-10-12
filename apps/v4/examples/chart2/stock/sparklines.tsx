"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
} from "recharts"

import { useChart2Caption } from "@/components/chart2-live"
import { toPersianDigits } from "@/lib/chart2-fa"
import {
  ChartContainer,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

const salesSpark = [
  31, 40, 33, 52, 46, 58, 49, 61, 55, 70, 64, 78, 72, 85, 79, 92, 88, 101, 96,
  108, 104, 118, 112, 126,
]
const expensesSpark = [
  28, 34, 30, 41, 37, 33, 45, 40, 52, 47, 43, 55, 50, 46, 58, 53, 49, 61, 56, 52,
  64, 59, 55, 67,
]
const profitSpark = salesSpark.map((v, i) => v - expensesSpark[i]!)

const salesData = salesSpark.map((value, i) => ({ i, value }))
const expensesData = expensesSpark.map((value, i) => ({ i, value }))
const profitData = profitSpark.map((value, i) => ({ i, value }))

const salesConfig = {
  value: { label: "فروش", color: "var(--chart-2)" },
} satisfies ChartConfig
const expensesConfig = {
  value: { label: "هزینه", color: "var(--destructive)" },
} satisfies ChartConfig
const profitConfig = {
  value: { label: "سود", color: "var(--chart-1)" },
} satisfies ChartConfig

const rowLineA = [25, 66, 41, 89, 63, 25, 44, 12, 36, 9, 54].map((value, i) => ({
  i,
  value,
}))
const rowLineB = [12, 14, 2, 47, 42, 15, 47, 75, 65, 19, 14].map((value, i) => ({
  i,
  value,
}))
const pieA = [
  { name: "آ", value: 43, fill: "var(--chart-1)" },
  { name: "ب", value: 32, fill: "var(--chart-2)" },
  { name: "ج", value: 12, fill: "var(--chart-3)" },
  { name: "د", value: 9, fill: "var(--chart-4)" },
]
const pieB = [
  { name: "آ", value: 43, fill: "var(--chart-1)" },
  { name: "ب", value: 32, fill: "var(--chart-2)" },
  { name: "ج", value: 12, fill: "var(--chart-3)" },
  { name: "د", value: 9, fill: "var(--chart-4)" },
]
const radialA = [{ name: "سهم", value: 45, fill: "var(--chart-1)" }]
const radialB = [
  { name: "الف", value: 53, fill: "var(--chart-1)" },
  { name: "ب", value: 67, fill: "var(--chart-2)" },
]

const miniConfig = {
  value: { label: "مقدار", color: "var(--chart-1)" },
} satisfies ChartConfig

function SparkArea({
  data,
  config,
  title,
  subtitle,
}: {
  data: Array<{ i: number; value: number }>
  config: ChartConfig
  title: string
  subtitle: string
}) {
  return (
    <div className="min-w-0 flex-1 rounded-lg border border-border/50 bg-background p-3">
      <p className="text-lg font-semibold tracking-tight">{title}</p>
      <p className="text-muted-foreground mb-1 text-xs">{subtitle}</p>
      <ChartContainer
        config={config}
        className="aspect-auto h-[100px] w-full font-sans"
      >
        <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <Area
            type="linear"
            dataKey="value"
            stroke={`var(--color-value)`}
            fill={`var(--color-value)`}
            fillOpacity={0.28}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}

function MiniLine({ data }: { data: Array<{ i: number; value: number }> }) {
  return (
    <ChartContainer
      config={miniConfig}
      className="aspect-auto h-[36px] w-[100px] font-sans"
    >
      <LineChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <Line
          type="monotone"
          dataKey="value"
          stroke="var(--color-value)"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ChartContainer>
  )
}

function MiniBar({ data }: { data: Array<{ i: number; value: number }> }) {
  return (
    <ChartContainer
      config={miniConfig}
      className="aspect-auto h-[36px] w-[100px] font-sans"
    >
      <BarChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <Bar
          dataKey="value"
          fill="var(--color-value)"
          radius={[1, 1, 0, 0]}
          isAnimationActive={false}
        />
      </BarChart>
    </ChartContainer>
  )
}

function MiniPie({
  data,
  innerRadius = 0,
}: {
  data: Array<{ name: string; value: number; fill: string }>
  innerRadius?: number
}) {
  return (
    <ChartContainer
      config={miniConfig}
      className="aspect-square mx-auto h-[40px] w-[40px] font-sans"
    >
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={18}
          innerRadius={innerRadius}
          stroke="var(--background)"
          strokeWidth={1}
          isAnimationActive={false}
        />
      </PieChart>
    </ChartContainer>
  )
}

function MiniRadial({
  data,
}: {
  data: Array<{ name: string; value: number; fill: string }>
}) {
  return (
    <ChartContainer
      config={miniConfig}
      className="aspect-square mx-auto h-[44px] w-[44px] font-sans"
    >
      <RadialBarChart
        data={data}
        innerRadius="40%"
        outerRadius="100%"
        startAngle={90}
        endAngle={-270}
      >
        <RadialBar
          dataKey="value"
          background
          cornerRadius={4}
          isAnimationActive={false}
        />
      </RadialBarChart>
    </ChartContainer>
  )
}

const rows = [
  {
    value: "۳۲٬۵۵۴ تومان",
    share: toPersianDigits("15") + "٪",
    line: rowLineA,
    volume: rowLineA,
    pie: pieA,
    radial: radialA,
    usePie: false,
  },
  {
    value: "۲۳٬۵۳۳ تومان",
    share: toPersianDigits("7") + "٪",
    line: rowLineB,
    volume: rowLineB,
    pie: pieB,
    radial: radialB,
    usePie: false,
  },
  {
    value: "۵۴٬۲۷۶ تومان",
    share: toPersianDigits("9") + "٪",
    line: rowLineA,
    volume: rowLineA,
    pie: pieA,
    radial: radialA,
    usePie: true,
    donut: false,
  },
  {
    value: "۱۱٬۵۳۳ تومان",
    share: toPersianDigits("2") + "٪",
    line: rowLineB,
    volume: rowLineB,
    pie: pieB,
    radial: radialB,
    usePie: true,
    donut: true,
  },
]

export default function SparklinesDemo() {
  useChart2Caption(
    () => <>اسپارک‌لاین‌های فشرده برای داشبورد ترید و پورتفوی — مشابه ApexCharts</>
  )

  return (
    <div className="w-full max-w-[720px] space-y-4 font-sans">
      <div className="flex flex-col gap-3 sm:flex-row">
        <SparkArea
          data={salesData}
          config={salesConfig}
          title={`${toPersianDigits("424652")} تومان`}
          subtitle="فروش"
        />
        <SparkArea
          data={expensesData}
          config={expensesConfig}
          title={`${toPersianDigits("235312")} تومان`}
          subtitle="هزینه"
        />
        <SparkArea
          data={profitData}
          config={profitConfig}
          title={`${toPersianDigits("189340")} تومان`}
          subtitle="سود"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-border/50">
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="border-b bg-muted/30 text-muted-foreground text-xs">
              <th className="px-3 py-2 text-start font-medium">ارزش کل</th>
              <th className="px-3 py-2 text-start font-medium">سهم پورتفوی</th>
              <th className="px-3 py-2 text-start font-medium">۱۰ روز اخیر</th>
              <th className="px-3 py-2 text-start font-medium">حجم</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b last:border-0">
                <td className="px-3 py-2 font-medium">{row.value}</td>
                <td className="text-muted-foreground px-3 py-2">{row.share}</td>
                <td className="px-3 py-2">
                  {row.usePie ? (
                    <MiniPie
                      data={row.pie}
                      innerRadius={row.donut ? 8 : 0}
                    />
                  ) : (
                    <MiniLine data={row.line} />
                  )}
                </td>
                <td className="px-3 py-2">
                  {row.usePie ? (
                    <MiniRadial data={row.radial} />
                  ) : (
                    <MiniBar data={row.volume} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
