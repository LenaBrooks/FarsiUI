"use client"

import * as React from "react"

import { RichTextEditor } from "@/registry/bases/base/ui/rich-text-editor"

export default function RichTextEditorControlled() {
  const [html, setHtml] = React.useState("<p>محتوای کنترل‌شده از والد.</p>")

  return (
    <div className="flex w-full flex-col gap-4" dir="rtl" lang="fa">
      <RichTextEditor
        value={html}
        onChange={({ html: next }) => setHtml(next)}
        placeholder="ویرایش کنید…"
      />
      <div className="rounded-md border border-border bg-muted/40 p-3 text-xs">
        <p className="mb-1 font-medium text-muted-foreground">خروجی HTML</p>
        <pre dir="ltr" className="max-h-32 overflow-auto whitespace-pre-wrap">
          {html}
        </pre>
      </div>
    </div>
  )
}
