"use client"

import { PriceInput } from "@/registry/bases/base/ui/price-input"

export default function PriceInputDemo() {
  return (
    <div className="w-full max-w-sm p-4" dir="rtl">
      <PriceInput id="price" defaultValue="10000000" defaultCurrency="toman" />
    </div>
  )
}
