import Link from "next/link"

import { FONTS_CATALOG } from "@/lib/fonts/catalog"

function specimenSrc(id: string, theme: "light" | "dark") {
  return `/font-gallery/${id}-${theme}.webp`
}

/** Fonts index gallery — specimen thumbs from `public/font-gallery`. */
export function FontGalleryTemp() {
  return (
    <div
      dir="rtl"
      lang="fa"
      className="mx-auto flex w-full max-w-180 min-w-0 flex-1 flex-col gap-6 px-4 py-6 text-foreground md:px-0 lg:gap-8 lg:py-8"
    >
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">معرفی فونت‌ها</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          روی هر ردیف کلیک کنید تا صفحهٔ همان فونت باز شود.
        </p>
      </header>

      <ul className="flex flex-col gap-3">
        {FONTS_CATALOG.map((font) => (
          <li key={font.id}>
            <Link
              href={`/fonts/${font.id}`}
              className="relative block overflow-hidden rounded-xl border border-border bg-card px-4 py-6 transition-colors hover:border-primary/40 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="pointer-events-none absolute top-3 left-3 z-10 text-xs text-muted-foreground/55">
                {font.nameFa}
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element -- local specimen thumbs */}
              <img
                src={specimenSrc(font.id, "light")}
                alt={font.nameFa}
                className="ms-0 me-auto block h-auto w-auto max-w-xl object-contain dark:hidden"
              />
              {/* eslint-disable-next-line @next/next/no-img-element -- local specimen thumbs */}
              <img
                src={specimenSrc(font.id, "dark")}
                alt={font.nameFa}
                className="ms-0 me-auto hidden h-auto w-auto max-w-xl object-contain dark:block"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
