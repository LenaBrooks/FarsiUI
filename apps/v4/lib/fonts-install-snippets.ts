import {
  getCssFontFamily,
  getFontFaceCss,
  getFontStylesheetUrl,
  getFontWoff2Url,
  getNextFontConstName,
  getNextFontCssVar,
  getNextFontSubsets,
  isGoogleFont,
  isRepoFont,
  type FontCatalogItem,
} from "@/lib/fonts-catalog"

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

function getNextLocalLayoutCode(font: FontCatalogItem) {
  const constName = getNextFontConstName(font)
  const cssVar = getNextFontCssVar(font)
  const file = isRepoFont(font) ? font.repoWoff2 : `${font.id}.woff2`

  return `import localFont from "next/font/local"

const ${constName} = localFont({
  src: "../public/fonts/${file}",
  variable: "${cssVar}",
  weight: "400",
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
  return `/* اگر در layout از className استفاده کرده‌اید، فونت از قبل روی کل صفحه است. */

/* Tailwind v4 — توکن font-sans */
@theme inline {
  --font-sans: var(${cssVar}), ui-sans-serif, system-ui, sans-serif;
}

/* بدون Tailwind — فقط variable روی html */
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

export function getFontInstallSnippets(font: FontCatalogItem): FontInstallTab[] {
  const stylesheetUrl = getFontStylesheetUrl(font)
  const face = getFontFaceCss(font)
  const family = getCssFontFamily(font)
  const bodyCss = getBodyCss(family)
  const google = isGoogleFont(font)
  const repo = isRepoFont(font)
  const headLinks = getHtmlHeadLinks(stylesheetUrl, google)
  const woff2Url = getFontWoff2Url(font)
  const publicFile = repo ? font.repoWoff2 : `${font.id}.woff2`

  const cssDownloadStep: FontInstallStep = google
    ? {
        instruction: `از صفحهٔ فونت در Google Fonts «Download family» را بزنید، فایل Regular (woff2) را در public/fonts/${publicFile} بگذارید.`,
        title: "public/fonts/",
        language: "plaintext",
        code: `public/
└── fonts/
    └── ${publicFile}

# منبع دانلود:
# ${font.sourceUrl}`,
      }
    : {
        instruction: `فایل woff2 را از ریپوی منبع یا از CDN کپی کنید و در public/fonts بگذارید.`,
        title: "public/fonts/",
        language: "plaintext",
        code: `public/
└── fonts/
    └── ${publicFile}

# منبع:
# ${font.sourceUrl}
# CDN:
# ${woff2Url}`,
      }

  return [
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    google
      ? {
          id: "next" as const,
          label: "Next.js",
          steps: [
            {
              instruction:
                "فونت را با next/font/google لود کنید؛ variable برای توکن CSS و className برای اعمال فوری روی کل صفحه.",
              title: "app/layout.tsx",
              language: "tsx",
              code: getNextGoogleLayoutCode(font),
            },
            {
              instruction:
                "اختیاری: برای Tailwind یا توکن --font-sans این را به globals.css اضافه کنید. اگر فقط className کافی است، از این قدم رد شوید.",
              title: "app/globals.css",
              language: "css",
              code: getNextFontCssFollowUp(font),
            },
          ],
        }
      : {
          id: "next" as const,
          label: "Next.js",
          steps: [],
          variants: [
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
            {
              id: "local",
              label: "لوکال",
              steps: [
                {
                  instruction: `فایل ${publicFile} را در public/fonts بگذارید (از ریپو یا CDN).`,
                  title: "public/fonts/",
                  language: "plaintext",
                  code: `public/fonts/${publicFile}

# ${woff2Url}`,
                },
                {
                  instruction:
                    "فونت را با next/font/local لود کنید؛ variable و className را روی html بگذارید.",
                  title: "app/layout.tsx",
                  language: "tsx",
                  code: getNextLocalLayoutCode(font),
                },
                {
                  instruction:
                    "اختیاری: برای Tailwind یا توکن --font-sans این را به globals.css اضافه کنید.",
                  title: "app/globals.css",
                  language: "css",
                  code: getNextFontCssFollowUp(font),
                },
              ],
            },
          ],
        },
  ]
}
