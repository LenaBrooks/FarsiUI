"use client"

import { createContext, useContext, useMemo, useState } from "react"
import {
  Legend,
  RadialBar,
  RadialBarChart,
  Sector,
  type DefaultLegendContentProps,
  type LegendPayload,
  type RadialBarSectorProps,
} from "recharts"

import { generatePersianMockData } from "@/lib/chart2-fa"
import {
  ChartContainer,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-1)",
]

const data = generatePersianMockData(6, 134).map((row, i) => ({
  ...row,
  fill: COLORS[i % COLORS.length],
}))

const chartConfig = {
  x: { label: "مقدار", color: "var(--chart-1)" },
} satisfies ChartConfig

type SelectedLabelState = {
  selectedLabel: string | undefined
  setSelectedLabel: (label: string | undefined) => void
}

const SelectedLabelContext = createContext<SelectedLabelState>({
  selectedLabel: undefined,
  setSelectedLabel: () => {},
})

function CustomSector(props: RadialBarSectorProps) {
  const { selectedLabel, setSelectedLabel } = useContext(SelectedLabelContext)
  const isSelected =
    props.payload.label === selectedLabel || selectedLabel == null
  return (
    <Sector
      {...props}
      onClick={() => setSelectedLabel(props.payload.label)}
      fill={COLORS[props.index % COLORS.length]}
      opacity={isSelected ? 1 : 0.2}
      style={{ transition: "opacity 0.3s ease", cursor: "pointer" }}
    />
  )
}

function LegendItem({ entry }: { entry: LegendPayload }) {
  const { selectedLabel, setSelectedLabel } = useContext(SelectedLabelContext)
  // @ts-expect-error label is always present on mock payload
  const l = entry.payload.label as string
  const isSelected = selectedLabel === l || selectedLabel == null
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
    <li
      onClick={() => setSelectedLabel(l)}
      className="cursor-pointer font-sans text-sm text-foreground transition-opacity duration-300"
      style={{ opacity: isSelected ? 1 : 0.2 }}
    >
      <span
        className="me-2 inline-block size-2.5 rounded-[2px] align-middle"
        style={{ backgroundColor: entry.color }}
      />
      {l}
    </li>
  )
}

function LegendContent({ payload }: DefaultLegendContentProps) {
  return (
    <ul className="flex flex-col gap-2 pe-2">
      {payload?.map((entry, index) => (
        <LegendItem key={`item-${index}`} entry={entry} />
      ))}
    </ul>
  )
}

export default function RadialBarChartClickToFocusLegendDemo() {
  const [selectedRadialBar, setSelectedRadialBar] = useState<
    string | undefined
  >(undefined)

  const providerValue = useMemo(
    () => ({
      selectedLabel: selectedRadialBar,
      setSelectedLabel: (newLabel: string | undefined) =>
        setSelectedRadialBar((curr) =>
          curr === newLabel ? undefined : newLabel
        ),
    }),
    [selectedRadialBar]
  )

  return (
    <SelectedLabelContext.Provider value={providerValue}>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-[2] h-auto w-full max-w-[500px] font-sans text-xs"
      >
        <RadialBarChart
          accessibilityLayer
          data={data}
          innerRadius="15%"
          outerRadius="100%"
        >
          <RadialBar
            background
            dataKey="x"
            name="x"
            shape={CustomSector}
            cornerRadius={10}
            stroke="none"
          />
          <Legend
            iconSize={10}
            width={120}
            height={140}
            verticalAlign="middle"
            align="right"
            content={LegendContent}
          />
        </RadialBarChart>
      </ChartContainer>
    </SelectedLabelContext.Provider>
  )
}
