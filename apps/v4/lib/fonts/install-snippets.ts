import {
  getCssFontFamily,
  getFontFaceCss,
  getFontLicenseId,
  getFontLicenseLabel,
  getFontLicenseRepoPath,
  getFontsCdnUrl,
  getFontStylesheetUrl,
  getFontWoff2Url,
  getNextFontConstName,
  getNextFontCssVar,
  getNextFontSubsets,
  hasFontCliInstall,
  isGoogleFont,
  isRepoFont,
  type FontCatalogItem,
} from "@/lib/fonts/catalog"

function getHtmlHeadLinks(stylesheetUrl: string, preconnectGoogle: boolean) {
  if (preconnectGoogle) {
    return `<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="${stylesheetUrl}" />`
  }
  return `<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin />
<link rel="stylesheet" href="${stylesheetUrl}" />`
}

function getBodyCss(family: string) {
  return `body {
  font-family: "${family}", ui-sans-serif, system-ui, sans-serif;
}`
}

function getNextGoogleLayoutCode(font: FontCatalogItem) {
  const constName = getNextFontConstName(font)
  const cssVar = getNextFontCssVar(font)
  const subsets = JSON.stringify(getNextFontSubsets(font))
  const weightLine =
    font.nextWeight === undefined
      ? ""
      : `  weight: ${JSON.stringify(font.nextWeight)},\n`

  return `import { ${font.nextImport} } from "next/font/google"

const ${constName} = ${font.nextImport}({
  subsets: ${subsets},
${weightLine}  variable: "${cssVar}",
  display: "swap",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={\`\${${constName}.variable} \${${constName}.className}\`}
    >
      <body className="antialiased">{children}</body>
    </html>
  )
}`
}

/** Relative to app/layout.tsx — next/font/local files live under app/fonts/<id>/. */
function getNextLocalFontSrc(font: FontCatalogItem) {
  const file = hasFontCliInstall(font)
    ? font.cliWoff2
    : isRepoFont(font)
      ? font.repoWoff2
      : `${font.id}.woff2`
  return `./fonts/${font.id}/${file}`
}

function getNextLocalFontTree(font: FontCatalogItem) {
  const files = hasFontCliInstall(font)
    ? (font.cliFiles?.length
        ? font.cliFiles
        : [font.cliWoff2, "OFL.txt"])
    : isRepoFont(font)
      ? font.repoFiles?.length
        ? font.repoFiles
        : [font.repoWoff2, "font-face.css", "LICENSE"]
      : [`${font.id}.woff2`, "OFL.txt"]

  const lines = files.map((name, i) => {
    const branch = i === files.length - 1 ? "└──" : "├──"
    return `        ${branch} ${name}`
  })
  return `app/
└── fonts/
    └── ${font.id}/
${lines.join("\n")}`
}

function getCssPublicFontTree(font: FontCatalogItem) {
  const file = isRepoFont(font) ? font.repoWoff2 : `${font.id}.woff2`
  if (isRepoFont(font)) {
    return `public/
└── fonts/
    └── ${font.id}/
        ├── ${file}
        └── LICENSE`
  }
  return `public/
└── fonts/
    └── ${font.id}/
        ├── ${file}
        └── OFL.txt`
}

function getNextLocalLayoutCode(font: FontCatalogItem) {
  const constName = getNextFontConstName(font)
  const cssVar = getNextFontCssVar(font)
  const cliWoff2s = hasFontCliInstall(font)
    ? (font.cliFiles ?? []).filter((f) => f.endsWith(".woff2"))
    : []

  const localFontConfig =
    cliWoff2s.length > 1
      ? `src: [
${cliWoff2s
  .map((file) => {
    const weight = /bold/i.test(file) ? "700" : "400"
    return `    { path: "./fonts/${font.id}/${file}", weight: "${weight}", style: "normal" },`
  })
  .join("\n")}
  ],
  variable: "${cssVar}",
  display: "swap",`
      : `src: "${getNextLocalFontSrc(font)}",
  variable: "${cssVar}",
  weight: "${font.cliWeight ?? "400"}",
  display: "swap",`

  return `import localFont from "next/font/local"

const ${constName} = localFont({
  ${localFontConfig}
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={\`\${${constName}.variable} \${${constName}.className}\`}
    >
      <body className="antialiased">{children}</body>
    </html>
  )
}`
}

/** Next.js layout that loads a repo font from jsDelivr (no local file). */
function getNextCdnLayoutCode(font: FontCatalogItem) {
  const family = getCssFontFamily(font)
  const stylesheetUrl = getFontStylesheetUrl(font)

  return `export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link
          rel="preconnect"
          href="https://cdn.jsdelivr.net"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href="${stylesheetUrl}" />
      </head>
      <body
        className="antialiased"
        style={{
          fontFamily: '"${family}", ui-sans-serif, system-ui, sans-serif',
        }}
      >
        {children}
      </body>
    </html>
  )
}`
}

function getNextFontCssFollowUp(font: FontCatalogItem) {
  const cssVar = getNextFontCssVar(font)
  return `@theme inline {
  --font-sans: var(${cssVar}), ui-sans-serif, system-ui, sans-serif;
}

body {
  font-family: var(${cssVar}), ui-sans-serif, system-ui, sans-serif;
}`
}

export type FontInstallStep = {
  instruction: string
  title: string
  language: string
  code: string
}

/** Mutually exclusive install method inside a tab (user picks one). */
export type FontInstallVariant = {
  id: string
  label: string
  steps: FontInstallStep[]
}

export type FontInstallTab = {
  id: "link" | "import" | "css" | "react" | "next"
  label: string
  /** Used when the tab has a single method. */
  steps: FontInstallStep[]
  /** When set, UI shows a picker; `steps` is ignored. */
  variants?: FontInstallVariant[]
}

export type FontInstallSnippetsResult = {
  tabs: FontInstallTab[]
}

export function getFontInstallSnippets(
  font: FontCatalogItem
): FontInstallSnippetsResult {
  const stylesheetUrl = getFontStylesheetUrl(font)
  const face = getFontFaceCss(font)
  const family = getCssFontFamily(font)
  const bodyCss = getBodyCss(family)
  const google = isGoogleFont(font)
  const headLinks = getHtmlHeadLinks(stylesheetUrl, google)
  const woff2Url = getFontWoff2Url(font)
  const licenseRepoPath = getFontLicenseRepoPath(font)
  const licenseCdnUrl = licenseRepoPath
    ? getFontsCdnUrl(licenseRepoPath)
    : null

  const licenseLabel = getFontLicenseLabel(font)
  const licenseId = getFontLicenseId(font)
  const repoCssInstruction =
    licenseId === "bitstream-vera"
      ? `فایل woff2 و LICENSE را از ریپو یا CDN کپی کنید و در public/fonts/${font.id}/ بگذارید. لایسنس Bitstream Vera است (نه OFL) — notice را نگه دارید؛ فروش جداگانهٔ فونت مجاز نیست.`
      : licenseId === "gpl-2.0"
        ? `فایل woff2 و LICENSE را از ریپو یا CDN کپی کنید و در public/fonts/${font.id}/ بگذارید. لایسنس GNU GPL v2 است (نه OFL) — متن COPYING/LICENSE را نگه دارید.`
        : licenseId === "font-store-free"
          ? `فایل woff2 و LICENSE را از ریپو یا CDN کپی کنید و در public/fonts/${font.id}/ بگذارید. لایسنس Free Licence خانه فونت است (نه OFL جدا) — notice را نگه دارید.`
          : licenseId === "irannastaliq-free"
            ? `فایل woff2 و LICENSE را از ریپو یا CDN کپی کنید و در public/fonts/${font.id}/ بگذارید. نسخهٔ رایگان ایران نستعلیق ۱/۲ است (نه نسخهٔ ۳ تجاری، نه OFL) — notice را نگه دارید.`
            : `فایل woff2 و LICENSE (OFL) را از ریپو یا CDN کپی کنید و در public/fonts/${font.id}/ بگذارید.`

  const cssDownloadStep: FontInstallStep = google
    ? {
        instruction: `از Google Fonts «Download family» را بزنید؛ فایل Regular (woff2) و OFL.txt را در public/fonts/${font.id}/ بگذارید.`,
        title: "public/fonts/",
        language: "plaintext",
        code: `${getCssPublicFontTree(font)}

# منبع دانلود:
# ${font.sourceUrl}
# لایسنس: OFL.txt داخل همان zip گوگل`,
      }
    : {
        instruction: repoCssInstruction,
        title: "public/fonts/",
        language: "plaintext",
        code: `${getCssPublicFontTree(font)}

# منبع:
# ${font.sourceUrl}
# لایسنس: ${licenseLabel}
# CDN فونت:
# ${woff2Url}
# CDN لایسنس:
# ${licenseCdnUrl}`,
      }

  const nextGoogleSteps: FontInstallStep[] = [
    {
      instruction:
        "فونت را با next/font/google لود کنید؛ variable برای توکن CSS و className برای اعمال فوری روی کل صفحه.",
      title: "app/layout.tsx",
      language: "tsx",
      code: getNextGoogleLayoutCode(font),
    },
    {
      instruction:
        "اختیاری — اگر className روی html کافی است رد شوید. در غیر این صورت برای توکن Tailwind از @theme و بدون Tailwind از body استفاده کنید.",
      title: "app/globals.css",
      language: "css",
      code: getNextFontCssFollowUp(font),
    },
  ]

  const nextCliSteps: FontInstallStep[] = [
    {
      instruction:
        "یک دستور — فایل‌های فونت و لایسنس در app/fonts کپی می‌شوند.",
      title: "Terminal",
      language: "bash",
      code: `npx farsiui@latest add font-${font.id}`,
    },
    {
      instruction: "ساختار بعد از add:",
      title: "app/fonts/",
      language: "plaintext",
      code: getNextLocalFontTree(font),
    },
    {
      instruction: "فونت را با next/font/local به layout وصل کنید.",
      title: "app/layout.tsx",
      language: "tsx",
      code: getNextLocalLayoutCode(font),
    },
    {
      instruction:
        "اختیاری — اگر className روی html کافی است رد شوید. در غیر این صورت برای توکن Tailwind از @theme و بدون Tailwind از body استفاده کنید.",
      title: "app/globals.css",
      language: "css",
      code: getNextFontCssFollowUp(font),
    },
  ]

  const nextTab: FontInstallTab = google
    ? hasFontCliInstall(font)
      ? {
          id: "next",
          label: "Next.js",
          steps: [],
          variants: [
            {
              id: "google",
              label: "Google",
              steps: nextGoogleSteps,
            },
            {
              id: "cli",
              label: "CLI",
              steps: nextCliSteps,
            },
          ],
        }
      : {
          id: "next",
          label: "Next.js",
          steps: nextGoogleSteps,
        }
    : {
        id: "next",
        label: "Next.js",
        steps: [],
        variants: [
          {
            id: "cli",
            label: "CLI",
            steps: nextCliSteps,
          },
          {
            id: "cdn",
            label: "CDN",
            steps: [
              {
                instruction:
                  "بدون دانلود: stylesheet را از jsDelivr در layout لود کنید.",
                title: "app/layout.tsx",
                language: "tsx",
                code: getNextCdnLayoutCode(font),
              },
            ],
          },
        ],
      }

  const linkTab: FontInstallTab = {
    id: "link",
    label: "Link",
    steps: [
      {
        instruction: google
          ? "در index.html داخل <head> اول preconnect بگذارید، بعد stylesheet."
          : "در index.html داخل <head> preconnect به jsDelivr و stylesheet را بگذارید.",
        title: "index.html",
        language: "html",
        code: headLinks,
      },
      {
        instruction: "در فایل CSS سراسری، فونت را روی body اعمال کنید.",
        title: "styles.css",
        language: "css",
        code: bodyCss,
      },
    ],
  }

  const reactTab: FontInstallTab = {
    id: "react",
    label: "React",
    steps: [
      {
        instruction:
          "در پروژه Vite یا CRA، فایل index.html را باز کنید و داخل <head> این لینک‌ها را بگذارید.",
        title: "index.html",
        language: "html",
        code: headLinks,
      },
      {
        instruction:
          "در CSS سراسری (مثلاً src/index.css) فونت را روی body بگذارید و همان فایل را در main.tsx / main.jsx import کنید.",
        title: "src/index.css",
        language: "css",
        code: bodyCss,
      },
      {
        instruction:
          "نیازی به style اینلاین نیست — متن کامپوننت‌ها از body ارث می‌برند.",
        title: "App.tsx",
        language: "tsx",
        code: `export function App() {
  return <p>سلام — نمونهٔ متن با ${font.nameFa}</p>
}`,
      },
    ],
  }

  const importTab: FontInstallTab = {
    id: "import",
    label: "Import",
    steps: [
      {
        instruction: google
          ? "برای سرعت بیشتر، در index.html این preconnectها را داخل <head> بگذارید."
          : "برای سرعت بیشتر، در index.html این preconnect را داخل <head> بگذارید.",
        title: "index.html",
        language: "html",
        code: google
          ? `<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />`
          : `<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin />`,
      },
      {
        instruction:
          "@import را در ابتدای فایل CSS بگذارید (قبل از هر قانون دیگر)، بعد font-family را تنظیم کنید.",
        title: "styles.css",
        language: "css",
        code: `@import url("${stylesheetUrl}");

${bodyCss}`,
      },
    ],
  }

  const cssTab: FontInstallTab = {
    id: "css",
    label: "CSS",
    steps: [
      cssDownloadStep,
      {
        instruction: "این @font-face را در CSS پروژه اضافه کنید.",
        title: "styles.css",
        language: "css",
        code: face,
      },
      {
        instruction: "فونت را روی body اعمال کنید.",
        title: "styles.css",
        language: "css",
        code: bodyCss,
      },
    ],
  }

  // Usage order for this docs audience: Next first, then quick CDN/HTML, then the rest.
  return {
    tabs: [nextTab, linkTab, reactTab, importTab, cssTab],
  }
}
