export type LocalizedTitle = {
  fa: string
  en?: string
}

export type CalendarOccasion = {
  id: string
  date: string
  title: LocalizedTitle
  isHoliday: boolean
  categories?: string[]
}

export type YearOccasionsFile = {
  year: number
  schemaVersion: number
  dataVersion?: string
  items: CalendarOccasion[]
}
