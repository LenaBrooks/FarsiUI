"use client"

import { Loader2Icon } from "lucide-react"
import * as React from "react"

import { toPersianDigits } from "@/lib/digits"
import {
  getCssFontFamily,
  getFontSpecimenFaceCss,
  getFontSpecimenLocalCssUrl,
  getFontSpecimenStylesheetUrl,
  getFontSpecimenWeights,
  type FontCatalogItem,
} from "@/lib/fonts/catalog"
import { cn } from "cn"

const DEFAULT_FA = `زبان فارسی فقط واژه‌ها نیست؛ راهی است برای گفتن دقیق‌تر، دیدن روشن‌تر، و ساختن چیزهایی که به کار آدم‌ها بیاید.
وقتی متن خوانا باشد، فکر هم راحت‌تر پیش می‌رود: در رابط کاربری، در مقاله، و در پیام کوتاه روزمره.
۱۲۳۴۵۶۷۸۹۰ · ۰٫۲۵ · ۹۹٬۰۰۰ تومان`

const DEFAULT_EN = `The quick brown fox jumps over the lazy dog.`

const STYLE_ID = "font-specimen-face"
const LINK_ID = "font-specimen-stylesheet"

/** Fixed specimen frame — content scrolls when larger sizes overflow. */
const SPECIMEN_FRAME_CLASS = "h-64 sm:h-72"

/** Keep spinner visible long enough to paint (cached fonts resolve in one tick). */
const LOADING_MIN_MS = 240

/** Discrete test sizes (px). Default matches docs body (16). */
const SPECIMEN_SIZES = [16, 18, 20, 24, 32] as const
const SIZE_DEFAULT = 16

function defaultSpecimenSize() {
  return SIZE_DEFAULT
}

const fieldClass = cn(
  "w-full resize-none border-0 bg-transparent px-4 shadow-none sm:px-5",
  "wrap-break-word outline-none focus-visible:ring-0"
)

const chipClass = cn(
  "h-7 cursor-pointer rounded-md px-2.5 text-sm tabular-nums transition-colors disabled:cursor-wait"
)

function chipActive(active: boolean) {
  return active
    ? "bg-muted/60 text-foreground"
    : "text-muted-foreground/70 hover:text-muted-foreground"
}

function defaultWeight(weights: number[]) {
  if (weights.includes(400)) return 400
  return weights[0] ?? 400
}

export function FontSpecimenPreview({ font }: { font: FontCatalogItem }) {
  const family = getCssFontFamily(font)
  const weights = React.useMemo(() => getFontSpecimenWeights(font), [font])
  const googleHref = getFontSpecimenStylesheetUrl(font)
  const faceCss = getFontSpecimenFaceCss(font)
  const localCssHref = getFontSpecimenLocalCssUrl(font)
  const [sampleFa, setSampleFa] = React.useState(DEFAULT_FA)
  const [sampleEn, setSampleEn] = React.useState(DEFAULT_EN)
  const [weight, setWeight] = React.useState(() => defaultWeight(weights))
  const [size, setSize] = React.useState(defaultSpecimenSize)
  const [ready, setReady] = React.useState(false)
  const faRef = React.useRef<HTMLTextAreaElement>(null)

  const fitFa = React.useEffectEvent(() => {
    const el = faRef.current
    if (!el) return
    el.style.height = "0px"
    el.style.height = `${el.scrollHeight}px`
  })

  React.useEffect(() => {
    setReady(false)
    setSampleFa(DEFAULT_FA)
    setSampleEn(DEFAULT_EN)
    setWeight(defaultWeight(getFontSpecimenWeights(font)))
    setSize(defaultSpecimenSize())
  }, [font])

  React.useEffect(() => {
    fitFa()
  }, [sampleFa, weight, size, ready, family])

  React.useEffect(() => {
    setReady(false)
    let cancelled = false
    const startedAt = performance.now()
    let readyTimer = 0

    const markReady = () => {
      if (cancelled) return
      const wait = Math.max(0, LOADING_MIN_MS - (performance.now() - startedAt))
      readyTimer = window.setTimeout(() => {
        if (!cancelled) setReady(true)
      }, wait)
    }

    const waitForFace = () => {
      if (!("fonts" in document)) {
        window.setTimeout(markReady, 600)
        return
      }
      void document.fonts
        .load(`${weight} 24px "${family}"`)
        .then(markReady, markReady)
    }

    // Let React paint the loading state before kicking off (often-cached) loads.
    const kickoff = window.requestAnimationFrame(() => {
      if (cancelled) return

      document.getElementById(STYLE_ID)?.remove()
      const existingLink = document.getElementById(LINK_ID) as HTMLLinkElement | null

      if (faceCss) {
        existingLink?.remove()
        const style = document.createElement("style")
        style.id = STYLE_ID
        style.textContent = faceCss
        document.head.appendChild(style)
        waitForFace()
        return
      }

      document.getElementById(STYLE_ID)?.remove()
      const href = localCssHref ?? googleHref
      if (!href) {
        existingLink?.remove()
        markReady()
        return
      }

      let link = existingLink
      if (!link) {
        link = document.createElement("link")
        link.id = LINK_ID
        link.rel = "stylesheet"
        document.head.appendChild(link)
      }

      const onSheet = () => {
        link!.removeEventListener("load", onSheet)
        link!.removeEventListener("error", onSheet)
        waitForFace()
      }
      link.addEventListener("load", onSheet)
      link.addEventListener("error", onSheet)

      const absolute = new URL(href, window.location.href).href
      if (link.href === absolute && link.sheet) {
        onSheet()
      } else {
        link.href = href
      }
    })

    return () => {
      cancelled = true
      window.cancelAnimationFrame(kickoff)
      window.clearTimeout(readyTimer)
    }
  }, [family, faceCss, localCssHref, googleHref, weight])

  const fontStyle = {
    fontFamily: `"${family}", ui-sans-serif, system-ui, sans-serif`,
    fontWeight: weight,
    fontSize: size,
    lineHeight: 1.75,
  } as const

  return (
    <section
      aria-label={`پیش‌نمایش ${font.nameFa}`}
      aria-busy={!ready}
      className="not-typeset min-w-0 rounded-xl border border-border bg-background"
    >
      <div className={cn("relative overflow-y-auto", SPECIMEN_FRAME_CLASS)}>
        {!ready ? (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center bg-background/80"
            aria-hidden
          >
            <Loader2Icon className="size-4 animate-spin text-muted-foreground/45" />
            <span className="sr-only">در حال بارگذاری فونت</span>
          </div>
        ) : null}

        <textarea
          key={`${font.id}-fa`}
          ref={faRef}
          value={sampleFa}
          onChange={(e) => setSampleFa(e.target.value)}
          spellCheck={false}
          dir="rtl"
          aria-label="متن آزمایشی فارسی"
          style={fontStyle}
          className={cn(
            fieldClass,
            "overflow-hidden pt-3 pb-1 transition-opacity duration-200 sm:pt-4 sm:pb-1",
            ready ? "opacity-100" : "opacity-0"
          )}
        />
        <textarea
          key={`${font.id}-en`}
          value={sampleEn}
          onChange={(e) => setSampleEn(e.target.value)}
          rows={1}
          spellCheck={false}
          dir="ltr"
          aria-label="English specimen text"
          style={fontStyle}
          className={cn(
            fieldClass,
            "min-h-0 overflow-hidden py-1 pb-3 text-left transition-opacity duration-200 sm:pb-4",
            ready ? "opacity-100" : "opacity-0"
          )}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-border px-3 py-2 sm:px-4">
        {weights.length > 1 ? (
          <div
            className="flex flex-wrap items-center gap-1.5"
            role="group"
            aria-label="وزن فونت"
          >
            <span className="shrink-0 text-xs text-muted-foreground">وزن</span>
            {weights.map((w) => {
              const active = w === weight
              return (
                <button
                  key={w}
                  type="button"
                  onClick={() => {
                    if (w === weight) return
                    setReady(false)
                    setWeight(w)
                  }}
                  aria-pressed={active}
                  className={cn(chipClass, chipActive(active))}
                >
                  {toPersianDigits(String(w))}
                </button>
              )
            })}
          </div>
        ) : (
          <span />
        )}

        <div
          className="flex flex-wrap items-center gap-1.5"
          role="group"
          aria-label="اندازه متن"
        >
          {SPECIMEN_SIZES.map((s) => {
            const active = s === size
            return (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                aria-pressed={active}
                className={cn(chipClass, chipActive(active))}
              >
                {toPersianDigits(s)}px
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
