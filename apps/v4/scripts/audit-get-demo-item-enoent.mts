/**
 * Phase E2: getDemoItem must return null on ENOENT, not throw.
 * Mirrors the guard in lib/registry.ts without importing server-only modules.
 *
 * Usage: bun run ./scripts/audit-get-demo-item-enoent.mts
 */
import { promises as fs } from "fs"
import path from "path"

async function readFileFromRoot(relativePath: string) {
  return fs.readFile(path.join(process.cwd(), relativePath), "utf-8")
}

function isNotFoundError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as NodeJS.ErrnoException).code === "ENOENT"
  )
}

async function getDemoItemLike(filePath: string) {
  try {
    const content = await readFileFromRoot(filePath)
    return { content }
  } catch (error) {
    if (isNotFoundError(error)) {
      return null
    }
    throw error
  }
}

async function main() {
  const missing = await getDemoItemLike(
    "examples/base/__does-not-exist-phase-e__.tsx"
  )
  if (missing !== null) {
    console.error("expected null for missing demo file")
    process.exit(1)
  }

  const present = await getDemoItemLike("examples/base/drawer-demo.tsx")
  if (!present?.content.includes("useIsMobile")) {
    console.error("expected to read existing drawer-demo")
    process.exit(1)
  }

  const registrySource = await fs.readFile(
    path.join(process.cwd(), "lib/registry.ts"),
    "utf8"
  )
  if (!registrySource.includes("[getDemoItem] missing file")) {
    console.error("getDemoItem ENOENT harden missing from lib/registry.ts")
    process.exit(1)
  }
  if (!registrySource.includes("isNotFoundError")) {
    console.error("isNotFoundError helper missing from lib/registry.ts")
    process.exit(1)
  }

  // readFileFromRoot must remain a throwing wrapper (no silent swallow).
  const readFileSource = await fs.readFile(
    path.join(process.cwd(), "lib/read-file.ts"),
    "utf8"
  )
  if (readFileSource.includes("catch")) {
    console.error(
      "readFileFromRoot gained a catch — Phase E2 prefers scoped getDemoItem harden only"
    )
    process.exit(1)
  }

  console.log("getDemoItem ENOENT harden checks OK")
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
