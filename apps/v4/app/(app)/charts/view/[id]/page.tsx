import fs from "node:fs/promises"
import path from "node:path"
import { type Metadata } from "next"
import { notFound } from "next/navigation"

import {
  chart2Examples,
  getChart2Example,
} from "@/lib/chart2-catalog"
import { getChart2DemoSourcePath } from "@/lib/chart2-demos"
import { Chart2ViewPanel } from "@/components/chart2-view-panel"
import { CodeFigure } from "@/components/code-figure"

export const dynamic = "force-static"
export const dynamicParams = true

type PageProps = {
  params: Promise<{ id: string }>
}

export function generateStaticParams() {
  return chart2Examples.map((example) => ({ id: example.id }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params
  const example = getChart2Example(id)
  if (!example) return { title: "نمودار" }

  return {
    title: example.title,
    alternates: {
      canonical: `/charts/view/${id}`,
    },
  }
}

async function readDemoSource(id: string) {
  const rel = getChart2DemoSourcePath(id)
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
  const example = getChart2Example(id)
  if (!example) notFound()

  const sourcePath = getChart2DemoSourcePath(id)
  if (!sourcePath) notFound()

  const source = await readDemoSource(id)
  if (!source) notFound()

  const importPath = `@/examples/chart2/${example.category}/${id}`
  const usageImport = `import Chart from "${importPath}"`
  const usageJsx = `export default function Page() {
  return <Chart />
}
`

  return (
    <Chart2ViewPanel
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
