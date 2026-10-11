import { siteConfig } from "@/lib/config"
import { type Metadata } from "next"
import { notFound } from "next/navigation"

import { getSkill, getSkillFiles, getSkillSlugs } from "@/lib/skills"
import { highlightCode } from "@/lib/highlight-code"
import { SkillDetail } from "@/components/skill-detail"

export const dynamicParams = true

export function generateStaticParams() {
  return getSkillSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const skill = getSkill(slug)

  if (!skill) {
    return {}
  }

  return {
    title: skill.title,
    description: skill.summary,
    alternates: {
      canonical: `/skills/${skill.slug}`,
    },
    openGraph: {
      title: skill.title,
      description: skill.summary,
      url: `/skills/${skill.slug}`,
      images: [
        {
          url: siteConfig.ogImage,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: skill.title,
      description: skill.summary,
    },
  }
}

export default async function SkillPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const skill = getSkill(slug)
  const files = getSkillFiles(slug)

  if (!skill || files.length === 0) {
    notFound()
  }

  const skillFiles = await Promise.all(
    files.map(async (file) => ({
      path: file.path,
      content: file.content,
      highlighted: await highlightCode(file.content, "markdown"),
    }))
  )

  return <SkillDetail skill={skill} files={skillFiles} />
}
