"use client"

import { useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
  type BarRectangleItem,
  type BarShapeProps,
} from "recharts"

import { useChart2Caption } from "@/components/chart2-live"
import {
  FA_MONTHS,
  chart2DashedGridClassName,
  chart2BarMockConfig,
} from "@/lib/chart2-fa"
import { ChartContainer } from "@/registry/new-york-v4/ui/chart"

const data = [
  { name: FA_MONTHS[0], uv: 4000 },
  { name: FA_MONTHS[1], uv: 3000 },
  { name: FA_MONTHS[2], uv: 2000 },
  { name: FA_MONTHS[3], uv: 2780 },
  { name: FA_MONTHS[4], uv: 1890 },
  { name: FA_MONTHS[5], uv: 2390 },
  { name: "مهر", uv: 3490 },
]

function MyCustomShape(props: BarShapeProps) {
  const [isActive, setIsActive] = useState(false)
  return (
    <Rectangle
      {...props}
      fill="var(--color-x)"
      fillOpacity={isActive ? 1 : 0.5}
      onClick={() => setIsActive((curr) => !curr)}
    />
  )
}

export default function BarChartWithCustomizedEventDemo() {
  useChart2Caption(() => <>روی هر میله کلیک کنید</>)

  return (
    <div className="flex w-full flex-col font-sans [font-family:var(--font-sans)]">
      <ChartContainer
        config={chart2BarMockConfig}
        className={`aspect-[1.618] h-auto w-full max-w-[700px] max-h-[30vh] font-sans ${chart2DashedGridClassName}`}
      >
        <BarChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <Bar
            dataKey="uv"
            onClick={(bri: BarRectangleItem, index, event) => {
              console.log("clicked on", bri, index, event)
            }}
            shape={MyCustomShape}
          />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
