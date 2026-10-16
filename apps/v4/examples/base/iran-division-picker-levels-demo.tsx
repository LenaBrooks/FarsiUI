"use client"

import * as React from "react"

import {
  IranDivisionPicker,
  type IranDivisionSelection,
} from "@/registry/bases/base/ui/IranDivisionPicker/iran-division-picker"

export default function IranDivisionPickerLevelsDemo() {
  const [value, setValue] = React.useState<IranDivisionSelection>({})

  return (
    <div className="mx-auto w-full max-w-lg space-y-4 p-4" dir="rtl" lang="fa">
      <IranDivisionPicker
        id="iran-division-levels"
        levels={["province", "county", "city"]}
        value={value}
        onValueChange={setValue}
      />
      {value.province ? (
        <p className="text-xs text-muted-foreground">
          {[value.province?.name, value.county?.name, value.city?.name]
            .filter(Boolean)
            .join(" ← ")}
        </p>
      ) : null}
    </div>
  )
}
