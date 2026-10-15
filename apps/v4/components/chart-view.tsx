"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import { cn } from "cn"

import {
  getChartNextExample,
  type ChartExample,
} from "@/lib/chart-catalog"
import { ChartDemoPreview } from "@/components/chart-demo-preview"
import {
  ChartExportPngButton,
  ChartGridToggleButton,
  ChartLiveProvider,
  ChartRandomizeButton,
  ChartToolbarStart,
  chartGridHiddenClass,
  useChartGridBaselines,
  useChartHasGrid,
  useChartLive,
} from "@/components/chart-live"
import { CodeBlockCommand } from "@/components/code-block-command"
import { CodeTabs } from "@/components/code-tabs"
import { Button } from "@/registry/new-york-v4/ui/button"
import {
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/new-york-v4/ui/tabs"

/** Same tab chrome as docs MDX (دستور / دستی). */
const docsTabsListClass =
  "justify-start gap-4 rounded-none bg-transparent px-0"

const docsTabsTriggerClass =
  "not-typeset rounded-none border-0 border-b-2 border-transparent bg-transparent px-0 pb-3 text-base text-muted-foreground hover:text-primary data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none! dark:data-[state=active]:border-primary dark:data-[state=active]:bg-transparent"

const docsTabsContentClass =
  "relative [&_h3.font-heading]:text-base [&_h3.font-heading]:font-medium *:[figure]:first:mt-0 [&>.steps]:mt-6"

function DocsHeading({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) {
  return (
    <h2 id={id}>
      <a className="group no-underline" href={`#${id}`}>
        <span className="underline-offset-4 group-hover:underline">
          {children}
        </span>
        <span
          aria-hidden="true"
          className="ms-2 text-muted-foreground opacity-0 group-hover:opacity-100"
        >
          #
        </span>
      </a>
    </h2>
  )
}

function ChartViewStage({ exampleId }: { exampleId: string }) {
  const live = useChartLive()
  const stageRef = React.useRef<HTMLDivElement>(null)
  const hasGrid = useChartHasGrid(stageRef, [exampleId])
  useChartGridBaselines(stageRef, hasGrid ? live?.showGrid : true)

  return (
    <div
      ref={stageRef}
      data-chart-stage=""
      className={cn(
        "overflow-visible rounded-xl border border-border/60 bg-muted/20",
        hasGrid ? chartGridHiddenClass(live?.showGrid) : undefined
      )}
    >
      <div className="flex min-h-9 items-center gap-2 border-b border-border/40 px-2.5 py-1">
        <ChartToolbarStart />
        <div className="ms-auto flex shrink-0 items-center gap-0.5">
          {hasGrid ? <ChartGridToggleButton /> : null}
          <ChartExportPngButton
            containerRef={stageRef}
            filename={exampleId}
          />
          <ChartRandomizeButton />
        </div>
      </div>
      <div className="flex items-center justify-center p-4 md:p-6">
        <ChartDemoPreview id={exampleId} />
      </div>
    </div>
  )
}

export function ChartView({
  example,
  sourceFigure,
  usageFigures,
  embedded = false,
}: {
  example: ChartExample
  sourceFigure: React.ReactNode
  usageFigures: React.ReactNode
  /** Render inside gallery shell (no full-page chrome). */
  embedded?: boolean
}) {
  const addCommand = `farsiui@latest add ${example.id}`
  const backHref = `/charts#chart-type-${example.category}`
  const nextExample = getChartNextExample(example.id)

  return (
    <div
      dir="rtl"
      lang="fa"
      data-slot="docs"
      data-docs-kind="chart-view"
      className={cn(
        "flex flex-col bg-background text-foreground",
        embedded ? "min-h-0" : "min-h-svh"
      )}
    >
      <header
        className={cn(
          "flex shrink-0 flex-wrap items-center gap-2 border-b border-border/60",
          embedded ? "px-3 py-2.5 md:px-5" : "px-4 py-3 md:px-6"
        )}
      >
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 px-2 text-muted-foreground"
        >
          <Link href={backHref}>
            <ArrowRightIcon className="size-3.5" />
            بازگشت
          </Link>
        </Button>

        <div className="mx-1 hidden h-4 w-px bg-border sm:block" />

        <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
          <h1 className="max-w-full truncate text-base font-semibold tracking-tight md:text-lg">
            {example.title}
          </h1>
          {example.en ? (
            <span
              dir="ltr"
              lang="en"
              className="max-w-full truncate font-sans text-xs text-muted-foreground"
            >
              {example.en}
            </span>
          ) : null}
        </div>

        {nextExample ? (
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="ms-2 h-8 shrink-0 gap-1.5 px-2 text-muted-foreground me-0.5"
          >
            <Link href={`/charts/view/${nextExample.id}`}>
              بعدی
              <ArrowLeftIcon className="size-3.5" />
            </Link>
          </Button>
        ) : null}
      </header>

      <main
        className={cn(
          "mx-auto w-full max-w-3xl min-w-0 flex-1",
          embedded
            ? "px-3 pt-5 pb-16 md:px-5 md:pt-6 md:pb-20"
            : "px-4 pt-6 pb-20 md:px-6 md:pt-8 md:pb-28"
        )}
      >
        <ChartLiveProvider>
          <ChartViewStage exampleId={example.id} />
        </ChartLiveProvider>

        <div className="typeset mt-10">
          <DocsHeading id="نصب">نصب</DocsHeading>

          <CodeTabs>
            <TabsList className={docsTabsListClass}>
              <TabsTrigger value="cli" className={docsTabsTriggerClass}>
                دستور
              </TabsTrigger>
              <TabsTrigger value="manual" className={docsTabsTriggerClass}>
                دستی
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cli" className={docsTabsContentClass}>
              <figure
                data-rehype-pretty-code-figure=""
                data-not-typeset=""
                className="relative"
              >
                <CodeBlockCommand
                  __npm__={`npx ${addCommand}`}
                  __pnpm__={`pnpm dlx ${addCommand}`}
                  __yarn__={`yarn dlx ${addCommand}`}
                  __bun__={`bunx --bun ${addCommand}`}
                />
              </figure>
            </TabsContent>

            <TabsContent value="manual" className={docsTabsContentClass}>
              <div
                className={cn(
                  "steps relative mb-0 pt-2 [counter-reset:step] md:ms-4 md:border-s md:ps-8 [&>h3]:step"
                )}
              >
                <h3 className="font-heading text-base font-medium">
                  کد زیر را در پروژه خود قرار دهید.
                </h3>
                {sourceFigure}
                <h3 className="font-heading text-base font-medium">
                  مسیرهای import را متناسب با ساختار پروژه خود تنظیم کنید.
                </h3>
              </div>
            </TabsContent>
          </CodeTabs>

          <DocsHeading id="استفاده">استفاده</DocsHeading>
          <div className="min-w-0 max-w-full space-y-4 *:[figure]:first:mt-0">
            {usageFigures}
          </div>
        </div>
      </main>
    </div>
  )
}
