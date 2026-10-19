# FarsiUI Calendar Data

Static Jalali holiday/event JSON for Iranian public calendars. This folder is **data only** — no date-conversion library and no React component.

**Status:** draft for Jalali year **1405**, national fixed holidays only. Hijri/lunar religious holidays are **not** included until verified.

## Layout

```
calendar/
  meta.json                 # index + CDN hints + coverage policy
  schema.json               # JSON Schema for year files and rules
  rules/
    fixed-jalali.json       # year-independent national fixed days
  years/
    1405/
      holidays.json         # expanded fixed holidays for 1405
      events.json           # empty (reserved)
  README.md
```

## What is included (1405)

| Jalali date | Title (fa) |
|-------------|------------|
| 1405-01-01 … 01-04 | عید نوروز |
| 1405-01-12 | روز جمهوری اسلامی ایران |
| 1405-01-13 | روز طبیعت (سیزده‌به‌در) |
| 1405-03-14 | رحلت امام خمینی |
| 1405-03-15 | قیام ۱۵ خرداد |
| 1405-11-22 | پیروزی انقلاب اسلامی |
| 1405-12-29 | روز ملی شدن صنعت نفت ایران |

Not included: Fridays/weekends as holiday rows, Hijri-based religious days (e.g. Eid al-Fitr), optional cultural events.

## jsDelivr (after push to `MiladJoodi/FarsiUI`)

Prefer a **pinned tag** in production; `@latest` is fine for demos.

```text
https://cdn.jsdelivr.net/gh/MiladJoodi/FarsiUI@latest/calendar/meta.json
https://cdn.jsdelivr.net/gh/MiladJoodi/FarsiUI@latest/calendar/rules/fixed-jalali.json
https://cdn.jsdelivr.net/gh/MiladJoodi/FarsiUI@latest/calendar/years/1405/holidays.json
https://cdn.jsdelivr.net/gh/MiladJoodi/FarsiUI@latest/calendar/years/1405/events.json
https://cdn.jsdelivr.net/gh/MiladJoodi/FarsiUI@latest/calendar/schema.json
```

Example fetch:

```ts
const res = await fetch(
  "https://cdn.jsdelivr.net/gh/MiladJoodi/FarsiUI@latest/calendar/years/1405/holidays.json"
)
const { year, items } = await res.json()
```

FarsiUI app components should prefer **static import** of these JSON files (or a copy under `public/`) rather than depending on CDN at runtime.

## Date conversion

Not part of this package. Use `@internationalized/date` (`PersianCalendar`) or another Jalali library to convert between Jalali and Gregorian. Holiday rows use Jalali `YYYY-MM-DD` strings only.

## Data policy

1. Only high-confidence **national fixed** Jalali holidays ship in this draft.
2. Scraped Time.ir dumps are **reference-only** until curated (see `meta.json` → `sources`).
3. Empty `events.json` means “not curated yet”, not “no events exist”.
4. License intent for curated data: **CC0-1.0** (see `meta.json`).

## Optional local repos (later phases)

Not required for this draft. When adding lunar/religious days, clone for offline review (do not wholesale import):

- https://github.com/samanzamani/PersianHoliday
- https://github.com/HMarzban/pipe2time.ir

## Next phases (out of scope here)

- Curate Hijri holidays for 1405 from a verified source
- Add 1406+ year folders
- Embed JSON in a FarsiUI calendar UI component
