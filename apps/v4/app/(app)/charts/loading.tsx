import { Loader2Icon } from "lucide-react"

export default function ChartsLoading() {
  return (
    <div
      dir="rtl"
      lang="fa"
      className="flex min-h-[50svh] w-full flex-1 items-center justify-center"
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
