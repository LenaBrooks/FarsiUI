import { access, readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { NextResponse } from "next/server"

const HERE = path.dirname(fileURLToPath(import.meta.url))
/** `apps/v4/app/catalog-fonts/[...path]` → repo `fonts/`. */
const FONTS_ROOT_FROM_FILE = path.resolve(HERE, "../../../../fonts")

async function resolveFontsRoot() {
  const candidates = [
    FONTS_ROOT_FROM_FILE,
    path.resolve(process.cwd(), "fonts"),
    path.resolve(process.cwd(), "../../fonts"),
  ]
  for (const dir of candidates) {
    try {
      await access(dir)
      return dir
    } catch {
      /* try next */
    }
  }
  return FONTS_ROOT_FROM_FILE
}

const CONTENT_TYPES: Record<string, string> = {
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".css": "text/css; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
}

type Params = { params: Promise<{ path: string[] }> }

export async function GET(_request: Request, { params }: Params) {
  const segments = (await params).path
  if (!segments?.length) {
    return new NextResponse("Not found", { status: 404 })
  }

  const relative = segments.join("/")
  if (
    relative.includes("\0") ||
    segments.some((part) => part === ".." || part === ".")
  ) {
    return new NextResponse("Forbidden", { status: 403 })
  }

  const fontsRoot = await resolveFontsRoot()
  const absolute = path.resolve(fontsRoot, relative)
  if (
    absolute !== fontsRoot &&
    !absolute.startsWith(fontsRoot + path.sep)
  ) {
    return new NextResponse("Forbidden", { status: 403 })
  }

  try {
    const data = await readFile(absolute)
    const ext = path.extname(absolute).toLowerCase()
    const contentType = CONTENT_TYPES[ext] ?? "application/octet-stream"
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    })
  } catch {
    return new NextResponse("Not found", { status: 404 })
  }
}
