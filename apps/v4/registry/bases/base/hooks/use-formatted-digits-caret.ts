"use client"

import * as React from "react"

const DIGIT_CHAR_RE = /[0-9\u06F0-\u06F9\u0660-\u0669]/

/** Count digit characters in `value` before index `end` (for caret mapping). */
export function countDigitsBefore(value: string, end: number) {
  let count = 0
  const limit = Math.max(0, Math.min(end, value.length))
  for (let i = 0; i < limit; i++) {
    if (DIGIT_CHAR_RE.test(value[i]!)) count++
  }
  return count
}

/** Map a digit-count caret back into a grouped (possibly Persian) string. */
export function indexFromDigitCount(formatted: string, digitCount: number) {
  if (digitCount <= 0) return 0
  let seen = 0
  for (let i = 0; i < formatted.length; i++) {
    if (DIGIT_CHAR_RE.test(formatted[i]!)) {
      seen++
      if (seen === digitCount) return i + 1
    }
  }
  return formatted.length
}

/**
 * Keep the caret on the same digit when thousand-separators / dashes / spaces
 * regroup on each keystroke (works with persianDigits Input display).
 */
export function useFormattedDigitsCaret(displayValue: string) {
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const caretDigitsRef = React.useRef<{ start: number; end: number } | null>(
    null
  )

  React.useLayoutEffect(() => {
    const node = inputRef.current
    const caret = caretDigitsRef.current
    if (!node || !caret) return
    const el =
      node instanceof HTMLInputElement
        ? node
        : node.querySelector?.("input")
    if (!el || typeof el.setSelectionRange !== "function") {
      caretDigitsRef.current = null
      return
    }
    const start = indexFromDigitCount(displayValue, caret.start)
    const end = indexFromDigitCount(displayValue, caret.end)
    try {
      el.setSelectionRange(start, end)
    } catch {
      // Ignore detached / non-text inputs.
    }
    caretDigitsRef.current = null
  }, [displayValue])

  const onChangeCaptureCaret = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      try {
        const raw = String(event.target.value ?? "")
        // Prefer the real input node — selection* via some event proxies is unsafe.
        const node = inputRef.current
        const el =
          node instanceof HTMLInputElement
            ? node
            : node?.querySelector?.("input") ?? null
        const selStart = el?.selectionStart ?? event.target.selectionStart
        const selEnd = el?.selectionEnd ?? event.target.selectionEnd
        const start = selStart ?? raw.length
        const end = selEnd ?? start
        caretDigitsRef.current = {
          start: countDigitsBefore(raw, start),
          end: countDigitsBefore(raw, end),
        }
      } catch {
        caretDigitsRef.current = null
      }
    },
    []
  )

  return { inputRef, onChangeCaptureCaret }
}
