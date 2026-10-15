import fs from "node:fs/promises"
import path from "node:path"
import { type Metadata } from "next"
import { notFound } from "next/navigation"

import {
  chartExamples,
  getChartExample,
} from "@/lib/chart-catalog"
import { getChartDemoSourcePath } from "@/lib/chart-demos"
import { ChartViewPanel } from "@/components/chart-view-panel"
import { CodeFigure } from "@/components/code-figure"

export const dynamic = "force-static"
export const dynamicParams = true

type PageProps = {
  params: Promise<{ id: string }>
}

export function generateStaticParams() {
  return chartExamples.map((example) => ({ id: example.id }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params
  const example = getChartExample(id)
  if (!example) return { title: "نمودار" }

  return {
    title: example.title,
    alternates: {
      canonical: `/charts/view/${id}`,
    },
  }
}

async function readDemoSource(id: string) {
  const rel = getChartDemoSourcePath(id)
  if (!rel) return null
  const abs = path.join(process.cwd(), rel)
  try {
    return await fs.readFile(abs, "utf8")
  } catch {
    return null
  }
}

export default async function ChartViewPage({ params }: PageProps) {
  const { id } = await params
  const example = getChartExample(id)
  if (!example) notFound()

  const sourcePath = getChartDemoSourcePath(id)
  if (!sourcePath) notFound()

  const source = await readDemoSource(id)
  if (!source) notFound()

  const importPath = `@/examples/chart/${example.category}/${id}`
  const usageImport = `import Chart from "${importPath}"`
  const usageJsx = `export default function Page() {
  return <Chart />
}
`

  return (
    <ChartViewPanel
      example={example}
      sourceFigure={
        <CodeFigure
          code={source}
          title={sourcePath.replace(/^examples\//, "")}
          language="tsx"
        />
      }
      usageFigures={
        <>
          <CodeFigure code={usageImport} language="tsx" />
          <CodeFigure code={usageJsx} language="tsx" />
        </>
      }
    />
  )
}
