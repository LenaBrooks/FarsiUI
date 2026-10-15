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
  type SectorProps,
} from "recharts"

import {
  CHART_BAR_COLORS,
  generatePersianMockData,
} from "@/lib/chart-fa"
import {
  ChartContainer,
  type ChartConfig,
} from "@/registry/new-york-v4/ui/chart"

const COLORS = [
  CHART_BAR_COLORS[0],
  CHART_BAR_COLORS[1],
  CHART_BAR_COLORS[2],
  CHART_BAR_COLORS[3],
  CHART_BAR_COLORS[4],
  CHART_BAR_COLORS[0],
]

const data = generatePersianMockData(6, 134).map((row, i) => ({
  ...row,
  fill: COLORS[i % COLORS.length],
}))

const chartConfig = {
  x: { label: "مقدار", color: CHART_BAR_COLORS[0] },
} satisfies ChartConfig

type SelectedLabelState = {
  selectedLabel: string | undefined
  toggleLabel: (label: string) => void
  clearSelection: () => void
}

const SelectedLabelContext = createContext<SelectedLabelState>({
  selectedLabel: undefined,
  toggleLabel: () => {},
  clearSelection: () => {},
})

function resolveLabel(payload: unknown): string | undefined {
  if (payload == null || typeof payload !== "object") return undefined
  const row = payload as { label?: unknown; payload?: { label?: unknown } }
  if (typeof row.label === "string") return row.label
  if (typeof row.payload?.label === "string") return row.payload.label
  return undefined
}

function CustomSector(props: RadialBarSectorProps) {
  const { selectedLabel, toggleLabel } = useContext(SelectedLabelContext)
  const label = resolveLabel(props.payload) ?? data[props.index]?.label
  const isSelected = label === selectedLabel || selectedLabel == null

  return (
    <Sector
      {...props}
      onClick={(event) => {
        event.stopPropagation()
        if (label) toggleLabel(label)
      }}
      fill={COLORS[props.index % COLORS.length]}
      opacity={isSelected ? 1 : 0.2}
      style={{ transition: "opacity 0.3s ease", cursor: "pointer" }}
    />
  )
}

function BackgroundSector(props: SectorProps) {
  const { clearSelection } = useContext(SelectedLabelContext)
  return (
    <Sector
      {...props}
      onClick={(event) => {
        event.stopPropagation()
        clearSelection()
      }}
      style={{ cursor: "pointer" }}
    />
  )
}

function LegendItem({ entry }: { entry: LegendPayload }) {
  const { selectedLabel, toggleLabel } = useContext(SelectedLabelContext)
  const label = resolveLabel(entry.payload) ?? String(entry.value ?? "")
  const isSelected = selectedLabel === label || selectedLabel == null

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
    <li
      onClick={(event) => {
        event.stopPropagation()
        if (label) toggleLabel(label)
      }}
      className="cursor-pointer font-sans text-sm text-foreground transition-opacity duration-300"
      style={{ opacity: isSelected ? 1 : 0.2 }}
    >
      <span
        className="me-2 inline-block size-2.5 rounded-[2px] align-middle"
        style={{ backgroundColor: entry.color }}
      />
      {label}
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
      toggleLabel: (label: string) =>
        setSelectedRadialBar((curr) => (curr === label ? undefined : label)),
      clearSelection: () => setSelectedRadialBar(undefined),
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
          onClick={providerValue.clearSelection}
        >
          <RadialBar
            background={BackgroundSector}
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
