import { promises as fs } from "fs"
import path from "path"

/**
 * MDX tags that pull the registry/examples client graph into the docs route.
 * Pages without these use the lightweight prose map instead.
 */
const HEAVY_MDX_TAG =
  /<(ComponentPreview|ComponentSource|ComponentVariantPreview|ComponentDependencies|DocsApiProps|ComponentsList)\b/

export type DocsMdxComponents = Record<string, unknown>

function resolveDocsFilePath(page: {
  absolutePath?: string
  path?: string
}): string | null {
  if (page.absolutePath) return page.absolutePath
  if (!page.path) return null
  // fumadocs `path` is relative to `content/docs` (see source.config.ts).
  return path.isAbsolute(page.path)
    ? page.path
    : path.join(process.cwd(), "content/docs", page.path)
}

/**
 * Pick prose vs full MDX component map per page.
 * Uses dynamic import so prose pages never evaluate the heavy module graph.
 */
export async function resolveDocsMdxComponents(
  slug: string[],
  page: { absolutePath?: string; path?: string }
): Promise<DocsMdxComponents> {
  // Component docs (including /docs/components index) always need the full map.
  if (slug[0] === "components") {
    const mod = await import("@/mdx-components")
    return mod.mdxComponents as DocsMdxComponents
  }

  const filePath = resolveDocsFilePath(page)
  if (filePath) {
    try {
      const raw = await fs.readFile(filePath, "utf8")
      if (HEAVY_MDX_TAG.test(raw)) {
        const mod = await import("@/mdx-components")
        return mod.mdxComponents as DocsMdxComponents
      }
    } catch {
      // Fall through to prose if the source file cannot be read.
    }
  }

  const prose = await import("@/mdx-components-prose")
  return prose.mdxProseComponents as DocsMdxComponents
}
