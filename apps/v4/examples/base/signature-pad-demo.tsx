"use client"

import * as React from "react"

import {
  SignaturePad,
  type SignaturePadHandle,
} from "@/registry/bases/base/ui/signature-pad"
import { Button } from "@/registry/bases/base/ui/button"

export default function SignaturePadDemo() {
  const ref = React.useRef<SignaturePadHandle>(null)
  const [preview, setPreview] = React.useState<string | null>(null)

  return (
    <div className="w-full max-w-md space-y-3 p-4" dir="rtl" lang="fa">
      <SignaturePad
        ref={ref}
        height={180}
        onEnd={(dataUrl) => setPreview(dataUrl)}
      />
      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => {
            const svg = ref.current?.toSvg()
            if (svg) {
              // eslint-disable-next-line no-alert
              alert("SVG آماده شد (" + svg.length + " کاراکتر)")
            }
          }}
        >
          خروجی SVG
        </Button>
      </div>
      {preview ? (
        <div className="rounded-lg border p-2">
          <p className="mb-2 text-xs text-muted-foreground">پیش‌نمایش PNG</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="امضا" className="max-h-24 w-auto" />
        </div>
      ) : null}
    </div>
  )
}
