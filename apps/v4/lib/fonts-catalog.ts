/**
 * Font catalog — Google Fonts + repo-hosted faces under /fonts.
 * Install snippets only; this app never loads catalog faces at runtime.
 */

/** GitHub org/repo for jsDelivr links to files under /fonts. */
export const FONTS_CDN_REPO = "MiladJoodi/FarsiUI"

export type FontCatalogItem = {
  id: string
  nameFa: string
  nameEn: string
  /** Upstream / specimen page (Google Fonts or original GitHub). */
  sourceUrl: string
  /** External preview (specimen or upstream repo). */
  demoUrl: string
  /**
   * `google` → fonts.googleapis.com + next/font/google
   * `repo` → jsDelivr from FONTS_CDN_REPO + next/font/local
   */
  provider: "google" | "repo"
  /**
   * Family token for the Google CSS2 API (spaces as `+`).
   * Required when provider === "google".
   */
  googleFamily?: string
  /**
   * Export name from `next/font/google` (spaces → `_`).
   * Required when provider === "google".
   */
  nextImport?: string
  /** Required for non-variable Google fonts in next/font. */
  nextWeight?: string | string[]
  /** next/font `subsets` — default arabic + latin. */
  nextSubsets?: string[]
  /**
   * Path under repo root for repo-hosted fonts.
   * @example "fonts/sahel"
   */
  repoDir?: string
  /**
   * Regular woff2 filename inside repoDir.
   * @example "Sahel.woff2"
   */
  repoWoff2?: string
  /**
   * Stylesheet path relative to repo root (font-face.css).
   * @example "fonts/sahel/font-face.css"
   */
  repoCss?: string
  /** CSS font-family for repo fonts (defaults to nameEn). */
  cssFamily?: string
}

export function isGoogleFont(
  font: FontCatalogItem
): font is FontCatalogItem & {
  provider: "google"
  googleFamily: string
  nextImport: string
} {
  return font.provider === "google"
}

export function isRepoFont(
  font: FontCatalogItem
): font is FontCatalogItem & {
  provider: "repo"
  repoDir: string
  repoWoff2: string
  repoCss: string
} {
  return font.provider === "repo"
}

/** CSS variable used with next/font `variable` option. */
export function getNextFontCssVar(font: FontCatalogItem) {
  return `--font-${font.id}`
}

/** Local const name for the next/font instance. */
export function getNextFontConstName(font: FontCatalogItem) {
  return font.id.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
}

/** jsDelivr URL for a path in FONTS_CDN_REPO. */
export function getFontsCdnUrl(repoPath: string, ref = "latest") {
  const path = repoPath.replace(/^\/+/, "")
  return `https://cdn.jsdelivr.net/gh/${FONTS_CDN_REPO}@${ref}/${path}`
}

/** Stylesheet for `<link>` / `@import`. */
export function getFontStylesheetUrl(font: FontCatalogItem) {
  if (isRepoFont(font)) {
    return getFontsCdnUrl(font.repoCss)
  }
  const family = font.nextWeight
    ? `${font.googleFamily}:wght@${
        Array.isArray(font.nextWeight)
          ? font.nextWeight.join(";")
          : font.nextWeight
      }`
    : font.googleFamily!
  return `https://fonts.googleapis.com/css2?family=${family}&display=swap`
}

/** Direct woff2 URL (repo fonts) or null for Google. */
export function getFontWoff2Url(font: FontCatalogItem) {
  if (!isRepoFont(font)) return null
  return getFontsCdnUrl(`${font.repoDir}/${font.repoWoff2}`)
}

/** next/font subsets for Google faces. */
export function getNextFontSubsets(font: FontCatalogItem) {
  return font.nextSubsets ?? ["arabic", "latin"]
}

export function getCssFontFamily(font: FontCatalogItem) {
  return font.cssFamily ?? font.nameEn
}

/**
 * Self-host `@font-face` for the user's project public/ folder.
 */
export function getFontFaceCss(font: FontCatalogItem) {
  const family = getCssFontFamily(font)
  if (isRepoFont(font)) {
    return `/* دانلود از ریپو: ${font.sourceUrl}
   یا کپی از ${font.repoDir}/${font.repoWoff2} */
@font-face {
  font-family: "${family}";
  src: url("/fonts/${font.repoWoff2}") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}`
  }
  return `/* دانلود: ${font.sourceUrl} → Download family
   فایل Regular را در public/fonts/${font.id}.woff2 بگذارید. */
@font-face {
  font-family: "${family}";
  src: url("/fonts/${font.id}.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}`
}

/**
 * Catalog order: Google priorities, then repo-hosted Persian faces.
 */
export const FONTS_CATALOG: FontCatalogItem[] = [
  {
    id: "vazirmatn",
    nameFa: "وزیرمتن",
    nameEn: "Vazirmatn",
    provider: "google",
    googleFamily: "Vazirmatn",
    nextImport: "Vazirmatn",
    sourceUrl: "https://fonts.google.com/specimen/Vazirmatn",
    demoUrl: "https://fonts.google.com/specimen/Vazirmatn",
  },
  {
    id: "estedad",
    nameFa: "استعداد",
    nameEn: "Estedad",
    provider: "google",
    googleFamily: "Estedad",
    nextImport: "Estedad",
    sourceUrl: "https://fonts.google.com/specimen/Estedad",
    demoUrl: "https://fonts.google.com/specimen/Estedad",
  },
  {
    id: "sahel",
    nameFa: "ساحل",
    nameEn: "Sahel",
    provider: "repo",
    /** Persian digits (0–9 → فارسی) — better default for fa UI. */
    cssFamily: "Sahel FD",
    repoDir: "fonts/sahel/farsi-digits",
    repoWoff2: "Sahel-FD.woff2",
    repoCss: "fonts/sahel/farsi-digits/font-face.css",
    sourceUrl: "https://github.com/rastikerdar/sahel-font",
    demoUrl: "https://github.com/rastikerdar/sahel-font",
  },
  {
    id: "noto-sans-arabic",
    nameFa: "نوتو سنس عربی",
    nameEn: "Noto Sans Arabic",
    provider: "google",
    googleFamily: "Noto+Sans+Arabic",
    nextImport: "Noto_Sans_Arabic",
    sourceUrl: "https://fonts.google.com/specimen/Noto+Sans+Arabic",
    demoUrl: "https://fonts.google.com/specimen/Noto+Sans+Arabic",
  },
  {
    id: "noto-kufi-arabic",
    nameFa: "نوتو کوفی عربی",
    nameEn: "Noto Kufi Arabic",
    provider: "google",
    googleFamily: "Noto+Kufi+Arabic",
    nextImport: "Noto_Kufi_Arabic",
    sourceUrl: "https://fonts.google.com/specimen/Noto+Kufi+Arabic",
    demoUrl: "https://fonts.google.com/specimen/Noto+Kufi+Arabic",
  },
  {
    id: "lalezar",
    nameFa: "لاله‌زار",
    nameEn: "Lalezar",
    provider: "google",
    googleFamily: "Lalezar",
    nextImport: "Lalezar",
    nextWeight: "400",
    sourceUrl: "https://fonts.google.com/specimen/Lalezar",
    demoUrl: "https://fonts.google.com/specimen/Lalezar",
  },
  {
    id: "markazi-text",
    nameFa: "مرکزی تکست",
    nameEn: "Markazi Text",
    provider: "google",
    googleFamily: "Markazi+Text",
    nextImport: "Markazi_Text",
    sourceUrl: "https://fonts.google.com/specimen/Markazi+Text",
    demoUrl: "https://fonts.google.com/specimen/Markazi+Text",
  },
  {
    id: "noto-naskh-arabic",
    nameFa: "نوتو نسخ عربی",
    nameEn: "Noto Naskh Arabic",
    provider: "google",
    googleFamily: "Noto+Naskh+Arabic",
    nextImport: "Noto_Naskh_Arabic",
    sourceUrl: "https://fonts.google.com/specimen/Noto+Naskh+Arabic",
    demoUrl: "https://fonts.google.com/specimen/Noto+Naskh+Arabic",
  },
  {
    id: "lateef",
    nameFa: "لطیف",
    nameEn: "Lateef",
    provider: "google",
    googleFamily: "Lateef",
    nextImport: "Lateef",
    nextWeight: ["400", "700"],
    nextSubsets: ["arabic"],
    sourceUrl: "https://fonts.google.com/specimen/Lateef",
    demoUrl: "https://fonts.google.com/specimen/Lateef",
  },
  {
    id: "amiri",
    nameFa: "امیری",
    nameEn: "Amiri",
    provider: "google",
    googleFamily: "Amiri",
    nextImport: "Amiri",
    nextWeight: ["400", "700"],
    sourceUrl: "https://fonts.google.com/specimen/Amiri",
    demoUrl: "https://fonts.google.com/specimen/Amiri",
  },
  {
    id: "scheherazade-new",
    nameFa: "شهرزاد جدید",
    nameEn: "Scheherazade New",
    provider: "google",
    googleFamily: "Scheherazade+New",
    nextImport: "Scheherazade_New",
    nextWeight: ["400", "700"],
    nextSubsets: ["arabic"],
    sourceUrl: "https://fonts.google.com/specimen/Scheherazade+New",
    demoUrl: "https://fonts.google.com/specimen/Scheherazade+New",
  },
]

export function getFontCatalogItem(id: string) {
  return FONTS_CATALOG.find((font) => font.id === id) ?? FONTS_CATALOG[0]
}
