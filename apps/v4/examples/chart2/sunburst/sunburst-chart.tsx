"use client"

import { SunburstChart, type SunburstData } from "recharts"

import { formatChart2Number } from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

const hierarchy: SunburstData = {
  name: "کل فروش",
  value: 100,
  children: [
    {
      name: "شعبه تهران",
      fill: "var(--chart-1)",
      value: 30,
      children: [
        { name: "طبقهٔ اول", value: 10 },
        { name: "طبقهٔ دوم", value: 5 },
        {
          name: "انبار",
          value: 15,
          children: [
            { name: "بخش آ", value: 5 },
            { name: "بخش ب", value: 5 },
            {
              name: "بخش ج",
              value: 5,
              children: [{ name: "قفسه", value: 2 }],
            },
          ],
        },
      ],
    },
    {
      name: "شعبه اصفهان",
      fill: "var(--chart-2)",
      value: 20,
      children: [
        { name: "فروش حضوری", value: 10 },
        {
          name: "فروش آنلاین",
          value: 10,
          children: [
            { name: "درگاه", value: 5 },
            { name: "کیف پول", value: 3 },
            { name: "کارت", value: 2 },
          ],
        },
      ],
    },
    {
      name: "شعبه شیراز",
      fill: "var(--chart-3)",
      value: 20,
    },
    {
      name: "شعبه مشهد",
      fill: "var(--chart-4)",
      value: 10,
      children: [
        { name: "ویترین", value: 5 },
        { name: "انبار محلی", value: 5 },
      ],
    },
    {
      name: "سایر شعب",
      fill: "var(--chart-5)",
      value: 20,
    },
  ],
}

const chartConfig = {
  value: { label: "مقدار", color: "var(--chart-1)" },
} satisfies ChartConfig

export default function SunburstChartDemo() {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-[450px] w-full max-w-[450px] font-sans text-xs"
    >
      <SunburstChart
        accessibilityLayer
        startAngle={90}
        endAngle={270}
        data={hierarchy}
        dataKey="value"
      >
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => formatChart2Number(value as number)}
            />
          }
        />
      </SunburstChart>
    </ChartContainer>
  )
}
