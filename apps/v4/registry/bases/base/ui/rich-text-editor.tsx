"use client"

import * as React from "react"
import { EditorContent, type JSONContent } from "@tiptap/react"
import { cn } from "cn"

import { useRichTextEditor } from "@/registry/bases/base/hooks/use-rich-text-editor"
import type {
  RichTextEditorContent,
  RichTextEditorVariant,
} from "@/registry/bases/base/lib/rich-text-editor"
import { RichTextEditorToolbar } from "@/registry/bases/base/ui/rich-text-editor-toolbar"

const editorSurfaceClassName = cn(
  "rounded-b-md border border-input bg-transparent shadow-xs dark:bg-input/30",
  "aria-invalid:border-destructive",
  "[&_[contenteditable]]:min-h-[var(--rte-min-height,12rem)]",
  "md:[&_[contenteditable]]:min-h-[var(--rte-min-height,16rem)]",
  "[&_[contenteditable]]:px-3 [&_[contenteditable]]:py-2",
  "[&_[contenteditable]:focus]:outline-none",
  "[&_.rich-text-editor-prose]:text-base md:[&_.rich-text-editor-prose]:text-sm",
  "[&_.rich-text-editor-prose_h1]:mt-4 [&_.rich-text-editor-prose_h1]:mb-2 [&_.rich-text-editor-prose_h1]:text-2xl [&_.rich-text-editor-prose_h1]:font-bold",
  "[&_.rich-text-editor-prose_h2]:mt-3 [&_.rich-text-editor-prose_h2]:mb-2 [&_.rich-text-editor-prose_h2]:text-xl [&_.rich-text-editor-prose_h2]:font-semibold",
  "[&_.rich-text-editor-prose_h3]:mt-2 [&_.rich-text-editor-prose_h3]:mb-1 [&_.rich-text-editor-prose_h3]:text-lg [&_.rich-text-editor-prose_h3]:font-semibold",
  "[&_.rich-text-editor-prose_p]:my-2 [&_.rich-text-editor-prose_p]:leading-relaxed",
  "[&_.rich-text-editor-prose_ul]:my-2 [&_.rich-text-editor-prose_ul]:list-disc [&_.rich-text-editor-prose_ul]:ps-6",
  "[&_.rich-text-editor-prose_ol]:my-2 [&_.rich-text-editor-prose_ol]:list-decimal [&_.rich-text-editor-prose_ol]:ps-6",
  "[&_.rich-text-editor-prose_ul[data-type=taskList]]:list-none [&_.rich-text-editor-prose_ul[data-type=taskList]]:ps-0",
  "[&_.rich-text-editor-prose_ul[data-type=taskList]_li]:flex [&_.rich-text-editor-prose_ul[data-type=taskList]_li]:items-start [&_.rich-text-editor-prose_ul[data-type=taskList]_li]:gap-2",
  "[&_.rich-text-editor-prose_ul[data-type=taskList]_li_label]:mt-1",
  "[&_.rich-text-editor-prose_blockquote]:my-2 [&_.rich-text-editor-prose_blockquote]:border-s-4 [&_.rich-text-editor-prose_blockquote]:border-border [&_.rich-text-editor-prose_blockquote]:ps-4 [&_.rich-text-editor-prose_blockquote]:text-muted-foreground",
  "[&_.rich-text-editor-prose_pre]:my-2 [&_.rich-text-editor-prose_pre]:overflow-x-auto [&_.rich-text-editor-prose_pre]:rounded-md [&_.rich-text-editor-prose_pre]:bg-muted [&_.rich-text-editor-prose_pre]:p-3 [&_.rich-text-editor-prose_pre]:font-mono [&_.rich-text-editor-prose_pre]:text-sm",
  "[&_.rich-text-editor-prose_code]:rounded-sm [&_.rich-text-editor-prose_code]:bg-muted [&_.rich-text-editor-prose_code]:px-1 [&_.rich-text-editor-prose_code]:py-0.5 [&_.rich-text-editor-prose_code]:font-mono [&_.rich-text-editor-prose_code]:text-[0.9em]",
  "[&_.rich-text-editor-prose_hr]:my-4 [&_.rich-text-editor-prose_hr]:border-border",
  "[&_.rich-text-editor-prose_table]:my-3 [&_.rich-text-editor-prose_table]:w-full [&_.rich-text-editor-prose_table]:border-collapse [&_.rich-text-editor-prose_table]:overflow-hidden [&_.rich-text-editor-prose_table]:rounded-md [&_.rich-text-editor-prose_table]:border [&_.rich-text-editor-prose_table]:border-border",
  "[&_.rich-text-editor-prose_th]:border [&_.rich-text-editor-prose_th]:border-border [&_.rich-text-editor-prose_th]:bg-muted/50 [&_.rich-text-editor-prose_th]:px-2 [&_.rich-text-editor-prose_th]:py-1.5 [&_.rich-text-editor-prose_th]:text-start [&_.rich-text-editor-prose_th]:font-medium",
  "[&_.rich-text-editor-prose_td]:border [&_.rich-text-editor-prose_td]:border-border [&_.rich-text-editor-prose_td]:px-2 [&_.rich-text-editor-prose_td]:py-1.5",
  "[&_.rich-text-editor-prose_mark]:rounded-sm [&_.rich-text-editor-prose_mark]:px-0.5",
  "[&_.rich-text-editor-prose_a]:text-primary [&_.rich-text-editor-prose_a]:underline",
  "[&_.rich-text-editor-prose_img]:my-2 [&_.rich-text-editor-prose_img]:max-w-full [&_.rich-text-editor-prose_img]:rounded-md",
  "data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50"
)

export type RichTextEditorProps = {
  value?: RichTextEditorContent
  defaultValue?: RichTextEditorContent
  onChange?: (payload: { html: string; json: JSONContent }) => void
  dir?: "rtl" | "ltr" | "auto"
  lang?: string
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  "aria-invalid"?: boolean
  className?: string
  editorClassName?: string
  minHeight?: number | string
  onUploadImage?: (file: File) => Promise<string>
  hideToolbar?: boolean
  /** `simple` کار روزمره؛ `advanced` همهٔ امکانات نوار ابزار */
  variant?: RichTextEditorVariant
  id?: string
}

function RichTextEditor({
  value,
  defaultValue,
  onChange,
  dir = "rtl",
  lang = "fa",
  placeholder = "متن را بنویسید…",
  disabled = false,
  readOnly = false,
  "aria-invalid": ariaInvalid,
  className,
  editorClassName,
  minHeight = "16rem",
  onUploadImage,
  hideToolbar = false,
  variant = "simple",
  id,
}: RichTextEditorProps) {
  return (
    <RichTextEditorImpl
      key={variant}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      dir={dir}
      lang={lang}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      aria-invalid={ariaInvalid}
      className={className}
      editorClassName={editorClassName}
      minHeight={minHeight}
      onUploadImage={onUploadImage}
      hideToolbar={hideToolbar}
      variant={variant}
      id={id}
    />
  )
}

function RichTextEditorImpl({
  value,
  defaultValue,
  onChange,
  dir = "rtl",
  lang = "fa",
  placeholder = "متن را بنویسید…",
  disabled = false,
  readOnly = false,
  "aria-invalid": ariaInvalid,
  className,
  editorClassName,
  minHeight = "16rem",
  onUploadImage,
  hideToolbar = false,
  variant = "simple",
  id,
}: RichTextEditorProps) {
  const editable = !disabled && !readOnly

  const editor = useRichTextEditor({
    value,
    defaultValue,
    onChange,
    placeholder,
    editable,
    immediatelyRender: false,
    variant,
  })

  const minHeightValue =
    typeof minHeight === "number" ? `${minHeight}px` : minHeight
  const usesDefaultMinHeight = minHeightValue === "16rem"

  return (
    <div
      data-slot="rich-text-editor"
      data-variant={variant}
      data-disabled={disabled || undefined}
      dir={dir}
      lang={lang}
      className={cn(
        "flex w-full flex-col rounded-md",
        "has-[[contenteditable]:focus]:ring-[3px] has-[[contenteditable]:focus]:ring-ring/50",
        "has-[[contenteditable]:focus]:[&_[data-slot=rich-text-editor-toolbar]]:border-ring",
        "has-[[contenteditable]:focus]:[&_[data-slot=rich-text-editor-surface]]:border-ring",
        "has-[[aria-invalid=true]]:ring-[3px] has-[[aria-invalid=true]]:ring-destructive/20 dark:has-[[aria-invalid=true]]:ring-destructive/40",
        "has-[[aria-invalid=true]]:[&_[data-slot=rich-text-editor-toolbar]]:border-destructive",
        className
      )}
      style={
        usesDefaultMinHeight
          ? undefined
          : ({
              "--rte-min-height": minHeightValue,
            } as React.CSSProperties)
      }
    >
      {!hideToolbar ? (
        <RichTextEditorToolbar
          editor={editor}
          disabled={disabled || readOnly}
          onUploadImage={onUploadImage}
          variant={variant}
          className="rounded-t-md border border-b-0 border-input"
        />
      ) : null}
      <div
        id={id}
        data-slot="rich-text-editor-surface"
        role="textbox"
        aria-multiline="true"
        aria-invalid={ariaInvalid}
        aria-readonly={readOnly || undefined}
        aria-disabled={disabled || undefined}
        data-dir={dir}
        className={cn(
          editorSurfaceClassName,
          hideToolbar && "rounded-t-md",
          dir === "rtl" &&
            "[&_.rich-text-editor-prose]:text-right [&_.rich-text-editor-prose]:[unicode-bidi:plaintext]",
          dir === "ltr" &&
            "[&_.rich-text-editor-prose]:text-left [&_.rich-text-editor-prose]:[unicode-bidi:plaintext]",
          editorClassName
        )}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export { RichTextEditor }
