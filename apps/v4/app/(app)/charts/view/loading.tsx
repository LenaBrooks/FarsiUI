/**
 * Detail navigation under ChartShell — soft stage only.
 * Avoids bubbling to charts/loading (generic page skeleton).
 */
export default function ChartsViewLoading() {
  return (
    <div
      className="flex min-h-0 flex-1 flex-col p-3 md:p-5"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">در حال بارگذاری</span>
      <div className="min-h-[280px] flex-1 animate-pulse rounded-xl bg-muted/30" />
    </div>
  )
}
