"use client"

import { RichTextEditor } from "@/registry/bases/base/ui/rich-text-editor"

export default function RichTextEditorDisabled() {
  return (
    <div className="w-full" dir="rtl" lang="fa">
      <RichTextEditor
        disabled
        defaultValue="<p>این ویرایشگر غیرفعال است.</p>"
      />
    </div>
  )
}
