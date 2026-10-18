import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { FontCatalogDetail } from "@/components/fonts-catalog-preview"
import { FONTS_CATALOG, getFontCatalogItem } from "@/lib/fonts-catalog"

type Props = {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return FONTS_CATALOG.map((font) => ({ id: font.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const font = FONTS_CATALOG.find((item) => item.id === id)
  if (!font) return { title: "فونت" }

  return {
    title: font.nameFa,
    description: `راهنمای نصب فونت ${font.nameFa} (${font.nameEn})`,
    alternates: {
      canonical: `/font-catalog/${font.id}`,
    },
  }
}

export default async function FontCatalogItemPage({ params }: Props) {
  const { id } = await params
  const font = FONTS_CATALOG.find((item) => item.id === id)
  if (!font) notFound()

  return <FontCatalogDetail font={getFontCatalogItem(id)} />
}
