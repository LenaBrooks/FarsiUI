"use client"

import * as React from "react"
import type { Editor } from "@tiptap/react"
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BaselineIcon,
  BoldIcon,
  ChevronDownIcon,
  CodeIcon,
  CodeXmlIcon,
  EraserIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  HighlighterIcon,
  ImageIcon,
  IndentDecreaseIcon,
  IndentIncreaseIcon,
  ItalicIcon,
  LinkIcon,
  ListChecksIcon,
  ListIcon,
  ListOrderedIcon,
  MinusIcon,
  MoreHorizontalIcon,
  PilcrowIcon,
  QuoteIcon,
  RedoIcon,
  RemoveFormattingIcon,
  SquareSplitHorizontalIcon,
  StrikethroughIcon,
  SubscriptIcon,
  SuperscriptIcon,
  TableIcon,
  UnderlineIcon,
  UndoIcon,
} from "lucide-react"
import { cn } from "cn"

import {
  isAllowedRichTextUrl,
  normalizeRichTextUrl,
  type RichTextEditorVariant,
} from "@/registry/bases/base/lib/rich-text-editor"
import {
  RICH_TEXT_FONT_FAMILIES,
  RICH_TEXT_FONT_SIZES,
  RICH_TEXT_HIGHLIGHT_COLORS,
  RICH_TEXT_TEXT_COLORS,
} from "@/registry/bases/base/lib/rich-text-editor-presets"
import { Button } from "@/registry/bases/base/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/bases/base/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/registry/bases/base/ui/dropdown-menu"
import { Input } from "@/registry/bases/base/ui/input"
import { Label } from "@/registry/bases/base/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/bases/base/ui/popover"
import { Separator } from "@/registry/bases/base/ui/separator"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/bases/base/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/bases/base/ui/tooltip"

const toolbarControlClassName = "cursor-pointer"
const toolbarDropdownContentClassName =
  "[&_[data-slot=dropdown-menu-item]]:cursor-pointer"
/** One horizontal row + scroll; avoid wrap so the «more» control stays aligned. */
const toolbarScrollRowClassName = cn(
  "flex min-w-0 flex-1 flex-nowrap items-center gap-0.5 overflow-x-auto overscroll-x-contain touch-pan-x scrollbar-none"
)
/**
 * Compact toolbar controls — beat DS (vega) padding/radius on cn-button/toggle.
 */
const toolbarRadiusClassName = "[border-radius:0.375rem]!"
const toolbarIconButtonClassName = cn(
  "size-7! shrink-0 p-0!",
  toolbarRadiusClassName,
  toolbarControlClassName
)
const toolbarDropdownTriggerClassName = cn(
  "h-7 shrink-0 gap-0.5 px-1.5 text-xs",
  toolbarRadiusClassName,
  toolbarControlClassName
)
const toolbarToggleItemClassName = cn(
  "size-7! min-w-7! shrink-0 px-0! py-0!",
  toolbarRadiusClassName
)

function ToolbarGroup({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex shrink-0 items-center gap-0.5"
    >
      {children}
    </div>
  )
}

function ToolbarDivider() {
  return (
    <Separator orientation="vertical" className="mx-0.5 h-5 shrink-0" />
  )
}

function ToolbarIconButton({
  label,
  disabled,
  pressed,
  onClick,
  children,
  className,
}: {
  label: string
  disabled?: boolean
  pressed?: boolean
  onClick?: () => void
  children: React.ReactNode
  className?: string
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            variant={pressed ? "secondary" : "ghost"}
            size="icon-sm"
            disabled={disabled}
            aria-label={label}
            aria-pressed={pressed}
            className={cn(toolbarIconButtonClassName, className)}
            onClick={onClick}
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  )
}

function ColorSwatchPopover({
  label,
  icon,
  disabled,
  colors,
  value,
  onSelect,
}: {
  label: string
  icon: React.ReactNode
  disabled?: boolean
  colors: readonly { label: string; value: string }[]
  value?: string
  onSelect: (color: string) => void
}) {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={disabled}
            aria-label={label}
            title={label}
            className={toolbarIconButtonClassName}
          />
        }
      >
        {icon}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="start">
        <div className="grid grid-cols-5 gap-1.5">
          {colors.map((color) => (
            <button
              key={color.label}
              type="button"
              title={color.label}
              aria-label={color.label}
              className={cn(
                "size-7 cursor-pointer rounded-md border border-border transition-transform hover:scale-105 max-md:size-9",
                !color.value &&
                  "relative overflow-hidden bg-background after:absolute after:inset-x-0 after:top-1/2 after:h-px after:-rotate-45 after:bg-destructive",
                value === color.value && "ring-2 ring-ring"
              )}
              style={
                color.value ? { backgroundColor: color.value } : undefined
              }
              onClick={() => onSelect(color.value)}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function LinkDialog({
  open,
  onOpenChange,
  initialUrl,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialUrl: string
  onSubmit: (url: string) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open ? (
        <LinkDialogForm
          key={initialUrl}
          initialUrl={initialUrl}
          onOpenChange={onOpenChange}
          onSubmit={onSubmit}
        />
      ) : null}
    </Dialog>
  )
}

function LinkDialogForm({
  initialUrl,
  onOpenChange,
  onSubmit,
}: {
  initialUrl: string
  onOpenChange: (open: boolean) => void
  onSubmit: (url: string) => void
}) {
  const [url, setUrl] = React.useState(initialUrl)
  const [error, setError] = React.useState<string | null>(null)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const normalized = normalizeRichTextUrl(url)
    if (!isAllowedRichTextUrl(normalized)) {
      setError("آدرس باید با http:// یا https:// شروع شود.")
      return
    }
    onSubmit(normalized)
    onOpenChange(false)
  }

  return (
    <DialogContent className="sm:max-w-md">
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>درج لینک</DialogTitle>
          <DialogDescription>
            آدرس صفحهٔ مقصد را وارد کنید.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <div className="grid gap-1.5">
            <Label htmlFor="rte-link-url">نشانی</Label>
            <Input
              id="rte-link-url"
              dir="ltr"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                setError(null)
              }}
              aria-invalid={error ? true : undefined}
            />
            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : null}
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" className={toolbarControlClassName}>
            اعمال
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}

function ImageDialog({
  open,
  onOpenChange,
  onSubmitUrl,
  onUploadImage,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmitUrl: (url: string) => void
  onUploadImage?: (file: File) => Promise<string>
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open ? (
        <ImageDialogForm
          onOpenChange={onOpenChange}
          onSubmitUrl={onSubmitUrl}
          onUploadImage={onUploadImage}
        />
      ) : null}
    </Dialog>
  )
}

function ImageDialogForm({
  onOpenChange,
  onSubmitUrl,
  onUploadImage,
}: {
  onOpenChange: (open: boolean) => void
  onSubmitUrl: (url: string) => void
  onUploadImage?: (file: File) => Promise<string>
}) {
  const [url, setUrl] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [uploading, setUploading] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const insertUrl = () => {
    const normalized = normalizeRichTextUrl(url)
    if (!isAllowedRichTextUrl(normalized)) {
      setError("آدرس تصویر باید با http:// یا https:// شروع شود.")
      return
    }
    onSubmitUrl(normalized)
    onOpenChange(false)
  }

  const handleFile = async (file: File | undefined) => {
    if (!file || !onUploadImage) return
    setUploading(true)
    setError(null)
    try {
      const uploaded = await onUploadImage(file)
      if (!isAllowedRichTextUrl(normalizeRichTextUrl(uploaded))) {
        setError("آدرس برگشتی از آپلود معتبر نیست.")
        return
      }
      onSubmitUrl(normalizeRichTextUrl(uploaded))
      onOpenChange(false)
    } catch {
      setError("آپلود تصویر انجام نشد.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>درج تصویر</DialogTitle>
        <DialogDescription>
          نشانی تصویر را وارد کنید یا فایل را انتخاب کنید.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-3 py-2">
        <div className="grid gap-1.5">
          <Label htmlFor="rte-image-url">نشانی تصویر</Label>
          <Input
            id="rte-image-url"
            dir="ltr"
            placeholder="https://example.com/image.jpg"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value)
              setError(null)
            }}
            aria-invalid={error ? true : undefined}
          />
        </div>
        {onUploadImage ? (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => void handleFile(e.target.files?.[0])}
            />
            <Button
              type="button"
              variant="outline"
              disabled={uploading}
              className={toolbarControlClassName}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? "در حال آپلود…" : "انتخاب فایل"}
            </Button>
          </>
        ) : null}
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </div>
      <DialogFooter>
        <Button
          type="button"
          className={toolbarControlClassName}
          onClick={insertUrl}
        >
          درج از نشانی
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}

export function RichTextEditorToolbar({
  editor,
  disabled,
  className,
  onUploadImage,
  variant = "simple",
}: {
  editor: Editor | null
  disabled?: boolean
  className?: string
  onUploadImage?: (file: File) => Promise<string>
  variant?: RichTextEditorVariant
}) {
  const [linkOpen, setLinkOpen] = React.useState(false)
  const [imageOpen, setImageOpen] = React.useState(false)
  const [moreOpen, setMoreOpen] = React.useState(false)
  const [, setTick] = React.useState(0)
  const [tooltipDelay, setTooltipDelay] = React.useState(700)
  const isAdvanced = variant === "advanced"

  React.useEffect(() => {
    if (!editor) return
    const refresh = () => setTick((n) => n + 1)
    editor.on("selectionUpdate", refresh)
    editor.on("transaction", refresh)
    return () => {
      editor.off("selectionUpdate", refresh)
      editor.off("transaction", refresh)
    }
  }, [editor])

  React.useEffect(() => {
    const media = window.matchMedia("(pointer: coarse)")
    const sync = () => setTooltipDelay(media.matches ? 100_000 : 700)
    sync()
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [])

  if (!editor) return null

  const isDisabled = disabled || !editor.isEditable
  const currentLink =
    (editor.getAttributes("link").href as string | undefined) ?? ""
  const textStyle = isAdvanced
    ? editor.getAttributes("textStyle")
    : ({} as Record<string, string | undefined>)
  const currentColor = (textStyle.color as string | undefined) ?? ""
  const currentHighlight = isAdvanced
    ? ((editor.getAttributes("highlight").color as string | undefined) ?? "")
    : ""
  const currentFontFamily = (textStyle.fontFamily as string | undefined) ?? ""
  const currentFontSize = (textStyle.fontSize as string | undefined) ?? ""

  const canSinkListItem = editor.can().sinkListItem("listItem")
  const canLiftListItem = editor.can().liftListItem("listItem")
  const canSinkTaskItem =
    isAdvanced && editor.can().sinkListItem("taskItem")
  const canLiftTaskItem =
    isAdvanced && editor.can().liftListItem("taskItem")
  const canSink = canSinkListItem || canSinkTaskItem
  const canLift = canLiftListItem || canLiftTaskItem

  const sinkList = () => {
    if (canSinkTaskItem) {
      editor.chain().focus().sinkListItem("taskItem").run()
      return
    }
    editor.chain().focus().sinkListItem("listItem").run()
  }

  const liftList = () => {
    if (canLiftTaskItem) {
      editor.chain().focus().liftListItem("taskItem").run()
      return
    }
    editor.chain().focus().liftListItem("listItem").run()
  }

  return (
    <TooltipProvider delay={tooltipDelay}>
      <div
        data-slot="rich-text-editor-toolbar"
        data-variant={variant}
        role="toolbar"
        aria-label="نوار ابزار ویرایشگر"
        aria-orientation="horizontal"
        aria-disabled={isDisabled || undefined}
        className={cn(
          "flex w-full flex-col gap-0.5 border-b border-input bg-muted/30 p-1 touch-manipulation",
          "[&_button]:cursor-pointer [&_button]:[border-radius:0.375rem]!",
          "[&_[data-slot=toggle-group-item]]:[border-radius:0.375rem]!",
          "[&_svg:not([class*='size-'])]:size-3.5",
          isDisabled && "pointer-events-none opacity-50",
          className
        )}
      >
        <div className="flex w-full min-w-0 items-center gap-0.5">
          <div className={toolbarScrollRowClassName}>
          <ToolbarGroup label="تاریخچه">
            <ToolbarIconButton
              label="واگرد"
              disabled={isDisabled || !editor.can().undo()}
              onClick={() => editor.chain().focus().undo().run()}
            >
              <UndoIcon className="size-4" />
            </ToolbarIconButton>
            <ToolbarIconButton
              label="از نو"
              disabled={isDisabled || !editor.can().redo()}
              onClick={() => editor.chain().focus().redo().run()}
            >
              <RedoIcon className="size-4" />
            </ToolbarIconButton>
          </ToolbarGroup>

          <ToolbarDivider />

          <ToolbarGroup label="سبک">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={isDisabled}
                    className={toolbarDropdownTriggerClassName}
                    aria-label="سبک پاراگراف"
                  />
                }
              >
                عنوان
                <ChevronDownIcon className="size-3.5 opacity-70" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className={toolbarDropdownContentClassName}
              >
                <DropdownMenuItem
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                  }
                >
                  <Heading1Icon className="size-4" />
                  عنوان ۱
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                >
                  <Heading2Icon className="size-4" />
                  عنوان ۲
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                  }
                >
                  <Heading3Icon className="size-4" />
                  عنوان ۳
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => editor.chain().focus().setParagraph().run()}
                >
                  <PilcrowIcon className="size-4" />
                  پاراگراف
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </ToolbarGroup>

          <ToolbarDivider />

            <ToolbarGroup label="قالب متن">
              <ToggleGroup
                type="multiple"
                variant="outline"
                size="sm"
                spacing={0}
                aria-label="سبک متن"
              >
              <ToggleGroupItem
                value="bold"
                aria-label="درشت"
                disabled={isDisabled}
                className={toolbarToggleItemClassName}
                data-state={editor.isActive("bold") ? "on" : "off"}
                onClick={() => editor.chain().focus().toggleBold().run()}
              >
                <BoldIcon className="size-4" />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="italic"
                aria-label="مورب"
                disabled={isDisabled}
                className={toolbarToggleItemClassName}
                data-state={editor.isActive("italic") ? "on" : "off"}
                onClick={() => editor.chain().focus().toggleItalic().run()}
              >
                <ItalicIcon className="size-4" />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="underline"
                aria-label="زیرخط"
                disabled={isDisabled}
                className={toolbarToggleItemClassName}
                data-state={editor.isActive("underline") ? "on" : "off"}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
              >
                <UnderlineIcon className="size-4" />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="strike"
                aria-label="خط‌خورده"
                disabled={isDisabled}
                className={toolbarToggleItemClassName}
                data-state={editor.isActive("strike") ? "on" : "off"}
                onClick={() => editor.chain().focus().toggleStrike().run()}
              >
                <StrikethroughIcon className="size-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </ToolbarGroup>

          {isAdvanced ? (
            <>
              <ToolbarDivider />
                <ToolbarGroup label="تراز">
                  <ToggleGroup
                    type="single"
                    variant="outline"
                    size="sm"
                    spacing={0}
                    aria-label="تراز متن"
                  >
                  <ToggleGroupItem
                    value="right"
                    aria-label="راست‌چین"
                    disabled={isDisabled}
                    className={toolbarToggleItemClassName}
                    data-state={
                      editor.isActive({ textAlign: "right" }) ? "on" : "off"
                    }
                    onClick={() =>
                      editor.chain().focus().setTextAlign("right").run()
                    }
                  >
                    <AlignRightIcon className="size-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="center"
                    aria-label="وسط‌چین"
                    disabled={isDisabled}
                    className={toolbarToggleItemClassName}
                    data-state={
                      editor.isActive({ textAlign: "center" }) ? "on" : "off"
                    }
                    onClick={() =>
                      editor.chain().focus().setTextAlign("center").run()
                    }
                  >
                    <AlignCenterIcon className="size-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="left"
                    aria-label="چپ‌چین"
                    disabled={isDisabled}
                    className={toolbarToggleItemClassName}
                    data-state={
                      editor.isActive({ textAlign: "left" }) ? "on" : "off"
                    }
                    onClick={() =>
                      editor.chain().focus().setTextAlign("left").run()
                    }
                  >
                    <AlignLeftIcon className="size-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="justify"
                    aria-label="تراز دوطرفه"
                    disabled={isDisabled}
                    className={toolbarToggleItemClassName}
                    data-state={
                      editor.isActive({ textAlign: "justify" }) ? "on" : "off"
                    }
                    onClick={() =>
                      editor.chain().focus().setTextAlign("justify").run()
                    }
                  >
                    <AlignJustifyIcon className="size-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
              </ToolbarGroup>
            </>
          ) : null}

          <ToolbarDivider />

          <ToolbarGroup label="فهرست">
            <ToolbarIconButton
              label="فهرست گلوله‌ای"
              disabled={isDisabled}
              pressed={editor.isActive("bulletList")}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <ListIcon className="size-4" />
            </ToolbarIconButton>
            <ToolbarIconButton
              label="فهرست شماره‌دار"
              disabled={isDisabled}
              pressed={editor.isActive("orderedList")}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <ListOrderedIcon className="size-4" />
            </ToolbarIconButton>
          </ToolbarGroup>

          <ToolbarDivider />

          <ToolbarGroup label="درج سریع">
            <ToolbarIconButton
              label="لینک"
              disabled={isDisabled}
              pressed={editor.isActive("link")}
              onClick={() => setLinkOpen(true)}
            >
              <LinkIcon className="size-4" />
            </ToolbarIconButton>
            <ToolbarIconButton
              label="تصویر"
              disabled={isDisabled}
              onClick={() => setImageOpen(true)}
            >
              <ImageIcon className="size-4" />
            </ToolbarIconButton>
            <ToolbarIconButton
              label="نقل‌قول"
              disabled={isDisabled}
              pressed={editor.isActive("blockquote")}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
              <QuoteIcon className="size-4" />
            </ToolbarIconButton>
          </ToolbarGroup>
          </div>

          {isAdvanced ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={isDisabled}
              className={cn(
                "ms-0.5 shrink-0 self-center bg-muted/25 text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                toolbarIconButtonClassName,
                moreOpen && "bg-muted/50 text-foreground"
              )}
              aria-label={moreOpen ? "بستن ابزارهای بیشتر" : "ابزارهای بیشتر"}
              aria-expanded={moreOpen}
              aria-controls="rich-text-editor-toolbar-more"
              onClick={() => setMoreOpen((open) => !open)}
            >
              <MoreHorizontalIcon className="size-4" />
            </Button>
          ) : null}
        </div>

        {isAdvanced && moreOpen ? (
          <div
            id="rich-text-editor-toolbar-more"
            role="group"
            aria-label="ابزارهای بیشتر"
            className={cn(toolbarScrollRowClassName, "w-full flex-none")}
          >
                <ToolbarGroup label="قلم">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className={toolbarDropdownTriggerClassName}
                        />
                      }
                    >
                      قلم
                      <ChevronDownIcon className="size-3.5 opacity-70" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                align="start"
                className={toolbarDropdownContentClassName}
              >
                      {RICH_TEXT_FONT_FAMILIES.map((font) => (
                        <DropdownMenuItem
                          key={font.label}
                          onClick={() => {
                            if (!font.value) {
                              editor.chain().focus().unsetFontFamily().run()
                              return
                            }
                            editor
                              .chain()
                              .focus()
                              .setFontFamily(font.value)
                              .run()
                          }}
                        >
                          <span
                            style={
                              font.value
                                ? { fontFamily: font.value }
                                : undefined
                            }
                          >
                            {font.label}
                            {currentFontFamily === font.value ? " ✓" : ""}
                          </span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className={toolbarDropdownTriggerClassName}
                        />
                      }
                    >
                      اندازه
                      <ChevronDownIcon className="size-3.5 opacity-70" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                align="start"
                className={toolbarDropdownContentClassName}
              >
                      <DropdownMenuItem
                        onClick={() =>
                          editor.chain().focus().unsetFontSize().run()
                        }
                      >
                        پیش‌فرض{!currentFontSize ? " ✓" : ""}
                      </DropdownMenuItem>
                      {RICH_TEXT_FONT_SIZES.map((size) => (
                        <DropdownMenuItem
                          key={size.value}
                          onClick={() =>
                            editor
                              .chain()
                              .focus()
                              .setFontSize(size.value)
                              .run()
                          }
                        >
                          <span style={{ fontSize: size.value }}>
                            {size.label}
                            {currentFontSize === size.value ? " ✓" : ""}
                          </span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </ToolbarGroup>

                <ToolbarDivider />

                <ToolbarGroup label="رنگ و علامت">
                  <ColorSwatchPopover
                    label="رنگ متن"
                    disabled={isDisabled}
                    icon={<BaselineIcon className="size-4" />}
                    colors={RICH_TEXT_TEXT_COLORS}
                    value={currentColor}
                    onSelect={(color) => {
                      if (!color) {
                        editor.chain().focus().unsetColor().run()
                        return
                      }
                      editor.chain().focus().setColor(color).run()
                    }}
                  />
                  <ColorSwatchPopover
                    label="هایلایت"
                    disabled={isDisabled}
                    icon={<HighlighterIcon className="size-4" />}
                    colors={RICH_TEXT_HIGHLIGHT_COLORS}
                    value={currentHighlight}
                    onSelect={(color) => {
                      if (!color) {
                        editor.chain().focus().unsetHighlight().run()
                        return
                      }
                      editor
                        .chain()
                        .focus()
                        .toggleHighlight({ color })
                        .run()
                    }}
                  />
                  <ToolbarIconButton
                    label="حذف قالب‌بندی"
                    disabled={isDisabled}
                    onClick={() =>
                      editor.chain().focus().unsetAllMarks().run()
                    }
                  >
                    <RemoveFormattingIcon className="size-4" />
                  </ToolbarIconButton>
                  <ToolbarIconButton
                    label="کد درخط"
                    disabled={isDisabled}
                    pressed={editor.isActive("code")}
                    onClick={() => editor.chain().focus().toggleCode().run()}
                  >
                    <CodeIcon className="size-4" />
                  </ToolbarIconButton>
                  <ToolbarIconButton
                    label="زیرنویس"
                    disabled={isDisabled}
                    pressed={editor.isActive("subscript")}
                    onClick={() =>
                      editor.chain().focus().toggleSubscript().run()
                    }
                  >
                    <SubscriptIcon className="size-4" />
                  </ToolbarIconButton>
                  <ToolbarIconButton
                    label="بالانویس"
                    disabled={isDisabled}
                    pressed={editor.isActive("superscript")}
                    onClick={() =>
                      editor.chain().focus().toggleSuperscript().run()
                    }
                  >
                    <SuperscriptIcon className="size-4" />
                  </ToolbarIconButton>
                </ToolbarGroup>

                <ToolbarDivider />

                <ToolbarGroup label="فهرست پیشرفته">
                  <ToolbarIconButton
                    label="فهرست کارها"
                    disabled={isDisabled}
                    pressed={editor.isActive("taskList")}
                    onClick={() =>
                      editor.chain().focus().toggleTaskList().run()
                    }
                  >
                    <ListChecksIcon className="size-4" />
                  </ToolbarIconButton>
                  <ToolbarIconButton
                    label="کاهش تورفتگی"
                    disabled={isDisabled || !canLift}
                    onClick={liftList}
                  >
                    <IndentDecreaseIcon className="size-4" />
                  </ToolbarIconButton>
                  <ToolbarIconButton
                    label="افزایش تورفتگی"
                    disabled={isDisabled || !canSink}
                    onClick={sinkList}
                  >
                    <IndentIncreaseIcon className="size-4" />
                  </ToolbarIconButton>
                </ToolbarGroup>

                <ToolbarDivider />

                <ToolbarGroup label="درج و بلوک">
                  <ToolbarIconButton
                    label="درج جدول ۳×۳"
                    disabled={isDisabled}
                    pressed={editor.isActive("table")}
                    onClick={() =>
                      editor
                        .chain()
                        .focus()
                        .insertTable({
                          rows: 3,
                          cols: 3,
                          withHeaderRow: true,
                        })
                        .run()
                    }
                  >
                    <TableIcon className="size-4" />
                  </ToolbarIconButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={
                            isDisabled || !editor.isActive("table")
                          }
                          className={toolbarDropdownTriggerClassName}
                          aria-label="ویرایش جدول"
                        />
                      }
                    >
                      جدول
                      <ChevronDownIcon className="size-3.5 opacity-70" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                align="start"
                className={toolbarDropdownContentClassName}
              >
                      <DropdownMenuLabel>ویرایش جدول</DropdownMenuLabel>
                      <DropdownMenuItem
                        disabled={!editor.can().addColumnBefore()}
                        onClick={() =>
                          editor.chain().focus().addColumnBefore().run()
                        }
                      >
                        ستون قبل
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={!editor.can().addColumnAfter()}
                        onClick={() =>
                          editor.chain().focus().addColumnAfter().run()
                        }
                      >
                        ستون بعد
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={!editor.can().deleteColumn()}
                        onClick={() =>
                          editor.chain().focus().deleteColumn().run()
                        }
                      >
                        حذف ستون
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={!editor.can().addRowBefore()}
                        onClick={() =>
                          editor.chain().focus().addRowBefore().run()
                        }
                      >
                        ردیف قبل
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={!editor.can().addRowAfter()}
                        onClick={() =>
                          editor.chain().focus().addRowAfter().run()
                        }
                      >
                        ردیف بعد
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={!editor.can().deleteRow()}
                        onClick={() =>
                          editor.chain().focus().deleteRow().run()
                        }
                      >
                        حذف ردیف
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={!editor.can().mergeCells()}
                        onClick={() =>
                          editor.chain().focus().mergeCells().run()
                        }
                      >
                        <SquareSplitHorizontalIcon className="size-4" />
                        ادغام سلول‌ها
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={!editor.can().splitCell()}
                        onClick={() =>
                          editor.chain().focus().splitCell().run()
                        }
                      >
                        جدا کردن سلول
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={!editor.can().toggleHeaderRow()}
                        onClick={() =>
                          editor.chain().focus().toggleHeaderRow().run()
                        }
                      >
                        ردیف عنوان
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={!editor.can().deleteTable()}
                        onClick={() =>
                          editor.chain().focus().deleteTable().run()
                        }
                      >
                        <EraserIcon className="size-4" />
                        حذف جدول
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <ToolbarIconButton
                    label="بلوک کد"
                    disabled={isDisabled}
                    pressed={editor.isActive("codeBlock")}
                    onClick={() =>
                      editor.chain().focus().toggleCodeBlock().run()
                    }
                  >
                    <CodeXmlIcon className="size-4" />
                  </ToolbarIconButton>
                  <ToolbarIconButton
                    label="خط افقی"
                    disabled={isDisabled}
                    onClick={() =>
                      editor.chain().focus().setHorizontalRule().run()
                    }
                  >
                    <MinusIcon className="size-4" />
                  </ToolbarIconButton>
                </ToolbarGroup>
          </div>
        ) : null}
      </div>

      <LinkDialog
        open={linkOpen}
        onOpenChange={setLinkOpen}
        initialUrl={currentLink}
        onSubmit={(href) => {
          if (!href) {
            editor.chain().focus().extendMarkRange("link").unsetLink().run()
            return
          }
          editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href })
            .run()
        }}
      />

      <ImageDialog
        open={imageOpen}
        onOpenChange={setImageOpen}
        onUploadImage={onUploadImage}
        onSubmitUrl={(src) => {
          editor.chain().focus().setImage({ src }).run()
        }}
      />
    </TooltipProvider>
  )
}
