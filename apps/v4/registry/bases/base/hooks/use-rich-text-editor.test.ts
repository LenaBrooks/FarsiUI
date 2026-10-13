import { describe, expect, it } from "vitest"

import { createRichTextExtensions } from "./use-rich-text-editor"

describe("createRichTextExtensions", () => {
  it("registers a lean set for the simple variant", () => {
    const extensions = createRichTextExtensions("راهنما", "simple")
    const names = extensions.map((ext) => ext.name)
    expect(names).toEqual([
      "starterKit",
      "underline",
      "link",
      "image",
      "placeholder",
    ])
  })

  it("registers advanced TipTap extensions for the advanced variant", () => {
    const extensions = createRichTextExtensions("راهنما", "advanced")
    const names = extensions.map((ext) => ext.name)
    expect(names).toContain("starterKit")
    expect(names).toContain("textStyleKit")
    expect(names).toContain("highlight")
    expect(names).toContain("textAlign")
    expect(names).toContain("taskList")
    expect(names).toContain("tableKit")
    expect(names).toContain("typography")
  })

  it("limits headings to levels 1 through 3", () => {
    const extensions = createRichTextExtensions()
    const starter = extensions.find((ext) => ext.name === "starterKit")
    expect(starter).toBeDefined()
    // @ts-expect-error -- tiptap extension options are runtime
    const levels = starter?.options?.heading?.levels
    expect(levels).toEqual([1, 2, 3])
  })
})
