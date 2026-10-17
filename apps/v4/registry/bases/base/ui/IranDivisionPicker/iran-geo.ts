/** Iran administrative divisions — fetch helpers + types for iran-division-picker. */

export type IranGeoRecord = {
  fullCode: string
  code: string
  name: string
  provinceCode?: string
  countyCode?: string
  districtCode?: string
  ruralDistrictCode?: string
  blockCode?: string | null
}

export type IranGeoIndex = {
  provinces: IranGeoRecord[]
  counties: IranGeoRecord[]
  districts: IranGeoRecord[]
  cities: IranGeoRecord[]
  ruralDistricts: IranGeoRecord[]
}

export const DEFAULT_IRAN_GEO_DATA_URL =
  "https://raw.githubusercontent.com/MiladJoodi/FarsiUI/main/apps/v4/public/r/geo/iran"

const indexCache = new Map<string, Promise<IranGeoIndex>>()
const villageCache = new Map<string, Promise<IranGeoRecord[]>>()

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to load ${url}: ${res.status}`)
  }
  return res.json() as Promise<T>
}

export function loadIranGeoIndex(
  dataUrl: string = DEFAULT_IRAN_GEO_DATA_URL
): Promise<IranGeoIndex> {
  const key = dataUrl.replace(/\/$/, "")
  let pending = indexCache.get(key)
  if (!pending) {
    pending = Promise.all([
      fetchJson<IranGeoRecord[]>(`${key}/provinces.json`),
      fetchJson<IranGeoRecord[]>(`${key}/counties.json`),
      fetchJson<IranGeoRecord[]>(`${key}/districts.json`),
      fetchJson<IranGeoRecord[]>(`${key}/cities.json`),
      fetchJson<IranGeoRecord[]>(`${key}/rural-districts.json`),
    ]).then(
      ([provinces, counties, districts, cities, ruralDistricts]) => ({
        provinces,
        counties,
        districts,
        cities,
        ruralDistricts,
      })
    )
    indexCache.set(key, pending)
  }
  return pending
}

export function loadIranVillages(
  provinceCode: string,
  dataUrl: string = DEFAULT_IRAN_GEO_DATA_URL
): Promise<IranGeoRecord[]> {
  const base = dataUrl.replace(/\/$/, "")
  const key = `${base}::${provinceCode}`
  let pending = villageCache.get(key)
  if (!pending) {
    pending = fetchJson<IranGeoRecord[]>(
      `${base}/villages/${provinceCode}.json`
    )
    villageCache.set(key, pending)
  }
  return pending
}

export function pickSelection(
  record: IranGeoRecord | undefined
): { code: string; fullCode: string; name: string } | undefined {
  if (!record) return undefined
  return {
    code: record.code,
    fullCode: record.fullCode,
    name: record.name,
  }
}
