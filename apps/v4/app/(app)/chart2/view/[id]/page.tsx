import { redirect } from "next/navigation"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function Chart2ViewRedirectPage({ params }: PageProps) {
  const { id } = await params
  redirect(`/charts/view/${id}`)
}
