import { describe, expect, it } from "vitest"

import {
  extractHookDependencies,
  filterHookRegistryDependencies,
} from "./example-dependencies"

describe("extractHookDependencies", () => {
  it("extracts @/hooks imports in sorted unique order", () => {
    const source = `
import { useIsMobile } from "@/hooks/use-mobile"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useIsMobile as again } from "@/hooks/use-mobile"
`
    expect(extractHookDependencies(source)).toEqual([
      "use-media-query",
      "use-mobile",
    ])
  })

  it("extracts registry hook paths", () => {
    const source = `import { useFoo } from "@/registry/bases/base/hooks/use-copy-to-clipboard"`
    expect(extractHookDependencies(source)).toEqual(["use-copy-to-clipboard"])
  })

  it("returns [] for empty/missing source", () => {
    expect(extractHookDependencies(undefined)).toEqual([])
    expect(extractHookDependencies(null)).toEqual([])
    expect(extractHookDependencies("")).toEqual([])
  })
})

describe("filterHookRegistryDependencies", () => {
  it("keeps only use-* registry deps", () => {
    expect(
      filterHookRegistryDependencies([
        "button",
        "use-mobile",
        "input",
        "use-copy-to-clipboard",
      ])
    ).toEqual(["use-copy-to-clipboard", "use-mobile"])
  })
})
