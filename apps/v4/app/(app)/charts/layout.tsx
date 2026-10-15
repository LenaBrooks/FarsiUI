import { type Metadata } from "next"

import { siteConfig } from "@/lib/config"
import { PersianDigits } from "@/registry/bases/base/ui/persian-digits"

import "@/app/(app)/(typeset)/typeset.css"

const title = "نمودارها"
const description =
  "گالری نمودارهای FarsiUI — میله‌ای، خطی، ناحیه‌ای، سهام، گیج و بیشتر."

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/charts",
  },
  openGraph: {
    title,
    description,
    images: [{ url: siteConfig.ogImage }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [{ url: siteConfig.ogImage }],
  },
}

export default function ChartsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      data-slot="charts"
      className="flex min-h-0 flex-1 flex-col"
      dir="rtl"
      lang="fa"
      id="charts"
    >
      <PersianDigits>{children}</PersianDigits>
    </div>
  )
}
