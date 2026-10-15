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
  // Only the real editor root — never [contenteditable] alone (matches
  // task-item labels with contenteditable="false" and blows min-height up).
  "[&_.ProseMirror]:min-h-[var(--rte-min-height,16rem)]",
  "[&_.ProseMirror]:px-3 [&_.ProseMirror]:py-2",
  "[&_.ProseMirror]:outline-none",
  "[&_.ProseMirror]:text-sm [&_.ProseMirror]:leading-relaxed",
  "[&_.ProseMirror_h1]:mt-4 [&_.ProseMirror_h1]:mb-2 [&_.ProseMirror_h1]:text-2xl [&_.ProseMirror_h1]:font-bold",
  "[&_.ProseMirror_h2]:mt-3 [&_.ProseMirror_h2]:mb-2 [&_.ProseMirror_h2]:text-xl [&_.ProseMirror_h2]:font-semibold",
  "[&_.ProseMirror_h3]:mt-2 [&_.ProseMirror_h3]:mb-1 [&_.ProseMirror_h3]:text-lg [&_.ProseMirror_h3]:font-semibold",
  "[&_.ProseMirror_p]:my-1.5",
  "[&_.ProseMirror_ul]:my-1.5 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:ps-6",
  "[&_.ProseMirror_ol]:my-1.5 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:ps-6",
  "[&_.ProseMirror_li]:my-0 [&_.ProseMirror_li_p]:my-0",
  // Task list — compact checkbox + text on one line rhythm
  "[&_.ProseMirror_ul[data-type=taskList]]:my-1.5 [&_.ProseMirror_ul[data-type=taskList]]:list-none [&_.ProseMirror_ul[data-type=taskList]]:ps-0",
  "[&_.ProseMirror_ul[data-type=taskList]_li]:m-0 [&_.ProseMirror_ul[data-type=taskList]_li]:flex [&_.ProseMirror_ul[data-type=taskList]_li]:items-start [&_.ProseMirror_ul[data-type=taskList]_li]:gap-2 [&_.ProseMirror_ul[data-type=taskList]_li]:py-0.5",
  "[&_.ProseMirror_ul[data-type=taskList]_li_label]:m-0 [&_.ProseMirror_ul[data-type=taskList]_li_label]:flex [&_.ProseMirror_ul[data-type=taskList]_li_label]:h-[1.375rem] [&_.ProseMirror_ul[data-type=taskList]_li_label]:shrink-0 [&_.ProseMirror_ul[data-type=taskList]_li_label]:items-center [&_.ProseMirror_ul[data-type=taskList]_li_label]:p-0",
  "[&_.ProseMirror_ul[data-type=taskList]_li_label_input]:size-3.5 [&_.ProseMirror_ul[data-type=taskList]_li_label_input]:accent-primary",
  "[&_.ProseMirror_ul[data-type=taskList]_li>div]:min-w-0 [&_.ProseMirror_ul[data-type=taskList]_li>div]:flex-1",
  "[&_.ProseMirror_ul[data-type=taskList]_li_p]:my-0 [&_.ProseMirror_ul[data-type=taskList]_li_p]:leading-relaxed",
  "[&_.ProseMirror_blockquote]:my-2 [&_.ProseMirror_blockquote]:border-s-4 [&_.ProseMirror_blockquote]:border-border [&_.ProseMirror_blockquote]:ps-4 [&_.ProseMirror_blockquote]:text-muted-foreground",
  "[&_.ProseMirror_pre]:my-2 [&_.ProseMirror_pre]:overflow-x-auto [&_.ProseMirror_pre]:rounded-md [&_.ProseMirror_pre]:bg-muted [&_.ProseMirror_pre]:p-3 [&_.ProseMirror_pre]:font-mono [&_.ProseMirror_pre]:text-sm",
  "[&_.ProseMirror_code]:rounded-sm [&_.ProseMirror_code]:bg-muted [&_.ProseMirror_code]:px-1 [&_.ProseMirror_code]:py-0.5 [&_.ProseMirror_code]:font-mono [&_.ProseMirror_code]:text-[0.9em]",
  "[&_.ProseMirror_hr]:my-4 [&_.ProseMirror_hr]:border-border",
  "[&_.ProseMirror_table]:my-3 [&_.ProseMirror_table]:w-full [&_.ProseMirror_table]:border-collapse [&_.ProseMirror_table]:overflow-hidden [&_.ProseMirror_table]:rounded-md [&_.ProseMirror_table]:border [&_.ProseMirror_table]:border-border",
  "[&_.ProseMirror_th]:border [&_.ProseMirror_th]:border-border [&_.ProseMirror_th]:bg-muted/50 [&_.ProseMirror_th]:px-2 [&_.ProseMirror_th]:py-1.5 [&_.ProseMirror_th]:text-start [&_.ProseMirror_th]:font-medium",
  "[&_.ProseMirror_td]:border [&_.ProseMirror_td]:border-border [&_.ProseMirror_td]:px-2 [&_.ProseMirror_td]:py-1.5",
  "[&_.ProseMirror_mark]:rounded-sm [&_.ProseMirror_mark]:px-0.5",
  "[&_.ProseMirror_a]:text-primary [&_.ProseMirror_a]:underline",
  "[&_.ProseMirror_img]:my-2 [&_.ProseMirror_img]:max-w-full [&_.ProseMirror_img]:rounded-md",
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
        // ring-inset avoids layout jump when focus toggles
        "has-[[contenteditable=true]:focus]:ring-2 has-[[contenteditable=true]:focus]:ring-inset has-[[contenteditable=true]:focus]:ring-ring/50",
        "has-[[contenteditable=true]:focus]:[&_[data-slot=rich-text-editor-toolbar]]:border-ring",
        "has-[[contenteditable=true]:focus]:[&_[data-slot=rich-text-editor-surface]]:border-ring",
        "has-[[aria-invalid=true]]:ring-2 has-[[aria-invalid=true]]:ring-inset has-[[aria-invalid=true]]:ring-destructive/20 dark:has-[[aria-invalid=true]]:ring-destructive/40",
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
            "[&_.ProseMirror]:text-right [&_.ProseMirror]:[unicode-bidi:plaintext]",
          dir === "ltr" &&
            "[&_.ProseMirror]:text-left [&_.ProseMirror]:[unicode-bidi:plaintext]",
          editorClassName
        )}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export { RichTextEditor }
