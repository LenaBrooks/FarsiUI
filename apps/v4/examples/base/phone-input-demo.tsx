"use client"

import { PhoneInput } from "@/registry/bases/base/ui/phone-input"

export default function PhoneInputDemo() {
  return (
    <div className="w-full max-w-sm p-4" dir="rtl">
      <PhoneInput id="phone" placeholder="0912 345 6789" />
    </div>
  )
}
