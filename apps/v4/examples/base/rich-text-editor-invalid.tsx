"use client"

import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/registry/bases/base/ui/field"
import { RichTextEditor } from "@/registry/bases/base/ui/rich-text-editor"

export default function RichTextEditorInvalid() {
  return (
    <Field data-invalid className="w-full max-w-2xl" dir="rtl">
      <FieldLabel htmlFor="rte-invalid">متن مقاله</FieldLabel>
      <RichTextEditor
        id="rte-invalid"
        aria-invalid
        placeholder="متن را وارد کنید…"
      />
      <FieldDescription>متن باید حداقل یک پاراگراف معتبر داشته باشد.</FieldDescription>
    </Field>
  )
}
