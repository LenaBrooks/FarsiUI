"use client"

import { useSyncExternalStore } from "react"

function subscribeBodyClass(onChange: () => void) {
  const obs = new MutationObserver(onChange)
  obs.observe(document.body, { attributes: true, attributeFilter: ["class"] })
  return () => obs.disconnect()
}

function bodyHasStyleClass() {
  return [...document.body.classList].some((c) => c.startsWith("style-"))
}

function bodyIsNova() {
  return document.body.classList.contains("style-nova")
}

/**
 * Neon market-card pattern on branded DS only — Nova (پیشفرض) stays raw.
 * Reads live `style-*` on body (docs picker or consumer layout).
 * No DesignSystemPreviewProvider — safe to install via CLI.
 * Without any `style-*` class, neon stays off (raw).
 */
export function useMarketNeon() {
  return useSyncExternalStore(
    subscribeBodyClass,
    () => bodyHasStyleClass() && !bodyIsNova(),
    () => false
  )
}
