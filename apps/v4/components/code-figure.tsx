import { highlightCode } from "@/lib/highlight-code"
import { CopyButton } from "@/components/copy-button"
import { getIconForLanguageExtension } from "@/components/icons"

/** Same visual shell as docs / ComponentSource code figures. */
export async function CodeFigure({
  code,
  title,
  language = "tsx",
  className,
}: {
  code: string
  title?: string
  language?: string
  className?: string
}) {
  const highlightedCode = await highlightCode(code, language)

  return (
    <figure
      data-rehype-pretty-code-figure=""
      className={
        className ??
        "[&_pre]:max-h-64 [&_pre]:overflow-auto [&_pre]:scrollbar-soft"
      }
    >
      {title ? (
        <figcaption
          data-rehype-pretty-code-title=""
          className="flex items-center gap-2 text-code-foreground [&_svg]:size-4 [&_svg]:text-code-foreground [&_svg]:opacity-70"
          data-language={language}
        >
          {getIconForLanguageExtension(language)}
          {title}
        </figcaption>
      ) : null}
      <CopyButton value={code} />
      <div
        data-not-typeset
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      />
    </figure>
  )
}
