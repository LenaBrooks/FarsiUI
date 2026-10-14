"use client"

import { BankCardInput } from "@/registry/bases/base/ui/bank-card-input"

export default function BankCardInputDemo() {
  return (
    <div className="w-full max-w-sm p-4" dir="rtl">
      <BankCardInput id="card" />
    </div>
  )
}
