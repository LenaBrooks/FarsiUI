"use client"

import * as React from "react"
import { BadgeCheck, Check, ChevronDown, Copy, Download } from "lucide-react"

import { type Skill, type SkillSource } from "@/lib/skills-data"
import { copyToClipboardWithMeta } from "@/components/copy-button"
import { SkillAgentPathRow, SkillCopyCommand } from "@/components/skill-copy"
import { Button } from "@/registry/new-york-v4/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/new-york-v4/ui/dropdown-menu"

export type SkillFileView = {
  path: string
  content: string
  highlighted: string
}

export function SkillDetail({
  skill,
  files,
}: {
  skill: Skill
  files: SkillFileView[]
}) {
  const [activePath, setActivePath] = React.useState(
    files[0]?.path ?? "SKILL.md"
  )
  const active =
    files.find((file) => file.path === activePath) ?? files[0] ?? null
  const hasCompanions = files.length > 1
  const bundleZipUrl = skill.bundleZipUrl

  return (
    <div
      data-slot="docs"
      data-docs-kind="docs"
      dir="rtl"
      lang="fa"
      className="flex scroll-mt-24 items-stretch pb-8 text-base leading-[1.7] xl:w-full"
    >
      <div className="mx-auto flex w-full max-w-160 min-w-0 flex-1 flex-col gap-8 px-4 py-6 text-foreground md:px-0 lg:py-8 dark:text-foreground">
        <header className="flex flex-col gap-2.5">
          <h1 className="docs-page-title scroll-m-24 font-semibold tracking-tight">
            {skill.title}
          </h1>
          {(skill.description ?? skill.summary)
            .split(/\n\n+/)
            .map((paragraph) => (
              <p
                key={paragraph.slice(0, 48)}
                className="docs-page-description text-pretty text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
          <SkillSourceMeta source={skill.source} />
        </header>

        <div className="typeset w-full flex-1">
          <h2>کاربردها</h2>
          <ul>
            {skill.useCases.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          {skill.example ? (
            <>
              <h2>مثال</h2>
              <p>{skill.example}</p>
            </>
          ) : null}

          {bundleZipUrl ? null : (
            <>
              <h2>فایل‌های مهارت</h2>
              {hasCompanions ? (
                <p>
                  این مجموعه {files.length.toLocaleString("fa-IR")} فایل مهارت
                  داره. با فلش کنار نام هر فایل می‌تونی محتوای هرکدوم رو ببینی.
                  نصب از طریق CLI، همه فایل‌های مجموعه رو دریافت می‌کنه.
                </p>
              ) : null}
            </>
          )}

          {!bundleZipUrl && active ? (
            <div data-not-typeset="" className="mt-5 mb-8 w-full">
              <figure
                data-rehype-pretty-code-figure=""
                data-not-typeset=""
                dir="ltr"
                lang="en"
                className="m-0! overflow-hidden rounded-xl border bg-code text-code-foreground md:mx-0!"
              >
                <figcaption className="flex h-9 shrink-0 items-center gap-2 border-b px-3 text-xs text-code-foreground">
                  {hasCompanions ? (
                    <>
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger
                          className="inline-flex h-7 max-w-[min(100%,18rem)] cursor-pointer items-center gap-1 rounded-sm px-0.5 font-mono text-xs text-code-foreground outline-none hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring/40"
                        >
                          <span className="truncate">{active.path}</span>
                          <ChevronDown
                            className="size-3.5 shrink-0 opacity-70"
                            aria-hidden
                          />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          dir="ltr"
                          align="start"
                          className="max-w-[min(100vw-2rem,24rem)] font-mono text-xs"
                        >
                          {files.map((file) => (
                            <DropdownMenuItem
                              key={file.path}
                              className="cursor-pointer font-mono text-xs"
                              onClick={() => setActivePath(file.path)}
                            >
                              <span className="min-w-0 flex-1 truncate">
                                {file.path}
                              </span>
                              {file.path === active.path ? (
                                <Check className="size-3.5 shrink-0 opacity-70" />
                              ) : null}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <span
                        dir="rtl"
                        lang="fa"
                        className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 font-sans text-[11px] leading-none text-muted-foreground tabular-nums"
                      >
                        {(
                          files.findIndex((file) => file.path === active.path) +
                          1
                        ).toLocaleString("fa-IR")}
                        {" از "}
                        {files.length.toLocaleString("fa-IR")}
                      </span>
                    </>
                  ) : (
                    <span dir="ltr" lang="en" className="truncate font-mono">
                      {active.path}
                    </span>
                  )}
                  <div className="ms-auto flex shrink-0 items-center gap-0.5">
                    <SkillFileCopyButton value={active.content} />
                    <SkillFileDownloadButton
                      content={active.content}
                      filename={active.path.split("/").pop() ?? active.path}
                    />
                  </div>
                </figcaption>
                <div
                  className="max-h-72 overflow-auto text-start text-[length:var(--docs-code)] leading-[1.5] [&_pre]:max-h-none"
                  dangerouslySetInnerHTML={{ __html: active.highlighted }}
                />
              </figure>
            </div>
          ) : null}

          <h2>نصب</h2>

          <h3>نصب سریع با CLI</h3>
          {bundleZipUrl ? (
            <p>
              CLI فقط{" "}
              <code dir="ltr" lang="en">
                SKILL.md
              </code>{" "}
              را می‌گذارد؛ برای کل مرجع‌ها از نصب دستی و ZIP استفاده کنید.
            </p>
          ) : null}
          <SkillCopyCommand command={skill.installCommand} />

          <h3>نصب دستی</h3>
          {bundleZipUrl ? (
            <>
              <p>
                فایل ZIP را دانلود کنید، از حالت فشرده خارج کنید و پوشهٔ{" "}
                <code dir="ltr" lang="en">
                  {skill.slug}
                </code>{" "}
                را در یکی از مسیرهای زیر بگذارید:
              </p>
              <div
                data-not-typeset=""
                className="mt-4 mb-4 flex flex-wrap gap-2"
              >
                <Button asChild variant="outline">
                  <a href={bundleZipUrl} download={`${skill.slug}.zip`}>
                    <Download className="size-4" />
                    دانلود ZIP
                  </a>
                </Button>
                <SkillZipCopyLink url={bundleZipUrl} />
              </div>
            </>
          ) : (
            <p>
              {hasCompanions
                ? "کل پوشهٔ مهارت (SKILL.md به‌همراه فایل‌های همراه) را در یکی از مسیرهای زیر بگذارید:"
                : "فایل را دانلود کنید یا خودتان بسازید و در یکی از مسیرهای زیر بگذارید:"}
            </p>
          )}
          <div data-not-typeset="" className="mt-4 mb-2 space-y-2">
            {skill.installTargets
              .filter((target) => target.id !== "other")
              .map((target) => (
                <SkillAgentPathRow
                  key={target.id}
                  id={target.id}
                  name={target.name}
                  paths={target.paths}
                  note={target.note}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function SkillSourceMeta({ source }: { source?: SkillSource }) {
  const resolved: SkillSource = source ?? { name: "FarsiUI" }

  return (
    <p className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-muted-foreground/80">
      <BadgeCheck className="size-3.5 shrink-0 opacity-80" aria-hidden />
      {resolved.url ? (
        <a
          href={resolved.url}
          target="_blank"
          rel="noreferrer"
          className="transition-colors hover:text-foreground hover:underline hover:underline-offset-2"
        >
          {resolved.name}
        </a>
      ) : (
        <span>{resolved.name}</span>
      )}
    </p>
  )
}

function SkillZipCopyLink({ url }: { url: string }) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1800)
    return () => clearTimeout(timer)
  }, [copied])

  return (
    <Button
      type="button"
      variant="outline"
      onClick={async () => {
        const ok = await copyToClipboardWithMeta(url)
        if (ok) setCopied(true)
      }}
    >
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      {copied ? "لینک کپی شد" : "کپی لینک دانلود"}
    </Button>
  )
}

function SkillFileCopyButton({ value }: { value: string }) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1800)
    return () => clearTimeout(timer)
  }, [copied])

  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      data-slot="copy-button"
      className="size-6 cursor-pointer rounded-sm"
      title={copied ? "کپی شد" : "کپی فایل"}
      aria-label={copied ? "کپی شد" : "کپی فایل"}
      onClick={async () => {
        const ok = await copyToClipboardWithMeta(value)
        if (ok) setCopied(true)
      }}
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
    </Button>
  )
}

function SkillFileDownloadButton({
  content,
  filename,
}: {
  content: string
  filename: string
}) {
  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      className="size-6 cursor-pointer rounded-sm"
      title="دانلود فایل"
      aria-label="دانلود فایل"
      onClick={() => {
        const blob = new Blob([content], {
          type: "text/markdown;charset=utf-8",
        })
        const url = URL.createObjectURL(blob)
        const anchor = document.createElement("a")
        anchor.href = url
        anchor.download = filename
        document.body.appendChild(anchor)
        anchor.click()
        anchor.remove()
        URL.revokeObjectURL(url)
      }}
    >
      <Download className="size-3.5" />
    </Button>
  )
}
