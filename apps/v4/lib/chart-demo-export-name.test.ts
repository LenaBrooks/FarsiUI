import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

import {
  getDefaultExportName,
  toPascalCaseId,
} from "./chart-demo-export-name"
import { chartDemoSourcePath } from "./chart-demos"

const appsV4Root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")

describe("getDefaultExportName", () => {
  it("parses export default function Name", () => {
    expect(
      getDefaultExportName(
        `export default function SimpleBarChartDemo() {\n  return null\n}\n`
      )
    ).toBe("SimpleBarChartDemo")
  })

  it("parses export default Identifier", () => {
    expect(getDefaultExportName(`const App = () => null\nexport default App\n`)).toBe(
      "App"
    )
  })

  it("falls back with toPascalCaseId", () => {
    expect(toPascalCaseId("simple-bar-chart")).toBe("SimpleBarChart")
  })
})

describe("chartDemoSourcePath default exports", () => {
  it(
    "resolves a real component name for every catalog demo",
    () => {
      const failures: string[] = []

      for (const [id, rel] of Object.entries(chartDemoSourcePath)) {
        const abs = path.join(appsV4Root, rel)
        if (!fs.existsSync(abs)) {
          failures.push(`${id}: missing file ${rel}`)
          continue
        }
        const source = fs.readFileSync(abs, "utf8")
        const name = getDefaultExportName(source)
        if (!name) {
          failures.push(`${id}: could not parse default export`)
          continue
        }
        if (name === "Chart") {
          failures.push(`${id}: still uses Chart alias`)
        }
      }

      expect(failures).toEqual([])
    },
    30_000
  )
})
