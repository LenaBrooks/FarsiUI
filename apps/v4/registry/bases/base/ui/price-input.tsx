"use client"

import * as React from "react"
import { cn } from "cn"

import {
  amountToPersianCurrencyWords,
  convertPrice,
  formatPriceDigits,
  onlyDigits,
  type PriceCurrency,
} from "@/registry/bases/base/lib/iran"
import { Button } from "@/registry/bases/base/ui/button"
import { Input } from "@/registry/bases/base/ui/input"

export type PriceInputProps = Omit<
  React.ComponentProps<typeof Input>,
  "value" | "defaultValue" | "onChange" | "type"
> & {
  value?: string
  defaultValue?: string
  /** Raw digits (ASCII) without separators. */
  onValueChange?: (digits: string, currency: PriceCurrency) => void
  currency?: PriceCurrency
  defaultCurrency?: PriceCurrency
  onCurrencyChange?: (currency: PriceCurrency) => void
  showWords?: boolean
  showCurrencyToggle?: boolean
}

function groupDigits(digits: string) {
  if (!digits) return ""
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

function PriceInput({
  className,
  value,
  defaultValue,
  onValueChange,
  currency: currencyProp,
  defaultCurrency = "toman",
  onCurrencyChange,
  showWords = true,
  showCurrencyToggle = true,
  disabled,
  id,
  ...props
}: PriceInputProps) {
  const [internalDigits, setInternalDigits] = React.useState(
    () => onlyDigits(defaultValue ?? "")
  )
  const [internalCurrency, setInternalCurrency] =
    React.useState<PriceCurrency>(defaultCurrency)

  const digits =
    value !== undefined ? onlyDigits(value) : internalDigits
  const currency = currencyProp ?? internalCurrency

  function setDigits(next: string) {
    const d = onlyDigits(next)
    if (value === undefined) setInternalDigits(d)
    onValueChange?.(d, currency)
  }

  function setCurrency(next: PriceCurrency) {
    if (next === currency) return
    const asNumber = Number(digits || "0")
    const converted = digits
      ? String(convertPrice(asNumber, currency, next))
      : ""
    if (currencyProp === undefined) setInternalCurrency(next)
    onCurrencyChange?.(next)
    if (value === undefined) setInternalDigits(converted)
    onValueChange?.(converted, next)
  }

  const words = showWords
    ? amountToPersianCurrencyWords(digits, currency)
    : ""

  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)} dir="rtl">
      <div className="flex items-center gap-2">
        <Input
          id={id}
          dir="ltr"
          lang="fa"
          inputMode="numeric"
          persianDigits
          disabled={disabled}
          value={groupDigits(digits)}
          onChange={(e) => setDigits(e.target.value)}
          placeholder="1,000,000"
          aria-describedby={id && showWords ? `${id}-words` : undefined}
          className="min-w-0 flex-1 text-start tabular-nums"
          {...props}
        />
        {showCurrencyToggle ? (
          <div className="flex shrink-0 overflow-hidden rounded-lg border">
            <Button
              type="button"
              variant={currency === "toman" ? "secondary" : "ghost"}
              size="sm"
              disabled={disabled}
              className="rounded-none px-2.5 text-xs"
              onClick={() => setCurrency("toman")}
            >
              تومان
            </Button>
            <Button
              type="button"
              variant={currency === "rial" ? "secondary" : "ghost"}
              size="sm"
              disabled={disabled}
              className="rounded-none px-2.5 text-xs"
              onClick={() => setCurrency("rial")}
            >
              ریال
            </Button>
          </div>
        ) : null}
      </div>
      {showWords && words ? (
        <p
          id={id ? `${id}-words` : undefined}
          className="text-muted-foreground text-xs leading-relaxed"
        >
          {words}
        </p>
      ) : null}
    </div>
  )
}

export { PriceInput, formatPriceDigits, amountToPersianCurrencyWords }
