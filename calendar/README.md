# FarsiUI Calendar Data

Static Jalali holiday/event JSON for Iranian public calendars. This folder is **data only** — no date-conversion library and no React component.

**Status:** Jalali year **1405**, aligned with the official University of Tehran Calendar Center (`dataVersion` `1405.2.0`).

## Layout

```
calendar/
  meta.json                 # index + CDN hints + coverage policy
  schema.json               # JSON Schema for year files and rules
  rules/
    fixed-jalali.json       # year-independent national fixed days
  years/
    1405/
      holidays.json         # official national + religious holidays
      events.json           # empty (reserved)
  README.md
```

## Authoritative source (1405)

- [Holiday-1405.pdf](https://calendar.ut.ac.ir/documents/2139738/7092644/Holiday-1405.pdf)
- [Calendar-1405.pdf](https://calendar.ut.ac.ir/documents/2139738/7092644/Calendar-1405.pdf)
- Site: [calendar.ut.ac.ir](https://calendar.ut.ac.ir/)

Earlier drafts used Time.ir/pipe2time scrapes; several lunar dates were ±1 day off and were corrected against the UT PDF.

## What is included (1405)

**26 official holiday days** (PDF rows). Overlapping occasions on the same day may appear as separate `items` (e.g. Nowruz + Eid al-Fitr on 1–2 Farvardin; Ghadir + Khomeini on 14 Khordad).

| Jalali date | Title (fa) | Category |
|-------------|------------|----------|
| 1405-01-01 | عید سعید فطر؛ آغاز نوروز | religious + national |
| 1405-01-02 | تعطیل فطر؛ عید نوروز | religious + national |
| 1405-01-03 … 01-04 | عید نوروز | national |
| 1405-01-12 | روز جمهوری اسلامی ایران | national |
| 1405-01-13 | روز طبیعت (سیزده‌به‌در) | national |
| 1405-01-25 | شهادت امام جعفر صادق | religious |
| 1405-03-06 | عید سعید قربان | religious |
| 1405-03-14 | عید غدیر؛ رحلت امام خمینی | religious + national |
| 1405-03-15 | قیام ۱۵ خرداد | national |
| 1405-04-03 | تاسوعای حسینی | religious |
| 1405-04-04 | عاشورای حسینی | religious |
| 1405-05-13 | اربعین حسینی | religious |
| 1405-05-21 | رحلت رسول اکرم؛ شهادت امام حسن مجتبی | religious |
| 1405-05-22 | شهادت امام رضا | religious |
| 1405-05-30 | شهادت امام حسن عسکری | religious |
| 1405-06-08 | میلاد رسول اکرم و امام جعفر صادق | religious |
| 1405-08-22 | شهادت حضرت فاطمه زهرا | religious |
| 1405-10-02 | ولادت امام علی و روز پدر | religious |
| 1405-10-16 | مبعث رسول اکرم | religious |
| 1405-11-04 | ولادت حضرت قائم و نیمه شعبان | religious |
| 1405-11-22 | پیروزی انقلاب اسلامی | national |
| 1405-12-09 | شهادت حضرت علی | religious |
| 1405-12-19 | عید سعید فطر | religious |
| 1405-12-20 | تعطیل به مناسبت عید سعید فطر | religious |
| 1405-12-29 | روز ملی شدن صنعت نفت ایران | national |

Not included: Fridays/weekends, non-holiday observances, ad-hoc government closures.

## Future years (1406+)

Publish a year folder only after that year’s **official UT Holiday PDF** is available. Fixed national days alone may ship as draft without lunar dates.

## jsDelivr

Prefer `@main` or a pinned tag (`@latest` may lag):

```text
https://cdn.jsdelivr.net/gh/MiladJoodi/FarsiUI@main/calendar/meta.json
https://cdn.jsdelivr.net/gh/MiladJoodi/FarsiUI@main/calendar/years/1405/holidays.json
```

```ts
const res = await fetch(
  "https://cdn.jsdelivr.net/gh/MiladJoodi/FarsiUI@main/calendar/years/1405/holidays.json"
)
const { year, items } = await res.json()
```

## Date conversion

Not part of this package. Use `@internationalized/date` (`PersianCalendar`) or another Jalali library. Holiday rows use Jalali `YYYY-MM-DD` only.

## Data policy

1. Official holidays only, from UT Calendar Center PDFs when available.
2. Empty `events.json` means “not curated yet”.
3. License intent for curated FarsiUI JSON: **CC0-1.0** (see `meta.json`).
