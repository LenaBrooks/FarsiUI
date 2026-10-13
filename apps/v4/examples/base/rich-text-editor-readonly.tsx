"use client"

import { RichTextEditor } from "@/registry/bases/base/ui/rich-text-editor"

export default function RichTextEditorReadonly() {
  return (
    <div className="w-full max-w-2xl" dir="rtl" lang="fa">
      <RichTextEditor
        readOnly
        defaultValue="<p>حالت فقط‌خواندنی — محتوا قابل ویرایش نیست.</p>"
      />
    </div>
  )
}
