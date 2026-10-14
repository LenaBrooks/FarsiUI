"use client"

import { NationalCodeInput } from "@/registry/bases/base/ui/national-code-input"

export default function NationalCodeInputDemo() {
  return (
    <div className="w-full max-w-sm p-4" dir="rtl">
      <NationalCodeInput id="national-code" />
    </div>
  )
}
