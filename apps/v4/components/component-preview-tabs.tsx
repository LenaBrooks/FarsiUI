"use client"
import { Eye } from "lucide-react"

import * as React from "react"
import { cn } from "cn"
import { I18nProvider } from "react-aria-components"

import { ComponentSourceLazy } from "@/components/component-source-lazy"
import { useDesignSystemPreview } from "@/components/design-system-preview"
import { ExampleDependencies } from "@/components/example-dependencies"
import {
  LanguageProvider,
  useTranslation,
  type Translations,
} from "@/components/language-selector"
import {
  PreviewThemeIframe,
  PreviewThemeScope,
} from "@/components/preview-theme-scope"
import { DirectionProvider as BaseDirectionProvider } from "@/registry/bases/base/ui/direction"
import { DirectionProvider as RadixDirectionProvider } from "@/registry/bases/radix/ui/direction"
import { Button } from "@/registry/new-york-v4/ui/button"

export function ComponentPreviewTabs({
  className,
  previewClassName,
  align = "center",
  hideCode = false,
  chromeLessOnMobile = false,
  name,
  component,
  source,
  dependencies,
  highlightedCommands,
  direction = "ltr",
  styleName,
  ...props
}: React.ComponentProps<"div"> & {
  previewClassName?: string
  align?: "center" | "start" | "end"
  hideCode?: boolean
  chromeLessOnMobile?: boolean
  /** Demo/registry item name — used to load the active Design System bake. */
  name?: string
  /** Inline preview node when `name` is absent (non-iframe embeds). */
  component?: React.ReactNode
  /** @deprecated Prefer lazy full source via `name` after expand. */
  source?: React.ReactNode
  dependencies?: string[]
  highlightedCommands?: React.ComponentProps<
    typeof ExampleDependencies
  >["highlightedCommands"]
  direction?: "ltr" | "rtl"
  styleName?: string
}) {
  const [isMobileCodeVisible, setIsMobileCodeVisible] = React.useState(false)
  const { styleName: designSystemStyleName } = useDesignSystemPreview()
  const previewStyleName = designSystemStyleName || styleName || "base-nova"
  const base = previewStyleName.match(/^(base|radix|aria)-/)?.[1] || "base"
  const useInstallablePreview = Boolean(name)

  return (
    <div className="mt-4 mb-12">
      <div
        data-slot="component-preview"
        dir={direction}
        className={cn(
          "group relative flex flex-col overflow-hidden rounded-2xl border",
          className
        )}
        {...props}
      >
        {useInstallablePreview ? (
          <div
            data-slot="preview"
            dir={direction}
            data-chromeless={chromeLessOnMobile}
            className={cn(
              // Absolute iframe fills the host; height must stay definite.
              "relative w-full overflow-hidden data-[chromeless=true]:h-auto",
              chromeLessOnMobile ? "h-auto min-h-56" : "h-72",
              iframePreviewClassName(previewClassName)
            )}
          >
            <PreviewThemeIframe
              src={`/view/${previewStyleName}/${name}?embed=1`}
              className="absolute inset-0 size-full border-0"
            />
          </div>
        ) : direction === "rtl" ? (
          <LanguageProvider defaultLanguage="ar">
            <PreviewWrapper
              align={align}
              chromeLessOnMobile={chromeLessOnMobile}
              previewClassName={previewClassName}
              styleName={previewStyleName}
            >
              <DirectionProviderWrapper base={base}>
                {component}
              </DirectionProviderWrapper>
            </PreviewWrapper>
          </LanguageProvider>
        ) : (
          <DirectionProviderWrapper base={base} dir="ltr">
            <PreviewWrapper
              align={align}
              chromeLessOnMobile={chromeLessOnMobile}
              previewClassName={previewClassName}
              styleName={previewStyleName}
              dir="ltr"
            >
              {component}
            </PreviewWrapper>
          </DirectionProviderWrapper>
        )}
        {!hideCode && (
          <div
            data-slot="code"
            data-not-typeset
            data-mobile-code-visible={isMobileCodeVisible}
            className="relative overflow-hidden border-t **:data-[slot=copy-button]:top-3 **:data-[slot=copy-button]:right-3 **:data-[slot=copy-button]:hidden data-[mobile-code-visible=true]:**:data-[slot=copy-button]:flex [&_[data-rehype-pretty-code-figure]]:m-0! [&_[data-rehype-pretty-code-figure]]:rounded-none"
          >
            {isMobileCodeVisible ? (
              <div dir="ltr" className="relative max-h-72 overflow-auto">
                {name ? (
                  <ComponentSourceLazy
                    name={name}
                    styleName={previewStyleName}
                    collapsible={false}
                  />
                ) : (
                  <>{source}</>
                )}
              </div>
            ) : (
              <div className="relative flex h-16 items-center justify-center bg-muted/20">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="relative z-10 cursor-pointer gap-1.5 rounded-lg border border-border bg-background font-sans text-foreground shadow-none hover:bg-muted dark:bg-background dark:text-foreground dark:hover:bg-muted"
                  onClick={() => {
                    setIsMobileCodeVisible(true)
                  }}
                >
                  <Eye className="size-4" />
                  مشاهده کد
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      <ExampleDependencies
        dependencies={dependencies}
        highlightedCommands={highlightedCommands}
      />
    </div>
  )
}

/**
 * MDX often passes `h-auto! min-h-0 p-*` meant for inline demos.
 * Absolute iframe hosts ignore padding/flex align and collapse on h-auto —
 * keep only real height utilities (e.g. h-96).
 */
function iframePreviewClassName(previewClassName?: string) {
  if (!previewClassName) return undefined
  const kept = previewClassName.split(/\s+/).filter((token) => {
    if (!token) return false
    if (
      token === "h-auto" ||
      token === "h-auto!" ||
      token === "min-h-0" ||
      token === "min-h-0!"
    ) {
      return false
    }
    if (/^(p|px|py|pt|pb|ps|pe|pl|pr|items|justify)-/.test(token)) {
      return false
    }
    return true
  })
  return kept.length ? kept.join(" ") : undefined
}

const directionTranslations: Translations<Record<string, never>> = {
  en: {
    dir: "ltr",
    values: {},
  },
  ar: {
    dir: "rtl",
    values: {},
  },
  he: {
    dir: "rtl",
    values: {},
  },
}

function PreviewWrapper({
  align,
  chromeLessOnMobile,
  previewClassName,
  styleName,
  dir: explicitDir,
  children,
}: {
  align: "center" | "start" | "end"
  chromeLessOnMobile: boolean
  previewClassName?: string
  styleName?: string
  dir?: "ltr" | "rtl"
  children: React.ReactNode
}) {
  // useTranslation handles the case when there's no LanguageProvider context.
  // It will fall back to local state with defaultLanguage.
  const translation = useTranslation(directionTranslations, "ar")
  const dir = explicitDir ?? translation.dir

  // Digit style is independent of direction: keep fa so LTR phone fields
  // can still show Persian digits unless explicitly opted out.
  const lang = "fa"

  return (
    <div data-slot="preview" dir={dir} lang={lang} data-lang={lang}>
      <PreviewThemeScope styleName={styleName}>
        <div
          data-align={align}
          data-chromeless={chromeLessOnMobile}
          className={cn(
            "preview relative flex h-72 w-full justify-center p-10 data-[align=center]:items-center data-[align=end]:items-start data-[align=start]:items-start data-[chromeless=true]:h-auto data-[chromeless=true]:p-0 sm:data-[align=end]:items-end",
            previewClassName
          )}
        >
          {children}
        </div>
      </PreviewThemeScope>
    </div>
  )
}

function DirectionProviderWrapper({
  base,
  dir: explicitDir,
  children,
}: {
  base?: string
  dir?: "ltr" | "rtl"
  children: React.ReactNode
}) {
  // useTranslation handles the case when there's no LanguageProvider context.
  // It will fall back to local state with defaultLanguage.
  const translation = useTranslation(directionTranslations, "ar")
  const dir = explicitDir ?? translation.dir

  if (base === "base") {
    return (
      <BaseDirectionProvider direction={dir}>{children}</BaseDirectionProvider>
    )
  }

  if (base === "aria") {
    return (
      <I18nProvider
        locale={
          explicitDir === "ltr"
            ? "en"
            : (translation.locale ?? translation.language)
        }
      >
        {children}
      </I18nProvider>
    )
  }

  return <RadixDirectionProvider dir={dir}>{children}</RadixDirectionProvider>
}
