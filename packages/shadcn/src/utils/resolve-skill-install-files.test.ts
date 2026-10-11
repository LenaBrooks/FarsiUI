import path from "path"
import { afterEach, describe, expect, it, vi } from "vitest"

import {
  getAgentSkillRoot,
  resolveSkillInstallFiles,
} from "./resolve-skill-install-files"

vi.mock("prompts", () => ({
  default: vi.fn(),
}))

describe("getAgentSkillRoot", () => {
  it("detects known skill roots", () => {
    expect(getAgentSkillRoot(".cursor/skills/foo/SKILL.md")).toBe(
      ".cursor/skills"
    )
    expect(getAgentSkillRoot(".claude/skills/foo/SKILL.md")).toBe(
      ".claude/skills"
    )
    expect(getAgentSkillRoot(".agents/skills/foo/SKILL.md")).toBe(
      ".agents/skills"
    )
  })

  it("returns null for other targets", () => {
    expect(getAgentSkillRoot("components/ui/button.tsx")).toBeNull()
    expect(getAgentSkillRoot(undefined)).toBeNull()
  })
})

describe("resolveSkillInstallFiles", () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it("leaves non-skill files unchanged", async () => {
    const files = [
      { target: "components/ui/button.tsx", path: "button.tsx" },
      { target: "lib/utils.ts", path: "utils.ts" },
    ]
    await expect(
      resolveSkillInstallFiles(files, process.cwd(), { interactive: false })
    ).resolves.toEqual(files)
  })

  it("keeps a single-root skill payload unchanged", async () => {
    const files = [
      {
        target: ".cursor/skills/demo/SKILL.md",
        path: "skills/demo/SKILL.md",
      },
    ]
    await expect(
      resolveSkillInstallFiles(files, process.cwd(), { interactive: false })
    ).resolves.toEqual(files)
  })

  it("filters multi-root skills to one root when non-interactive", async () => {
    const cwd = path.join(process.cwd(), "__skill_install_tmp__")
    const files = [
      {
        target: ".claude/skills/demo/SKILL.md",
        path: "skills/demo/SKILL.md",
      },
      {
        target: ".cursor/skills/demo/SKILL.md",
        path: "skills/demo/SKILL.md",
      },
      {
        target: ".agents/skills/demo/SKILL.md",
        path: "skills/demo/SKILL.md",
      },
    ]

    const resolved = await resolveSkillInstallFiles(files, cwd, {
      interactive: false,
      silent: true,
    })

    expect(resolved).toHaveLength(1)
    expect(resolved[0]?.target).toBe(".cursor/skills/demo/SKILL.md")
  })
})
