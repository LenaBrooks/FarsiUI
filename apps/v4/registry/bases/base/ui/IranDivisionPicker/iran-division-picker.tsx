"use client"

import * as React from "react"
import { cn } from "cn"

import {
  DEFAULT_IRAN_GEO_DATA_URL,
  loadIranGeoIndex,
  loadIranVillages,
  pickSelection,
  type IranGeoIndex,
  type IranGeoRecord,
} from "./iran-geo"
import { Field, FieldGroup, FieldLabel } from "@/registry/bases/base/ui/field"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/registry/bases/base/ui/native-select"

export type IranDivisionLevel =
  | "province"
  | "county"
  | "district"
  | "city"
  | "ruralDistrict"
  | "village"

export type IranDivisionItem = {
  code: string
  fullCode: string
  name: string
}

export type IranDivisionSelection = {
  province?: IranDivisionItem
  county?: IranDivisionItem
  district?: IranDivisionItem
  city?: IranDivisionItem
  ruralDistrict?: IranDivisionItem
  village?: IranDivisionItem
}

export type IranDivisionPickerProps = {
  className?: string
  id?: string
  disabled?: boolean
  /** Which levels to show. Default: all six. */
  levels?: IranDivisionLevel[]
  value?: IranDivisionSelection
  defaultValue?: IranDivisionSelection
  onValueChange?: (value: IranDivisionSelection) => void
  /** Base URL for geo JSON (default GitHub raw under `apps/v4/public/r/geo/iran`). */
  dataUrl?: string
  labels?: Partial<Record<IranDivisionLevel, string>>
}

const ALL_LEVELS: IranDivisionLevel[] = [
  "province",
  "county",
  "district",
  "city",
  "ruralDistrict",
  "village",
]

const DEFAULT_LABELS: Record<IranDivisionLevel, string> = {
  province: "استان",
  county: "شهرستان",
  district: "بخش",
  city: "شهر",
  ruralDistrict: "دهستان",
  village: "روستا",
}

const PLACEHOLDERS: Record<IranDivisionLevel, string> = {
  province: "انتخاب استان",
  county: "انتخاب شهرستان",
  district: "انتخاب بخش",
  city: "انتخاب شهر",
  ruralDistrict: "انتخاب دهستان",
  village: "انتخاب روستا",
}

function hasLevel(levels: IranDivisionLevel[], level: IranDivisionLevel) {
  return levels.includes(level)
}

function IranDivisionPicker({
  className,
  id = "iran-division",
  disabled,
  levels = ALL_LEVELS,
  value,
  defaultValue,
  onValueChange,
  dataUrl = DEFAULT_IRAN_GEO_DATA_URL,
  labels,
}: IranDivisionPickerProps) {
  const [internal, setInternal] = React.useState<IranDivisionSelection>(
    () => defaultValue ?? {}
  )
  const current = value ?? internal
  const labelMap = { ...DEFAULT_LABELS, ...labels }

  const [index, setIndex] = React.useState<IranGeoIndex | null>(null)
  const [indexError, setIndexError] = React.useState<string | null>(null)
  const [villages, setVillages] = React.useState<IranGeoRecord[]>([])
  const [villagesLoading, setVillagesLoading] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false
    setIndexError(null)
    loadIranGeoIndex(dataUrl)
      .then((data) => {
        if (!cancelled) setIndex(data)
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setIndexError(
            error instanceof Error ? error.message : "بارگذاری داده ناموفق بود"
          )
        }
      })
    return () => {
      cancelled = true
    }
  }, [dataUrl])

  const provinceCode = current.province?.code
  const needsVillages = hasLevel(levels, "village")

  React.useEffect(() => {
    if (!needsVillages || !provinceCode) {
      setVillages([])
      setVillagesLoading(false)
      return
    }
    let cancelled = false
    setVillagesLoading(true)
    loadIranVillages(provinceCode, dataUrl)
      .then((rows) => {
        if (!cancelled) {
          setVillages(rows)
          setVillagesLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setVillages([])
          setVillagesLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [dataUrl, needsVillages, provinceCode])

  const commit = React.useCallback(
    (next: IranDivisionSelection) => {
      if (value === undefined) setInternal(next)
      onValueChange?.(next)
    },
    [onValueChange, value]
  )

  const counties = React.useMemo(() => {
    if (!index || !current.province) return []
    return index.counties.filter(
      (row) => row.provinceCode === current.province!.code
    )
  }, [current.province, index])

  const districts = React.useMemo(() => {
    if (!index || !current.province) return []
    return index.districts.filter((row) => {
      if (row.provinceCode !== current.province!.code) return false
      if (current.county && row.countyCode !== current.county.code) return false
      return true
    })
  }, [current.county, current.province, index])

  const cities = React.useMemo(() => {
    if (!index || !current.province) return []
    return index.cities.filter((row) => {
      if (row.provinceCode !== current.province!.code) return false
      if (current.county && row.countyCode !== current.county.code) return false
      if (current.district && row.districtCode !== current.district.code)
        return false
      return true
    })
  }, [current.county, current.district, current.province, index])

  const ruralDistricts = React.useMemo(() => {
    if (!index || !current.province) return []
    return index.ruralDistricts.filter((row) => {
      if (row.provinceCode !== current.province!.code) return false
      if (current.county && row.countyCode !== current.county.code) return false
      if (current.district && row.districtCode !== current.district.code)
        return false
      return true
    })
  }, [current.county, current.district, current.province, index])

  const filteredVillages = React.useMemo(() => {
    if (!current.province) return []
    return villages.filter((row) => {
      if (row.provinceCode !== current.province!.code) return false
      if (current.county && row.countyCode !== current.county.code) return false
      if (current.district && row.districtCode !== current.district.code)
        return false
      if (
        current.ruralDistrict &&
        row.ruralDistrictCode !== current.ruralDistrict.code
      ) {
        return false
      }
      return true
    })
  }, [
    current.county,
    current.district,
    current.province,
    current.ruralDistrict,
    villages,
  ])

  function findByFullCode(rows: IranGeoRecord[], fullCode: string) {
    return rows.find((row) => row.fullCode === fullCode)
  }

  function setProvince(fullCode: string) {
    const record = index
      ? findByFullCode(index.provinces, fullCode)
      : undefined
    commit({
      province: pickSelection(record),
    })
  }

  function setCounty(fullCode: string) {
    const record = findByFullCode(counties, fullCode)
    commit({
      province: current.province,
      county: pickSelection(record),
    })
  }

  function setDistrict(fullCode: string) {
    const record = findByFullCode(districts, fullCode)
    commit({
      province: current.province,
      county: current.county,
      district: pickSelection(record),
    })
  }

  function setCity(fullCode: string) {
    const record = findByFullCode(cities, fullCode)
    commit({
      province: current.province,
      county: current.county,
      district: current.district,
      city: pickSelection(record),
      ruralDistrict: current.ruralDistrict,
      village: current.village,
    })
  }

  function setRuralDistrict(fullCode: string) {
    const record = findByFullCode(ruralDistricts, fullCode)
    commit({
      province: current.province,
      county: current.county,
      district: current.district,
      city: current.city,
      ruralDistrict: pickSelection(record),
    })
  }

  function setVillage(fullCode: string) {
    const record = findByFullCode(filteredVillages, fullCode)
    commit({
      ...current,
      village: pickSelection(record),
    })
  }

  const loadingIndex = !index && !indexError
  const provinceReady = Boolean(current.province)
  const requireCounty = hasLevel(levels, "county")
  const requireDistrict = hasLevel(levels, "district")
  const requireRural = hasLevel(levels, "ruralDistrict")

  const canPickCounty = !disabled && !loadingIndex && provinceReady
  const canPickDistrict =
    !disabled &&
    !loadingIndex &&
    provinceReady &&
    (!requireCounty || Boolean(current.county))
  const canPickCity =
    !disabled &&
    !loadingIndex &&
    provinceReady &&
    (!requireCounty || Boolean(current.county)) &&
    (!requireDistrict || Boolean(current.district))
  const canPickRural = canPickCity
  const canPickVillage =
    canPickRural &&
    (!requireRural || Boolean(current.ruralDistrict)) &&
    !villagesLoading

  function renderSelect(
    level: IranDivisionLevel,
    options: IranGeoRecord[],
    selected: IranDivisionItem | undefined,
    onChange: (fullCode: string) => void,
    enabled: boolean
  ) {
    return (
      <Field key={level}>
        <FieldLabel htmlFor={`${id}-${level}`}>{labelMap[level]}</FieldLabel>
        <NativeSelect
          id={`${id}-${level}`}
          className="w-full"
          disabled={!enabled}
          value={selected?.fullCode ?? ""}
          onChange={(e) => {
            const next = e.target.value
            if (!next) {
              // Clear this level and below by calling level-specific clearers via empty commit patterns
              if (level === "province") commit({})
              else if (level === "county")
                commit({ province: current.province })
              else if (level === "district")
                commit({
                  province: current.province,
                  county: current.county,
                })
              else if (level === "city")
                commit({
                  province: current.province,
                  county: current.county,
                  district: current.district,
                  ruralDistrict: current.ruralDistrict,
                  village: current.village,
                })
              else if (level === "ruralDistrict")
                commit({
                  province: current.province,
                  county: current.county,
                  district: current.district,
                  city: current.city,
                })
              else
                commit({
                  ...current,
                  village: undefined,
                })
              return
            }
            onChange(next)
          }}
        >
          <NativeSelectOption value="">
            {level === "village" && villagesLoading
              ? "در حال بارگذاری…"
              : PLACEHOLDERS[level]}
          </NativeSelectOption>
          {options.map((row) => (
            <NativeSelectOption key={row.fullCode} value={row.fullCode}>
              {row.name}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </Field>
    )
  }

  return (
    <FieldGroup
      className={cn("w-full gap-4", className)}
      dir="rtl"
      lang="fa"
    >
      {indexError ? (
        <p className="text-sm text-destructive">{indexError}</p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        {hasLevel(levels, "province")
          ? renderSelect(
              "province",
              index?.provinces ?? [],
              current.province,
              setProvince,
              !disabled && !loadingIndex
            )
          : null}
        {hasLevel(levels, "county")
          ? renderSelect(
              "county",
              counties,
              current.county,
              setCounty,
              canPickCounty
            )
          : null}
        {hasLevel(levels, "district")
          ? renderSelect(
              "district",
              districts,
              current.district,
              setDistrict,
              canPickDistrict
            )
          : null}
        {hasLevel(levels, "city")
          ? renderSelect("city", cities, current.city, setCity, canPickCity)
          : null}
        {hasLevel(levels, "ruralDistrict")
          ? renderSelect(
              "ruralDistrict",
              ruralDistricts,
              current.ruralDistrict,
              setRuralDistrict,
              canPickRural
            )
          : null}
        {hasLevel(levels, "village")
          ? renderSelect(
              "village",
              filteredVillages,
              current.village,
              setVillage,
              canPickVillage
            )
          : null}
      </div>
    </FieldGroup>
  )
}

export { IranDivisionPicker, ALL_LEVELS as IRAN_DIVISION_LEVELS }
