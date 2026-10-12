import type { DesignSystemCookieId } from "@/lib/design-system"
import {
  dsStyleHref,
  markDesignSystemStyleLoaded,
} from "@/lib/design-system-style-loader"

/**
 * SSR: emit a stylesheet link for the cookie-selected non-nova design system
 * so restored recipes paint without FOUC. Files live in public/ds/.
 */
export function DesignSystemStyles({
  id,
}: {
  id: DesignSystemCookieId
}) {
  if (id === "default") {
    markDesignSystemStyleLoaded("default")
    return null
  }

  markDesignSystemStyleLoaded(id)
  return (
    <link
      rel="stylesheet"
      href={dsStyleHref(id)}
      data-ds-style={id}
    />
  )
}
