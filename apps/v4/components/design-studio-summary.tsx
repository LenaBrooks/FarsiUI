"use client"

import { useThemeConfig } from "@/components/active-theme"
import { useDesignSystemPreview } from "@/components/design-system-preview"
import { THEME_LABELS } from "@/lib/themes"

/** Light summary hook for the header trigger — keep panel code out of the critical path. */
export function useDesignStudioSummary() {
  const { designSystemId, presets } = useDesignSystemPreview()
  const { activeTheme } = useThemeConfig()
  const showPrimaryColor = designSystemId === "default"
  const currentTheme = activeTheme === "default" ? "neutral" : activeTheme

  const activeDs =
    presets.find((preset) => preset.id === designSystemId) ?? presets[0]
  const colorLabel = THEME_LABELS[currentTheme] ?? currentTheme

  const parts = [activeDs.label]
  if (showPrimaryColor) parts.push(colorLabel)

  return {
    activeDs,
    colorLabel,
    currentTheme,
    showPrimaryColor,
    summary: parts.join(" · "),
  }
}
