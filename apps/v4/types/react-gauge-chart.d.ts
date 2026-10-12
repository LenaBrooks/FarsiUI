declare module "react-gauge-chart" {
  import type { CSSProperties, ReactElement, ReactNode } from "react"

  export type GaugeChartProps = {
    id: string
    className?: string
    style?: CSSProperties
    marginInPercent?: number
    cornerRadius?: number
    nrOfLevels?: number
    percent?: number
    arcPadding?: number
    arcWidth?: number
    colors?: string[]
    textColor?: string
    fontSize?: string
    needleColor?: string
    needleBaseColor?: string
    hideText?: boolean
    arcsLength?: number[]
    animate?: boolean
    animDelay?: number
    animateDuration?: number
    formatTextValue?: (value: string) => string
    textComponent?: ReactNode
    textComponentContainerClassName?: string
    needleScale?: number
    customNeedleComponent?: ReactElement
    customNeedleComponentClassName?: string
    customNeedleStyle?: CSSProperties
  }

  export default function GaugeChart(props: GaugeChartProps): ReactElement
}
