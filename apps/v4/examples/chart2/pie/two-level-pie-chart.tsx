"use client"

import { Pie, PieChart, type TooltipIndex } from "recharts"

import {
  CHART2_BAR_COLORS,
  FA_CHART,
  formatChart2Number,
} from "@/lib/chart2-fa"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

const data01 = [
  { name: "tehran", value: 400, fill: "var(--color-tehran)" },
  { name: "isfahan", value: 300, fill: "var(--color-isfahan)" },
  { name: "fars", value: 300, fill: "var(--color-fars)" },
  { name: "khorasan", value: 200, fill: "var(--color-khorasan)" },
]

const data02 = [
  { name: "store", value: 100, fill: "var(--color-store)" },
  { name: "online", value: 300, fill: "var(--color-online)" },
  { name: "card", value: 100, fill: "var(--color-card)" },
  { name: "cash", value: 80, fill: "var(--color-cash)" },
  { name: "gateway", value: 40, fill: "var(--color-gateway)" },
  { name: "wallet", value: 30, fill: "var(--color-wallet)" },
  { name: "delivery", value: 50, fill: "var(--color-delivery)" },
  { name: "pickup", value: 100, fill: "var(--color-pickup)" },
  { name: "orders", value: 200, fill: "var(--color-orders)" },
  { name: "other", value: 150, fill: "var(--color-other)" },
  { name: "branchTehran", value: 50, fill: "var(--color-branchTehran)" },
]

const chartConfig = {
  value: { label: FA_CHART.sales },
  tehran: { label: FA_CHART.tehran, color: CHART2_BAR_COLORS[0] },
  isfahan: { label: FA_CHART.isfahan, color: CHART2_BAR_COLORS[1] },
  fars: { label: FA_CHART.fars, color: CHART2_BAR_COLORS[2] },
  khorasan: { label: FA_CHART.khorasan, color: CHART2_BAR_COLORS[3] },
  store: { label: FA_CHART.store, color: CHART2_BAR_COLORS[0] },
  online: { label: FA_CHART.online, color: CHART2_BAR_COLORS[1] },
  card: { label: FA_CHART.card, color: CHART2_BAR_COLORS[2] },
  cash: { label: FA_CHART.cash, color: CHART2_BAR_COLORS[3] },
  gateway: { label: FA_CHART.gateway, color: CHART2_BAR_COLORS[4] },
  wallet: { label: FA_CHART.wallet, color: CHART2_BAR_COLORS[0] },
  delivery: { label: FA_CHART.delivery, color: CHART2_BAR_COLORS[1] },
  pickup: { label: FA_CHART.pickup, color: CHART2_BAR_COLORS[2] },
  orders: { label: FA_CHART.orders, color: CHART2_BAR_COLORS[3] },
  other: { label: FA_CHART.other, color: CHART2_BAR_COLORS[4] },
  branchTehran: { label: FA_CHART.branchTehran, color: CHART2_BAR_COLORS[0] },
} satisfies ChartConfig

export default function TwoLevelPieChartDemo({
  isAnimationActive,
  defaultIndex,
}: {
  isAnimationActive?: boolean
  defaultIndex?: TooltipIndex
}) {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-auto w-full max-w-[500px] max-h-[80vh] font-sans text-xs"
    >
      <PieChart accessibilityLayer>
        <Pie
          data={data01}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius="50%"
          stroke="var(--background)"
          isAnimationActive={isAnimationActive}
        />
        <Pie
          data={data02}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius="60%"
          outerRadius="80%"
          stroke="var(--background)"
          label={({ value }) => formatChart2Number(Number(value))}
          isAnimationActive={isAnimationActive}
        />
        <ChartTooltip
          defaultIndex={defaultIndex}
          content={
            <ChartTooltipContent
              nameKey="name"
              formatter={(value) => formatChart2Number(value as number)}
            />
          }
        />
      </PieChart>
    </ChartContainer>
  )
}
