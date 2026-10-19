# راهنمای استفاده از داده‌های تقویم FarsiUI

با داده‌های تقویم FarsiUI می‌توانید بررسی کنید که یک روز تعطیل رسمی است یا چه مناسبت‌هایی دارد. نیازی به نصب پکیج یا راه‌اندازی سرور ندارید؛ کافی است فایل JSON موردنیاز را از طریق اینترنت دریافت کنید.

در این راهنما از سال ۱۴۰۵ به‌عنوان مثال استفاده می‌کنیم.

## ۱. سال موردنظر را مشخص کنید

سال تقویم جلالی را انتخاب کنید؛ مثلاً `1405`. این عدد در آدرس فایل‌های همان سال استفاده می‌شود.

## ۲. فایل موردنیاز را انتخاب کنید

این سه فایل در دسترس است:

- `holidays.json` — تعطیلات رسمی همان سال (ملی و مذهبی)
- `events.json` — مناسبت‌های غیرتعطیل همان سال
- `meta.json` — فهرست همهٔ سال‌های منتشرشده (برای کل مجموعه، نه فقط یک سال)

- [دریافت فایل تعطیلات سال ۱۴۰۵](https://raw.githubusercontent.com/MiladJoodi/FarsiUI/main/calendar/years/1405/holidays.json)
- [دریافت فایل مناسبت‌های سال ۱۴۰۵](https://raw.githubusercontent.com/MiladJoodi/FarsiUI/main/calendar/years/1405/events.json)
- [دریافت meta.json](https://raw.githubusercontent.com/MiladJoodi/FarsiUI/main/calendar/meta.json)

می‌توانید لینک هر فایل را در مرورگر باز کنید یا مستقیماً در کد خود از آن استفاده کنید.

الگو:

```text
https://raw.githubusercontent.com/MiladJoodi/FarsiUI/{ref}/calendar/years/{YEAR}/holidays.json
https://raw.githubusercontent.com/MiladJoodi/FarsiUI/{ref}/calendar/years/{YEAR}/events.json
```

`{ref}` معمولاً `main` است؛ برای پایداری می‌توانید تگ یا هش کامیت بگذارید.

## ۳. فایل JSON را دریافت کنید

برای دریافت اطلاعات، از `fetch` استفاده کنید:

```js
const response = await fetch(
  "https://raw.githubusercontent.com/MiladJoodi/FarsiUI/main/calendar/years/1405/holidays.json"
);

const data = await response.json();

console.log(data);
```

در این مثال، اطلاعات تعطیلات رسمی سال ۱۴۰۵ دریافت می‌شود.

## ۴. ساختار داده‌ها را بشناسید

اطلاعات هر فایل در قالب JSON ارائه می‌شود. فهرست روزها داخل ویژگی `items` قرار دارد.

نمونه‌ای از یک آیتم:

```json
{
  "id": "nature-day-1405",
  "date": "1405-01-13",
  "title": {
    "fa": "روز طبیعت",
    "en": "Nature Day"
  },
  "isHoliday": true,
  "categories": ["national"]
}
```

معنی فیلدها:

- `id`: شناسه یکتای مناسبت
- `date`: تاریخ شمسی به فرمت `YYYY-MM-DD`
- `title.fa`: عنوان فارسی
- `title.en`: عنوان انگلیسی
- `isHoliday`: مشخص می‌کند این مناسبت تعطیل رسمی است یا نه
- `categories`: دسته‌بندی مناسبت

ممکن است در یک روز چند مناسبت وجود داشته باشد؛ بنابراین برای پیدا کردن مناسبت‌های یک روز، تمام آیتم‌های مطابق با تاریخ را بررسی کنید.

**نکته:** جمعه‌ها و تعطیلی‌های موردی که بعداً اعلام می‌شوند، لزوماً در این داده‌ها وجود ندارند. برای تشخیص جمعه باید روز هفته را جداگانه محاسبه کنید.

## ۵. تعطیلی یا مناسبت یک روز را پیدا کنید

اگر تاریخ شمسی روز موردنظر را دارید، آن را با فیلد `date` مقایسه کنید:

```js
const response = await fetch(
  "https://raw.githubusercontent.com/MiladJoodi/FarsiUI/main/calendar/years/1405/holidays.json"
);

const data = await response.json();

// تاریخ شمسی موردنظر
const day = "1405-01-13";

const matches = data.items.filter(
  (item) => item.date === day
);

if (matches.length > 0) {
  console.log(matches.map((item) => item.title.fa));
} else {
  console.log("تعطیل رسمی در این فهرست ثبت نشده است.");
}
```

اگر برای آن روز چند مناسبت ثبت شده باشد، همهٔ آن‌ها برگردانده می‌شوند.

## ۶. اگر تاریخ میلادی دارید، ابتدا آن را تبدیل کنید

فایل‌های تقویم FarsiUI از تاریخ شمسی استفاده می‌کنند و وظیفهٔ تبدیل تاریخ را بر عهده ندارند.

اگر تاریخ شما میلادی است، ابتدا آن را با یک کتابخانهٔ سازگار با تقویم جلالی، مانند `@internationalized/date`، به تاریخ شمسی تبدیل کنید. سپس تاریخ را با فرمت `YYYY-MM-DD` بسازید و در فهرست مناسبت‌ها جست‌وجو کنید.

## چند نکته مهم

- برای دریافت فایل‌ها به اینترنت نیاز دارید، اما به سرور اختصاصی یا API خودتان احتیاجی نیست.
- فایل‌های هر سال را فقط پس از انتشار و بررسی صحت داده‌ها استفاده کنید.
- این داده‌ها برای تشخیص مناسبت‌ها و تعطیلات هستند؛ تبدیل تاریخ و محاسبهٔ روز هفته باید جداگانه انجام شود.

منبع اصلی داده‌ها، سایت رسمی مرکز تقویم دانشگاه تهران است.

---

## Layout (مرجع فنی)

```
calendar/
  meta.json
  schema.json
  rules/fixed-jalali.json
  years/{YEAR}/holidays.json
  years/{YEAR}/events.json
  README.md
```

**سال‌های موجود:** ۱۳۸۳ تا ۱۴۰۵.

## Data policy

1. منبع اصلی: سایت رسمی مرکز تقویم دانشگاه تهران.
2. لایسنس داده: **CC0-1.0** (جزئیات در `meta.json`).
