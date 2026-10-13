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
  name: "کل فروش",
  value: 100,
  children: [
    {
      name: "شعبه تهران",
      fill: CHART2_BAR_COLORS[0],
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
      fill: CHART2_BAR_COLORS[1],
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
      fill: CHART2_BAR_COLORS[2],
      value: 20,
    },
    {
      name: "شعبه مشهد",
      fill: CHART2_BAR_COLORS[3],
      value: 10,
      children: [
        { name: "ویترین", value: 5 },
        { name: "انبار محلی", value: 5 },
      ],
    },
    {
      name: "سایر شعب",
      fill: CHART2_BAR_COLORS[4],
      value: 20,
    },
  ],
}

const chartConfig = {
  value: { label: "مقدار", color: CHART2_BAR_COLORS[0] },
} satisfies ChartConfig

export default function SunburstChartDemo() {
  return (
    <PersianSunburstDigits className="mx-auto w-full max-w-[450px]">
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
    </PersianSunburstDigits>
  )
}
