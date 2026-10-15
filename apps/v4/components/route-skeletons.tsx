import { cn } from "cn"

const pulse = "animate-pulse rounded-sm bg-muted-foreground/20"
const pulseMid = "animate-pulse rounded-sm bg-muted-foreground/30"
const pulseBold = "animate-pulse rounded-sm bg-muted-foreground/40"

/**
 * Shared App Router instant-loading UI.
 * Neutral — not a components/charts/blocks grid lookalike.
 */
export function RoutePageSkeleton({
  className,
}: {
  className?: string
}) {
  return (
    <div
      dir="rtl"
      lang="fa"
      className={cn(
        "mx-auto flex w-full max-w-3xl min-w-0 flex-1 flex-col gap-5 px-4 py-10 md:px-6",
        className
      )}
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">در حال بارگذاری</span>
      <div className={cn("h-7 w-40 max-w-[50%]", pulseBold)} />
      <div className="flex flex-col gap-2.5">
        <div className={cn("h-3.5 w-full", pulse)} />
        <div className={cn("h-3.5 w-[92%]", pulse)} />
        <div className={cn("h-3.5 w-[70%]", pulse)} />
      </div>
      <div className={cn("mt-2 h-44 w-full rounded-xl", pulseMid)} />
    </div>
  )
}

/** Plain muted fill for a chart plot area only (inside a chart card). */
export function ChartPlotSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex size-full flex-col justify-center gap-2 bg-transparent p-3",
        className
      )}
      aria-hidden
    >
      <div className={cn("h-2.5 w-1/3 rounded-md", pulseBold)} />
      <div className={cn("h-2 w-2/3 rounded-md", pulse)} />
      <div className={cn("mt-0.5 min-h-8 flex-1 rounded-md", pulseMid)} />
    </div>
  )
}

/** One chart card: toolbar row + plot (matches ChartDisplay). */
export function ChartCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border/80 bg-background">
      <div className="flex items-center gap-2 px-3 py-2.5">
        <div className={cn("size-3.5 shrink-0 rounded-sm", pulseMid)} />
        <div className={cn("h-3 w-20", pulseBold)} />
        <div className="ms-auto flex items-center gap-2">
          <div className={cn("h-6 w-6 rounded-md", pulse)} />
          <div className={cn("h-6 w-6 rounded-md", pulse)} />
        </div>
      </div>
      <div className="h-[460px] overflow-hidden rounded-xl border-t border-border/60">
        <ChartPlotSkeleton />
      </div>
    </div>
  )
}

/** Block category preview card (in-page only — not route loading). */
export function BlockPreviewCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 overflow-hidden rounded-xl border border-border/80 bg-background">
      <div className="flex items-center gap-2 px-3 py-2.5">
        <div className={cn("h-3.5 w-28", pulseBold)} />
        <div className="ms-auto flex items-center gap-2">
          <div className={cn("h-7 w-16 rounded-md", pulse)} />
          <div className={cn("h-7 w-7 rounded-md", pulse)} />
        </div>
      </div>
      <div className="mx-2 mb-2 h-[420px] overflow-hidden rounded-xl border border-border/80 bg-muted/40 md:h-[520px]">
        <div className="flex size-full items-center justify-center p-6 md:p-10">
          <div className="flex w-full max-w-sm flex-col gap-3">
            <div className={cn("mx-auto size-8 rounded-md", pulseMid)} />
            <div className={cn("mx-auto h-5 w-40", pulseBold)} />
            <div className={cn("mx-auto h-3 w-28", pulse)} />
            <div className={cn("mt-2 h-3 w-16", pulseMid)} />
            <div className={cn("h-9 w-full rounded-md", pulse)} />
            <div className={cn("h-9 w-full rounded-md", pulse)} />
            <div className={cn("h-9 w-full rounded-md", pulseBold)} />
          </div>
        </div>
      </div>
    </div>
  )
}
