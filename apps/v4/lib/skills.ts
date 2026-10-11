import fs from "node:fs"
import path from "node:path"

export {
  getSkill,
  getSkillCategory,
  getSkillTitleEn,
  getSkillSlugs,
  getSkills,
  getSkillsByCategory,
  getSkillsGroupedByCategory,
  getSkillsNavCategoryId,
  getSkillsNavCurrent,
  searchSkills,
  skillMatchesQuery,
  skills,
  SKILL_CATEGORIES,
  type Skill,
  type SkillCategoryGroup,
  type SkillCategoryId,
  type SkillInstallTarget,
  type SkillSource,
} from "@/lib/skills-data"

const SKILLS_DIR = path.join(process.cwd(), "content/skills")

export function getSkillMarkdown(slug: string) {
  const filePath = path.join(SKILLS_DIR, slug, "SKILL.md")
  if (!fs.existsSync(filePath)) {
    return null
  }
  return fs.readFileSync(filePath, "utf8")
}

export type SkillFileEntry = {
  /** Path relative to the skill folder */
  path: string
  content: string
}

function listSkillRelativeFiles(slug: string): string[] {
  const skillDir = path.join(SKILLS_DIR, slug)
  if (!fs.existsSync(skillDir)) {
    return []
  }

  const out: string[] = []

  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith(".")) continue
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(full)
        continue
      }
      if (!entry.isFile()) continue
      out.push(path.relative(skillDir, full).split(path.sep).join("/"))
    }
  }

  walk(skillDir)
  return out.sort((a, b) => {
    if (a === "SKILL.md") return -1
    if (b === "SKILL.md") return 1
    return a.localeCompare(b)
  })
}

/** Extra files shipped with the skill (e.g. references/*.md), excluding SKILL.md. */
export function getSkillExtraFiles(slug: string): string[] {
  return listSkillRelativeFiles(slug).filter((file) => file !== "SKILL.md")
}

/** All skill files with content — SKILL.md first, then companions. */
export function getSkillFiles(slug: string): SkillFileEntry[] {
  const skillDir = path.join(SKILLS_DIR, slug)
  return listSkillRelativeFiles(slug).map((relative) => ({
    path: relative,
    content: fs.readFileSync(path.join(skillDir, relative), "utf8"),
  }))
}
