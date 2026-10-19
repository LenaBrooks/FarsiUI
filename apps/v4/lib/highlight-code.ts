import { createHash } from "crypto"
import { LRUCache } from "lru-cache"
import { codeToHtml } from "shiki"
import type { ShikiTransformer } from "shiki"

// LRU cache for cross-request caching of highlighted code.
// Shiki highlighting is CPU-intensive and deterministic, so caching is safe.
const highlightCache = new LRUCache<string, string>({
  max: 500,
  ttl: 1000 * 60 * 60, // 1 hour.
})

export type PackageManagerCommands = {
  npm: string
  yarn: string
  pnpm: string
  bun: string
}

export type HighlightedPackageManagerCommands = PackageManagerCommands & {
  npmHtml: string
  yarnHtml: string
  pnpmHtml: string
  bunHtml: string
}

/** Expand a single CLI string into npm / yarn / pnpm / bun variants. */
export function expandPackageManagerCommands(
  command: string
): PackageManagerCommands | null {
  const raw = command.trim()
  if (!raw) return null

  if (raw.startsWith("npm install")) {
    return {
      npm: raw,
      yarn: raw.replace("npm install", "yarn add"),
      pnpm: raw.replace("npm install", "pnpm add"),
      bun: raw.replace("npm install", "bun add"),
    }
  }
  if (raw.startsWith("npx create-")) {
    return {
      npm: raw,
      yarn: raw.replace("npx create-", "yarn create "),
      pnpm: raw.replace("npx create-", "pnpm create "),
      bun: raw.replace("npx", "bunx --bun"),
    }
  }
  if (raw.startsWith("npm create")) {
    return {
      npm: raw,
      yarn: raw.replace("npm create", "yarn create"),
      pnpm: raw.replace("npm create", "pnpm create"),
      bun: raw.replace("npm create", "bun create"),
    }
  }
  if (raw.startsWith("npx")) {
    return {
      npm: raw,
      yarn: raw.replace("npx", "yarn dlx"),
      pnpm: raw.replace("npx", "pnpm dlx"),
      bun: raw.replace("npx", "bunx --bun"),
    }
  }
  if (raw.startsWith("npm run")) {
    return {
      npm: raw,
      yarn: raw.replace("npm run", "yarn"),
      pnpm: raw.replace("npm run", "pnpm"),
      bun: raw.replace("npm run", "bun"),
    }
  }

  return null
}

export async function highlightPackageManagerCommands(
  command: string
): Promise<HighlightedPackageManagerCommands | null> {
  const commands = expandPackageManagerCommands(command)
  if (!commands) return null

  const [npmHtml, yarnHtml, pnpmHtml, bunHtml] = await Promise.all([
    highlightCode(commands.npm, "bash"),
    highlightCode(commands.yarn, "bash"),
    highlightCode(commands.pnpm, "bash"),
    highlightCode(commands.bun, "bash"),
  ])

  return {
    ...commands,
    npmHtml,
    yarnHtml,
    pnpmHtml,
    bunHtml,
  }
}

export const transformers = [
  {
    code(node) {
      if (node.tagName === "code") {
        const raw = this.source
        node.properties["__raw__"] = raw

        const expanded = expandPackageManagerCommands(raw)
        if (expanded) {
          node.properties["__npm__"] = expanded.npm
          node.properties["__yarn__"] = expanded.yarn
          node.properties["__pnpm__"] = expanded.pnpm
          node.properties["__bun__"] = expanded.bun
        }
      }
    },
  },
] as ShikiTransformer[]

export async function highlightCode(code: string, language: string = "tsx") {
  // Create cache key from code content and language.
  // Prefix bumps when Persian wrapping / highlighting output shape changes.
  const cacheKey = createHash("sha256")
    .update(`fa-wrap-v7-only-dark-plus:${language}:${code}`)
    .digest("hex")

  // Check cache first.
  const cached = highlightCache.get(cacheKey)
  if (cached) {
    return cached
  }

  const html = await codeToHtml(code, {
    lang: language,
    // Single theme: VS Code Default Dark+ inline colors (charcoal shells in light UI).
    theme: "dark-plus",
    transformers: [
      {
        pre(node) {
          node.properties["class"] =
            // pe-12: جا برای دکمهٔ کپی؛ با line-numbers فقط شروع صفر شود نه پایان
            "scrollbar-soft min-w-0 overflow-x-auto overflow-y-auto overscroll-x-contain overscroll-y-auto ps-4 pe-12 py-3.5 outline-none has-[[data-highlighted-line]]:ps-0 has-[[data-line-numbers]]:ps-0 has-[[data-slot=tabs]]:p-0 !bg-transparent"
        },
        code(node) {
          node.properties["data-line-numbers"] = ""
        },
        line(node) {
          node.properties["data-line"] = ""
        },
      },
    ],
  })

  const withPersian = wrapPersianTextInCodeHtml(html)

  // Cache the result.
  highlightCache.set(cacheKey, withPersian)

  return withPersian
}

import { PERSIAN_RUN } from "@/lib/rehype-code-fa"

function wrapPersianTextInCodeHtml(html: string) {
  return html.replace(/>([^<]+)</g, (match, text: string) => {
    PERSIAN_RUN.lastIndex = 0
    const wrapped = text.replace(
      PERSIAN_RUN,
      '<span class="code-fa">$&</span>'
    )
    if (wrapped === text) {
      return match
    }
    return `>${wrapped}<`
  })
}
