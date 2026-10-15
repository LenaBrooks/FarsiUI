/**
 * Lazy-load picker design-system CSS via <link> tags under /ds/{id}.css.
 * Nova ships with the shell; webpack CSS imports for other recipes are avoided
 * so Next does not hoist them onto every page.
 */

import {
  type DesignSystemCookieId,
} from "@/lib/design-system"
import { DS_CSS_VERSION } from "@/lib/ds-css-version"

export type LoadableDesignSystemId = DesignSystemCookieId

const loaded = new Set<LoadableDesignSystemId>(["default"])
const inflight = new Map<LoadableDesignSystemId, Promise<void>>()

export function dsStyleHref(id: Exclude<LoadableDesignSystemId, "default">) {
  return `/ds/${id}.css?v=${DS_CSS_VERSION}`
}

export function isDesignSystemStyleLoaded(id: LoadableDesignSystemId) {
  return loaded.has(id)
}

export function markDesignSystemStyleLoaded(id: LoadableDesignSystemId) {
  loaded.add(id)
}

export function markDefaultDesignSystemStyleLoaded() {
  loaded.add("default")
}

function injectStylesheet(
  id: Exclude<LoadableDesignSystemId, "default">
): Promise<void> {
  if (typeof document === "undefined") {
    return Promise.resolve()
  }

  const href = dsStyleHref(id)
  const existing = document.querySelector(
    `link[data-ds-style="${id}"]`
  ) as HTMLLinkElement | null
  if (existing) {
    loaded.add(id)
    return Promise.resolve()
  }

  return new Promise((resolve, reject) => {
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = href
    link.dataset.dsStyle = id
    link.onload = () => {
      loaded.add(id)
      resolve()
    }
    link.onerror = () => {
      reject(new Error(`Failed to load design system style: ${id}`))
    }
    document.head.appendChild(link)
  })
}

/** Load CSS for a picker design system (no-op when already loaded). */
export function loadDesignSystemStyle(
  id: LoadableDesignSystemId
): Promise<void> {
  if (loaded.has(id)) {
    return Promise.resolve()
  }

  if (id === "default") {
    loaded.add(id)
    return Promise.resolve()
  }

  const existing = inflight.get(id)
  if (existing) {
    return existing
  }

  const pending = injectStylesheet(id)
    .catch((error) => {
      console.error(`Failed to load design system style: ${id}`, error)
      throw error
    })
    .finally(() => {
      inflight.delete(id)
    })

  inflight.set(id, pending)
  return pending
}
