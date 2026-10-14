import { type Metadata } from "next"

export const metadata: Metadata = {
  title: "نمودارها",
  alternates: {
    canonical: "/charts",
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function Chart2LegacyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
