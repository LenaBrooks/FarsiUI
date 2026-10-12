import type { Metadata } from "next"
import { cookies, headers } from "next/headers"
import { cn } from "cn"
import { NuqsAdapter } from "nuqs/adapters/next/app"

import { getMetadataBase, META_THEME_COLORS, siteConfig } from "@/lib/config"
import {
  ACTIVE_THEME_BOOTSTRAP_SCRIPT,
  ACTIVE_THEME_COOKIE,
  normalizeActiveTheme,
} from "@/lib/active-theme"
import {
  DESIGN_SYSTEM_BOOTSTRAP_SCRIPT,
  DESIGN_SYSTEM_COOKIE,
  DESIGN_SYSTEM_STYLE_CLASS,
  normalizeDesignSystemId,
} from "@/lib/design-system"
import { DOCS_SIDEBAR_SCROLL_RESTORE_SCRIPT } from "@/lib/docs-sidebar-scroll"
import {
  fontVariables,
  getUiFontStyle,
  normalizeUiFontId,
  UI_FONT_BOOTSTRAP_SCRIPT,
  UI_FONT_COOKIE,
} from "@/lib/fonts"
import { ActiveThemeProvider } from "@/components/active-theme"
import { Analytics } from "@/components/analytics"
import { DesignSystemPreviewProvider } from "@/components/design-system-preview"
import { DesignSystemStyles } from "@/components/design-system-styles"
import { FontPreviewProvider } from "@/components/font-preview"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/registry/bases/radix/ui/sonner"
import { TooltipProvider as RadixTooltipProvider } from "@/registry/bases/radix/ui/tooltip"

import "@/app/globals.css"
/* Default design system only — other picker recipes load on demand. */
import "@/app/styles/chunk-nova.css"

export async function generateMetadata(): Promise<Metadata> {
  const metadataBase = getMetadataBase(await headers())

  return {
    title: {
      default: siteConfig.name,
      template: `%s · ${siteConfig.name}`,
    },
    metadataBase,
    description: siteConfig.description,
    keywords: [
      "Next.js",
      "React",
      "Tailwind CSS",
      "Components",
      "FarsiUI",
      "RTL",
      "Persian",
    ],
    authors: [
      {
        name: "FarsiUI",
        url: siteConfig.links.github,
      },
    ],
    creator: "FarsiUI",
    openGraph: {
      type: "website",
      locale: "fa_IR",
      url: siteConfig.url,
      title: siteConfig.name,
      description: siteConfig.description,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.name,
      description: siteConfig.description,
      images: [siteConfig.ogImage],
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/farsiui/favicon.png", type: "image/png" },
      ],
      shortcut: "/farsiui/favicon.png",
      apple: "/apple-touch-icon.png",
    },
    // Relative path keeps this same-origin (avoids localhost loopback permission prompts).
    manifest: "/site.webmanifest",
    alternates: {
      types: {
        "application/rss+xml": "/rss.xml",
      },
    },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const headerStore = await headers()
  // proxy.ts forwards Cookie → x-* when root layout does not see Cookie.
  const initialDesignSystem = normalizeDesignSystemId(
    headerStore.get("x-design-system-preview") ??
      cookieStore.get(DESIGN_SYSTEM_COOKIE)?.value
  )
  const initialFontId = normalizeUiFontId(
    headerStore.get("x-ui-font-preview") ??
      cookieStore.get(UI_FONT_COOKIE)?.value
  )
  const initialActiveTheme = normalizeActiveTheme(
    headerStore.get("x-active-theme") ??
      cookieStore.get(ACTIVE_THEME_COOKIE)?.value
  )
  const styleRootClass = DESIGN_SYSTEM_STYLE_CLASS[initialDesignSystem]
  const themeClass = `theme-${initialActiveTheme}`

  const extraFontClass =
    initialFontId !== "estedad"
      ? (await import("@/lib/fonts-extras")).getExtraUiFontClassName(
          initialFontId
        )
      : undefined

  return (
    <html
      lang="fa"
      suppressHydrationWarning
      className={cn(
        fontVariables,
        extraFontClass,
        "font-sans",
        "[--header-height:calc(var(--spacing)*14)] lg:[--header-height:calc(var(--spacing)*16)]"
      )}
      style={getUiFontStyle(initialFontId)}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: DOCS_SIDEBAR_SCROLL_RESTORE_SCRIPT,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
                }
              } catch (_) {}
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: UI_FONT_BOOTSTRAP_SCRIPT,
          }}
        />
        <meta name="theme-color" content={META_THEME_COLORS.light} />
      </head>
      <body
        suppressHydrationWarning
        className={cn(
          "group/body font-sans antialiased [--footer-height:calc(var(--spacing)*14)] xl:[--footer-height:calc(var(--spacing)*24)]",
          styleRootClass,
          themeClass,
          initialActiveTheme.endsWith("-scaled") && "theme-scaled"
        )}
      >
        <DesignSystemStyles id={initialDesignSystem} />
        {/* Sync localStorage → body classes before first paint (body exists here). */}
        <script
          dangerouslySetInnerHTML={{
            __html: DESIGN_SYSTEM_BOOTSTRAP_SCRIPT,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: ACTIVE_THEME_BOOTSTRAP_SCRIPT,
          }}
        />
        {/* Dark toggle works before React hydrates the header ModeSwitcher. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                document.addEventListener('click', function (e) {
                  if (window.__modeSwitchHydrated) return;
                  var btn = e.target && e.target.closest && e.target.closest('[data-mode-switch]');
                  if (!btn) return;
                  e.preventDefault();
                  e.stopPropagation();
                  var root = document.documentElement;
                  var next = root.classList.contains('dark') ? 'light' : 'dark';
                  root.classList.remove('light', 'dark');
                  root.classList.add(next);
                  root.style.colorScheme = next;
                  try { localStorage.setItem('theme', next); } catch (_) {}
                  var meta = document.querySelector('meta[name="theme-color"]');
                  if (meta) meta.setAttribute('content', next === 'dark' ? '${META_THEME_COLORS.dark}' : '${META_THEME_COLORS.light}');
                }, true);
              } catch (_) {}
            `,
          }}
        />
        <ThemeProvider>
          <ActiveThemeProvider initialTheme={initialActiveTheme}>
            <DesignSystemPreviewProvider
              initialDesignSystem={initialDesignSystem}
            >
              <FontPreviewProvider initialFontId={initialFontId}>
                <NuqsAdapter>
                  <RadixTooltipProvider delayDuration={0}>
                    {children}
                    <Toaster position="top-center" dir="rtl" />
                  </RadixTooltipProvider>
                </NuqsAdapter>
                <TailwindIndicator />
                <Analytics />
              </FontPreviewProvider>
            </DesignSystemPreviewProvider>
          </ActiveThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
