import localFont from "next/font/local"
import { cn } from "cn"

/**
 * Shell UI fonts — Estedad (sans) + Geist Mono.
 * Font Switcher / preview extras removed; catalog fonts are docs-only.
 */

const fontEstedad = localFont({
  src: "../../app/font-files/estedad-wght.woff2",
  variable: "--font-estedad",
  weight: "100 900",
  display: "swap",
  adjustFontFallback: false,
})

const fontMono = localFont({
  src: "../../app/font-files/geist-mono-400.woff2",
  variable: "--font-geist-mono",
  weight: "400",
  display: "swap",
  adjustFontFallback: false,
})

/** Applied on <html> — maps to --font-sans / --font-mono via globals.css @theme. */
export const fontVariables = cn(fontEstedad.variable, fontMono.variable)
