"use client"

import { useCallback } from "react"
import { CheckIcon, RotateCcwIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "cn"

import { useThemeConfig } from "@/components/active-theme"
import {
  useDesignSystemPreview,
  type DesignSystemId,
} from "@/components/design-system-preview"
import { useFontPreview } from "@/components/font-preview"
import { DEFAULT_ACTIVE_THEME } from "@/lib/active-theme"
import { THEME_BEFORE_DARK_DS_KEY } from "@/lib/design-system"
import { THEME_LABELS, THEMES } from "@/lib/themes"

function themeSwatch(themeName: string) {
  const theme = THEMES.find((item) => item.name === themeName) ?? THEMES[0]
  return `hsl(${theme?.activeColor.light})`
}

/** Compact recipe thumb — muted accents; glass title readable on cyan card. */
function StyleThumb({ id }: { id: DesignSystemId }) {
  const looks: Record<
    DesignSystemId,
    { card: string; line: string; lineSoft: string; btn: string }
  > = {
    default: {
      card: "rounded-lg border border-border/60 bg-background",
      line: "rounded-sm bg-foreground/50",
      lineSoft: "rounded-sm bg-foreground/18",
      btn: "rounded-md bg-foreground/35",
    },
    comfort: {
      card: "rounded-2xl border border-sky-500/25 bg-sky-500/10",
      line: "rounded-full bg-sky-950/45 dark:bg-sky-100/50",
      lineSoft: "rounded-full bg-sky-700/25 dark:bg-sky-200/30",
      btn: "rounded-full bg-sky-700/45 dark:bg-sky-300/35",
    },
    glass: {
      card: "rounded-xl border border-cyan-500/25 bg-cyan-500/10",
      line: "rounded-md bg-cyan-950/55 dark:bg-cyan-100/55",
      lineSoft: "rounded-md bg-cyan-700/25 dark:bg-cyan-200/30",
      btn: "rounded-lg bg-cyan-700/45 dark:bg-cyan-300/35",
    },
    rose: {
      card: "rounded-[1.1rem] border border-rose-200/60 bg-[#fff6f6]",
      line: "rounded-full bg-rose-900/40",
      lineSoft: "rounded-full bg-rose-300/40",
      btn: "rounded-full bg-rose-400/55",
    },
    nili: {
      card: "rounded-md border border-slate-700/80 bg-slate-900",
      line: "rounded-sm bg-slate-300/65",
      lineSoft: "rounded-sm bg-slate-500/45",
      btn: "rounded-sm bg-slate-400/50",
    },
    khesht: {
      card: "rounded-md border-2 border-amber-950/45 bg-amber-50 shadow-[2px_2px_0_0_rgba(69,26,3,0.3)]",
      line: "rounded-[2px] bg-amber-950/55",
      lineSoft: "rounded-[2px] bg-amber-800/30",
      btn: "rounded-[2px] border border-amber-950/40 bg-amber-800/45",
    },
  }

  const look = looks[id]

  return (
    <div
      aria-hidden
      className={cn(
        "flex h-[3.25rem] w-full shrink-0 flex-col justify-center gap-1 p-2",
        look.card
      )}
    >
      <span className={cn("h-1.5 w-[58%] shrink-0", look.line)} />
      <span className={cn("h-1 w-[78%] shrink-0", look.lineSoft)} />
      <span className={cn("mt-0.5 h-3 w-[42%] shrink-0", look.btn)} />
    </div>
  )
}

export { useDesignStudioSummary } from "@/components/design-studio-summary"

/** Shared design studio body — used by desktop Popover and mobile Drawer. */
export function DesignStudioPanel({
  className,
  hideColor = false,
}: {
  className?: string
  /** When true (e.g. /demos), never show primary color swatches. */
  hideColor?: boolean
}) {
  const { designSystemId, setDesignSystemId, presets } =
    useDesignSystemPreview()
  const { setFontId } = useFontPreview()
  const { activeTheme, setActiveTheme } = useThemeConfig()
  const { setTheme } = useTheme()
  const showPrimaryColor = !hideColor && designSystemId === "default"
  const currentTheme = activeTheme === "default" ? "neutral" : activeTheme

  const resetToDefaults = useCallback(() => {
    try {
      sessionStorage.removeItem(THEME_BEFORE_DARK_DS_KEY)
    } catch {
      // Ignore private mode.
    }
    setDesignSystemId("default")
    setFontId("estedad")
    setTheme("system")
    setActiveTheme(DEFAULT_ACTIVE_THEME)
  }, [setActiveTheme, setDesignSystemId, setFontId, setTheme])

  return (
    <div
      dir="rtl"
      lang="fa"
      className={cn("flex flex-col gap-2.5", className)}
    >
      <div className="flex items-center justify-between gap-2">
        {showPrimaryColor ? (
          <div
            role="listbox"
            aria-label="رنگ اصلی"
            className="flex min-w-0 flex-1 flex-wrap items-center gap-2.5 sm:gap-1"
          >
            {THEMES.map((theme) => {
              const selected = currentTheme === theme.name
              const label = THEME_LABELS[theme.name] ?? theme.label
              return (
                <button
                  key={theme.name}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  aria-label={label}
                  title={label}
                  onClick={() => setActiveTheme(theme.name)}
                  className={cn(
                    "relative flex size-9 shrink-0 cursor-pointer touch-manipulation items-center justify-center rounded-full transition-shadow sm:size-5",
                    selected &&
                      "ring-2 ring-primary ring-offset-1 ring-offset-background"
                  )}
                >
                  <span
                    className="pointer-events-none size-4 rounded-full ring-1 ring-foreground/10 sm:size-3.5"
                    style={{ backgroundColor: themeSwatch(theme.name) }}
                  />
                </button>
              )
            })}
          </div>
        ) : (
          <p className="text-[13px] font-medium text-foreground">ظاهر</p>
        )}
        <button
          type="button"
          onClick={resetToDefaults}
          aria-label="بازنشانی به پیشفرض و خاکستری"
          title="بازنشانی"
          className="inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
        >
          <RotateCcwIcon className="size-3" />
        </button>
      </div>

      <section
        role="listbox"
        aria-label="سیستم طراحی"
        className="grid grid-cols-2 gap-2"
      >
        {presets.map((preset) => {
          const selected = designSystemId === preset.id
          return (
            <button
              key={preset.id}
              type="button"
              role="option"
              aria-selected={selected}
              onClick={() =>
                setDesignSystemId(preset.id as DesignSystemId)
              }
              className={cn(
                "flex cursor-pointer flex-col gap-1.5 rounded-lg p-1.5 text-start transition-colors",
                "hover:bg-muted/50 active:bg-muted/70",
                selected && "bg-muted/40"
              )}
            >
              <span className="flex min-h-4 items-center gap-1 px-0.5">
                <span className="min-w-0 flex-1 truncate text-sm font-medium leading-none">
                  {preset.label}
                </span>
                {selected ? (
                  <CheckIcon
                    className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                    aria-hidden
                  />
                ) : (
                  <span className="size-3.5 shrink-0" aria-hidden />
                )}
              </span>
              <StyleThumb id={preset.id} />
            </button>
          )
        })}
      </section>
    </div>
  )
}
