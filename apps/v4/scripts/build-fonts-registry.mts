/**
 * Emits installable registry JSON for repo-hosted fonts into
 * public/r/fonts/<slug>.json. Middleware rewrites
 * /r/styles/<style>/<slug>.json → /r/fonts/<slug>.json so
 * `npx farsiui add font-sahel` works for every configured style.
 *
 * Binary faces (woff2) are embedded as base64 with encoding: "base64".
 */
import { promises as fs } from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")
const REPO_ROOT = path.resolve(ROOT, "../..")
const OUTPUT_DIR = path.join(ROOT, "public/r/fonts")
const SCHEMA = "https://farsiui.ir/schema/registry-item.json"

type RegistryFile = {
  path: string
  type: "registry:file"
  target: string
  content: string
  encoding?: "utf-8" | "base64"
}

type RegistryItem = {
  $schema: string
  name: string
  type: "registry:item"
  title: string
  description: string
  files: RegistryFile[]
  meta?: {
    links?: { docs?: string; source?: string }
    tags?: string[]
  }
}

type FontRegistryDefinition = {
  slug: string
  title: string
  description: string
  docsPath: string
  sourceUrl: string
  /** Absolute directory of files to ship. */
  sourceDir: string
  /** Install root in the user's project (relative). */
  installDir: string
  /** Filenames to include from sourceDir. */
  files: string[]
  tags: string[]
}

const FONT_ITEMS: FontRegistryDefinition[] = [
  {
    slug: "font-vazirmatn",
    title: "Vazirmatn",
    description:
      "Vazirmatn variable (wght 100–900, OFL-1.1). Installs woff2 + OFL into app/fonts/vazirmatn for next/font/local. CDN install stays on Google Fonts.",
    docsPath: "/fonts/vazirmatn",
    sourceUrl: "https://github.com/rastikerdar/vazirmatn",
    sourceDir: path.join(REPO_ROOT, "fonts/Vazirmatn"),
    installDir: "app/fonts/vazirmatn",
    files: ["Vazirmatn-wght.woff2", "font-face.css", "OFL.txt"],
    tags: ["فونت", "وزیرمتن", "فارسی"],
  },
  {
    slug: "font-estedad",
    title: "Estedad",
    description:
      "Estedad variable (wght 100–900, OFL-1.1). Installs woff2 + OFL into app/fonts/estedad for next/font/local. CDN install stays on Google Fonts.",
    docsPath: "/fonts/estedad",
    sourceUrl: "https://github.com/aminabedi68/Estedad",
    sourceDir: path.join(REPO_ROOT, "fonts/Estedad"),
    installDir: "app/fonts/estedad",
    files: ["Estedad-wght.woff2", "font-face.css", "OFL.txt"],
    tags: ["فونت", "استعداد", "فارسی"],
  },
  {
    slug: "font-noto-sans-arabic",
    title: "Noto Sans Arabic",
    description:
      "Noto Sans Arabic variable (OFL-1.1). Installs woff2 + OFL into app/fonts/noto-sans-arabic for next/font/local. CDN install stays on Google Fonts.",
    docsPath: "/fonts/noto-sans-arabic",
    sourceUrl: "https://fonts.google.com/specimen/Noto+Sans+Arabic",
    sourceDir: path.join(REPO_ROOT, "fonts/NotoSansArabic"),
    installDir: "app/fonts/noto-sans-arabic",
    files: ["NotoSansArabic-wght.woff2", "font-face.css", "OFL.txt"],
    tags: ["فونت", "نوتو", "عربی"],
  },
  {
    slug: "font-markazi-text",
    title: "Markazi Text",
    description:
      "Markazi Text variable (wght 400–700, OFL-1.1). Installs woff2 + OFL into app/fonts/markazi-text for next/font/local. CDN install stays on Google Fonts.",
    docsPath: "/fonts/markazi-text",
    sourceUrl: "https://fonts.google.com/specimen/Markazi+Text",
    sourceDir: path.join(REPO_ROOT, "fonts/MarkaziText"),
    installDir: "app/fonts/markazi-text",
    files: ["MarkaziText-wght.woff2", "font-face.css", "OFL.txt"],
    tags: ["فونت", "مرکزی", "عربی"],
  },
  {
    slug: "font-lalezar",
    title: "Lalezar",
    description:
      "Lalezar Regular (OFL-1.1). Installs woff2 + OFL into app/fonts/lalezar for next/font/local. CDN install stays on Google Fonts.",
    docsPath: "/fonts/lalezar",
    sourceUrl: "https://fonts.google.com/specimen/Lalezar",
    sourceDir: path.join(REPO_ROOT, "fonts/Lalezar"),
    installDir: "app/fonts/lalezar",
    files: ["Lalezar-Regular.woff2", "font-face.css", "OFL.txt"],
    tags: ["فونت", "لاله‌زار", "عربی"],
  },
  {
    slug: "font-amiri",
    title: "Amiri",
    description:
      "Amiri Regular + Bold (OFL-1.1). Installs woff2 + OFL into app/fonts/amiri for next/font/local. CDN install stays on Google Fonts.",
    docsPath: "/fonts/amiri",
    sourceUrl: "https://fonts.google.com/specimen/Amiri",
    sourceDir: path.join(REPO_ROOT, "fonts/Amiri"),
    installDir: "app/fonts/amiri",
    files: [
      "Amiri-Regular.woff2",
      "Amiri-Bold.woff2",
      "font-face.css",
      "OFL.txt",
    ],
    tags: ["فونت", "امیری", "عربی"],
  },
  {
    slug: "font-noto-kufi-arabic",
    title: "Noto Kufi Arabic",
    description:
      "Noto Kufi Arabic variable (OFL-1.1). Installs woff2 + OFL into app/fonts/noto-kufi-arabic for next/font/local. CDN install stays on Google Fonts.",
    docsPath: "/fonts/noto-kufi-arabic",
    sourceUrl: "https://fonts.google.com/specimen/Noto+Kufi+Arabic",
    sourceDir: path.join(REPO_ROOT, "fonts/NotoKufiArabic"),
    installDir: "app/fonts/noto-kufi-arabic",
    files: ["NotoKufiArabic-wght.woff2", "font-face.css", "OFL.txt"],
    tags: ["فونت", "نوتو", "کوفی"],
  },
  {
    slug: "font-noto-naskh-arabic",
    title: "Noto Naskh Arabic",
    description:
      "Noto Naskh Arabic variable (OFL-1.1). Installs woff2 + OFL into app/fonts/noto-naskh-arabic for next/font/local. CDN install stays on Google Fonts.",
    docsPath: "/fonts/noto-naskh-arabic",
    sourceUrl: "https://fonts.google.com/specimen/Noto+Naskh+Arabic",
    sourceDir: path.join(REPO_ROOT, "fonts/NotoNaskhArabic"),
    installDir: "app/fonts/noto-naskh-arabic",
    files: ["NotoNaskhArabic-wght.woff2", "font-face.css", "OFL.txt"],
    tags: ["فونت", "نوتو", "نسخ"],
  },
  {
    slug: "font-lateef",
    title: "Lateef",
    description:
      "Lateef Regular + Bold (OFL-1.1). Installs woff2 + OFL into app/fonts/lateef for next/font/local. CDN install stays on Google Fonts.",
    docsPath: "/fonts/lateef",
    sourceUrl: "https://fonts.google.com/specimen/Lateef",
    sourceDir: path.join(REPO_ROOT, "fonts/Lateef"),
    installDir: "app/fonts/lateef",
    files: [
      "Lateef-Regular.woff2",
      "Lateef-Bold.woff2",
      "font-face.css",
      "OFL.txt",
    ],
    tags: ["فونت", "لطیف", "عربی"],
  },
  {
    slug: "font-scheherazade-new",
    title: "Scheherazade New",
    description:
      "Scheherazade New Regular + Bold (OFL-1.1). Installs woff2 + OFL into app/fonts/scheherazade-new for next/font/local. CDN install stays on Google Fonts.",
    docsPath: "/fonts/scheherazade-new",
    sourceUrl: "https://fonts.google.com/specimen/Scheherazade+New",
    sourceDir: path.join(REPO_ROOT, "fonts/ScheherazadeNew"),
    installDir: "app/fonts/scheherazade-new",
    files: [
      "ScheherazadeNew-Regular.woff2",
      "ScheherazadeNew-Bold.woff2",
      "font-face.css",
      "OFL.txt",
    ],
    tags: ["فونت", "شهرزاد", "عربی"],
  },
  {
    slug: "font-mikhak",
    title: "Mikhak FD",
    description:
      "Mikhak variable with Persian digits (OFL-1.1). Installs woff2 + LICENSE/OFL into app/fonts/mikhak for next/font/local.",
    docsPath: "/fonts/mikhak",
    sourceUrl: "https://github.com/aminabedi68/Mikhak",
    sourceDir: path.join(REPO_ROOT, "fonts/Mikhak"),
    installDir: "app/fonts/mikhak",
    files: ["Mikhak-FD.woff2", "font-face.css", "LICENSE", "OFL.txt"],
    tags: ["فونت", "میخک", "فارسی"],
  },
  {
    slug: "font-behdad",
    title: "Behdad",
    description:
      "Behdad Regular (OFL-1.1). Installs woff2 + LICENSE/OFL into app/fonts/behdad for next/font/local.",
    docsPath: "/fonts/behdad",
    sourceUrl: "https://github.com/font-store/BehdadFont",
    sourceDir: path.join(REPO_ROOT, "fonts/Behdad"),
    installDir: "app/fonts/behdad",
    files: ["Behdad-Regular.woff2", "font-face.css", "LICENSE", "OFL.txt"],
    tags: ["فونت", "بهداد", "فارسی"],
  },
  {
    slug: "font-nika",
    title: "Nika",
    description:
      "Nika Regular (OFL-1.1). Installs woff2 + LICENSE/OFL into app/fonts/nika for next/font/local.",
    docsPath: "/fonts/nika",
    sourceUrl: "https://github.com/font-store/NikaFont",
    sourceDir: path.join(REPO_ROOT, "fonts/Nika"),
    installDir: "app/fonts/nika",
    files: ["Nika-Regular.woff2", "font-face.css", "LICENSE", "OFL.txt"],
    tags: ["فونت", "نیکا", "فارسی"],
  },
  {
    slug: "font-farbod",
    title: "Farbod",
    description:
      "Farbod Regular (OFL-1.1, Reserved Font Name Farbod). Installs woff2 + LICENSE/OFL into app/fonts/farbod for next/font/local.",
    docsPath: "/fonts/farbod",
    sourceUrl: "https://github.com/font-store/FarbodFont",
    sourceDir: path.join(REPO_ROOT, "fonts/Farbod"),
    installDir: "app/fonts/farbod",
    files: ["Farbod-Regular.woff2", "font-face.css", "LICENSE", "OFL.txt"],
    tags: ["فونت", "فربد", "فارسی"],
  },
  {
    slug: "font-shahab",
    title: "Shahab",
    description:
      "Shahab Regular (OFL-1.1, Reserved Font Name Shahab). Installs woff2 + LICENSE/OFL into app/fonts/shahab for next/font/local.",
    docsPath: "/fonts/shahab",
    sourceUrl: "https://github.com/font-store/ShahabFont",
    sourceDir: path.join(REPO_ROOT, "fonts/Shahab"),
    installDir: "app/fonts/shahab",
    files: ["Shahab-Regular.woff2", "font-face.css", "LICENSE", "OFL.txt"],
    tags: ["فونت", "شهاب", "فارسی"],
  },
  {
    slug: "font-noon",
    title: "Noon",
    description:
      "Noon Regular (OFL-1.1, Reserved Font Name Noon). Quran-oriented Naskh. Installs woff2 + LICENSE/OFL into app/fonts/noon for next/font/local.",
    docsPath: "/fonts/noon",
    sourceUrl: "https://github.com/font-store/NoonFont",
    sourceDir: path.join(REPO_ROOT, "fonts/Noon"),
    installDir: "app/fonts/noon",
    files: ["Noon-Regular.woff2", "font-face.css", "LICENSE", "OFL.txt"],
    tags: ["فونت", "نون", "فارسی", "قرآن"],
  },
  {
    slug: "font-miladazad",
    title: "MiladAzad",
    description:
      "MiladAzad Regular (OFL-1.1). Installs woff2 + LICENSE/OFL into app/fonts/miladazad for next/font/local.",
    docsPath: "/fonts/miladazad",
    sourceUrl: "https://github.com/font-store/font-MiladAzad",
    sourceDir: path.join(REPO_ROOT, "fonts/MiladAzad"),
    installDir: "app/fonts/miladazad",
    files: [
      "MiladAzad-Regular.woff2",
      "font-face.css",
      "LICENSE",
      "OFL.txt",
    ],
    tags: ["فونت", "میلاد", "فارسی"],
  },
  {
    slug: "font-vizhehazad",
    title: "VizhehAzad",
    description:
      "VizhehAzad Regular (OFL-1.1). Installs woff2 + LICENSE/OFL into app/fonts/vizhehazad for next/font/local.",
    docsPath: "/fonts/vizhehazad",
    sourceUrl: "https://github.com/font-store/font-VizhehAzad",
    sourceDir: path.join(REPO_ROOT, "fonts/VizhehAzad"),
    installDir: "app/fonts/vizhehazad",
    files: [
      "VizhehAzad-Regular.woff2",
      "font-face.css",
      "LICENSE",
      "OFL.txt",
    ],
    tags: ["فونت", "ویژه", "فارسی"],
  },
  {
    slug: "font-ganjnameh",
    title: "Ganjnameh",
    description:
      "Ganjnameh Regular (OFL-1.1). Modern monoline Persian/Arabic. Installs woff2 + LICENSE/OFL into app/fonts/ganjnameh for next/font/local.",
    docsPath: "/fonts/ganjnameh",
    sourceUrl: "https://github.com/font-store/GanjnamehFont",
    sourceDir: path.join(REPO_ROOT, "fonts/Ganjnameh"),
    installDir: "app/fonts/ganjnameh",
    files: [
      "GanjNamehSans-Regular.woff2",
      "font-face.css",
      "LICENSE",
      "OFL.txt",
    ],
    tags: ["فونت", "گنجنامه", "فارسی"],
  },
  {
    slug: "font-arad",
    title: "Arad FD",
    description:
      "Arad variable with Persian digits (OFL-1.1, Reserved Font Name Arad). Installs woff2 + LICENSE/OFL into app/fonts/arad for next/font/local.",
    docsPath: "/fonts/arad",
    sourceUrl: "https://github.com/MohamadDarvishi/Arad",
    sourceDir: path.join(REPO_ROOT, "fonts/Arad"),
    installDir: "app/fonts/arad",
    files: ["Arad-FD.woff2", "font-face.css", "LICENSE", "OFL.txt"],
    tags: ["فونت", "آراد", "فارسی"],
  },
  {
    slug: "font-unixel",
    title: "Unixel",
    description:
      "Unixel Regular (OFL-1.1). English–Arabic/Persian pixel typeface. Installs woff2 + LICENSE/OFL into app/fonts/unixel for next/font/local.",
    docsPath: "/fonts/unixel",
    sourceUrl: "https://github.com/MDarvishi5124/Unixel",
    sourceDir: path.join(REPO_ROOT, "fonts/Unixel"),
    installDir: "app/fonts/unixel",
    files: [
      "Unixel-Regular.woff2",
      "font-face.css",
      "LICENSE",
      "OFL.txt",
    ],
    tags: ["فونت", "یونیکسل", "پیکسلی", "فارسی"],
  },
  {
    slug: "font-sorena",
    title: "Sorena FD",
    description:
      "Sorena Normal + Pixel with Persian digits (OFL-1.1). Installs woff2 faces + LICENSE/OFL into app/fonts/sorena for next/font/local.",
    docsPath: "/fonts/sorena",
    sourceUrl: "https://github.com/MDarvishi5124/Sorena",
    sourceDir: path.join(REPO_ROOT, "fonts/Sorena"),
    installDir: "app/fonts/sorena",
    files: [
      "SorenaFD-Normal.woff2",
      "SorenaFD-Pixel.woff2",
      "font-face.css",
      "LICENSE",
      "OFL.txt",
    ],
    tags: ["فونت", "سورنا", "پیکسلی", "فارسی"],
  },
  {
    slug: "font-ario",
    title: "Ario FD",
    description:
      "Ario with Persian digits (OFL-1.1). Installs woff2 + LICENSE/OFL into app/fonts/ario for next/font/local.",
    docsPath: "/fonts/ario",
    sourceUrl: "https://github.com/MohamadDarvishi/Ario",
    sourceDir: path.join(REPO_ROOT, "fonts/Ario"),
    installDir: "app/fonts/ario",
    files: ["Ario-FD.woff2", "font-face.css", "LICENSE", "OFL.txt"],
    tags: ["فونت", "آریو", "فارسی"],
  },
  {
    slug: "font-normalsans",
    title: "AQ Normal Sans",
    description:
      "AQ Normal Sans variable (OFL-1.1, RFN AQ/AzadQalam). Vazir+Estedad blend. Installs woff2 + LICENSE/OFL into app/fonts/normalsans for next/font/local.",
    docsPath: "/fonts/normalsans",
    sourceUrl: "https://github.com/AzadQalam/normal-sans",
    sourceDir: path.join(REPO_ROOT, "fonts/NormalSans"),
    installDir: "app/fonts/normalsans",
    files: [
      "AQNormalSans-VF.woff2",
      "font-face.css",
      "LICENSE",
      "OFL.txt",
    ],
    tags: ["فونت", "نرمال", "فارسی"],
  },
  {
    slug: "font-sahel",
    title: "Sahel FD",
    description:
      "Sahel with Persian digits (OFL-1.1). Installs woff2 faces + LICENSE into app/fonts/sahel for next/font/local.",
    docsPath: "/fonts/sahel",
    sourceUrl: "https://github.com/rastikerdar/sahel-font",
    sourceDir: path.join(REPO_ROOT, "fonts/sahel/farsi-digits"),
    installDir: "app/fonts/sahel",
    files: [
      "Sahel-Light-FD.woff2",
      "Sahel-FD.woff2",
      "Sahel-SemiBold-FD.woff2",
      "Sahel-Bold-FD.woff2",
      "Sahel-Black-FD.woff2",
      "font-face.css",
      "LICENSE",
    ],
    tags: ["فونت", "ساحل", "فارسی"],
  },
  {
    slug: "font-parastoo",
    title: "Parastoo FD",
    description:
      "Parastoo with Persian digits (OFL-1.1). Installs woff2 faces + LICENSE into app/fonts/parastoo for next/font/local. Upstream repo is archived.",
    docsPath: "/fonts/parastoo",
    sourceUrl: "https://github.com/rastikerdar/parastoo-font",
    sourceDir: path.join(REPO_ROOT, "fonts/parastoo/farsi-digits"),
    installDir: "app/fonts/parastoo",
    files: [
      "Parastoo-FD.woff2",
      "Parastoo-Bold-FD.woff2",
      "font-face.css",
      "LICENSE",
    ],
    tags: ["فونت", "پرستو", "فارسی"],
  },
  {
    slug: "font-samim",
    title: "Samim FD",
    description:
      "Samim with Persian digits (OFL-1.1). Installs woff2 faces + LICENSE into app/fonts/samim for next/font/local. Upstream repo is archived.",
    docsPath: "/fonts/samim",
    sourceUrl: "https://github.com/rastikerdar/samim-font",
    sourceDir: path.join(REPO_ROOT, "fonts/samim/farsi-digits"),
    installDir: "app/fonts/samim",
    files: [
      "Samim-FD.woff2",
      "Samim-Medium-FD.woff2",
      "Samim-Bold-FD.woff2",
      "font-face.css",
      "LICENSE",
    ],
    tags: ["فونت", "صمیم", "فارسی"],
  },
  {
    slug: "font-shabnam",
    title: "Shabnam FD",
    description:
      "Shabnam with Persian digits (OFL-1.1). Installs woff2 faces + LICENSE into app/fonts/shabnam for next/font/local. Upstream repo is archived.",
    docsPath: "/fonts/shabnam",
    sourceUrl: "https://github.com/rastikerdar/shabnam-font",
    sourceDir: path.join(REPO_ROOT, "fonts/shabnam/farsi-digits"),
    installDir: "app/fonts/shabnam",
    files: [
      "Shabnam-Thin-FD.woff2",
      "Shabnam-Light-FD.woff2",
      "Shabnam-FD.woff2",
      "Shabnam-Medium-FD.woff2",
      "Shabnam-Bold-FD.woff2",
      "font-face.css",
      "LICENSE",
    ],
    tags: ["فونت", "شبنم", "فارسی"],
  },
  {
    slug: "font-tanha",
    title: "Tanha FD",
    description:
      "Tanha with Persian digits (Bitstream Vera + Apache-2.0 / public domain — not OFL). Installs woff2 + LICENSE into app/fonts/tanha for next/font/local. Upstream repo is archived.",
    docsPath: "/fonts/tanha",
    sourceUrl: "https://github.com/rastikerdar/tanha-font",
    sourceDir: path.join(REPO_ROOT, "fonts/tanha/farsi-digits"),
    installDir: "app/fonts/tanha",
    files: ["Tanha-FD.woff2", "font-face.css", "LICENSE"],
    tags: ["فونت", "تنها", "فارسی"],
  },
  {
    slug: "font-nahid",
    title: "Nahid FD",
    description:
      "Nahid with Persian digits (Bitstream Vera + Apache-2.0 / public domain — not OFL). Installs woff2 + LICENSE into app/fonts/nahid for next/font/local. Upstream repo is archived.",
    docsPath: "/fonts/nahid",
    sourceUrl: "https://github.com/rastikerdar/nahid-font",
    sourceDir: path.join(REPO_ROOT, "fonts/nahid/farsi-digits"),
    installDir: "app/fonts/nahid",
    files: ["Nahid-FD.woff2", "font-face.css", "LICENSE"],
    tags: ["فونت", "ناهید", "فارسی"],
  },
  {
    slug: "font-gandom",
    title: "Gandom FD",
    description:
      "Gandom with Persian digits (OFL-1.1). Installs woff2 + LICENSE into app/fonts/gandom for next/font/local. Upstream repo is archived.",
    docsPath: "/fonts/gandom",
    sourceUrl: "https://github.com/rastikerdar/gandom-font",
    sourceDir: path.join(REPO_ROOT, "fonts/gandom/farsi-digits"),
    installDir: "app/fonts/gandom",
    files: ["Gandom-FD.woff2", "font-face.css", "LICENSE"],
    tags: ["فونت", "گندم", "فارسی"],
  },
]

function isBinaryFontFile(filename: string) {
  return /\.(woff2|woff|ttf|otf)$/i.test(filename)
}

async function pathExists(filePath: string) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function buildFontItem(
  def: FontRegistryDefinition
): Promise<RegistryItem> {
  const files: RegistryFile[] = []

  for (const filename of def.files) {
    const absolute = path.join(def.sourceDir, filename)
    if (!(await pathExists(absolute))) {
      throw new Error(`Missing font file for ${def.slug}: ${absolute}`)
    }

    const binary = isBinaryFontFile(filename)
    const content = binary
      ? (await fs.readFile(absolute)).toString("base64")
      : await fs.readFile(absolute, "utf8")

    files.push({
      path: `fonts/${def.slug}/${filename}`,
      type: "registry:file",
      target: `${def.installDir}/${filename}`,
      content,
      ...(binary ? { encoding: "base64" as const } : {}),
    })
  }

  return {
    $schema: SCHEMA,
    name: def.slug,
    type: "registry:item",
    title: def.title,
    description: def.description,
    files,
    meta: {
      links: {
        docs: `https://farsiui.ir${def.docsPath}`,
        source: def.sourceUrl,
      },
      tags: def.tags,
    },
  }
}

export async function buildFontsRegistry() {
  const slugs = FONT_ITEMS.map((item) => item.slug)
  console.log(`\n🔤 Building fonts registry (${FONT_ITEMS.length} items)...`)
  await fs.mkdir(OUTPUT_DIR, { recursive: true })

  let written = 0
  for (const def of FONT_ITEMS) {
    const item = await buildFontItem(def)
    const outPath = path.join(OUTPUT_DIR, `${item.name}.json`)
    await fs.writeFile(outPath, `${JSON.stringify(item, null, 2)}\n`, "utf8")
    written += 1
    console.log(`   ✅ ${def.slug} (${item.files.length} files)`)
  }

  const slugsPath = path.join(ROOT, "lib/fonts/registry-slugs.ts")
  const slugsSource = `/** Auto-generated by scripts/build-fonts-registry.mts - do not edit. */
export const FONT_REGISTRY_SLUGS = new Set<string>(${JSON.stringify(slugs, null, 2)})
`
  await fs.writeFile(slugsPath, slugsSource, "utf8")

  console.log(`   Done: ${written} fonts → public/r/fonts/`)
  return { written, slugs }
}

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isMain) {
  buildFontsRegistry().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}
