/**
 * Phase E1 audit: every ComponentSource `src=` in docs MDX must exist on disk
 * and match docs outputFileTracingIncludes globs in next.config.mjs.
 *
 * Usage: bun run ./scripts/audit-docs-src-tracing.mts
 */
import { promises as fs } from "fs"
import path from "path"

const ROOT = process.cwd()
const CONTENT_DOCS = path.join(ROOT, "content", "docs")
const NEXT_CONFIG = path.join(ROOT, "next.config.mjs")

/** Minimal glob: `**` and `*` only, posix-style relative paths. */
function globToRegExp(glob: string) {
  const normalized = glob.replace(/^\.\//, "").replace(/\\/g, "/")
  let re = "^"
  for (let i = 0; i < normalized.length; i++) {
    const ch = normalized[i]
    if (ch === "*" && normalized[i + 1] === "*") {
      re += ".*"
      i++
      if (normalized[i + 1] === "/") i++
      continue
    }
    if (ch === "*") {
      re += "[^/]*"
      continue
    }
    if (".+^${}()|[]\\".includes(ch)) {
      re += `\\${ch}`
      continue
    }
    re += ch
  }
  re += "$"
  return new RegExp(re)
}

async function collectMdxFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) return collectMdxFiles(full)
      if (entry.isFile() && entry.name.endsWith(".mdx")) return [full]
      return [] as string[]
    })
  )
  return nested.flat()
}

function parseDocsTracingGlobs(configSource: string): string[] {
  const blockMatch = configSource.match(
    /"\/docs\/\[\[\.\.\.slug\]\]"\s*:\s*\[([\s\S]*?)\]/
  )
  if (!blockMatch) {
    throw new Error('Could not find "/docs/[[...slug]]" tracing includes')
  }
  return [...blockMatch[1].matchAll(/"(\.\/[^"]+)"/g)].map((m) => m[1])
}

function extractComponentSourceSrc(mdx: string): string[] {
  const srcs: string[] = []
  const tagRe = /<ComponentSource\b([\s\S]*?)(?:\/>|>)/g
  for (const tag of mdx.matchAll(tagRe)) {
    const attrs = tag[1]
    const srcMatch = attrs.match(/\bsrc=(["'])([^"']+)\1/)
    if (srcMatch) srcs.push(srcMatch[2])
  }
  return srcs
}

async function main() {
  const configSource = await fs.readFile(NEXT_CONFIG, "utf8")
  const globs = parseDocsTracingGlobs(configSource)
  const patterns = globs.map((g) => ({ glob: g, re: globToRegExp(g) }))

  const mdxFiles = await collectMdxFiles(CONTENT_DOCS)
  const refs: Array<{ file: string; src: string; rel: string }> = []

  for (const file of mdxFiles) {
    const text = await fs.readFile(file, "utf8")
    if (!text.includes("ComponentSource")) continue
    for (const src of extractComponentSourceSrc(text)) {
      const rel = src.replace(/^\/+/, "").replace(/\\/g, "/")
      refs.push({
        file: path.relative(ROOT, file).replace(/\\/g, "/"),
        src,
        rel,
      })
    }
  }

  const unique = [...new Map(refs.map((r) => [r.rel, r])).values()]
  let missing = 0
  let untraced = 0

  console.log(
    `ComponentSource src= refs: ${refs.length} (${unique.length} unique)`
  )
  console.log(`Docs tracing globs: ${globs.join(", ")}`)
  console.log("")

  for (const ref of unique) {
    const abs = path.join(ROOT, ref.rel)
    let exists = false
    try {
      await fs.access(abs)
      exists = true
    } catch {
      exists = false
    }

    const matched = patterns
      .filter((p) => p.re.test(ref.rel))
      .map((p) => p.glob)
    const okTrace = matched.length > 0

    if (!exists) {
      missing++
      console.log(`MISSING  ${ref.rel}`)
      console.log(`         from ${ref.file}`)
    } else if (!okTrace) {
      untraced++
      console.log(`UNTRACED ${ref.rel}`)
      console.log(`         from ${ref.file}`)
    } else {
      console.log(`OK       ${ref.rel}`)
      console.log(`         matched ${matched.join(" | ")}`)
    }
  }

  const appExamples = unique.filter((r) =>
    r.rel.startsWith("app/(app)/examples/")
  )
  console.log("")
  console.log(`Under app/(app)/examples: ${appExamples.length}`)
  for (const r of appExamples) {
    console.log(`  - ${r.rel}`)
  }

  // Changelog route intentionally omits app/(app)/examples — confirm no need.
  const changelogRefs = refs.filter((r) =>
    r.file.includes("content/docs/changelog/")
  )
  console.log(`Changelog ComponentSource src= refs: ${changelogRefs.length}`)

  if (missing || untraced) {
    console.log(`\nFAIL missing=${missing} untraced=${untraced}`)
    process.exit(1)
  }

  console.log(
    "\nAll ComponentSource src= paths exist and match docs tracing globs."
  )
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
