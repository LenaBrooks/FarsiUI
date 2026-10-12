import { type Metadata } from "next"

import "@/app/(app)/(typeset)/typeset.css"
import { PersianDigits } from "@/registry/bases/base/ui/persian-digits"

export const metadata: Metadata = {
  title: "گالری نمودارها",
  description: "گالری اسکلت نمودارهای FarsiUI — جدا از بخش نمودارهای فعلی.",
  alternates: {
    canonical: "/chart2",
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function Chart2Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col" dir="rtl" lang="fa">
      <PersianDigits>{children}</PersianDigits>
    </div>
  )
}
