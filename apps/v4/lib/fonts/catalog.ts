/**
 * Font catalog — Google Fonts + repo-hosted faces under /fonts.
 * Install snippets only; this app never loads catalog faces at runtime.
 */

/** GitHub org/repo for jsDelivr links to files under /fonts. */
export const FONTS_CDN_REPO = "MiladJoodi/FarsiUI"

/**
 * Font redistribution license (not the FarsiUI app license).
 * - `ofl-1.1` — SIL Open Font License 1.1 (Google Fonts + most Rastikerdar OFL faces)
 * - `bitstream-vera` — Bitstream Vera + Apache-2.0 (Roboto glyphs) + PD changes
 *   (Tanha, Nahid — see upstream LICENSE; not OFL)
 * - `gpl-2.0` — GNU GPL v2 (e.g. Sharif FarsiWeb Titr)
 * - `font-store-free` — خانه فونت (cdn.font-store.ir) Free Licence; no separate OFL file
 * - `irannastaliq-free` — Iran Nastaliq v1/v2 free download (not v3 / not OFL)
 */
export type FontLicenseId =
  | "ofl-1.1"
  | "bitstream-vera"
  | "gpl-2.0"
  | "font-store-free"
  | "irannastaliq-free"

export type FontCatalogItem = {
  id: string
  nameFa: string
  nameEn: string
  /** Upstream / specimen page (Google Fonts or original GitHub). */
  sourceUrl: string
  /** External preview (specimen or upstream repo). */
  demoUrl: string
  /**
   * Redistribution license for the font files.
   * Defaults to `ofl-1.1` when omitted (Google Fonts + OFL repo faces).
   */
  license?: FontLicenseId
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
  /**
   * Files shipped by `npx farsiui add font-<id>` (relative to repoDir).
   * Used for install-tree docs.
   */
  repoFiles?: string[]
  /**
   * Optional local CLI package while CDN stays Google (`provider: "google"`).
   * Paths are under the FarsiUI repo root (e.g. `fonts/Estedad`).
   */
  cliDir?: string
  /** woff2 filename inside cliDir for next/font/local after npx. */
  cliWoff2?: string
  /** Files shipped by `npx farsiui add font-<id>` (relative to cliDir). */
  cliFiles?: string[]
  /** next/font/local `weight` for CLI install (e.g. `"100 900"` for variable). */
  cliWeight?: string
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

/** Google face that also ships files via `npx farsiui add font-<id>`. */
export function hasFontCliInstall(
  font: FontCatalogItem
): font is FontCatalogItem & {
  cliDir: string
  cliWoff2: string
} {
  return Boolean(font.cliDir && font.cliWoff2)
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

/** Weight chips for specimen UI — empty means single Regular (no picker). */
export function getFontSpecimenWeights(font: FontCatalogItem): number[] {
  if (font.cliWeight?.includes(" ")) {
    const [min, max] = font.cliWeight.split(/\s+/).map(Number)
    return [300, 400, 500, 700].filter(
      (w) => w >= (min ?? 400) && w <= (max ?? 400)
    )
  }
  if (Array.isArray(font.nextWeight) && font.nextWeight.length > 1) {
    return font.nextWeight.map(Number).sort((a, b) => a - b)
  }
  if (font.repoFiles?.length) {
    const inferred = inferSpecimenWeightsFromFiles(font.repoFiles)
    if (inferred.length > 1) return inferred
  }
  return []
}

function inferSpecimenWeightsFromFiles(files: string[]): number[] {
  const weights = new Set<number>()
  for (const file of files) {
    if (!file.toLowerCase().endsWith(".woff2")) continue
    const n = file.toLowerCase()
    if (n.includes("thin")) weights.add(100)
    else if (n.includes("extralight")) weights.add(200)
    else if (n.includes("light")) weights.add(300)
    else if (n.includes("medium")) weights.add(500)
    else if (n.includes("semibold") || n.includes("demibold")) weights.add(600)
    else if (n.includes("extrabold") || n.includes("ultrabold")) weights.add(800)
    else if (n.includes("black") || n.includes("heavy")) weights.add(900)
    else if (n.includes("bold")) weights.add(700)
    else if (
      n.includes("regular") ||
      n.includes("normal") ||
      /-(fd|regular)\.woff2$/i.test(file)
    ) {
      weights.add(400)
    }
  }
  return [...weights].sort((a, b) => a - b)
}

/**
 * Google specimen stylesheet — loads only the weights shown in the picker (or 400).
 */
export function getFontSpecimenStylesheetUrl(font: FontCatalogItem) {
  if (isRepoFont(font)) return null
  const weights = getFontSpecimenWeights(font)
  const list = weights.length > 0 ? weights : [400]
  return `https://fonts.googleapis.com/css2?family=${font.googleFamily}:wght@${list.join(";")}&display=swap`
}

/** Same-origin woff2 for variable repo specimen. */
export function getFontSpecimenLocalWoff2Url(font: FontCatalogItem) {
  if (!isRepoFont(font)) return null
  const relative = font.repoDir.replace(/^fonts\//, "")
  return `/catalog-fonts/${relative}/${font.repoWoff2}`
}

/** Same-origin font-face.css for static multi-weight repo faces. */
export function getFontSpecimenLocalCssUrl(font: FontCatalogItem) {
  if (!isRepoFont(font) || !font.repoCss) return null
  const relative = font.repoCss.replace(/^fonts\//, "")
  return `/catalog-fonts/${relative}`
}

/** True when repo face is a single variable file with a weight axis. */
export function isFontSpecimenVariable(font: FontCatalogItem) {
  return Boolean(font.cliWeight?.includes(" "))
}

/** Injected `@font-face` for variable repo specimen. */
export function getFontSpecimenFaceCss(font: FontCatalogItem) {
  if (!isRepoFont(font) || !isFontSpecimenVariable(font)) return null
  const family = getCssFontFamily(font)
  const src = getFontSpecimenLocalWoff2Url(font)
  const weight = font.cliWeight ?? "400"
  return `@font-face{font-family:"${family}";src:url("${src}") format("woff2");font-weight:${weight};font-style:normal;font-display:swap;}`
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

/** Resolved license id (defaults to OFL-1.1). */
export function getFontLicenseId(font: FontCatalogItem): FontLicenseId {
  return font.license ?? "ofl-1.1"
}

/** Short English label for UI / registry copy. */
export function getFontLicenseLabel(font: FontCatalogItem) {
  switch (getFontLicenseId(font)) {
    case "bitstream-vera":
      return "Bitstream Vera (+ Apache-2.0 / public domain)"
    case "gpl-2.0":
      return "GNU General Public License v2"
    case "font-store-free":
      return "Font-store Free Licence (خانه فونت)"
    case "irannastaliq-free":
      return "Iran Nastaliq v1/v2 free download"
    case "ofl-1.1":
      return "SIL Open Font License 1.1"
  }
}

/** Repo-relative path to the LICENSE file next to hosted faces. */
export function getFontLicenseRepoPath(font: FontCatalogItem) {
  if (!isRepoFont(font)) return null
  return `${font.repoDir}/LICENSE`
}

/**
 * Self-host `@font-face` for the user's project public/ folder.
 * Repo fonts: keep LICENSE beside the woff2 (required for redistribution).
 */
export function getFontFaceCss(font: FontCatalogItem) {
  const family = getCssFontFamily(font)
  const licenseLabel = getFontLicenseLabel(font)
  if (isRepoFont(font)) {
    const weight = font.cliWeight ?? "400"
    return `/* ${family} — ${licenseLabel}
   منبع: ${font.sourceUrl}
   کپی: ${font.repoDir}/${font.repoWoff2} + LICENSE → public/fonts/${font.id}/ */
@font-face {
  font-family: "${family}";
  src: url("/fonts/${font.id}/${font.repoWoff2}") format("woff2");
  font-weight: ${weight};
  font-style: normal;
  font-display: swap;
}`
  }
  return `/* دانلود: ${font.sourceUrl} → Download family
   Regular (woff2) + OFL.txt را در public/fonts/${font.id}/ بگذارید. */
@font-face {
  font-family: "${family}";
  src: url("/fonts/${font.id}/${font.id}.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}`
}

/** Green sidebar bullet — high-signal / popular / distinctive faces. */
export const FONT_FEATURED_IDS = new Set([
  "vazirmatn",
  "estedad",
  "mikhak",
  "arad",
  "sahel",
  "shabnam",
  "samim",
  "normalsans",
  "noto-sans-arabic",
  "lalezar",
  "amiri",
  "unixel",
  "nahid",
  "koodak",
  "terafik",
  "nazanin",
  "xm-yekan",
  "titr",
  "sepehr",
  "tanha",
])

export function isFeaturedFont(id: string) {
  return FONT_FEATURED_IDS.has(id)
}

/**
 * Catalog order: curated for FA UI (top = strongest / most useful picks).
 */
export const FONTS_CATALOG: FontCatalogItem[] = [
  {
    id: "vazirmatn",
    nameFa: "وزیرمتن",
    nameEn: "Vazirmatn",
    provider: "google",
    license: "ofl-1.1",
    googleFamily: "Vazirmatn",
    nextImport: "Vazirmatn",
    /** CDN / specimen stay on Google; local files via npx. */
    sourceUrl: "https://github.com/rastikerdar/vazirmatn",
    demoUrl: "https://fonts.google.com/specimen/Vazirmatn",
    cliDir: "fonts/Vazirmatn",
    cliWoff2: "Vazirmatn-wght.woff2",
    cliFiles: ["Vazirmatn-wght.woff2", "font-face.css", "OFL.txt"],
    cliWeight: "100 900",
  },
  {
    id: "estedad",
    nameFa: "استعداد",
    nameEn: "Estedad",
    provider: "google",
    license: "ofl-1.1",
    googleFamily: "Estedad",
    nextImport: "Estedad",
    /** CDN / specimen stay on Google; local files via npx. */
    sourceUrl: "https://github.com/aminabedi68/Estedad",
    demoUrl: "https://fonts.google.com/specimen/Estedad",
    cliDir: "fonts/Estedad",
    cliWoff2: "Estedad-wght.woff2",
    cliFiles: ["Estedad-wght.woff2", "font-face.css", "OFL.txt"],
    cliWeight: "100 900",
  },
  {
    id: "mikhak",
    nameFa: "میخک",
    nameEn: "Mikhak",
    provider: "repo",
    license: "ofl-1.1",
    /** Variable FD — Persian digits; wght (+ KSHD / DSTY in the file). */
    cssFamily: "Mikhak FD",
    repoDir: "fonts/Mikhak",
    repoWoff2: "Mikhak-FD.woff2",
    repoCss: "fonts/Mikhak/font-face.css",
    repoFiles: ["Mikhak-FD.woff2", "font-face.css", "LICENSE", "OFL.txt"],
    /** next/font/local weight range for the variable face. */
    cliWeight: "100 900",
    sourceUrl: "https://github.com/aminabedi68/Mikhak",
    demoUrl: "https://aminabedi68.github.io/Mikhak/",
  },
  {
    id: "arad",
    nameFa: "آراد",
    nameEn: "Arad",
    provider: "repo",
    license: "ofl-1.1",
    cssFamily: "Arad FD",
    repoDir: "fonts/Arad",
    repoWoff2: "Arad-FD.woff2",
    repoCss: "fonts/Arad/font-face.css",
    repoFiles: ["Arad-FD.woff2", "font-face.css", "LICENSE", "OFL.txt"],
    cliWeight: "100 900",
    sourceUrl: "https://github.com/MohamadDarvishi/Arad",
    demoUrl: "https://mohamaddarvishi.ir/Arad/",
  },
  {
    id: "sahel",
    nameFa: "ساحل",
    nameEn: "Sahel",
    provider: "repo",
    license: "ofl-1.1",
    /** Persian digits (0–9 → فارسی) — better default for fa UI. */
    cssFamily: "Sahel FD",
    repoDir: "fonts/sahel/farsi-digits",
    repoWoff2: "Sahel-FD.woff2",
    repoCss: "fonts/sahel/farsi-digits/font-face.css",
    repoFiles: [
      "Sahel-Light-FD.woff2",
      "Sahel-FD.woff2",
      "Sahel-SemiBold-FD.woff2",
      "Sahel-Bold-FD.woff2",
      "Sahel-Black-FD.woff2",
      "font-face.css",
      "LICENSE",
    ],
    sourceUrl: "https://github.com/rastikerdar/sahel-font",
    demoUrl: "https://github.com/rastikerdar/sahel-font",
  },
  {
    id: "shabnam",
    nameFa: "شبنم",
    nameEn: "Shabnam",
    provider: "repo",
    license: "ofl-1.1",
    /** Persian digits (0–9 → فارسی) — better default for fa UI. */
    cssFamily: "Shabnam FD",
    repoDir: "fonts/shabnam/farsi-digits",
    repoWoff2: "Shabnam-FD.woff2",
    repoCss: "fonts/shabnam/farsi-digits/font-face.css",
    repoFiles: [
      "Shabnam-Thin-FD.woff2",
      "Shabnam-Light-FD.woff2",
      "Shabnam-FD.woff2",
      "Shabnam-Medium-FD.woff2",
      "Shabnam-Bold-FD.woff2",
      "font-face.css",
      "LICENSE",
    ],
    sourceUrl: "https://github.com/rastikerdar/shabnam-font",
    demoUrl: "https://github.com/rastikerdar/shabnam-font",
  },
  {
    id: "samim",
    nameFa: "صمیم",
    nameEn: "Samim",
    provider: "repo",
    license: "ofl-1.1",
    /** Persian digits (0–9 → فارسی) — better default for fa UI. */
    cssFamily: "Samim FD",
    repoDir: "fonts/samim/farsi-digits",
    repoWoff2: "Samim-FD.woff2",
    repoCss: "fonts/samim/farsi-digits/font-face.css",
    repoFiles: [
      "Samim-FD.woff2",
      "Samim-Medium-FD.woff2",
      "Samim-Bold-FD.woff2",
      "font-face.css",
      "LICENSE",
    ],
    sourceUrl: "https://github.com/rastikerdar/samim-font",
    demoUrl: "https://github.com/rastikerdar/samim-font",
  },
  {
    id: "normalsans",
    nameFa: "نرمال سنس",
    nameEn: "Normal Sans",
    provider: "repo",
    license: "ofl-1.1",
    cssFamily: "AQ Normal Sans",
    repoDir: "fonts/NormalSans",
    repoWoff2: "AQNormalSans-VF.woff2",
    repoCss: "fonts/NormalSans/font-face.css",
    repoFiles: [
      "AQNormalSans-VF.woff2",
      "font-face.css",
      "LICENSE",
      "OFL.txt",
    ],
    cliWeight: "100 900",
    sourceUrl: "https://github.com/AzadQalam/normal-sans",
    demoUrl: "https://azadqalam.github.io",
  },
  {
    id: "nahid",
    nameFa: "ناهید",
    nameEn: "Nahid",
    provider: "repo",
    /** Not OFL — same family of license as Tanha (Bitstream Vera / Apache / PD). */
    license: "bitstream-vera",
    /** Persian digits (0–9 → فارسی) — better default for fa UI. */
    cssFamily: "Nahid FD",
    repoDir: "fonts/nahid/farsi-digits",
    repoWoff2: "Nahid-FD.woff2",
    repoCss: "fonts/nahid/farsi-digits/font-face.css",
    repoFiles: ["Nahid-FD.woff2", "font-face.css", "LICENSE"],
    sourceUrl: "https://github.com/rastikerdar/nahid-font",
    demoUrl: "https://github.com/rastikerdar/nahid-font",
  },
  {
    id: "noto-sans-arabic",
    nameFa: "نوتو سنس عربی",
    nameEn: "Noto Sans Arabic",
    provider: "google",
    license: "ofl-1.1",
    googleFamily: "Noto+Sans+Arabic",
    nextImport: "Noto_Sans_Arabic",
    sourceUrl: "https://fonts.google.com/specimen/Noto+Sans+Arabic",
    demoUrl: "https://fonts.google.com/specimen/Noto+Sans+Arabic",
    cliDir: "fonts/NotoSansArabic",
    cliWoff2: "NotoSansArabic-wght.woff2",
    cliFiles: ["NotoSansArabic-wght.woff2", "font-face.css", "OFL.txt"],
    cliWeight: "100 900",
  },
  {
    id: "parastoo",
    nameFa: "پرستو",
    nameEn: "Parastoo",
    provider: "repo",
    license: "ofl-1.1",
    /** Persian digits (0–9 → فارسی) — better default for fa UI. */
    cssFamily: "Parastoo FD",
    repoDir: "fonts/parastoo/farsi-digits",
    repoWoff2: "Parastoo-FD.woff2",
    repoCss: "fonts/parastoo/farsi-digits/font-face.css",
    repoFiles: [
      "Parastoo-FD.woff2",
      "Parastoo-Bold-FD.woff2",
      "font-face.css",
      "LICENSE",
    ],
    sourceUrl: "https://github.com/rastikerdar/parastoo-font",
    demoUrl: "https://github.com/rastikerdar/parastoo-font",
  },
  {
    id: "ganjnameh",
    nameFa: "گنجنامه",
    nameEn: "Ganjnameh",
    provider: "repo",
    license: "ofl-1.1",
    cssFamily: "Ganjnameh",
    repoDir: "fonts/Ganjnameh",
    repoWoff2: "GanjNamehSans-Regular.woff2",
    repoCss: "fonts/Ganjnameh/font-face.css",
    repoFiles: [
      "GanjNamehSans-Regular.woff2",
      "font-face.css",
      "LICENSE",
      "OFL.txt",
    ],
    sourceUrl: "https://github.com/font-store/GanjnamehFont",
    demoUrl: "https://libre.font-store.ir/GanjnamehFont/",
  },
  {
    id: "ario",
    nameFa: "آریو",
    nameEn: "Ario",
    provider: "repo",
    license: "ofl-1.1",
    cssFamily: "Ario FD",
    repoDir: "fonts/Ario",
    repoWoff2: "Ario-FD.woff2",
    repoCss: "fonts/Ario/font-face.css",
    repoFiles: ["Ario-FD.woff2", "font-face.css", "LICENSE", "OFL.txt"],
    sourceUrl: "https://github.com/MohamadDarvishi/Ario",
    demoUrl: "https://mohamaddarvishi.ir/Ario/",
  },
  {
    id: "markazi-text",
    nameFa: "مرکزی تکست",
    nameEn: "Markazi Text",
    provider: "google",
    license: "ofl-1.1",
    googleFamily: "Markazi+Text",
    nextImport: "Markazi_Text",
    sourceUrl: "https://fonts.google.com/specimen/Markazi+Text",
    demoUrl: "https://fonts.google.com/specimen/Markazi+Text",
    cliDir: "fonts/MarkaziText",
    cliWoff2: "MarkaziText-wght.woff2",
    cliFiles: ["MarkaziText-wght.woff2", "font-face.css", "OFL.txt"],
    cliWeight: "400 700",
  },
  {
    id: "lalezar",
    nameFa: "لاله‌زار",
    nameEn: "Lalezar",
    provider: "google",
    license: "ofl-1.1",
    googleFamily: "Lalezar",
    nextImport: "Lalezar",
    nextWeight: "400",
    sourceUrl: "https://fonts.google.com/specimen/Lalezar",
    demoUrl: "https://fonts.google.com/specimen/Lalezar",
    cliDir: "fonts/Lalezar",
    cliWoff2: "Lalezar-Regular.woff2",
    cliFiles: ["Lalezar-Regular.woff2", "font-face.css", "OFL.txt"],
    cliWeight: "400",
  },
  {
    id: "amiri",
    nameFa: "امیری",
    nameEn: "Amiri",
    provider: "google",
    license: "ofl-1.1",
    googleFamily: "Amiri",
    nextImport: "Amiri",
    nextWeight: ["400", "700"],
    sourceUrl: "https://fonts.google.com/specimen/Amiri",
    demoUrl: "https://fonts.google.com/specimen/Amiri",
    cliDir: "fonts/Amiri",
    cliWoff2: "Amiri-Regular.woff2",
    cliFiles: [
      "Amiri-Regular.woff2",
      "Amiri-Bold.woff2",
      "font-face.css",
      "OFL.txt",
    ],
    cliWeight: "400",
  },
  {
    id: "noto-kufi-arabic",
    nameFa: "نوتو کوفی عربی",
    nameEn: "Noto Kufi Arabic",
    provider: "google",
    license: "ofl-1.1",
    googleFamily: "Noto+Kufi+Arabic",
    nextImport: "Noto_Kufi_Arabic",
    sourceUrl: "https://fonts.google.com/specimen/Noto+Kufi+Arabic",
    demoUrl: "https://fonts.google.com/specimen/Noto+Kufi+Arabic",
    cliDir: "fonts/NotoKufiArabic",
    cliWoff2: "NotoKufiArabic-wght.woff2",
    cliFiles: ["NotoKufiArabic-wght.woff2", "font-face.css", "OFL.txt"],
    cliWeight: "100 900",
  },
  {
    id: "noto-naskh-arabic",
    nameFa: "نوتو نسخ عربی",
    nameEn: "Noto Naskh Arabic",
    provider: "google",
    license: "ofl-1.1",
    googleFamily: "Noto+Naskh+Arabic",
    nextImport: "Noto_Naskh_Arabic",
    sourceUrl: "https://fonts.google.com/specimen/Noto+Naskh+Arabic",
    demoUrl: "https://fonts.google.com/specimen/Noto+Naskh+Arabic",
    cliDir: "fonts/NotoNaskhArabic",
    cliWoff2: "NotoNaskhArabic-wght.woff2",
    cliFiles: ["NotoNaskhArabic-wght.woff2", "font-face.css", "OFL.txt"],
    cliWeight: "400 700",
  },
  {
    id: "unixel",
    nameFa: "یونیکسل",
    nameEn: "Unixel",
    provider: "repo",
    license: "ofl-1.1",
    cssFamily: "Unixel",
    repoDir: "fonts/Unixel",
    repoWoff2: "Unixel-Regular.woff2",
    repoCss: "fonts/Unixel/font-face.css",
    repoFiles: [
      "Unixel-Regular.woff2",
      "font-face.css",
      "LICENSE",
      "OFL.txt",
    ],
    sourceUrl: "https://github.com/MDarvishi5124/Unixel",
    demoUrl: "https://mdarvishi5124.github.io/Unixel/",
  },
  {
    id: "sorena",
    nameFa: "سورنا",
    nameEn: "Sorena",
    provider: "repo",
    license: "ofl-1.1",
    cssFamily: "Sorena FD",
    repoDir: "fonts/Sorena",
    repoWoff2: "SorenaFD-Normal.woff2",
    repoCss: "fonts/Sorena/font-face.css",
    repoFiles: [
      "SorenaFD-Normal.woff2",
      "SorenaFD-Pixel.woff2",
      "font-face.css",
      "LICENSE",
      "OFL.txt",
    ],
    sourceUrl: "https://github.com/MDarvishi5124/Sorena",
    demoUrl: "https://mdarvishi5124.github.io/Sorena",
  },
  {
    id: "behdad",
    nameFa: "بهداد",
    nameEn: "Behdad",
    provider: "repo",
    license: "ofl-1.1",
    cssFamily: "Behdad",
    repoDir: "fonts/Behdad",
    repoWoff2: "Behdad-Regular.woff2",
    repoCss: "fonts/Behdad/font-face.css",
    repoFiles: ["Behdad-Regular.woff2", "font-face.css", "LICENSE", "OFL.txt"],
    sourceUrl: "https://github.com/font-store/BehdadFont",
    demoUrl: "https://libre.font-store.ir/BehdadFont/",
  },
  {
    id: "nika",
    nameFa: "نیکا",
    nameEn: "Nika",
    provider: "repo",
    license: "ofl-1.1",
    cssFamily: "Nika",
    repoDir: "fonts/Nika",
    repoWoff2: "Nika-Regular.woff2",
    repoCss: "fonts/Nika/font-face.css",
    repoFiles: ["Nika-Regular.woff2", "font-face.css", "LICENSE", "OFL.txt"],
    sourceUrl: "https://github.com/font-store/NikaFont",
    demoUrl: "https://libre.font-store.ir/NikaFont/",
  },
  {
    id: "farbod",
    nameFa: "فربد",
    nameEn: "Farbod",
    provider: "repo",
    license: "ofl-1.1",
    cssFamily: "Farbod",
    repoDir: "fonts/Farbod",
    repoWoff2: "Farbod-Regular.woff2",
    repoCss: "fonts/Farbod/font-face.css",
    repoFiles: ["Farbod-Regular.woff2", "font-face.css", "LICENSE", "OFL.txt"],
    sourceUrl: "https://github.com/font-store/FarbodFont",
    demoUrl: "https://libre.font-store.ir/FarbodFont/",
  },
  {
    id: "shahab",
    nameFa: "شهاب",
    nameEn: "Shahab",
    provider: "repo",
    license: "ofl-1.1",
    cssFamily: "Shahab",
    repoDir: "fonts/Shahab",
    repoWoff2: "Shahab-Regular.woff2",
    repoCss: "fonts/Shahab/font-face.css",
    repoFiles: ["Shahab-Regular.woff2", "font-face.css", "LICENSE", "OFL.txt"],
    sourceUrl: "https://github.com/font-store/ShahabFont",
    demoUrl: "https://libre.font-store.ir/ShahabFont/",
  },
  {
    id: "noon",
    nameFa: "نون",
    nameEn: "Noon",
    provider: "repo",
    license: "ofl-1.1",
    cssFamily: "Noon",
    repoDir: "fonts/Noon",
    repoWoff2: "Noon-Regular.woff2",
    repoCss: "fonts/Noon/font-face.css",
    repoFiles: ["Noon-Regular.woff2", "font-face.css", "LICENSE", "OFL.txt"],
    sourceUrl: "https://github.com/font-store/NoonFont",
    demoUrl: "https://libre.font-store.ir/NoonFont/",
  },
  {
    id: "miladazad",
    nameFa: "میلاد آزاد",
    nameEn: "MiladAzad",
    provider: "repo",
    license: "ofl-1.1",
    cssFamily: "MiladAzad",
    repoDir: "fonts/MiladAzad",
    repoWoff2: "MiladAzad-Regular.woff2",
    repoCss: "fonts/MiladAzad/font-face.css",
    repoFiles: [
      "MiladAzad-Regular.woff2",
      "font-face.css",
      "LICENSE",
      "OFL.txt",
    ],
    sourceUrl: "https://github.com/font-store/font-MiladAzad",
    demoUrl: "https://github.com/font-store/font-MiladAzad",
  },
  {
    id: "vizhehazad",
    nameFa: "ویژه آزاد",
    nameEn: "VizhehAzad",
    provider: "repo",
    license: "ofl-1.1",
    cssFamily: "VizhehAzad",
    repoDir: "fonts/VizhehAzad",
    repoWoff2: "VizhehAzad-Regular.woff2",
    repoCss: "fonts/VizhehAzad/font-face.css",
    repoFiles: [
      "VizhehAzad-Regular.woff2",
      "font-face.css",
      "LICENSE",
      "OFL.txt",
    ],
    sourceUrl: "https://github.com/font-store/font-VizhehAzad",
    demoUrl: "https://github.com/font-store/font-VizhehAzad",
  },
  {
    id: "tanha",
    nameFa: "تنها",
    nameEn: "Tanha",
    provider: "repo",
    /** Not OFL — Bitstream Vera + Apache-2.0 (Roboto) + PD (Rastikerdar). */
    license: "bitstream-vera",
    /** Persian digits (0–9 → فارسی) — better default for fa UI. */
    cssFamily: "Tanha FD",
    repoDir: "fonts/tanha/farsi-digits",
    repoWoff2: "Tanha-FD.woff2",
    repoCss: "fonts/tanha/farsi-digits/font-face.css",
    repoFiles: ["Tanha-FD.woff2", "font-face.css", "LICENSE"],
    sourceUrl: "https://github.com/rastikerdar/tanha-font",
    demoUrl: "https://github.com/rastikerdar/tanha-font",
  },
  {
    id: "gandom",
    nameFa: "گندم",
    nameEn: "Gandom",
    provider: "repo",
    license: "ofl-1.1",
    /** Persian digits (0–9 → فارسی) — better default for fa UI. */
    cssFamily: "Gandom FD",
    repoDir: "fonts/gandom/farsi-digits",
    repoWoff2: "Gandom-FD.woff2",
    repoCss: "fonts/gandom/farsi-digits/font-face.css",
    repoFiles: ["Gandom-FD.woff2", "font-face.css", "LICENSE"],
    sourceUrl: "https://github.com/rastikerdar/gandom-font",
    demoUrl: "https://github.com/rastikerdar/gandom-font",
  },
  {
    id: "sepehr",
    nameFa: "سپهر",
    nameEn: "Sepehr",
    provider: "repo",
    license: "ofl-1.1",
    cssFamily: "Sepehr",
    repoDir: "fonts/Sepehr",
    repoWoff2: "Sepehr-Regular.woff2",
    repoCss: "fonts/Sepehr/font-face.css",
    repoFiles: [
      "Sepehr-Thin.woff2",
      "Sepehr-Light.woff2",
      "Sepehr-Regular.woff2",
      "Sepehr-Medium.woff2",
      "Sepehr-Bold.woff2",
      "font-face.css",
      "LICENSE",
      "OFL.txt",
    ],
    sourceUrl: "https://github.com/googlefonts/sepehr-fonts",
    demoUrl: "https://github.com/googlefonts/sepehr-fonts",
  },
  {
    id: "xm-yekan",
    nameFa: "یکان",
    nameEn: "XM Yekan",
    provider: "repo",
    license: "ofl-1.1",
    cssFamily: "XM Yekan",
    repoDir: "fonts/XMYekan",
    repoWoff2: "XMYekan-Regular.woff2",
    repoCss: "fonts/XMYekan/font-face.css",
    repoFiles: [
      "XMYekan-Regular.woff2",
      "XMYekan-Bold.woff2",
      "XMYekan-Italic.woff2",
      "XMYekan-BoldItalic.woff2",
      "font-face.css",
      "LICENSE",
      "OFL.txt",
    ],
    sourceUrl: "https://fontlibrary.org/en/font/xm-yekan",
    demoUrl: "https://fontlibrary.org/en/font/xm-yekan",
  },
  {
    id: "titr",
    nameFa: "تیتر",
    nameEn: "Titr",
    provider: "repo",
    /** Sharif FarsiWeb — GNU GPL v2 (not OFL). */
    license: "gpl-2.0",
    cssFamily: "Titr",
    repoDir: "fonts/titr",
    repoWoff2: "Titr-Bold.woff2",
    repoCss: "fonts/titr/font-face.css",
    repoFiles: ["Titr-Bold.woff2", "font-face.css", "LICENSE", "COPYING.txt"],
    /** Single Bold face. */
    cliWeight: "700",
    sourceUrl: "https://fontlibrary.org/en/font/titr",
    demoUrl: "https://fontlibrary.org/en/font/titr",
  },
  {
    id: "shafigh",
    nameFa: "شفیق",
    nameEn: "XB Shafigh Uzbek",
    provider: "repo",
    license: "ofl-1.1",
    cssFamily: "XB Shafigh Uzbek",
    repoDir: "fonts/Shafigh",
    repoWoff2: "Shafigh-Regular.woff2",
    repoCss: "fonts/Shafigh/font-face.css",
    repoFiles: [
      "Shafigh-Regular.woff2",
      "Shafigh-Bold.woff2",
      "Shafigh-Italic.woff2",
      "Shafigh-BoldItalic.woff2",
      "font-face.css",
      "LICENSE",
      "OFL.txt",
    ],
    sourceUrl: "https://fontlibrary.org/en/font/xb-shafigh-uzbek",
    demoUrl: "https://fontlibrary.org/en/font/xb-shafigh-uzbek",
  },
  {
    id: "nazanin",
    nameFa: "نازنین",
    nameEn: "Nazanin",
    provider: "repo",
    /** CDN خانه فونت — Free Licence claim; no OFL file beside faces. */
    license: "font-store-free",
    cssFamily: "Nazanin",
    repoDir: "fonts/Nazanin",
    repoWoff2: "Nazanin-Regular.woff2",
    repoCss: "fonts/Nazanin/font-face.css",
    repoFiles: [
      "Nazanin-Regular.woff2",
      "Nazanin-Bold.woff2",
      "font-face.css",
      "LICENSE",
    ],
    sourceUrl: "https://cdn.font-store.ir/nazanin.css",
    demoUrl: "https://cdn.font-store.ir/",
  },
  {
    id: "xp-vosta",
    nameFa: "وسطا",
    nameEn: "XP Vosta",
    provider: "repo",
    license: "ofl-1.1",
    cssFamily: "XP Vosta",
    repoDir: "fonts/XPVosta",
    repoWoff2: "XPVosta-Regular.woff2",
    repoCss: "fonts/XPVosta/font-face.css",
    repoFiles: [
      "XPVosta-Regular.woff2",
      "XPVosta-Bold.woff2",
      "XPVosta-Italic.woff2",
      "XPVosta-BoldItalic.woff2",
      "font-face.css",
      "LICENSE",
      "OFL.txt",
    ],
    sourceUrl: "https://fontlibrary.org/en/font/xp-vosta",
    demoUrl: "https://fontlibrary.org/en/font/xp-vosta",
  },
  {
    id: "xb-sols",
    nameFa: "سلس",
    nameEn: "XB Sols",
    provider: "repo",
    license: "ofl-1.1",
    cssFamily: "XB Sols",
    repoDir: "fonts/XBSols",
    repoWoff2: "XBSols-Regular.woff2",
    repoCss: "fonts/XBSols/font-face.css",
    repoFiles: [
      "XBSols-Regular.woff2",
      "XBSols-Bold.woff2",
      "XBSols-Italic.woff2",
      "XBSols-BoldItalic.woff2",
      "font-face.css",
      "LICENSE",
      "OFL.txt",
    ],
    sourceUrl: "https://fontlibrary.org/en/font/xb-sols",
    demoUrl: "https://fontlibrary.org/en/font/xb-sols",
  },
  {
    id: "terafik",
    nameFa: "ترافیک",
    nameEn: "Terafik",
    provider: "repo",
    /** Sharif FarsiWeb — Bitstream Vera (not OFL). */
    license: "bitstream-vera",
    cssFamily: "Terafik",
    repoDir: "fonts/Terafik",
    repoWoff2: "Terafik-Regular.woff2",
    repoCss: "fonts/Terafik/font-face.css",
    repoFiles: [
      "Terafik-Regular.woff2",
      "Terafik-Bold.woff2",
      "font-face.css",
      "LICENSE",
    ],
    sourceUrl: "https://fontlibrary.org/en/font/terafik",
    demoUrl: "https://fontlibrary.org/en/font/terafik",
  },
  {
    id: "nazli",
    nameFa: "نازلی",
    nameEn: "Nazli",
    provider: "repo",
    /** Sharif FarsiWeb — GNU GPL v2 (FOSS Nazanin-based; not OFL). */
    license: "gpl-2.0",
    cssFamily: "Nazli",
    repoDir: "fonts/Nazli",
    repoWoff2: "Nazli-Regular.woff2",
    repoCss: "fonts/Nazli/font-face.css",
    repoFiles: [
      "Nazli-Regular.woff2",
      "Nazli-Bold.woff2",
      "font-face.css",
      "LICENSE",
      "COPYING.txt",
    ],
    sourceUrl: "https://fontlibrary.org/en/font/nazli",
    demoUrl: "https://fontlibrary.org/en/font/nazli",
  },
  {
    id: "koodak",
    nameFa: "کودک",
    nameEn: "Koodak",
    provider: "repo",
    /** Sharif FarsiWeb — Bitstream Vera (not OFL). */
    license: "bitstream-vera",
    cssFamily: "Koodak",
    repoDir: "fonts/Koodak",
    repoWoff2: "Koodak-Regular.woff2",
    repoCss: "fonts/Koodak/font-face.css",
    repoFiles: ["Koodak-Regular.woff2", "font-face.css", "LICENSE"],
    sourceUrl: "https://fontlibrary.org/en/font/koodak",
    demoUrl: "https://fontlibrary.org/en/font/koodak",
  },
  {
    id: "xp-ziba",
    nameFa: "زیبا",
    nameEn: "XP Ziba",
    provider: "repo",
    license: "ofl-1.1",
    cssFamily: "XP Ziba",
    repoDir: "fonts/XPZiba",
    repoWoff2: "XPZiba-Regular.woff2",
    repoCss: "fonts/XPZiba/font-face.css",
    repoFiles: [
      "XPZiba-Regular.woff2",
      "XPZiba-Bold.woff2",
      "XPZiba-Italic.woff2",
      "XPZiba-BoldItalic.woff2",
      "font-face.css",
      "LICENSE",
      "OFL.txt",
    ],
    sourceUrl: "https://fontlibrary.org/en/font/xp-ziba",
    demoUrl: "https://fontlibrary.org/en/font/xp-ziba",
  },
  {
    id: "xb-tabriz",
    nameFa: "تبریز",
    nameEn: "XB Tabriz",
    provider: "repo",
    license: "ofl-1.1",
    cssFamily: "XB Tabriz",
    repoDir: "fonts/XBTabriz",
    repoWoff2: "XBTabriz-Regular.woff2",
    repoCss: "fonts/XBTabriz/font-face.css",
    repoFiles: [
      "XBTabriz-Regular.woff2",
      "XBTabriz-Bold.woff2",
      "XBTabriz-Italic.woff2",
      "XBTabriz-BoldItalic.woff2",
      "font-face.css",
      "LICENSE",
      "OFL.txt",
    ],
    sourceUrl: "https://fontlibrary.org/en/font/xb-tabriz",
    demoUrl: "https://fontlibrary.org/en/font/xb-tabriz",
  },
  {
    id: "xb-roya",
    nameFa: "رویا",
    nameEn: "XB Roya",
    provider: "repo",
    license: "ofl-1.1",
    cssFamily: "XB Roya",
    repoDir: "fonts/XBRoya",
    repoWoff2: "XBRoya-Regular.woff2",
    repoCss: "fonts/XBRoya/font-face.css",
    repoFiles: [
      "XBRoya-Regular.woff2",
      "XBRoya-Bold.woff2",
      "XBRoya-Italic.woff2",
      "XBRoya-BoldItalic.woff2",
      "font-face.css",
      "LICENSE",
      "OFL.txt",
    ],
    sourceUrl: "https://fontlibrary.org/en/font/xb-roya",
    demoUrl: "https://fontlibrary.org/en/font/xb-roya",
  },
  {
    id: "xb-kayhan",
    nameFa: "کیهان",
    nameEn: "XB Kayhan",
    provider: "repo",
    license: "ofl-1.1",
    cssFamily: "XB Kayhan",
    repoDir: "fonts/XBKayhan",
    repoWoff2: "XBKayhan-Regular.woff2",
    repoCss: "fonts/XBKayhan/font-face.css",
    repoFiles: [
      "XBKayhan-Regular.woff2",
      "XBKayhan-Bold.woff2",
      "XBKayhan-Italic.woff2",
      "XBKayhan-BoldItalic.woff2",
      "font-face.css",
      "LICENSE",
      "OFL.txt",
    ],
    sourceUrl: "https://fontlibrary.org/en/font/xb-kayhan",
    demoUrl: "https://fontlibrary.org/en/font/xb-kayhan",
  },
  {
    id: "irannastaliq",
    nameFa: "ایران نستعلیق",
    nameEn: "Iran Nastaliq",
    provider: "repo",
    /** font-store optimized WebFont (OFL) — not Iran Nastaliq 3 commercial. */
    license: "ofl-1.1",
    cssFamily: "IranNastaliq",
    repoDir: "fonts/IranNastaliq",
    repoWoff2: "IranNastaliq-Regular.woff2",
    repoCss: "fonts/IranNastaliq/font-face.css",
    repoFiles: [
      "IranNastaliq-Regular.woff2",
      "font-face.css",
      "LICENSE",
      "OFL.txt",
    ],
    sourceUrl: "https://github.com/font-store/font-IranNastaliq",
    demoUrl: "http://font-store.github.io/font-IranNastaliq/",
  },
  {
    id: "lateef",
    nameFa: "لطیف",
    nameEn: "Lateef",
    provider: "google",
    license: "ofl-1.1",
    googleFamily: "Lateef",
    nextImport: "Lateef",
    nextWeight: ["400", "700"],
    nextSubsets: ["arabic"],
    sourceUrl: "https://fonts.google.com/specimen/Lateef",
    demoUrl: "https://fonts.google.com/specimen/Lateef",
    cliDir: "fonts/Lateef",
    cliWoff2: "Lateef-Regular.woff2",
    cliFiles: [
      "Lateef-Regular.woff2",
      "Lateef-Bold.woff2",
      "font-face.css",
      "OFL.txt",
    ],
    cliWeight: "400",
  },
  {
    id: "scheherazade-new",
    nameFa: "شهرزاد جدید",
    nameEn: "Scheherazade New",
    provider: "google",
    license: "ofl-1.1",
    googleFamily: "Scheherazade+New",
    nextImport: "Scheherazade_New",
    nextWeight: ["400", "700"],
    nextSubsets: ["arabic"],
    sourceUrl: "https://fonts.google.com/specimen/Scheherazade+New",
    demoUrl: "https://fonts.google.com/specimen/Scheherazade+New",
    cliDir: "fonts/ScheherazadeNew",
    cliWoff2: "ScheherazadeNew-Regular.woff2",
    cliFiles: [
      "ScheherazadeNew-Regular.woff2",
      "ScheherazadeNew-Bold.woff2",
      "font-face.css",
      "OFL.txt",
    ],
    cliWeight: "400",
  },
]

export function getFontCatalogItem(id: string) {
  return FONTS_CATALOG.find((font) => font.id === id) ?? FONTS_CATALOG[0]
}
