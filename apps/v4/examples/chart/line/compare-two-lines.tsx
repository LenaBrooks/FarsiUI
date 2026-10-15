// @ts-nocheck — adapted from Recharts upstream for recharts@3.8
"use client"

import { type FC, type ReactNode, useMemo, useState } from "react"
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  Tooltip,
  type TooltipContentProps,
  XAxis,
  YAxis,
  type MouseHandlerDataParam,
} from "recharts"

import { useChartCaption } from "@/components/chart-live"
import { CHART_BAR_COLORS } from "@/lib/chart-fa"
import {
  CHART_TOMAN_AXIS_WIDTH,
  formatJalaliDate,
  formatToman,
} from "@/lib/chart-locale"
import { TomanAxisTick } from "@/lib/chart-toman-tick"
import { cn } from "@/lib/utils"
import { ChartContainer, type ChartConfig } from "@/registry/new-york-v4/ui/chart"

import { LINE_CHART_CLASS } from "./line-fa-shared"

// #region sample data and types
interface DataPoint {
  date: number
  close: number
  maxClose?: number
  reinvestClose?: number
  netDeposits?: number
}

const getDataKeyClose = (point: DataPoint) => point.close
const getDataKeyNetDeposits = (point: DataPoint) => point.netDeposits
const getDataKeyReinvestClose = (point: DataPoint) => point.reinvestClose

const PORTFOLIO = CHART_BAR_COLORS[0]
const COMPARE = CHART_BAR_COLORS[1]
const DEPOSITS = "color-mix(in oklab, var(--muted-foreground) 72%, transparent)"

const compareChartConfig = {
  close: { label: "پول شما", color: PORTFOLIO },
  reinvestClose: { label: "با سرمایه‌گذاری مجدد", color: COMPARE },
  netDeposits: { label: "پولی که گذاشته‌اید", color: DEPOSITS },
} satisfies ChartConfig

const moneyStyle = {
  letterSpacing: 0,
  fontVariantNumeric: "normal",
} as const

function MoneyText({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span
      dir="rtl"
      lang="fa"
      className={cn("font-medium text-foreground", className)}
      style={moneyStyle}
    >
      {children}
    </span>
  )
}

function CompareTooltip({ active, payload }: TooltipContentProps<number, string>) {
  const row = payload?.[0]?.payload as DataPoint | undefined
  if (!active || !row?.date) return null

  const compare = row.reinvestClose
  const delta =
    compare != null && Number.isFinite(compare) ? compare - row.close : null

  return (
    <div
      dir="rtl"
      lang="fa"
      className="min-w-[12.5rem] rounded-lg border border-border/60 bg-background/95 px-3 py-2.5 shadow-md backdrop-blur-sm"
    >
      <p className="mb-2 border-b border-border/50 pb-1.5 text-[11px] text-muted-foreground">
        {formatJalaliDate(row.date, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
      <div className="flex flex-col gap-1.5 text-[12px]">
        <TooltipRow
          color={PORTFOLIO}
          label="پول شما الان"
          value={formatToman(row.close, { compact: true })}
        />
        {compare != null ? (
          <TooltipRow
            color={COMPARE}
            label="با سرمایه‌گذاری مجدد"
            value={formatToman(compare, { compact: true })}
            dashed
          />
        ) : null}
        {row.netDeposits != null ? (
          <TooltipRow
            color={DEPOSITS}
            label="فقط اصل پول"
            value={formatToman(row.netDeposits, { compact: true })}
          />
        ) : null}
        {delta != null ? (
          <div
            className={cn(
              "mt-1 rounded-md px-2 py-1.5 text-[11px] font-medium",
              delta >= 0
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                : "bg-rose-500/10 text-rose-700 dark:text-rose-400"
            )}
          >
            <span className="text-muted-foreground">یعنی </span>
            <MoneyText className="text-inherit">
              {delta >= 0 ? "حدود " : "حدود "}
              {formatToman(Math.abs(delta), { compact: true })}
              {delta >= 0 ? " بیشتر" : " کمتر"}
            </MoneyText>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function TooltipRow({
  color,
  label,
  value,
  dashed,
}: {
  color: string
  label: string
  value: string
  dashed?: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-muted-foreground">
        <span
          className={cn(
            "shrink-0 rounded-full",
            dashed ? "h-0.5 w-4" : "size-2"
          )}
          style={
            dashed
              ? {
                  background: `repeating-linear-gradient(90deg, ${color} 0 3px, transparent 3px 5px)`,
                }
              : { background: color }
          }
          aria-hidden
        />
        {label}
      </span>
      <MoneyText className="shrink-0">{value}</MoneyText>
    </div>
  )
}

function CompareLegend() {
  return (
    <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
      <span className="inline-flex items-center gap-1.5">
        <span
          className="size-2.5 shrink-0 rounded-full"
          style={{ background: PORTFOLIO }}
          aria-hidden
        />
        پول شما
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span
          className="h-0.5 w-5 shrink-0 rounded-full"
          style={{
            background: `repeating-linear-gradient(90deg, ${COMPARE} 0 3px, transparent 3px 5px)`,
          }}
          aria-hidden
        />
        با سرمایه‌گذاری مجدد
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span
          className="h-0.5 w-5 shrink-0 rounded-full"
          style={{ background: DEPOSITS }}
          aria-hidden
        />
        اصل پول
      </span>
    </div>
  )
}

const data: DataPoint[] = [
  {
    date: 1754265600000,
    close: 200250.28586,
    maxClose: 200329.40245,
    reinvestClose: 200250.28586,
    netDeposits: 200000,
  },
  {
    date: 1754352000000,
    close: 199272.96485,
    maxClose: 199474.10888,
    reinvestClose: 199272.96485,
    netDeposits: 200000,
  },
  {
    date: 1754438400000,
    close: 200912.62441,
    maxClose: 200912.62441,
    reinvestClose: 200912.62441,
    netDeposits: 200000,
  },
  {
    date: 1754524800000,
    close: 200841.07452,
    maxClose: 200841.07452,
    reinvestClose: 200841.07452,
    netDeposits: 200000,
  },
  {
    date: 1754611200000,
    close: 202280.1764,
    maxClose: 202819.09273,
    reinvestClose: 202819.09273,
    netDeposits: 200000,
  },
  {
    date: 1754697600000,
    close: 202280.1764,
    maxClose: 202819.12355,
    reinvestClose: 202819.12355,
    netDeposits: 200000,
  },
  {
    date: 1754784000000,
    close: 202280.1764,
    maxClose: 202819.12355,
    reinvestClose: 202819.12355,
    netDeposits: 200000,
  },
  {
    date: 1754870400000,
    close: 201695.79315,
    maxClose: 202233.53819000002,
    reinvestClose: 202233.53819000002,
    netDeposits: 200000,
  },
  {
    date: 1754956800000,
    close: 204165.11346,
    maxClose: 204708.99235,
    reinvestClose: 204708.99235,
    netDeposits: 200000,
  },
  {
    date: 1755043200000,
    close: 204683.86015,
    maxClose: 205229.85045,
    reinvestClose: 205229.85045,
    netDeposits: 200000,
  },
  {
    date: 1755129600000,
    close: 204386.16203,
    maxClose: 204931.76703000002,
    reinvestClose: 204931.76703000002,
    netDeposits: 200000,
  },
  {
    date: 1755216000000,
    close: 203872.79671,
    maxClose: 204417.21500999999,
    reinvestClose: 204417.21500999999,
    netDeposits: 200000,
  },
  {
    date: 1755302400000,
    close: 203875.56671,
    maxClose: 204419.98501,
    reinvestClose: 204419.98501,
    netDeposits: 200000,
  },
  {
    date: 1755388800000,
    close: 203875.56671,
    maxClose: 204419.98501,
    reinvestClose: 204419.98501,
    netDeposits: 200000,
  },
  {
    date: 1755475200000,
    close: 203990.21558,
    maxClose: 204534.66470999998,
    reinvestClose: 204534.66470999998,
    netDeposits: 200000,
  },
  {
    date: 1755561600000,
    close: 202693.85337,
    maxClose: 203235.18933,
    reinvestClose: 203235.18933,
    netDeposits: 200000,
  },
  {
    date: 1755648000000,
    close: 202185.45487,
    maxClose: 202725.1726,
    reinvestClose: 202725.1726,
    netDeposits: 200000,
  },
  {
    date: 1755734400000,
    close: 201559.8993,
    maxClose: 202097.73681,
    reinvestClose: 202097.73681,
    netDeposits: 200000,
  },
  {
    date: 1755820800000,
    close: 204676.42605,
    maxClose: 205222.81705,
    reinvestClose: 205222.81705,
    netDeposits: 200000,
  },
  {
    date: 1755907200000,
    close: 204680.26605,
    maxClose: 205226.65705,
    reinvestClose: 205226.65705,
    netDeposits: 200000,
  },
  {
    date: 1755993600000,
    close: 204680.26605,
    maxClose: 205226.65705,
    reinvestClose: 205226.65705,
    netDeposits: 200000,
  },
  {
    date: 1756080000000,
    close: 203829.67195,
    maxClose: 204373.79742999998,
    reinvestClose: 204373.79742999998,
    netDeposits: 200000,
  },
  {
    date: 1756166400000,
    close: 204599.65998,
    maxClose: 205145.98933,
    reinvestClose: 205145.98933,
    netDeposits: 200000,
  },
  {
    date: 1756252800000,
    close: 205156.94904,
    maxClose: 205704.15302,
    reinvestClose: 205704.15302,
    netDeposits: 200000,
  },
  {
    date: 1756339200000,
    close: 205982.92992,
    maxClose: 206531.6413,
    reinvestClose: 206531.6413,
    netDeposits: 200000,
  },
  {
    date: 1756425600000,
    close: 204750.72779,
    maxClose: 205296.33207,
    reinvestClose: 205296.33207,
    netDeposits: 200000,
  },
  {
    date: 1756512000000,
    close: 204771.30779,
    maxClose: 205316.91207,
    reinvestClose: 205316.91207,
    netDeposits: 200000,
  },
  {
    date: 1756598400000,
    close: 204771.30779,
    maxClose: 205316.91207,
    reinvestClose: 205316.91207,
    netDeposits: 200000,
  },
  {
    date: 1756684800000,
    close: 204771.30779,
    maxClose: 205316.91207,
    reinvestClose: 205316.91207,
    netDeposits: 200000,
  },
  {
    date: 1756771200000,
    close: 203336.77508,
    maxClose: 203878.38012,
    reinvestClose: 203878.38012,
    netDeposits: 200000,
  },
  {
    date: 1756857600000,
    close: 204313.32762,
    maxClose: 204857.62446,
    reinvestClose: 204857.62446,
    netDeposits: 200000,
  },
  {
    date: 1756944000000,
    close: 206164.82454,
    maxClose: 206713.68974,
    reinvestClose: 206713.68974,
    netDeposits: 200000,
  },
  {
    date: 1757030400000,
    close: 205688.30079,
    maxClose: 206235.95084,
    reinvestClose: 206235.95084,
    netDeposits: 200000,
  },
  {
    date: 1757116800000,
    close: 205694.24079,
    maxClose: 206241.89084,
    reinvestClose: 206241.89084,
    netDeposits: 200000,
  },
  {
    date: 1757203200000,
    close: 205694.24079,
    maxClose: 206241.89084,
    reinvestClose: 206241.89084,
    netDeposits: 200000,
  },
  {
    date: 1757289600000,
    close: 206248.11961,
    maxClose: 206797.50779,
    reinvestClose: 206797.50779,
    netDeposits: 200000,
  },
  {
    date: 1757376000000,
    close: 206361.60467,
    maxClose: 206911.90037,
    reinvestClose: 206911.90037,
    netDeposits: 200000,
  },
  {
    date: 1757462400000,
    close: 206931.57487,
    maxClose: 207483.45488,
    reinvestClose: 207483.45488,
    netDeposits: 200000,
  },
  {
    date: 1757548800000,
    close: 208777.49902,
    maxClose: 209334.08583,
    reinvestClose: 209334.08583,
    netDeposits: 200000,
  },
  {
    date: 1757635200000,
    close: 208367.30969,
    maxClose: 209021.15418,
    reinvestClose: 208923.34276,
    netDeposits: 200000,
  },
  {
    date: 1757721600000,
    close: 208370.03969,
    maxClose: 209021.15418,
    reinvestClose: 208926.07276,
    netDeposits: 200000,
  },
  {
    date: 1757808000000,
    close: 208370.03969,
    maxClose: 209021.15418,
    reinvestClose: 208926.07276,
    netDeposits: 200000,
  },
  {
    date: 1757894400000,
    close: 209371.73869,
    maxClose: 210020.92301,
    reinvestClose: 209930.4328,
    netDeposits: 200000,
  },
  {
    date: 1757980800000,
    close: 208934.04827,
    maxClose: 209490.66585,
    reinvestClose: 209490.66585,
    netDeposits: 200000,
  },
  {
    date: 1758067200000,
    close: 208731.12737,
    maxClose: 209287.02201000002,
    reinvestClose: 209287.02201000002,
    netDeposits: 200000,
  },
  {
    date: 1758153600000,
    close: 210068.19722,
    maxClose: 210627.04514,
    reinvestClose: 210627.04514,
    netDeposits: 200000,
  },
  {
    date: 1758240000000,
    close: 210862.44012,
    maxClose: 211513.10408,
    reinvestClose: 211423.62606,
    netDeposits: 200000,
  },
  {
    date: 1758326400000,
    close: 210859.46012,
    maxClose: 211513.10408,
    reinvestClose: 211420.64606,
    netDeposits: 200000,
  },
  {
    date: 1758412800000,
    close: 210859.46012,
    maxClose: 211513.10408,
    reinvestClose: 211420.64606,
    netDeposits: 200000,
  },
  {
    date: 1758499200000,
    close: 291534.89436,
    maxClose: 292736.93416,
    reinvestClose: 292736.93416,
    netDeposits: 280000,
  },
  {
    date: 1758585600000,
    close: 289886.60569,
    maxClose: 291084.14519,
    reinvestClose: 291084.14519,
    netDeposits: 280000,
  },
  {
    date: 1758672000000,
    close: 288803.00042,
    maxClose: 289996.03962,
    reinvestClose: 289996.03962,
    netDeposits: 280000,
  },
  {
    date: 1758758400000,
    close: 287237.53875,
    maxClose: 288424.69800000003,
    reinvestClose: 288424.69800000003,
    netDeposits: 280000,
  },
  {
    date: 1758844800000,
    close: 289098.40234,
    maxClose: 290292.75549999997,
    reinvestClose: 290292.75549999997,
    netDeposits: 280000,
  },
  {
    date: 1758931200000,
    close: 289100.27234,
    maxClose: 290294.6255,
    reinvestClose: 290294.6255,
    netDeposits: 280000,
  },
  {
    date: 1759017600000,
    close: 289100.27234,
    maxClose: 290294.6255,
    reinvestClose: 290294.6255,
    netDeposits: 280000,
  },
  {
    date: 1759104000000,
    close: 289917.68812,
    maxClose: 291114.99768000003,
    reinvestClose: 291114.99768000003,
    netDeposits: 280000,
  },
  {
    date: 1759190400000,
    close: 290927.67041,
    maxClose: 292128.23201000004,
    reinvestClose: 292128.23201000004,
    netDeposits: 280000,
  },
  {
    date: 1759276800000,
    close: 291725.80907,
    maxClose: 292930.93666,
    reinvestClose: 292930.93666,
    netDeposits: 280000,
  },
  {
    date: 1759363200000,
    close: 291954.38666,
    maxClose: 293161.35379,
    reinvestClose: 293161.35379,
    netDeposits: 280000,
  },
  {
    date: 1759449600000,
    close: 291896.55473,
    maxClose: 293103.65326,
    reinvestClose: 293103.65326,
    netDeposits: 280000,
  },
  {
    date: 1759536000000,
    close: 291896.97473,
    maxClose: 293104.07326000003,
    reinvestClose: 293104.07326000003,
    netDeposits: 280000,
  },
  {
    date: 1759622400000,
    close: 291896.97473,
    maxClose: 293104.07326000003,
    reinvestClose: 293104.07326000003,
    netDeposits: 280000,
  },
  {
    date: 1759708800000,
    close: 293116.53883,
    maxClose: 294328.13765999995,
    reinvestClose: 294328.13765999995,
    netDeposits: 280000,
  },
  {
    date: 1759795200000,
    close: 292039.96981,
    maxClose: 293246.27995999996,
    reinvestClose: 293246.27995999996,
    netDeposits: 280000,
  },
  {
    date: 1759881600000,
    close: 293856.81708,
    maxClose: 295070.45254,
    reinvestClose: 295070.45254,
    netDeposits: 280000,
  },
  {
    date: 1759968000000,
    close: 293065.79468,
    maxClose: 294275.58681999997,
    reinvestClose: 294275.58681999997,
    netDeposits: 280000,
  },
  {
    date: 1760054400000,
    close: 284898.1604,
    maxClose: 286075.43213,
    reinvestClose: 286075.43213,
    netDeposits: 280000,
  },
  {
    date: 1760140800000,
    close: 284915.9704,
    maxClose: 286093.24212999997,
    reinvestClose: 286093.24212999997,
    netDeposits: 280000,
  },
  {
    date: 1760227200000,
    close: 284915.9704,
    maxClose: 286093.24212999997,
    reinvestClose: 286093.24212999997,
    netDeposits: 280000,
  },
  {
    date: 1760313600000,
    close: 289631.91477,
    maxClose: 290827.74613,
    reinvestClose: 290827.74613,
    netDeposits: 280000,
  },
  {
    date: 1760400000000,
    close: 289375.17,
    maxClose: 290569.7531,
    reinvestClose: 290569.7531,
    netDeposits: 280000,
  },
  {
    date: 1760486400000,
    close: 290518.57728,
    maxClose: 291718.21911,
    reinvestClose: 291718.21911,
    netDeposits: 280000,
  },
  {
    date: 1760572800000,
    close: 288250.37569,
    maxClose: 289441.6739,
    reinvestClose: 289441.6739,
    netDeposits: 280000,
  },
  {
    date: 1760659200000,
    close: 289546.09897,
    maxClose: 290945.19578,
    reinvestClose: 290945.19578,
    netDeposits: 280000,
  },
  {
    date: 1760745600000,
    close: 289565.87897,
    maxClose: 290968.16831000004,
    reinvestClose: 290968.16831000004,
    netDeposits: 280000,
  },
  {
    date: 1760832000000,
    close: 289565.87897,
    maxClose: 290968.16831000004,
    reinvestClose: 290968.16831000004,
    netDeposits: 280000,
  },
  {
    date: 1760918400000,
    close: 292661.84624,
    maxClose: 294226.94687,
    reinvestClose: 294226.94687,
    netDeposits: 280000,
  },
  {
    date: 1761004800000,
    close: 292596.13311,
    maxClose: 294278.6664,
    reinvestClose: 294278.6664,
    netDeposits: 280000,
  },
  {
    date: 1761091200000,
    close: 291286.23879,
    maxClose: 293053.57587999996,
    reinvestClose: 293053.57587999996,
    netDeposits: 280000,
  },
  {
    date: 1761177600000,
    close: 292980.34027,
    maxClose: 294761.25367999997,
    reinvestClose: 294761.25367999997,
    netDeposits: 280000,
  },
  {
    date: 1761264000000,
    close: 295334.07645,
    maxClose: 297264.83434,
    reinvestClose: 297264.83434,
    netDeposits: 280000,
  },
  {
    date: 1761350400000,
    close: 295339.16645,
    maxClose: 297287.49003000004,
    reinvestClose: 297287.49003000004,
    netDeposits: 280000,
  },
  {
    date: 1761436800000,
    close: 295339.16645,
    maxClose: 297287.49003000004,
    reinvestClose: 297287.49003000004,
    netDeposits: 280000,
  },
  {
    date: 1761523200000,
    close: 298898.51849,
    maxClose: 301027.20428,
    reinvestClose: 301027.20428,
    netDeposits: 280000,
  },
  {
    date: 1761609600000,
    close: 299458.39529,
    maxClose: 301698.80308000004,
    reinvestClose: 301698.80308000004,
    netDeposits: 280000,
  },
  {
    date: 1761696000000,
    close: 300155.03367,
    maxClose: 302519.21663,
    reinvestClose: 302519.21663,
    netDeposits: 280000,
  },
  {
    date: 1761782400000,
    close: 296838.93323,
    maxClose: 299172.16269,
    reinvestClose: 299172.16269,
    netDeposits: 280000,
  },
  {
    date: 1761868800000,
    close: 297645.82883,
    maxClose: 299987.45458,
    reinvestClose: 299987.45458,
    netDeposits: 280000,
  },
  {
    date: 1761955200000,
    close: 297436.88883,
    maxClose: 299778.51458,
    reinvestClose: 299778.51458,
    netDeposits: 280000,
  },
  {
    date: 1762041600000,
    close: 297436.88883,
    maxClose: 299778.51458,
    reinvestClose: 299778.51458,
    netDeposits: 280000,
  },
  {
    date: 1762128000000,
    close: 297896.80552,
    maxClose: 300467.03155,
    reinvestClose: 300467.03155,
    netDeposits: 280000,
  },
  {
    date: 1762214400000,
    close: 294259.78159,
    maxClose: 296810.06841,
    reinvestClose: 296810.06841,
    netDeposits: 280000,
  },
  {
    date: 1762300800000,
    close: 295344.54123,
    maxClose: 298175.78807999997,
    reinvestClose: 298175.78807999997,
    netDeposits: 280000,
  },
  {
    date: 1762387200000,
    close: 292176.91517,
    maxClose: 294964.41625999997,
    reinvestClose: 294964.41625999997,
    netDeposits: 280000,
  },
  {
    date: 1762473600000,
    close: 293150.13876,
    maxClose: 295951.40437,
    reinvestClose: 295951.40437,
    netDeposits: 280000,
  },
  {
    date: 1762560000000,
    close: 293164.76876,
    maxClose: 296001.37622000003,
    reinvestClose: 296001.37622000003,
    netDeposits: 280000,
  },
  {
    date: 1762646400000,
    close: 293164.76876,
    maxClose: 296001.37622000003,
    reinvestClose: 296001.37622000003,
    netDeposits: 280000,
  },
  {
    date: 1762992000000,
    close: 367372.436370742,
    maxClose: 367372.436370742,
    netDeposits: 355000,
  },
];
// #endregion

const { yAxisMin, yAxisMax } = data.reduce(
  (acc, val) => {
    const mc = val.maxClose ?? 0
    const nd = val.netDeposits ?? 0
    return {
      yAxisMin: Math.min(acc.yAxisMin, mc, nd),
      yAxisMax: Math.max(acc.yAxisMax, mc, nd),
    }
  },
  { yAxisMin: Infinity, yAxisMax: 0 }
)

const yAxisDomain = [Math.max(0, 0.75 * yAxisMin), 1.25 * yAxisMax]

const compareHoverDenominator = data.filter((d) => !!d.reinvestClose).length

const App: FC = () => {
  const [hoverIndex, setHoverIndex] = useState(-1)
  useChartCaption(
    () =>
      "خط آبی پول الانِ شماست؛ خط صورتی می‌گوید اگر سود را دوباره سرمایه‌گذاری می‌کردید چقدر می‌شد",
    []
  )

  const isHovering = hoverIndex !== -1
  const hoverPoint = hoverIndex >= 0 ? data[hoverIndex] : null

  const invalidCompareValueLength = data
    .slice(0, hoverIndex)
    .filter((d) => !d.reinvestClose).length
  const compareHoverNumerator = hoverIndex - invalidCompareValueLength
  const compareHoverPercentage =
    compareHoverDenominator > 0
      ? hoverIndex >= 0
        ? (compareHoverNumerator / compareHoverDenominator) * 100
        : 100
      : compareHoverNumerator === 0
        ? 0
        : 100
  const invalidNetDepositsLength = data
    .slice(0, hoverIndex)
    .filter((d) => !d.netDeposits).length
  const netDepositHoverPercentage =
    hoverIndex >= 0
      ? ((hoverIndex - invalidNetDepositsLength) /
          (data.filter((d) => !!d.netDeposits).length - 1)) *
        100
      : 100
  const hoverPercentage =
    hoverIndex >= 0
      ? (hoverIndex / (data.filter((d) => !!d.date).length - 1)) * 100
      : 100
  const compareValue = hoverPoint?.reinvestClose

  const hoverDelta =
    hoverPoint && compareValue != null ? compareValue - hoverPoint.close : null

  const handleMouseLeave = useMemo(() => () => setHoverIndex(-1), [])
  const handleMouseMove = useMemo(
    () =>
      ({ activeIndex }: MouseHandlerDataParam) =>
        setHoverIndex(Number(activeIndex ?? -1)),
    []
  )

  const referenceLineSegment = useMemo(
    () =>
      [
        {
          x: hoverPoint?.date ?? "",
          y: compareValue ?? hoverPoint?.close ?? 0,
        },
        {
          x: hoverPoint?.date ?? "",
          y: hoverPoint?.close ?? compareValue ?? 0,
        },
      ] as const,
    [hoverPoint, compareValue]
  )

  return (
    <div
      dir="rtl"
      lang="fa"
      className="flex w-full max-w-[700px] flex-col gap-2.5 font-sans"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <CompareLegend />
        <div
          className={cn(
            "ms-auto min-h-8 rounded-full px-3 py-1 text-[11px] font-medium transition-opacity",
            isHovering && hoverDelta != null
              ? hoverDelta >= 0
                ? "bg-emerald-500/12 text-emerald-700 opacity-100 dark:text-emerald-400"
                : "bg-rose-500/12 text-rose-700 opacity-100 dark:text-rose-400"
              : "opacity-0"
          )}
          aria-live="polite"
        >
          {isHovering && hoverDelta != null ? (
            <MoneyText className="text-inherit">
              {hoverDelta >= 0 ? "بیشتر: " : "کمتر: "}
              {formatToman(Math.abs(hoverDelta), { compact: true })}
            </MoneyText>
          ) : (
            "—"
          )}
        </div>
      </div>

      <ChartContainer config={compareChartConfig} className={LINE_CHART_CLASS}>
        <LineChart
          accessibilityLayer
          data={data}
          margin={{ left: 4, right: 8, top: 18, bottom: 8 }}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
        >
          <defs>
            <linearGradient id="portfolioColor" x1="0%" y1="0" x2="100%" y2="0">
              <stop offset="0%" stopColor={PORTFOLIO} stopOpacity={1} />
              <stop
                offset={`${hoverPercentage}%`}
                stopColor={PORTFOLIO}
                stopOpacity={1}
              />
              <stop
                offset={`${hoverPercentage}%`}
                stopColor={PORTFOLIO}
                stopOpacity={0.28}
              />
              <stop offset="100%" stopColor={PORTFOLIO} stopOpacity={0.28} />
            </linearGradient>
            <linearGradient id="netDepositsColor" x1="0%" y1="0" x2="100%" y2="0">
              <stop offset="0%" stopColor={DEPOSITS} stopOpacity={1} />
              <stop
                offset={`${netDepositHoverPercentage}%`}
                stopColor={DEPOSITS}
                stopOpacity={1}
              />
              <stop
                offset={`${netDepositHoverPercentage}%`}
                stopColor={DEPOSITS}
                stopOpacity={0.25}
              />
              <stop offset="100%" stopColor={DEPOSITS} stopOpacity={0.25} />
            </linearGradient>
            <linearGradient
              id="compareValueColor"
              x1="0%"
              y1="0"
              x2="100%"
              y2="0"
            >
              <stop offset="0%" stopColor={COMPARE} stopOpacity={1} />
              <stop
                offset={`${compareHoverPercentage}%`}
                stopColor={COMPARE}
                stopOpacity={1}
              />
              <stop
                offset={`${compareHoverPercentage}%`}
                stopColor={COMPARE}
                stopOpacity={0.28}
              />
              <stop offset="100%" stopColor={COMPARE} stopOpacity={0.28} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={false}
            tickSize={0}
            tickMargin={0}
          />
          <YAxis
            dataKey={getDataKeyClose}
            tickCount={4}
            orientation="right"
            width={CHART_TOMAN_AXIS_WIDTH}
            tickMargin={8}
            tickLine={false}
            axisLine={false}
            type="number"
            name="ارزش سبد"
            tick={TomanAxisTick}
            domain={yAxisDomain}
          />
          <Tooltip
            offset={12}
            cursor={
              isHovering
                ? {
                    stroke:
                      "color-mix(in oklab, var(--foreground) 28%, transparent)",
                    strokeWidth: 1.25,
                    strokeDasharray: "4 4",
                  }
                : false
            }
            allowEscapeViewBox={{ x: true, y: true }}
            wrapperStyle={{ outline: "none", zIndex: 1 }}
            content={CompareTooltip}
            animationDuration={0}
          />
          <ReferenceLine
            stroke={COMPARE}
            strokeOpacity={0.35}
            strokeWidth={10}
            strokeLinecap="round"
            opacity={isHovering ? 1 : 0}
            segment={referenceLineSegment}
          />
          <Line
            type="linear"
            dataKey={getDataKeyNetDeposits}
            name="netDeposits"
            dot={false}
            activeDot={false}
            stroke="url(#netDepositsColor)"
            strokeWidth={1.75}
            opacity={isHovering ? 1 : 0}
            animationDuration={700}
          />
          <Line
            type="linear"
            dataKey={getDataKeyReinvestClose}
            name="reinvestClose"
            dot={false}
            activeDot={{
              r: 5,
              fill: COMPARE,
              stroke: "var(--background)",
              strokeWidth: 2,
            }}
            stroke="url(#compareValueColor)"
            strokeDasharray="0.1 5"
            strokeLinecap="round"
            strokeWidth={2.25}
            strokeOpacity={isHovering ? 1 : 0}
            animationDuration={900}
          />
          <Line
            type="linear"
            dataKey={getDataKeyClose}
            name="close"
            stroke="url(#portfolioColor)"
            strokeWidth={2.75}
            activeDot={{
              r: 6,
              fill: PORTFOLIO,
              stroke: "var(--background)",
              strokeWidth: 2,
            }}
            dot={false}
            animationDuration={550}
          />
        </LineChart>
      </ChartContainer>
    </div>
  )
}

export default App
