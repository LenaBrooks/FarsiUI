"use client"

import * as React from "react"
import { CheckIcon, PhoneIcon } from "lucide-react"
import { cn } from "cn"

import {
  formatIranPhone,
  isIranMobile,
  normalizeIranPhone,
} from "@/registry/bases/base/lib/iran"
import { toPersianDigits } from "@/registry/bases/base/lib/digits"
import { Input } from "@/registry/bases/base/ui/input"

export type PhoneInputProps = Omit<
  React.ComponentProps<typeof Input>,
  "value" | "defaultValue" | "onChange" | "type"
> & {
  value?: string
  defaultValue?: string
  /** 11-digit 09… ASCII digits + validity when complete. */
  onValueChange?: (digits: string, valid: boolean) => void
}

function PhoneInput({
  className,
  value,
  defaultValue,
  onValueChange,
  disabled,
  id,
  ...props
}: PhoneInputProps) {
  const [internal, setInternal] = React.useState(() =>
    normalizeIranPhone(defaultValue ?? "")
  )
  const digits =
    value !== undefined ? normalizeIranPhone(value) : internal
  const complete = digits.length === 11
  const valid = isIranMobile(digits)
  const invalid = complete && !valid

  function set(next: string) {
    const d = normalizeIranPhone(next)
    if (value === undefined) setInternal(d)
    onValueChange?.(d, isIranMobile(d))
  }

  return (
    <div className={cn("relative w-full", className)} dir="ltr">
      <PhoneIcon className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        id={id}
        type="tel"
        inputMode="numeric"
        autoComplete="tel"
        dir="ltr"
        lang="fa"
        persianDigits
        disabled={disabled}
        value={formatIranPhone(digits)}
        onChange={(e) => set(e.target.value)}
        placeholder={toPersianDigits("0912 345 6789")}
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

export { PhoneInput, isIranMobile, normalizeIranPhone, formatIranPhone }
