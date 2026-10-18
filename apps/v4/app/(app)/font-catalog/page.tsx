import { redirect } from "next/navigation"

import { FONTS_CATALOG } from "@/lib/fonts-catalog"

export default function FontCatalogIndexPage() {
  redirect(`/font-catalog/${FONTS_CATALOG[0].id}`)
}
