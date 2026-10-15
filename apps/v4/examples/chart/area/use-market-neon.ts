"use client"

import { useSyncExternalStore } from "react"

import { useDesignSystemPreview } from "@/components/design-system-preview"

function subscribeBodyClass(onChange: () => void) {
  const obs = new MutationObserver(onChange)
  obs.observe(document.body, { attributes: true, attributeFilter: ["class"] })
  return () => obs.disconnect()
}

function bodyIsNova() {
  return document.body.classList.contains("style-nova")
}

/**
 * Neon market-card pattern on branded DS only — Nova (پیشفرض) stays raw.
 * Prefer live `style-*` on body so charts match what the user actually sees
 * (avoids soft palette stuck on while آرام/etc. CSS is already applied).
 */
export function useMarketNeon() {
  const { designSystemId } = useDesignSystemPreview()
  const novaOnBody = useSyncExternalStore(
    subscribeBodyClass,
    bodyIsNova,
    () => designSystemId === "default"
  )
  return !novaOnBody
}
