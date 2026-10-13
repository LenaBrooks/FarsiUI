"use client"

import { RichTextEditor } from "@/registry/bases/base/ui/rich-text-editor"

export default function RichTextEditorDemo() {
  return (
    <div className="w-full max-w-2xl" dir="rtl" lang="fa">
      <RichTextEditor
        variant="simple"
        defaultValue="<p>سلام! این یک <strong>ویرایشگر متن</strong> فارسی است.</p><p>Mixed content: React + تایپ‌اسکریپت.</p>"
        placeholder="متن خود را بنویسید…"
      />
    </div>
  )
}
