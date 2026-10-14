"use client"

import * as React from "react"
import { CheckIcon, LandmarkIcon } from "lucide-react"
import { cn } from "cn"

import {
  formatSheba,
  isSheba,
  normalizeSheba,
} from "@/registry/bases/base/lib/iran"
import { Input } from "@/registry/bases/base/ui/input"

export type ShebaInputProps = Omit<
  React.ComponentProps<typeof Input>,
  "value" | "defaultValue" | "onChange" | "type"
> & {
  value?: string
  defaultValue?: string
  /** Normalized IR… string + validity when length complete. */
  onValueChange?: (sheba: string, valid: boolean) => void
}

function ShebaInput({
  className,
  value,
  defaultValue,
  onValueChange,
  disabled,
  id,
  ...props
}: ShebaInputProps) {
  const [internal, setInternal] = React.useState(() =>
    normalizeSheba(defaultValue ?? "")
  )
  const sheba = value !== undefined ? normalizeSheba(value) : internal
  const complete = sheba.length === 26
  const valid = isSheba(sheba)
  const invalid = complete && !valid

  function set(next: string) {
    const s = normalizeSheba(next)
    if (value === undefined) setInternal(s)
    onValueChange?.(s, isSheba(s))
  }

  return (
    <div className={cn("relative w-full", className)} dir="ltr">
      <LandmarkIcon className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        id={id}
        inputMode="text"
        autoComplete="off"
        dir="ltr"
        lang="en"
        persianDigits={false}
        disabled={disabled}
        value={formatSheba(sheba)}
        onChange={(e) => set(e.target.value)}
        placeholder="IR00 0000 0000 0000 0000 0000 00"
        aria-invalid={invalid || undefined}
        className={cn(
          "ps-9 pe-9 font-mono text-start text-xs tabular-nums sm:text-sm",
          invalid && "border-destructive"
        )}
        {...props}
      />
      {valid ? (
        <CheckIcon className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-emerald-600 dark:text-emerald-400" />
      ) : null}
    </div>
  )
}

export { ShebaInput, isSheba, normalizeSheba, formatSheba }
