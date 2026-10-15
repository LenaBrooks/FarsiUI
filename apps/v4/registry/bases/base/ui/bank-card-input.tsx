"use client"

import * as React from "react"
import { CheckIcon, CreditCardIcon } from "lucide-react"
import { cn } from "cn"

import {
  detectBankFromCard,
  formatCardNumber,
  isBankCard,
  normalizeCardNumber,
} from "@/registry/bases/base/lib/iran"
import { toPersianDigits } from "@/registry/bases/base/lib/digits"
import { useFormattedDigitsCaret } from "@/registry/bases/base/hooks/use-formatted-digits-caret"
import { Input } from "@/registry/bases/base/ui/input"

export type BankCardInputProps = Omit<
  React.ComponentProps<typeof Input>,
  "value" | "defaultValue" | "onChange" | "type"
> & {
  value?: string
  defaultValue?: string
  onValueChange?: (
    digits: string,
    meta: { valid: boolean; bank: string | null }
  ) => void
  showBank?: boolean
}

function BankCardInput({
  className,
  value,
  defaultValue,
  onValueChange,
  showBank = true,
  disabled,
  id,
  ...props
}: BankCardInputProps) {
  const [internal, setInternal] = React.useState(() =>
    normalizeCardNumber(defaultValue ?? "")
  )
  const digits =
    value !== undefined ? normalizeCardNumber(value) : internal
  const complete = digits.length === 16
  const valid = isBankCard(digits)
  const bank = detectBankFromCard(digits)
  const invalid = complete && !valid
  const formatted = formatCardNumber(digits)
  const displayFormatted = toPersianDigits(formatted)
  const { inputRef, onChangeCaptureCaret } =
    useFormattedDigitsCaret(displayFormatted)

  function set(next: string) {
    const d = normalizeCardNumber(next)
    if (value === undefined) setInternal(d)
    onValueChange?.(d, {
      valid: isBankCard(d),
      bank: detectBankFromCard(d),
    })
  }

  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)} dir="rtl">
      <div className="relative" dir="ltr">
        <CreditCardIcon className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          {...props}
          ref={inputRef}
          id={id}
          inputMode="numeric"
          autoComplete="cc-number"
          dir="ltr"
          lang="fa"
          persianDigits
          disabled={disabled}
          value={formatted}
          onChange={(e) => {
            onChangeCaptureCaret(e)
            set(e.target.value)
          }}
          placeholder={toPersianDigits("6037 9912 3456 7890")}
          aria-invalid={invalid || undefined}
          className={cn(
            "ps-9 pe-9 text-start tabular-nums",
            invalid && "border-destructive",
            props.className
          )}
        />
        {valid ? (
          <CheckIcon className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-emerald-600 dark:text-emerald-400" />
        ) : null}
      </div>
      {showBank && bank ? (
        <p className="text-muted-foreground text-xs">{bank}</p>
      ) : null}
    </div>
  )
}

export {
  BankCardInput,
  isBankCard,
  detectBankFromCard,
  normalizeCardNumber,
  formatCardNumber,
}
