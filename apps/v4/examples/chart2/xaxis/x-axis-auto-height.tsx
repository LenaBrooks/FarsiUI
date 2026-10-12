"use client"

import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts"

import { formatChart2Number } from "@/lib/chart2-fa"

const data = [
  { name: "جستجوی ارگانیک", visitors: 4000 },
  { name: "جستجو و نمایش پولی", visitors: 3000 },
  { name: "خبرنامه ایمیلی", visitors: 2000 },
  { name: "ارجاع از شرکا", visitors: 2780 },
  { name: "کمپین‌های شبکه‌های اجتماعی", visitors: 1890 },
  { name: "ترافیک مستقیم", visitors: 2390 },
]

const chartStyle = {
  width: "100%",
  maxWidth: "700px",
  maxHeight: "30vh",
  aspectRatio: 1.618,
} as const

/** مقایسهٔ ارتفاع پیش‌فرض محور X با ارتفاع بزرگ‌تر برای برچسب‌های چرخان. */
export default function XAxisAutoHeightDemo() {
  return (
    <div className="flex w-full flex-col gap-6 font-sans text-xs" dir="rtl">
      <BarChart
        style={chartStyle}
        responsive
        accessibilityLayer
        data={data}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="name"
          reversed
          angle={-35}
          textAnchor="end"
          tickMargin={8}
          tick={{ fontFamily: "var(--font-sans)", fontSize: 11 }}
        />
        <YAxis
          orientation="right"
          width={52}
          tickMargin={12}
          tickFormatter={formatChart2Number}
        />
        <Tooltip
          formatter={(value) => formatChart2Number(value as number)}
          contentStyle={{
            fontFamily: "var(--font-sans)",
            direction: "rtl",
            textAlign: "right",
          }}
        />
        <Bar dataKey="visitors" fill="var(--chart-1)" radius={[3, 3, 0, 0]} name="بازدید" />
      </BarChart>

      <BarChart
        style={chartStyle}
        responsive
        accessibilityLayer
        data={data}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="name"
          reversed
          angle={-35}
          textAnchor="end"
          height={100}
          tickMargin={8}
          tick={{ fontFamily: "var(--font-sans)", fontSize: 11 }}
        />
        <YAxis
          orientation="right"
          width={52}
          tickMargin={12}
          tickFormatter={formatChart2Number}
        />
        <Tooltip
          formatter={(value) => formatChart2Number(value as number)}
          contentStyle={{
            fontFamily: "var(--font-sans)",
            direction: "rtl",
            textAlign: "right",
          }}
        />
        <Bar dataKey="visitors" fill="var(--chart-1)" radius={[3, 3, 0, 0]} name="بازدید" />
      </BarChart>
    </div>
  )
}

export const xAxisAutoHeightDescription = (
  <article className="space-y-3 text-sm leading-relaxed text-muted-foreground font-sans" dir="rtl">
    <p>
      نمودار اول <code className="rounded bg-muted px-1 py-0.5 text-xs">height</code> را
      روی مقدار پیش‌فرض ۳۰ پیکسل می‌گذارد. برچسب‌های تیک چرخانده شده‌اند و از این ارتفاع
      بلندترند؛ بنابراین در پایین نمودار بریده می‌شوند.
    </p>
    <p>
      نمودار دوم ارتفاع محور را روی{" "}
      <code className="rounded bg-muted px-1 py-0.5 text-xs">100</code> می‌گذارد تا
      برچسب‌های چرخان کامل دیده شوند. در حالت ایده‌آل می‌توان از{" "}
      <code className="rounded bg-muted px-1 py-0.5 text-xs">{`height="auto"`}</code> استفاده
      کرد تا محور خودش اندازه بگیرد (مشابه{" "}
      <code className="rounded bg-muted px-1 py-0.5 text-xs">{`YAxis width="auto"`}</code>).
    </p>
    <p>
      وقتی می‌خواهید ارتفاع محور ثابت بماند — مثلاً برای هم‌تراز بودن چند نمودار —{" "}
      <code className="rounded bg-muted px-1 py-0.5 text-xs">height</code> را به‌صورت عدد بگذارید.
    </p>
  </article>
)
