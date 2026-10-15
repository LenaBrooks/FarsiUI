"use client"

import * as React from "react"

import { NationalCodeInput } from "@/registry/bases/base/ui/national-code-input"

export default function NationalCodeInputDemo() {
  const [digits, setDigits] = React.useState("")
  const [valid, setValid] = React.useState(false)

  return (
    <div className="grid w-full max-w-sm gap-2 p-4" dir="rtl">
      <NationalCodeInput
        id="national-code"
        onValueChange={(nextDigits, nextValid) => {
          setDigits(nextDigits)
          setValid(nextValid)
        }}
      />
      <p className="text-sm text-muted-foreground">
        {digits
          ? valid
            ? `کد ملی معتبر: ${digits}`
            : `در حال ورود یا نامعتبر: ${digits}`
          : "کد ملی را وارد کنید"}
      </p>
    </div>
  )
}
