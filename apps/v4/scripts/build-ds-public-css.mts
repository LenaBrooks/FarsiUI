/**
 * Compile non-nova design-system CSS into public/ds/{id}.css so the shell can
 * load them via <link> without webpack hoisting them onto every page.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import postcss from "postcss"
import tailwindPostcss from "@tailwindcss/postcss"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..")
const outDir = path.join(root, "public", "ds")

const recipes = [
  { id: "comfort", file: "chunk-vega.css" },
  { id: "glass", file: "chunk-glass.css" },
  { id: "rose", file: "chunk-rose.css" },
  { id: "nili", file: "chunk-nili.css" },
  { id: "khesht", file: "chunk-khesht.css" },
] as const

async function buildOne(id: string, file: string) {
  const from = path.join(root, "app", "styles", file)
  const css = await readFile(from, "utf8")
  const result = await postcss([tailwindPostcss()]).process(css, {
    from,
    to: path.join(outDir, `${id}.css`),
  })
  await writeFile(path.join(outDir, `${id}.css`), result.css, "utf8")
  const kb = (Buffer.byteLength(result.css) / 1024).toFixed(1)
  console.log(`ds/${id}.css  ${kb} KB`)
}

await mkdir(outDir, { recursive: true })
for (const recipe of recipes) {
  await buildOne(recipe.id, recipe.file)
}
console.log("Built public/ds design-system styles")
