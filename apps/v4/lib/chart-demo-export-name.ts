/** Resolve the default export identifier from a chart demo source file. */
export function getDefaultExportName(source: string): string | null {
  const fnMatch = source.match(
    /export\s+default\s+function\s+([A-Za-z_$][\w$]*)/
  )
  if (fnMatch?.[1]) return fnMatch[1]

  const bareMatch = source.match(
    /export\s+default\s+([A-Za-z_$][\w$]*)\s*;?\s*(?:\r?\n|$)/
  )
  if (bareMatch?.[1] && bareMatch[1] !== "function") return bareMatch[1]

  return null
}

/** Fallback when source parse fails: `simple-bar-chart` → `SimpleBarChart`. */
export function toPascalCaseId(id: string): string {
  return id
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")
}
