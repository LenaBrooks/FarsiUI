import fs from "node:fs"
import path from "node:path"

import {
  getDefaultExportName,
} from "../lib/chart-demo-export-name"
import { chartDemoSourcePath } from "../lib/chart-demos"

const root = path.join(import.meta.dir, "..")
const failures: string[] = []
const samples: Record<string, string> = {}

for (const [id, rel] of Object.entries(chartDemoSourcePath)) {
  const abs = path.join(root, rel)
  if (!fs.existsSync(abs)) {
    failures.push(`${id}: missing ${rel}`)
    continue
  }
  const source = fs.readFileSync(abs, "utf8")
  const name = getDefaultExportName(source)
  if (!name) {
    failures.push(`${id}: could not parse default export`)
    continue
  }
  if (name === "Chart") {
    failures.push(`${id}: resolved to Chart`)
  }
  if (
    id === "simple-bar-chart" ||
    id === "gauge-no-animation" ||
    id === "compare-two-lines"
  ) {
    samples[id] = name
  }
}

if (failures.length) {
  console.error("Failures:\n" + failures.join("\n"))
  process.exit(1)
}

console.log(
  `OK: ${Object.keys(chartDemoSourcePath).length} chart demos have parseable default exports`
)
console.log("samples:", samples)
