"use client"

import * as React from "react"
import { cn } from "cn"

import {
  IRAN_PROVINCES,
  isPostalCode,
  onlyDigits,
  type IranProvince,
} from "@/registry/bases/base/lib/iran"
import { toPersianDigits } from "@/registry/bases/base/lib/digits"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/registry/bases/base/ui/field"
import { Input } from "@/registry/bases/base/ui/input"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/registry/bases/base/ui/native-select"
import { Textarea } from "@/registry/bases/base/ui/textarea"

export type AddressFormValue = {
  province: string
  city: string
  postalCode: string
  line1: string
  line2?: string
}

export type AddressFormProps = {
  className?: string
  provinces?: IranProvince[]
  value?: Partial<AddressFormValue>
  defaultValue?: Partial<AddressFormValue>
  onValueChange?: (value: AddressFormValue) => void
  disabled?: boolean
  id?: string
}

function AddressForm({
  className,
  provinces = IRAN_PROVINCES,
  value,
  defaultValue,
  onValueChange,
  disabled,
  id = "address",
}: AddressFormProps) {
  const [internal, setInternal] = React.useState<AddressFormValue>({
    province: defaultValue?.province ?? "",
    city: defaultValue?.city ?? "",
    postalCode: onlyDigits(defaultValue?.postalCode ?? "", 10),
    line1: defaultValue?.line1 ?? "",
    line2: defaultValue?.line2 ?? "",
  })

  const current: AddressFormValue = {
    province: value?.province ?? internal.province,
    city: value?.city ?? internal.city,
    postalCode: onlyDigits(
      value?.postalCode ?? internal.postalCode,
      10
    ),
    line1: value?.line1 ?? internal.line1,
    line2: value?.line2 ?? internal.line2 ?? "",
  }

  const province = provinces.find((p) => p.name === current.province)
  const cities = province?.cities ?? []
  const postalComplete = current.postalCode.length === 10
  const postalInvalid = postalComplete && !isPostalCode(current.postalCode)

  function patch(partial: Partial<AddressFormValue>) {
    const next: AddressFormValue = {
      ...current,
      ...partial,
      postalCode: onlyDigits(
        partial.postalCode ?? current.postalCode,
        10
      ),
    }
    if (partial.province != null && partial.province !== current.province) {
      next.city = ""
    }
    if (value === undefined) setInternal(next)
    onValueChange?.(next)
  }

  return (
    <FieldGroup
      className={cn("w-full gap-4", className)}
      dir="rtl"
      lang="fa"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor={`${id}-province`}>استان</FieldLabel>
          <NativeSelect
            id={`${id}-province`}
            className="w-full"
            disabled={disabled}
            value={current.province}
            onChange={(e) => patch({ province: e.target.value })}
          >
            <NativeSelectOption value="">انتخاب استان</NativeSelectOption>
            {provinces.map((p) => (
              <NativeSelectOption key={p.name} value={p.name}>
                {p.name}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </Field>
        <Field>
          <FieldLabel htmlFor={`${id}-city`}>شهر</FieldLabel>
          <NativeSelect
            id={`${id}-city`}
            className="w-full"
            disabled={disabled || !current.province}
            value={current.city}
            onChange={(e) => patch({ city: e.target.value })}
          >
            <NativeSelectOption value="">انتخاب شهر</NativeSelectOption>
            {cities.map((c) => (
              <NativeSelectOption key={c.name} value={c.name}>
                {c.name}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor={`${id}-postal`}>کد پستی</FieldLabel>
        <Input
          id={`${id}-postal`}
          dir="ltr"
          lang="fa"
          inputMode="numeric"
          persianDigits
          disabled={disabled}
          value={current.postalCode}
          onChange={(e) => patch({ postalCode: e.target.value })}
          placeholder={toPersianDigits("1234567890")}
          aria-invalid={postalInvalid || undefined}
          className="max-w-xs text-start tabular-nums"
        />
        {postalInvalid ? (
          <FieldDescription className="text-destructive">
            کد پستی باید ۱۰ رقم باشد.
          </FieldDescription>
        ) : (
          <FieldDescription>ده رقم بدون خط تیره</FieldDescription>
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor={`${id}-line1`}>آدرس</FieldLabel>
        <Textarea
          id={`${id}-line1`}
          disabled={disabled}
          value={current.line1}
          onChange={(e) => patch({ line1: e.target.value })}
          placeholder="خیابان، کوچه، پلاک، واحد"
          rows={3}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor={`${id}-line2`}>توضیحات (اختیاری)</FieldLabel>
        <Input
          id={`${id}-line2`}
          disabled={disabled}
          value={current.line2}
          onChange={(e) => patch({ line2: e.target.value })}
          placeholder="نقطهٔ شاخص، زنگ، …"
        />
      </Field>
    </FieldGroup>
  )
}

export { AddressForm, IRAN_PROVINCES, isPostalCode }
