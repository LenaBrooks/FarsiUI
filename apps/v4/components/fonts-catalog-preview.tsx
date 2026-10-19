import Link from "next/link"

import { FontSpecimenPreview } from "@/components/font-specimen-preview"
import {
  FontInstallTabs,
  type HighlightedFontSnippet,
} from "@/components/fonts-install-tabs"
import { highlightCode } from "@/lib/highlight-code"
import type { FontCatalogItem } from "@/lib/fonts/catalog"
import { getFontInstallSnippets } from "@/lib/fonts/install-snippets"
import { Button } from "@/registry/new-york-v4/ui/button"

async function highlightSteps(
  steps: { instruction: string; title: string; language: string; code: string }[]
) {
  return Promise.all(
    steps.map(async (step) => ({
      instruction: step.instruction,
      title: step.title,
      language: step.language,
      code: step.code,
      html: await highlightCode(step.code, step.language),
    }))
  )
}

async function buildHighlightedSnippets(
  font: FontCatalogItem
): Promise<HighlightedFontSnippet[]> {
  const { tabs } = getFontInstallSnippets(font)
  return Promise.all(
    tabs.map(async (tab) => {
      if (tab.variants?.length) {
        return {
          id: tab.id,
          label: tab.label,
          steps: [],
          variants: await Promise.all(
            tab.variants.map(async (variant) => ({
              id: variant.id,
              label: variant.label,
              steps: await highlightSteps(variant.steps),
            }))
          ),
        }
      }

      return {
        id: tab.id,
        label: tab.label,
        steps: await highlightSteps(tab.steps),
      }
    })
  )
}

/** Detail panel for one font — sidebar lives in the layout. */
export async function FontCatalogDetail({ font }: { font: FontCatalogItem }) {
  const snippets = await buildHighlightedSnippets(font)

  return (
    <div
      data-slot="docs"
      data-docs-kind="component"
      dir="rtl"
      lang="fa"
      className="mx-auto flex w-full max-w-160 min-w-0 flex-1 flex-col gap-6 px-4 py-6 text-foreground md:px-0 lg:gap-8 lg:py-8"
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            href={font.demoUrl}
            target="_blank"
            rel="noreferrer"
            className="docs-page-title scroll-m-24 font-semibold tracking-tight outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
          >
            {font.nameFa}
          </Link>
          <p
            className="mt-0.5 text-[length:var(--docs-small)] leading-normal text-muted-foreground"
            dir="ltr"
          >
            {font.nameEn}
          </p>
        </div>
        <Button asChild size="sm" variant="outline" className="shrink-0">
          <Link href={font.sourceUrl} target="_blank" rel="noreferrer">
            منبع
          </Link>
        </Button>
      </header>

      <FontSpecimenPreview key={font.id} font={font} />

      <div className="typeset mt-6 w-full min-w-0 flex-1 sm:mt-10">
        <h2 id="نصب">نصب</h2>
        <div data-not-typeset="" className="not-typeset min-w-0">
          <FontInstallTabs snippets={snippets} />
        </div>
      </div>
    </div>
  )
}
