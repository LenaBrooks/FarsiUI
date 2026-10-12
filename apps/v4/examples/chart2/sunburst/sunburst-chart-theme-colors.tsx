"use client"

import { SunburstChart, type SunburstData } from "recharts"

import { formatChart2Number } from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

/*
 * داده بدون رنگ صریح است؛ نمودار رنگ‌ها را از تم می‌گیرد:
 * هر واحد رنگ بعدی تم را می‌گیرد و زیرمجموعه‌ها همان رنگ را به ارث می‌برند.
 */
const hierarchy: SunburstData = {
  name: "شرکت",
  value: 150,
  children: [
    {
      name: "فنی",
      value: 60,
      children: [
        { name: "فرانت‌اند", value: 25 },
        {
          name: "بک‌اند",
          value: 20,
          children: [
            { name: "API", value: 12 },
            { name: "داده", value: 8 },
          ],
        },
        { name: "تست", value: 15 },
      ],
    },
    {
      name: "فروش",
      value: 40,
      children: [
        { name: "مستقیم", value: 25 },
        { name: "شرکا", value: 15 },
      ],
    },
    {
      name: "بازاریابی",
      value: 30,
      children: [
        { name: "محتوا", value: 18 },
        { name: "تبلیغات", value: 12 },
      ],
    },
    { name: "پشتیبانی", value: 20 },
  ],
}

const chartConfig = {
  value: { label: "مقدار", color: "var(--chart-1)" },
  فنی: { label: "فنی", color: "var(--chart-1)" },
  فروش: { label: "فروش", color: "var(--chart-2)" },
  بازاریابی: { label: "بازاریابی", color: "var(--chart-3)" },
  پشتیبانی: { label: "پشتیبانی", color: "var(--chart-4)" },
} satisfies ChartConfig

export default function SunburstChartThemeColorsDemo() {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-[450px] w-full max-w-[450px] font-sans text-xs"
    >
      <SunburstChart accessibilityLayer data={hierarchy} dataKey="value">
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
