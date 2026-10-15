/**
 * Fail if published gallery / legacy chart JSON would break CLI install.
 *
 * Checks (against public/r/styles/new-york-v4 after build, or registry sources):
 * 1. No `from "../` relatives in packaged file content
 * 2. Multi-file items have unique basenames (CLI flatten)
 * 3. Chart-lib / gallery registryDependencies resolve under new-york-v4
 * 4. Legacy chart-* that import chart-locale / chart-toman-tick declare them
 *
 * Usage: node apps/v4/scripts/validate-gallery-install-imports.mjs
 * Prefer after: sync-gallery + build-registry --registry new-york-v4
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const APP_ROOT = path.resolve(__dirname, "..")
const PUBLIC_STYLE = path.join(
  APP_ROOT,
  "public",
  "r",
  "styles",
  "new-york-v4"
)
const REGISTRY_ROOT = path.join(APP_ROOT, "registry", "new-york-v4")
const GALLERY_OUT = path.join(REGISTRY_ROOT, "charts", "gallery")
const CATALOG_PATH = path.join(APP_ROOT, "lib", "chart-examples.json")
const CHARTS_REGISTRY_PATH = path.join(
  REGISTRY_ROOT,
  "charts",
  "_registry.ts"
)

const CHART_LIB_SLUGS = new Set([
  "chart-fa",
  "chart-locale",
  "chart-live",
  "chart-toman-tick",
  "chart-jalali-tick",
  "chart-mock-data",
  "use-market-neon",
])

const PARENT_RELATIVE_RE = /from\s+["']\.\.\//
const errors = []

function fail(msg) {
  errors.push(msg)
}

function loadJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) return null
  return JSON.parse(fs.readFileSync(filePath, "utf8"))
}

function validatePublishedItem(id, item) {
  const files = item.files ?? []
  const basenames = new Map()

  for (const file of files) {
    const content = file.content ?? ""
    if (PARENT_RELATIVE_RE.test(content)) {
      fail(`${id}: packaged content has ../ relative import (${file.path})`)
    }

    const base = path.posix.basename(file.path ?? "")
    if (!base) continue
    if (basenames.has(base)) {
      fail(
        `${id}: basename collision after flatten: ${base} (${basenames.get(base)} vs ${file.path})`
      )
    }
    basenames.set(base, file.path)
  }

  for (const dep of item.registryDependencies ?? []) {
    if (!CHART_LIB_SLUGS.has(dep) && !isGallerySlug(dep)) continue
    const depPath = path.join(PUBLIC_STYLE, `${dep}.json`)
    if (!fs.existsSync(depPath)) {
      fail(`${id}: registryDependency "${dep}" missing at ${depPath}`)
    }
  }

  if (id.startsWith("chart-")) {
    const joined = files.map((f) => f.content ?? "").join("\n")
    const deps = new Set(item.registryDependencies ?? [])
    if (
      joined.includes("@/lib/chart-locale") &&
      !deps.has("chart-locale")
    ) {
      fail(`${id}: imports @/lib/chart-locale but registryDependencies omit it`)
    }
    if (
      joined.includes("@/lib/chart-toman-tick") &&
      !deps.has("chart-toman-tick")
    ) {
      fail(
        `${id}: imports @/lib/chart-toman-tick but registryDependencies omit it`
      )
    }
  }
}

let gallerySlugSet = null
function isGallerySlug(name) {
  if (!gallerySlugSet) {
    try {
      const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"))
      gallerySlugSet = new Set(catalog.examples.map((e) => e.id))
    } catch {
      gallerySlugSet = new Set()
    }
  }
  return gallerySlugSet.has(name)
}

function validateFromPublic() {
  if (!fs.existsSync(PUBLIC_STYLE)) {
    console.warn(
      `⚠️  ${PUBLIC_STYLE} missing — skipping published JSON checks (run build-registry first)`
    )
    return false
  }

  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"))
  for (const example of catalog.examples) {
    const id = example.id
    const item = loadJsonIfExists(path.join(PUBLIC_STYLE, `${id}.json`))
    if (!item) {
      fail(`gallery id ${id}: missing public/r/styles/new-york-v4/${id}.json`)
      continue
    }
    validatePublishedItem(id, item)
  }

  // Legacy chart-* blocks present in public
  for (const name of fs.readdirSync(PUBLIC_STYLE)) {
    if (!name.startsWith("chart-") || !name.endsWith(".json")) continue
    const id = name.slice(0, -".json".length)
    const item = loadJsonIfExists(path.join(PUBLIC_STYLE, name))
    if (item) validatePublishedItem(id, item)
  }

  for (const slug of CHART_LIB_SLUGS) {
    if (!fs.existsSync(path.join(PUBLIC_STYLE, `${slug}.json`))) {
      fail(`chart lib ${slug}: missing public JSON`)
    }
  }

  return true
}

function validateGallerySources() {
  if (!fs.existsSync(GALLERY_OUT)) {
    fail(`gallery source missing: ${GALLERY_OUT}`)
    return
  }

  function walk(dir) {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const abs = path.join(dir, ent.name)
      if (ent.isDirectory()) walk(abs)
      else if (/\.(tsx?|jsx?)$/.test(ent.name)) {
        const content = fs.readFileSync(abs, "utf8")
        if (PARENT_RELATIVE_RE.test(content)) {
          fail(
            `gallery source has ../ : ${path.relative(APP_ROOT, abs)}`
          )
        }
      }
    }
  }
  walk(GALLERY_OUT)
}

function validateLegacyRegistryDeps() {
  const src = fs.readFileSync(CHARTS_REGISTRY_PATH, "utf8")
  const marker = src.indexOf(
    "// @generated by sync-gallery-charts-to-registry.mjs"
  )
  const legacy = marker === -1 ? src : src.slice(0, marker)

  const itemRe =
    /name:\s*"(chart-[^"]+)"[\s\S]*?registryDependencies:\s*(\[[^\]]*\])[\s\S]*?path:\s*"(charts\/[^"]+)"/g

  let m
  while ((m = itemRe.exec(legacy)) !== null) {
    const [, name, depsLiteral, fileRel] = m
    let deps
    try {
      deps = new Set(JSON.parse(depsLiteral))
    } catch {
      continue
    }
    const abs = path.join(REGISTRY_ROOT, fileRel)
    if (!fs.existsSync(abs)) continue
    const content = fs.readFileSync(abs, "utf8")
    if (
      content.includes("@/lib/chart-locale") &&
      !deps.has("chart-locale")
    ) {
      fail(
        `legacy ${name}: imports chart-locale but registryDependencies omit it`
      )
    }
    if (
      content.includes("@/lib/chart-toman-tick") &&
      !deps.has("chart-toman-tick")
    ) {
      fail(
        `legacy ${name}: imports chart-toman-tick but registryDependencies omit it`
      )
    }
  }
}

function main() {
  console.log("🔍 Validating gallery install imports …")
  validateGallerySources()
  validateLegacyRegistryDeps()
  validateFromPublic()

  if (errors.length) {
    console.error(`\n❌ ${errors.length} issue(s):`)
    for (const e of errors) console.error(`  - ${e}`)
    process.exit(1)
  }
  console.log("✅ Gallery install imports OK")
}

main()
