/**
 * Public URL for static calendar JSON.
 * GitHub Raw is used (not jsDelivr): the FarsiUI monorepo exceeds jsDelivr’s
 * 50 MB package limit for `gh/user/repo` URLs.
 */
export const CALENDAR_CDN_REPO = "MiladJoodi/FarsiUI"
export const CALENDAR_CDN_REF = "main"

export function calendarCdnUrl(path: string, ref: string = CALENDAR_CDN_REF) {
  const clean = path.replace(/^\/+/, "")
  return `https://raw.githubusercontent.com/${CALENDAR_CDN_REPO}/${ref}/calendar/${clean}`
}

export function calendarYearUrls(year: number, ref: string = CALENDAR_CDN_REF) {
  return {
    meta: calendarCdnUrl("meta.json", ref),
    holidays: calendarCdnUrl(`years/${year}/holidays.json`, ref),
    events: calendarCdnUrl(`years/${year}/events.json`, ref),
  }
}
