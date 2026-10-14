"use client"

import * as React from "react"
import { FileIcon, UploadIcon, XIcon } from "lucide-react"
import { cn } from "cn"

import { toPersianDigits } from "@/registry/bases/base/lib/digits"
import { Button } from "@/registry/bases/base/ui/button"
import { Progress } from "@/registry/bases/base/ui/progress"

export type FileUploadItem = {
  id: string
  file: File
  progress: number
  error?: string
  previewUrl?: string
}

export type FileUploadProps = {
  className?: string
  accept?: string
  multiple?: boolean
  /** Max size in bytes (default 5MB). */
  maxSize?: number
  disabled?: boolean
  value?: FileUploadItem[]
  defaultValue?: FileUploadItem[]
  onValueChange?: (items: FileUploadItem[]) => void
  /** Simulate upload progress when true (demo). */
  simulateProgress?: boolean
  id?: string
  label?: string
  description?: string
}

function formatBytes(n: number) {
  if (n < 1024) return `${toPersianDigits(n)} B`
  if (n < 1024 * 1024) return `${toPersianDigits((n / 1024).toFixed(1))} KB`
  return `${toPersianDigits((n / (1024 * 1024)).toFixed(1))} MB`
}

function FileUpload({
  className,
  accept,
  multiple = true,
  maxSize = 5 * 1024 * 1024,
  disabled,
  value,
  defaultValue,
  onValueChange,
  simulateProgress = true,
  id = "file-upload",
  label = "انتخاب یا رها کردن فایل",
  description,
}: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [internal, setInternal] = React.useState<FileUploadItem[]>(
    defaultValue ?? []
  )
  const [dragging, setDragging] = React.useState(false)
  const items = value ?? internal
  const itemsRef = React.useRef(items)
  itemsRef.current = items

  function commit(next: FileUploadItem[]) {
    if (value === undefined) setInternal(next)
    onValueChange?.(next)
  }

  function patchItem(itemId: string, patch: Partial<FileUploadItem>) {
    const next = itemsRef.current.map((it) =>
      it.id === itemId ? { ...it, ...patch } : it
    )
    commit(next)
  }

  function startSimulatedProgress(itemId: string) {
    let p = 0
    const timer = window.setInterval(() => {
      p = Math.min(100, p + 20)
      patchItem(itemId, { progress: p })
      if (p >= 100) window.clearInterval(timer)
    }, 120)
  }

  function addFiles(list: FileList | File[]) {
    const files = Array.from(list)
    const created: FileUploadItem[] = []

    for (const file of files) {
      let error: string | undefined
      if (file.size > maxSize) {
        error = `حجم بیشتر از ${formatBytes(maxSize)}`
      }
      if (accept) {
        const tokens = accept.split(",").map((t) => t.trim())
        const ok = tokens.some((token) => {
          if (token.startsWith(".")) {
            return file.name.toLowerCase().endsWith(token.toLowerCase())
          }
          if (token.endsWith("/*")) {
            return file.type.startsWith(token.slice(0, -1))
          }
          return file.type === token
        })
        if (!ok) error = "نوع فایل مجاز نیست"
      }

      created.push({
        id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
        file,
        progress: error ? 0 : simulateProgress ? 0 : 100,
        error,
        previewUrl: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : undefined,
      })
    }

    const next = multiple ? [...items, ...created] : created.slice(0, 1)
    commit(next)

    for (const item of created) {
      if (!item.error && simulateProgress) startSimulatedProgress(item.id)
    }
  }

  function remove(idToRemove: string) {
    const target = items.find((it) => it.id === idToRemove)
    if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl)
    commit(items.filter((it) => it.id !== idToRemove))
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div
      className={cn("flex w-full flex-col gap-3", className)}
      dir="rtl"
      lang="fa"
    >
      <label
        htmlFor={id}
        onDragOver={(e) => {
          e.preventDefault()
          if (!disabled) setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          if (disabled) return
          if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files)
        }}
        className={cn(
          "flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-6 text-center text-sm text-muted-foreground transition-colors",
          dragging && "border-primary bg-primary/5",
          disabled && "pointer-events-none opacity-50",
          !disabled && "hover:bg-muted/40"
        )}
      >
        <UploadIcon className="size-5" />
        <span className="font-medium text-foreground">{label}</span>
        {description ? (
          <span className="text-xs">{description}</span>
        ) : (
          <span className="text-xs">
            حداکثر {formatBytes(maxSize)}
            {accept ? ` · ${accept}` : null}
          </span>
        )}
        <input
          ref={inputRef}
          id={id}
          type="file"
          className="sr-only"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(e) => {
            if (e.target.files?.length) addFiles(e.target.files)
          }}
        />
      </label>

      {items.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-2 rounded-lg border p-3"
            >
              <div className="flex items-center gap-2">
                {item.previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.previewUrl}
                    alt=""
                    className="size-10 rounded-md object-cover"
                  />
                ) : (
                  <FileIcon className="size-4 shrink-0 text-muted-foreground" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    <bdi dir="ltr">{item.file.name}</bdi>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(item.file.size)}
                    {item.error ? (
                      <span className="text-destructive"> · {item.error}</span>
                    ) : null}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={disabled}
                  onClick={() => remove(item.id)}
                  aria-label="حذف فایل"
                >
                  <XIcon className="size-4" />
                </Button>
              </div>
              {!item.error ? (
                <>
                  <Progress value={item.progress} />
                  <p className="text-xs text-muted-foreground">
                    {toPersianDigits(item.progress)}٪
                  </p>
                </>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

export { FileUpload, formatBytes }
