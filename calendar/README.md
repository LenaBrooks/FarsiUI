# FarsiUI Calendar Data

Static Jalali holiday/event JSON for Iranian public calendars. This folder is **data only** — no date-conversion library and no React component.

**Status:** Jalali year **1405**, national fixed + official religious/lunar holidays (`dataVersion` `1405.1.0`). Non-holiday observances are not published yet.

## Layout

```
calendar/
  meta.json                 # index + CDN hints + coverage policy
  schema.json               # JSON Schema for year files and rules
  rules/
    fixed-jalali.json       # year-independent national fixed days
  years/
    1405/
      holidays.json         # national + religious holidays for 1405
      events.json           # empty (reserved; isHoliday:false not imported)
  README.md
```

## What is included (1405)

28 holiday rows (`isHoliday: true`). National fixed days come from `rules/fixed-jalali.json`. Religious/lunar days were curated from [pipe2time.ir](https://github.com/HMarzban/pipe2time.ir) `api/1405/events.json` (MIT / Time.ir). PersianHoliday was used only for spot-checks. `weeks.json` was not used.

| Jalali date | Title (fa) | Category |
|-------------|------------|----------|
| 1405-01-01 | عید نوروز | national |
| 1405-01-01 | تعطیل به مناسبت عید سعید فطر | religious |
| 1405-01-02 … 01-04 | عید نوروز | national |
| 1405-01-12 | روز جمهوری اسلامی ایران | national |
| 1405-01-13 | روز طبیعت (سیزده‌به‌در) | national |
| 1405-01-24 | شهادت امام جعفر صادق | religious |
| 1405-03-06 | عید سعید قربان | religious |
| 1405-03-14 | رحلت امام خمینی | national |
| 1405-03-14 | عید سعید غدیر خم | religious |
| 1405-03-15 | قیام ۱۵ خرداد | national |
| 1405-04-03 | تاسوعای حسینی | religious |
| 1405-04-04 | عاشورای حسینی | religious |
| 1405-05-12 | اربعین حسینی | religious |
| 1405-05-20 | رحلت رسول اکرم؛ شهادت امام حسن مجتبی | religious |
| 1405-05-22 | شهادت امام رضا | religious |
| 1405-05-30 | شهادت امام حسن عسکری | religious |
| 1405-06-08 | میلاد رسول اکرم و امام جعفر صادق | religious |
| 1405-08-22 | شهادت حضرت فاطمه زهرا | religious |
| 1405-10-01 | ولادت امام علی و روز پدر | religious |
| 1405-10-15 | مبعث رسول اکرم | religious |
| 1405-11-03 | ولادت حضرت قائم و جشن نیمه شعبان | religious |
| 1405-11-22 | پیروزی انقلاب اسلامی | national |
| 1405-12-09 | شهادت حضرت علی | religious |
| 1405-12-18 | عید سعید فطر | religious |
| 1405-12-19 | تعطیل به مناسبت عید سعید فطر | religious |
| 1405-12-29 | روز ملی شدن صنعت نفت ایران | national |

Not included: Fridays/weekends as holiday rows, cultural/observance days (`isHoliday: false`), wholesale upstream dumps.

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

1. Publish only curated **official holidays** (`isHoliday: true`).
2. Religious dates for 1405 are curated from pipe2time (MIT / Time.ir), not wholesale-copied into the repo.
3. Empty `events.json` means “not curated yet”, not “no events exist”.
4. License intent for curated FarsiUI JSON: **CC0-1.0** (see `meta.json`); attribute upstream when redistributing derived scrapes.

## Reference repos (offline review)

- https://github.com/HMarzban/pipe2time.ir — primary curated source for 1405 religious holidays
- https://github.com/samanzamani/PersianHoliday — cross-check only

## Next phases (out of scope here)

- Add 1406+ year folders the same way
- Optionally curate non-holiday `events.json`
- Embed JSON in a FarsiUI calendar UI component
