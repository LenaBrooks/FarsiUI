/**
 * Phase D audit: prove registry-meta cannot replace getDemoItem deps, and
 * verify ExamplesIndex.hookDependencies matches extractHookDependencies(file).
 *
 * Usage: bun run ./scripts/audit-example-hook-deps.mts
 */
import { promises as fs } from "fs"
import path from "path"

import {
  extractHookDependencies,
  filterHookRegistryDependencies,
} from "../lib/example-dependencies.ts"

const EXAMPLES_DIR = path.join(process.cwd(), "examples")
const INDEX_PATH = path.join(EXAMPLES_DIR, "__index__.tsx")
const BASES = ["base", "aria", "radix"] as const

async function collectTsxFiles(
  dirPath: string,
  rootDir = dirPath
): Promise<string[]> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(dirPath, entry.name)
      if (entry.isDirectory()) {
        return collectTsxFiles(entryPath, rootDir)
      }
      if (!entry.isFile() || !entry.name.endsWith(".tsx")) {
        return [] as string[]
      }
      return [path.relative(rootDir, entryPath).replace(/\\/g, "/")]
    })
  )
  return nested.flat().sort((a, b) => a.localeCompare(b))
}

function parseBakedHooks(
  indexSource: string,
  base: string,
  name: string
): string[] | null {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  // Scope search inside the base object. Full registry build may emit
  // either `"base": {` or unquoted `base: {` after prettier.
  const baseStartQuoted = indexSource.indexOf(`"${base}": {`)
  const baseStartBare = indexSource.indexOf(`\n  ${base}: {`)
  const baseStart =
    baseStartQuoted !== -1
      ? baseStartQuoted
      : baseStartBare !== -1
        ? baseStartBare
        : indexSource.indexOf(`${base}: {`)
  if (baseStart === -1) return null
  const slice = indexSource.slice(baseStart)
  // Allow CRLF from Windows/prettier writes; stop at the entry's closing `},`.
  const entryRe = new RegExp(
    `"${escaped}":\\s*\\{([\\s\\S]*?)\\r?\\n\\s*\\},`,
    "m"
  )
  const match = slice.match(entryRe)
  if (!match) return null
  const body = match[1]
  const hooksMatch = body.match(/hookDependencies:\s*(\[[\s\S]*?\])/)
  if (!hooksMatch) return null
  try {
    return (JSON.parse(hooksMatch[1]) as string[]).slice().sort()
  } catch {
    return null
  }
}

async function registryHooksForDemo(
  base: string,
  demoName: string
): Promise<string[]> {
  // Lightweight check against authored base registry source for the parent
  // component name (drawer-demo → drawer). Not used for runtime; audit only.
  const registryPath = path.join(
    process.cwd(),
    "registry",
    "bases",
    base,
    "ui",
    "_registry.ts"
  )
  let source: string
  try {
    source = await fs.readFile(registryPath, "utf8")
  } catch {
    return []
  }

  const candidates = [
    demoName,
    demoName.replace(/-demo$/, ""),
    demoName.split("-")[0] ?? demoName,
  ]

  for (const candidate of candidates) {
    const blockRe = new RegExp(
      `name:\\s*"${candidate.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[\\s\\S]*?registryDependencies:\\s*\\[([\\s\\S]*?)\\]`,
      "m"
    )
    const match = source.match(blockRe)
    if (!match) continue
    const deps = [...match[1].matchAll(/"([^"]+)"/g)].map((m) => m[1])
    const hooks = filterHookRegistryDependencies(deps)
    if (hooks.length) return hooks
  }

  return []
}

async function main() {
  const indexSource = await fs.readFile(INDEX_PATH, "utf8")
  const withHooks: Array<{
    base: string
    name: string
    fromFile: string[]
    fromMeta: string[]
    fromBake: string[] | null
  }> = []

  for (const base of BASES) {
    const baseDir = path.join(EXAMPLES_DIR, base)
    let files: string[]
    try {
      files = await collectTsxFiles(baseDir)
    } catch {
      continue
    }

    for (const file of files) {
      const name = file.replace(/\.tsx$/, "")
      const content = await fs.readFile(path.join(baseDir, file), "utf8")
      const fromFile = extractHookDependencies(content)
      if (!fromFile.length) continue

      withHooks.push({
        base,
        name,
        fromFile,
        fromMeta: await registryHooksForDemo(base, name),
        fromBake: parseBakedHooks(indexSource, base, name),
      })
    }
  }

  const metaMismatches = withHooks.filter(
    (r) => JSON.stringify(r.fromFile) !== JSON.stringify(r.fromMeta)
  )
  const bakeMismatches = withHooks.filter(
    (r) =>
      r.fromBake == null ||
      JSON.stringify(r.fromFile) !== JSON.stringify(r.fromBake)
  )

  console.log(`Examples with hook imports: ${withHooks.length}`)
  console.log(`Registry-meta mismatches: ${metaMismatches.length}`)
  for (const r of metaMismatches) {
    console.log(
      `  ${r.base}/${r.name}: file=${JSON.stringify(r.fromFile)} meta=${JSON.stringify(r.fromMeta)}`
    )
  }

  console.log(`ExamplesIndex bake mismatches: ${bakeMismatches.length}`)
  for (const r of bakeMismatches) {
    console.log(
      `  ${r.base}/${r.name}: file=${JSON.stringify(r.fromFile)} baked=${JSON.stringify(r.fromBake)}`
    )
  }

  if (metaMismatches.length === 0) {
    console.log("\nRegistry meta has full parity.")
  } else {
    console.log(
      "\nRegistry meta does NOT have parity — getRegistryMeta alone is unsafe for Phase D."
    )
  }

  if (bakeMismatches.length === 0) {
    console.log("ExamplesIndex.hookDependencies has exact file parity.")
    process.exit(0)
  }

  console.log(
    "\nBake missing/stale — run: bun run ./scripts/build-registry.mts --examples"
  )
  process.exit(1)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
