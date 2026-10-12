import {
  Lalezar,
  Markazi_Text,
  Noto_Kufi_Arabic,
  Noto_Sans_Arabic,
  Vazirmatn,
} from "next/font/google"

import type { UiFontId } from "@/lib/fonts"

const fontVazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
  adjustFontFallback: false,
})

const fontNotoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic", "latin"],
  variable: "--font-noto-sans-arabic",
  display: "swap",
  adjustFontFallback: false,
})

const fontNotoKufiArabic = Noto_Kufi_Arabic({
  subsets: ["arabic", "latin"],
  variable: "--font-noto-kufi-arabic",
  display: "swap",
  adjustFontFallback: false,
})

const fontLalezar = Lalezar({
  subsets: ["arabic", "latin"],
  weight: "400",
  variable: "--font-lalezar",
  display: "swap",
  adjustFontFallback: false,
})

const fontMarkaziText = Markazi_Text({
  subsets: ["arabic", "latin"],
  variable: "--font-markazi-text",
  display: "swap",
  adjustFontFallback: false,
})

const EXTRA_FONT_CLASS: Partial<Record<UiFontId, string>> = {
  vazirmatn: fontVazirmatn.variable,
  "noto-sans-arabic": fontNotoSansArabic.variable,
  "noto-kufi-arabic": fontNotoKufiArabic.variable,
  lalezar: fontLalezar.variable,
  "markazi-text": fontMarkaziText.variable,
}

/** Class name that defines the CSS variable for a non-shell UI font. */
export function getExtraUiFontClassName(fontId: UiFontId): string | undefined {
  return EXTRA_FONT_CLASS[fontId]
}

/** Ensure the Google font face for `fontId` is in the document. */
export async function ensureFontFaces(fontId: UiFontId): Promise<void> {
  if (fontId === "estedad") return
  // Importing this module registers next/font faces; class application is enough.
  void EXTRA_FONT_CLASS[fontId]
}
