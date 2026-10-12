"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
  chart2ContainerClassName,
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

/**
 * Data source: https://www.populationpyramid.net/world/2024/
 * CSV columns: Age,M,F
 */
const rawData = `
100+,110838,476160
95-99,1141691,3389124
90-94,6038458,13078242
85-89,18342182,31348041
80-84,37166893,53013079
75-79,65570812,83217973
70-74,103998992,124048996
65-69,138182244,154357035
60-64,170525048,180992721
55-59,206686596,212285997
50-54,231342779,232097236
45-49,240153677,236696232
40-44,270991534,263180352
35-39,301744799,289424003
30-34,310384416,294303405
25-29,308889349,291429439
20-24,318912554,300510028
15-19,335882343,315258559
10-14,353666705,331681954
5-9,351991008,332121131
0-4,331889289,315450649
`
  .trim()
  .split("\n")
  .map((line) => {
    const [age, m, f] = line.split(",")
    return { age: toPersianDigits(age!), male: Number(m), female: Number(f) }
  })

const totalPopulation = rawData.reduce(
  (sum, entry) => sum + entry.male + entry.female,
  0
)

/** مرد منفی → چپ، زن مثبت → راست (محور LTR). */
const percentageData = rawData.map((entry) => ({
  age: entry.age,
  male: (entry.male / totalPopulation) * -100,
  female: (entry.female / totalPopulation) * 100,
}))

const chartConfig = {
  female: { label: "زن", color: "#ed7485" },
  male: { label: "مرد", color: "#6ea1c7" },
} satisfies ChartConfig

function formatPercent(val: unknown) {
  const n = Math.abs(Number(val))
  if (!Number.isFinite(n)) return ""
  return `${toPersianDigits(n.toFixed(1))}٪`
}

/** برچسب روی نوک میله — position پیش‌فرض برای width منفی به مرکز می‌چسبد. */
function EndLabel({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  value,
  fill,
}: {
  x?: number
  y?: number
  width?: number
  height?: number
  value?: number
  fill: string
}) {
  if (value == null || Math.abs(Number(value)) < 0.2) return null
  const outward = width < 0
  const labelX = outward ? x + width - 4 : x + width + 4
  return (
    <text
      x={labelX}
      y={y + height / 2}
      textAnchor={outward ? "end" : "start"}
      dominantBaseline="central"
      fill={fill}
      fontSize={10}
      fontFamily="var(--font-sans)"
    >
      {formatPercent(value)}
    </text>
  )
}

export default function PopulationPyramidDemo({
  defaultIndex,
}: {
  defaultIndex?: number
}) {
  return (
    <ChartContainer
      config={chartConfig}
      dir="ltr"
      className={`${chart2ContainerClassName} aspect-square max-w-[700px]`}
    >
      <BarChart
        accessibilityLayer
        data={percentageData}
        layout="vertical"
        stackOffset="sign"
        barCategoryGap={1}
        margin={{ top: 8, right: 52, left: 52, bottom: 28 }}
      >
        <XAxis
          type="number"
          domain={[-10, 10]}
          tickFormatter={formatPercent}
          height={36}
        />
        <YAxis
          type="category"
          dataKey="age"
          orientation="right"
          width={48}
          tickMargin={8}
          tickLine={false}
          axisLine={false}
        />
        <Bar
          stackId="age"
          dataKey="female"
          fill="var(--color-female)"
          stroke="none"
          radius={[0, 5, 5, 0]}
          label={(props) => <EndLabel {...props} fill="#b84d5c" />}
        />
        <Bar
          stackId="age"
          dataKey="male"
          fill="var(--color-male)"
          stroke="none"
          radius={[5, 0, 0, 5]}
          label={(props) => <EndLabel {...props} fill="#3d6f94" />}
        />
        <ChartTooltip
          defaultIndex={defaultIndex}
          content={
            <ChartTooltipContent
              formatter={(value) => formatPercent(value)}
            />
          }
        />
        <ChartLegend content={<ChartLegendContent />} verticalAlign="top" />
      </BarChart>
    </ChartContainer>
  )
}
