"use client"

import { SunburstChart, type SunburstData } from "recharts"

import { CHART2_BAR_COLORS, formatChart2Number } from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

import { PersianSunburstDigits } from "./sunburst-fa"

const hierarchy: SunburstData = {
  name: "شرکت",
  value: 150,
  children: [
    {
      name: "فنی",
      fill: CHART2_BAR_COLORS[0],
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
      fill: CHART2_BAR_COLORS[1],
      value: 40,
      children: [
        { name: "مستقیم", value: 25 },
        { name: "شرکا", value: 15 },
      ],
    },
    {
      name: "بازاریابی",
      fill: CHART2_BAR_COLORS[2],
      value: 30,
      children: [
        { name: "محتوا", value: 18 },
        { name: "تبلیغات", value: 12 },
      ],
    },
    {
      name: "پشتیبانی",
      fill: CHART2_BAR_COLORS[3],
      value: 20,
    },
  ],
}

const chartConfig = {
  value: { label: "مقدار", color: CHART2_BAR_COLORS[0] },
  فنی: { label: "فنی", color: CHART2_BAR_COLORS[0] },
  فروش: { label: "فروش", color: CHART2_BAR_COLORS[1] },
  بازاریابی: { label: "بازاریابی", color: CHART2_BAR_COLORS[2] },
  پشتیبانی: { label: "پشتیبانی", color: CHART2_BAR_COLORS[3] },
} satisfies ChartConfig

export default function SunburstChartThemeColorsDemo() {
  return (
    <PersianSunburstDigits className="mx-auto w-full max-w-[450px]">
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
    </PersianSunburstDigits>
  )
}
