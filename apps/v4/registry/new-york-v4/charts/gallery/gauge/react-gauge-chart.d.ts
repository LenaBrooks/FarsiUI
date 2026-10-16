declare module "react-gauge-chart" {
  import type { CSSProperties, ReactElement } from "react"

  export type ReactGaugeChartProps = {
    id?: string
    className?: string
    style?: CSSProperties
    percent?: number
    nrOfLevels?: number
    colors?: string[]
    arcWidth?: number
    cornerRadius?: number
    animate?: boolean
    needleColor?: string
    textColor?: string
    formatTextValue?: (value: string) => string
  }

  export default function GaugeChart(
    props: ReactGaugeChartProps
  ): ReactElement
}
