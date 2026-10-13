"use client"

import { RichTextEditor } from "@/registry/bases/base/ui/rich-text-editor"

export default function RichTextEditorAdvanced() {
  return (
    <div className="w-full max-w-2xl" dir="rtl" lang="fa">
      <RichTextEditor
        variant="advanced"
        defaultValue="<p>حالت <strong>پیشرفته</strong> با رنگ، تراز، جدول و بقیهٔ امکانات.</p>"
        placeholder="متن خود را بنویسید…"
      />
    </div>
  )
}
