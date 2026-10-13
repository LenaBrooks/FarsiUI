import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("@tiptap/react", () => ({
  EditorContent: () => <div data-testid="editor-content" />,
}))

vi.mock("@/registry/bases/base/hooks/use-rich-text-editor", () => ({
  useRichTextEditor: () => ({}),
}))

vi.mock("@/registry/bases/base/ui/rich-text-editor-toolbar", () => ({
  RichTextEditorToolbar: () => (
    <div aria-label="نوار ابزار ویرایشگر" role="toolbar" />
  ),
}))

import { RichTextEditor } from "./rich-text-editor"

describe("RichTextEditor", () => {
  it("renders RTL shell with Persian toolbar label and invalid state", () => {
    const html = renderToStaticMarkup(
      <RichTextEditor aria-invalid id="rte-test" />
    )

    expect(html).toContain('data-slot="rich-text-editor"')
    expect(html).toContain('dir="rtl"')
    expect(html).toContain('lang="fa"')
    expect(html).toContain('aria-label="نوار ابزار ویرایشگر"')
    expect(html).toContain('aria-invalid="true"')
    expect(html).toContain('id="rte-test"')
  })

  it("can hide the toolbar", () => {
    const html = renderToStaticMarkup(<RichTextEditor hideToolbar />)
    expect(html).not.toContain("نوار ابزار ویرایشگر")
  })
})
