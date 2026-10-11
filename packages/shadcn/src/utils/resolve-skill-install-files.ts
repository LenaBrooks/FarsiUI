import { existsSync } from "fs"
import path from "path"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import prompts from "prompts"

/** Agent skill install roots used by FarsiUI skill registry items. */
export const AGENT_SKILL_ROOTS = [
  {
    id: "cursor",
    root: ".cursor/skills",
    label: "Cursor",
    marker: ".cursor",
  },
  {
    id: "claude",
    root: ".claude/skills",
    label: "Claude Code",
    marker: ".claude",
  },
  {
    id: "agents",
    root: ".agents/skills",
    label: "Codex / Agents",
    marker: ".agents",
  },
] as const

export type AgentSkillRoot = (typeof AGENT_SKILL_ROOTS)[number]["root"]

function normalizeTarget(target: string) {
  return target.replace(/\\/g, "/")
}

export function getAgentSkillRoot(
  target: string | undefined
): AgentSkillRoot | null {
  if (!target) {
    return null
  }
  const normalized = normalizeTarget(target)
  for (const { root } of AGENT_SKILL_ROOTS) {
    if (normalized === root || normalized.startsWith(`${root}/`)) {
      return root
    }
  }
  return null
}

function rootExists(cwd: string, root: string) {
  return existsSync(path.join(cwd, root))
}

function markerExists(cwd: string, marker: string) {
  return existsSync(path.join(cwd, marker))
}

/**
 * Pick a single agent skill root for install.
 * Skills belong in one tool directory — never all of them at once.
 */
export async function resolveAgentSkillRoot(
  cwd: string,
  options: { interactive?: boolean; silent?: boolean } = {}
): Promise<AgentSkillRoot> {
  const interactive = options.interactive ?? true
  const existingRoots = AGENT_SKILL_ROOTS.filter(({ root }) =>
    rootExists(cwd, root)
  )

  if (existingRoots.length === 1) {
    return existingRoots[0].root
  }

  if (existingRoots.length > 1) {
    if (interactive) {
      const selected = await promptForSkillRoot(
        existingRoots.map(({ root, label }) => ({ root, label })),
        "Skills are already installed for more than one agent. Where should this skill go?"
      )
      if (selected) {
        return selected
      }
    }
    return existingRoots[0].root
  }

  const markerMatches = AGENT_SKILL_ROOTS.filter(({ marker }) =>
    markerExists(cwd, marker)
  )

  if (markerMatches.length === 1) {
    return markerMatches[0].root
  }

  if (markerMatches.length > 1 && interactive) {
    const selected = await promptForSkillRoot(
      markerMatches.map(({ root, label }) => ({ root, label })),
      "Which agent should this skill be installed for?"
    )
    if (selected) {
      return selected
    }
  }

  if (markerMatches.length > 0) {
    return markerMatches[0].root
  }

  if (interactive) {
    const selected = await promptForSkillRoot(
      AGENT_SKILL_ROOTS.map(({ root, label }) => ({ root, label })),
      "Which agent should this skill be installed for?"
    )
    if (selected) {
      return selected
    }
  }

  // Greenfield + non-interactive: Cursor is the common default for this CLI.
  if (!options.silent) {
    logger.info(
      `Installing skill to ${highlighter.info(".cursor/skills")} (default).`
    )
  }
  return ".cursor/skills"
}

async function promptForSkillRoot(
  choices: { root: string; label: string }[],
  message: string
): Promise<AgentSkillRoot | null> {
  const { root } = await prompts({
    type: "select",
    name: "root",
    message,
    choices: choices.map((choice) => ({
      title: `${choice.label} (${choice.root})`,
      value: choice.root,
    })),
  })

  return (root as AgentSkillRoot | undefined) ?? null
}

type FileWithTarget = {
  target?: string
}

/**
 * When a registry item ships the same skill for Claude + Cursor + Agents,
 * keep only the files for one resolved root.
 */
export async function resolveSkillInstallFiles<T extends FileWithTarget>(
  files: T[] | undefined,
  cwd: string,
  options: { interactive?: boolean; silent?: boolean } = {}
): Promise<T[]> {
  if (!files?.length) {
    return files ?? []
  }

  const skillRootsInItem = new Set<AgentSkillRoot>()
  for (const file of files) {
    const root = getAgentSkillRoot(file.target)
    if (root) {
      skillRootsInItem.add(root)
    }
  }

  // Not a multi-agent skill payload — leave as-is.
  if (skillRootsInItem.size <= 1) {
    return files
  }

  const selectedRoot = await resolveAgentSkillRoot(cwd, options)

  return files.filter((file) => {
    const root = getAgentSkillRoot(file.target)
    if (!root) {
      return true
    }
    return root === selectedRoot
  })
}
