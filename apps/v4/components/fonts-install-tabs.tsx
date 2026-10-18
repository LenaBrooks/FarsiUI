"use client"

import { Fragment } from "react"

import { CopyButton } from "@/components/copy-button"
import { getIconForLanguageExtension } from "@/components/icons"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/new-york-v4/ui/tabs"

const docsTabsListClass =
  "justify-start gap-4 rounded-none bg-transparent px-0"

const docsTabsTriggerClass =
  "not-typeset rounded-none border-0 border-b-2 border-transparent bg-transparent px-0 pb-3 text-base text-muted-foreground hover:text-primary data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none! dark:data-[state=active]:border-primary dark:data-[state=active]:bg-transparent"

const docsTabsContentClass =
  "relative [&_h3.font-heading]:text-base [&_h3.font-heading]:font-medium *:[figure]:first:mt-0 [&>.steps]:mt-6"

const methodTabsListClass =
  "mb-4 h-9 w-fit justify-start gap-0 rounded-lg bg-muted p-1"

const methodTabsTriggerClass =
  "not-typeset h-7 rounded-md border-0 px-3 text-sm text-muted-foreground shadow-none data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"

export type HighlightedFontStep = {
  instruction: string
  title: string
  language: string
  code: string
  html: string
}

export type HighlightedFontVariant = {
  id: string
  label: string
  steps: HighlightedFontStep[]
}

export type HighlightedFontSnippet = {
  id: string
  label: string
  steps: HighlightedFontStep[]
  variants?: HighlightedFontVariant[]
}

function CodeFigure({
  title,
  language,
  code,
  html,
}: {
  title: string
  language: string
  code: string
  html: string
}) {
  return (
    <figure
      data-rehype-pretty-code-figure=""
      data-not-typeset=""
      className="[&_pre]:max-h-80 [&_pre]:overflow-auto [&_pre]:scrollbar-soft"
    >
      <figcaption
        data-rehype-pretty-code-title=""
        className="flex items-center gap-2 text-code-foreground [&_svg]:size-4 [&_svg]:text-code-foreground [&_svg]:opacity-70"
        data-language={language}
      >
        {getIconForLanguageExtension(language)}
        {title}
      </figcaption>
      <CopyButton value={code} />
      <div
        data-not-typeset=""
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  )
}

function InstallSteps({
  id,
  steps,
}: {
  id: string
  steps: HighlightedFontStep[]
}) {
  return (
    <div className="steps relative mb-0 pt-2 [counter-reset:step] md:ms-4 md:border-s md:ps-8 [&>h3]:step">
      {steps.map((step) => (
        <Fragment key={`${id}-${step.title}-${step.instruction}`}>
          <h3 className="font-heading text-base font-medium">
            {step.instruction}
          </h3>
          <CodeFigure
            title={step.title}
            language={step.language}
            code={step.code}
            html={step.html}
          />
        </Fragment>
      ))}
    </div>
  )
}

function SnippetBody({ snippet }: { snippet: HighlightedFontSnippet }) {
  const variants = snippet.variants

  if (variants && variants.length > 0) {
    const defaultVariant = variants[0].id

    return (
      <Tabs defaultValue={defaultVariant} dir="rtl" className="w-full">
        <div className="mb-1 text-sm text-muted-foreground">روش نصب را انتخاب کنید</div>
        <TabsList className={methodTabsListClass}>
          {variants.map((variant) => (
            <TabsTrigger
              key={variant.id}
              value={variant.id}
              className={methodTabsTriggerClass}
            >
              {variant.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {variants.map((variant) => (
          <TabsContent
            key={variant.id}
            value={variant.id}
            className={docsTabsContentClass}
          >
            <InstallSteps id={`${snippet.id}-${variant.id}`} steps={variant.steps} />
          </TabsContent>
        ))}
      </Tabs>
    )
  }

  return <InstallSteps id={snippet.id} steps={snippet.steps} />
}

export function FontInstallTabs({
  snippets,
}: {
  snippets: HighlightedFontSnippet[]
}) {
  const defaultValue = snippets[0]?.id ?? "link"

  return (
    <Tabs
      defaultValue={defaultValue}
      dir="rtl"
      className="relative mt-2 w-full *:data-[slot=tabs-list]:gap-6 [&_[data-rehype-pretty-code-figure]]:dir-ltr [&_pre]:dir-ltr"
    >
      <TabsList className={docsTabsListClass}>
        {snippets.map((snippet) => (
          <TabsTrigger
            key={snippet.id}
            value={snippet.id}
            className={docsTabsTriggerClass}
          >
            {snippet.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {snippets.map((snippet) => (
        <TabsContent
          key={snippet.id}
          value={snippet.id}
          className={docsTabsContentClass}
        >
          <SnippetBody snippet={snippet} />
        </TabsContent>
      ))}
    </Tabs>
  )
}
