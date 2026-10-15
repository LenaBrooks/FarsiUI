import { ChartCardSkeleton } from "@/components/route-skeletons"

export default function ChartsLoading() {
  return (
    <div
      dir="rtl"
      lang="fa"
      className="mx-auto w-full max-w-6xl px-4 pb-8 md:px-6"
      aria-hidden
    >
      <div className="grid flex-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ChartCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
