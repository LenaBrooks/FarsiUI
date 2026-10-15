import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../examples/Chart")

function walk(dir) {
  const out = []
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) out.push(...walk(p))
    else if (/\.tsx?$/.test(ent.name)) out.push(p)
  }
  return out
}

let fixed = 0
for (const file of walk(root)) {
  let code = fs.readFileSync(file, "utf8")
  const orig = code

  code = code.replace(
    /import\s*\{([^}]*)\}\s*from\s*["']recharts["']\s*;?/g,
    (_m, inner) => {
      const parts = inner
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .filter((p) => !p.includes("useRechartsTheme"))
      return `import { ${parts.join(", ")} } from "recharts";`
    }
  )

  code = code.replace(
    /\bconst\s+theme\s*=\s*useRechartsTheme\(\)\s*;?/g,
    "const theme = {};"
  )
  code = code.replace(/\buseRechartsTheme\(\)/g, "({})")

  code = code.replace(
    /import\s*\{([^}]*)\}\s*from\s*['"]@recharts\/devtools\/dist\/generateMockMarketData['"]\s*;?/g,
    (_m, inner) => {
      const parts = inner
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((p) => (p.includes("MarketCandle") ? "type MarketCandle" : p))
      return `import { generateMockMarketData, ${parts.join(", ")} } from "@/lib/chart-mock-data";`
    }
  )

  code = code.replace(
    /import\s*\{([^}]*)\}\s*from\s*['"]@recharts\/devtools['"]\s*;?/g,
    (_m, inner) => {
      const parts = inner
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .filter((p) => !/^RechartsDevtools$/.test(p.trim()))
        .map((p) => {
          if (p.includes("MockDataType")) return "type MockDataType"
          if (p.includes("MarketCandle")) return "type MarketCandle"
          return p
        })
      if (!parts.length) return ""
      return `import { ${parts.join(", ")} } from "@/lib/chart-mock-data";`
    }
  )

  if (
    code.includes("generateMockMarketData") &&
    !code.includes("Chart-mock-data")
  ) {
    code = code.replace(
      /("use client"\s*\n+)/,
      `$1import { generateMockMarketData, type MarketCandle } from "@/lib/chart-mock-data";\n`
    )
  }

  code = code.replace(/\s*<RechartsDevtools\s*\/>/g, "")

  if (code !== orig) {
    fs.writeFileSync(file, code)
    fixed++
    console.log("fixed", path.relative(root, file))
  }
}
console.log("total fixed", fixed)
