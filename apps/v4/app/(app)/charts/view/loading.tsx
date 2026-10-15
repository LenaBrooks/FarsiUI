import { Loader2Icon } from "lucide-react"

/**
 * Detail navigation under ChartShell — small spinner only.
 * Avoids bubbling to charts/loading.
 */
export default function ChartsViewLoading() {
  return (
    <div
      className="flex min-h-0 flex-1 flex-col items-center justify-center p-3 md:p-5"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">در حال بارگذاری</span>
      <Loader2Icon
        className="size-5 animate-spin text-muted-foreground/50"
        aria-hidden
      />
    </div>
  )
}
