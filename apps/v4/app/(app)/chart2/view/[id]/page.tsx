import { redirect } from "next/navigation"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function ChartViewRedirectPage({ params }: PageProps) {
  const { id } = await params
  redirect(`/charts/view/${id}`)
}
