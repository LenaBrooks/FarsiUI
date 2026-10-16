"use client"

import { IranDivisionPicker } from "./iran-division-picker"

export function IranDivisionPickerDemo() {
  return (
    <IranDivisionPicker
      onValueChange={(selection) => {
        console.log(selection)
      }}
    />
  )
}
