"use client"

import * as React from "react"
import { CheckIcon, IdCardIcon } from "lucide-react"
import { cn } from "cn"

import {
  formatNationalId,
  isNationalId,
  normalizeNationalId,
} from "@/registry/bases/base/lib/iran"
import { toPersianDigits } from "@/registry/bases/base/lib/digits"
import { Input } from "@/registry/bases/base/ui/input"

export type NationalCodeInputProps = Omit<
  React.ComponentProps<typeof Input>,
  "value" | "defaultValue" | "onChange" | "type"
> & {
  value?: string
  defaultValue?: string
  onValueChange?: (digits: string, valid: boolean) => void
}

function NationalCodeInput({
  className,
  value,
  defaultValue,
  onValueChange,
  disabled,
  id,
  ...props
}: NationalCodeInputProps) {
  const [internal, setInternal] = React.useState(() =>
    normalizeNationalId(defaultValue ?? "")
  )
  const digits =
    value !== undefined ? normalizeNationalId(value) : internal
  const complete = digits.length === 10
  const valid = isNationalId(digits)
  const invalid = complete && !valid

  function set(next: string) {
    const d = normalizeNationalId(next)
    if (value === undefined) setInternal(d)
    onValueChange?.(d, isNationalId(d))
  }

  return (
    <div className={cn("relative w-full", className)} dir="ltr">
      <IdCardIcon className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        id={id}
        inputMode="numeric"
        autoComplete="off"
        dir="ltr"
        lang="fa"
        persianDigits
        disabled={disabled}
        value={formatNationalId(digits)}
        onChange={(e) => set(e.target.value)}
        placeholder={toPersianDigits("001-234567-8")}
        aria-invalid={invalid || undefined}
        className={cn("ps-9 pe-9 text-start tabular-nums", invalid && "border-destructive")}
        {...props}
      />
      {valid ? (
        <CheckIcon className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-emerald-600 dark:text-emerald-400" />
      ) : null}
    </div>
  )
}

export {
  NationalCodeInput,
  isNationalId,
  normalizeNationalId,
  formatNationalId,
}
