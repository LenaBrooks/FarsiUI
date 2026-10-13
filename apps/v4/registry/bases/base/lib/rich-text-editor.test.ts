import { describe, expect, it } from "vitest"

import {
  isAllowedRichTextUrl,
  normalizeRichTextContent,
  normalizeRichTextUrl,
  RICH_TEXT_EXTENSION_NAMES,
  RICH_TEXT_HEADING_LEVELS,
} from "./rich-text-editor"

describe("rich-text-editor lib", () => {
  it("accepts http and https URLs only", () => {
    expect(isAllowedRichTextUrl("https://farsiui.ir")).toBe(true)
    expect(isAllowedRichTextUrl("http://example.com/path")).toBe(true)
    expect(isAllowedRichTextUrl("javascript:alert(1)")).toBe(false)
    expect(isAllowedRichTextUrl("ftp://files.example.com")).toBe(false)
    expect(isAllowedRichTextUrl("")).toBe(false)
  })

  it("normalizes bare hostnames to https", () => {
    expect(normalizeRichTextUrl("farsiui.ir")).toBe("https://farsiui.ir")
    expect(normalizeRichTextUrl("  https://a.com  ")).toBe("https://a.com")
  })

  it("normalizes string content", () => {
    expect(normalizeRichTextContent("   ")).toBe("")
    expect(normalizeRichTextContent("<p>x</p>")).toBe("<p>x</p>")
  })

  it("documents extension and heading levels for the hook", () => {
    expect(RICH_TEXT_EXTENSION_NAMES).toContain("starterKit")
    expect(RICH_TEXT_HEADING_LEVELS).toEqual([1, 2, 3])
  })
})
