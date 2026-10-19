/** Shared (server + client) props helpers for CodeBlockCommand. */

export type CodeBlockCommandProps = {
  __npm__?: string
  __yarn__?: string
  __pnpm__?: string
  __bun__?: string
  __npmHtml__?: string
  __yarnHtml__?: string
  __pnpmHtml__?: string
  __bunHtml__?: string
}

/** Map pre-highlighted PM commands into CodeBlockCommand props. */
export function toCodeBlockProps(highlighted: {
  npm: string
  yarn: string
  pnpm: string
  bun: string
  npmHtml: string
  yarnHtml: string
  pnpmHtml: string
  bunHtml: string
}): CodeBlockCommandProps {
  return {
    __npm__: highlighted.npm,
    __yarn__: highlighted.yarn,
    __pnpm__: highlighted.pnpm,
    __bun__: highlighted.bun,
    __npmHtml__: highlighted.npmHtml,
    __yarnHtml__: highlighted.yarnHtml,
    __pnpmHtml__: highlighted.pnpmHtml,
    __bunHtml__: highlighted.bunHtml,
  }
}
