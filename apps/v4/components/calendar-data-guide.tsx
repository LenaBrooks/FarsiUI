import { Callout } from "@/components/callout"
import { CodeFigure } from "@/components/code-figure"
import { calendarYearUrls } from "@/lib/calendar/cdn"

const GUIDE_YEAR = 1405

const GUIDE_ITEM_SAMPLE = `{
  "id": "nature-day-1405",
  "date": "1405-01-13",
  "title": {
    "fa": "روز طبیعت",
    "en": "Nature Day"
  },
  "isHoliday": true,
  "categories": ["national"]
}`

const codeFigureClass =
  "[&_pre]:max-h-80 [&_pre]:overflow-auto [&_pre]:scrollbar-soft"

/** Docs-styled guide for consuming calendar JSON via GitHub Raw. */
export async function CalendarDataGuide() {
  const urls = calendarYearUrls(GUIDE_YEAR)

  const guideFetchBasic = `const response = await fetch(
  "${urls.holidays}"
);

const data = await response.json();

console.log(data);`

  const guideFindDay = `const response = await fetch(
  "${urls.holidays}"
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
}`

  return (
    <div
      id="calendar-data"
      data-slot="docs"
      data-docs-kind="docs"
      dir="rtl"
      lang="fa"
      className="mx-auto w-full max-w-6xl min-w-0 text-foreground"
    >
      <div className="typeset w-full min-w-0 max-w-160">
        <h2 id="راهنمای-استفاده">
          راهنمای استفاده از داده‌های تقویم FarsiUI
        </h2>
        <p>
          با داده‌های تقویم FarsiUI می‌توانید بررسی کنید که یک روز تعطیل رسمی است
          یا چه مناسبت‌هایی دارد. نیازی به نصب پکیج یا راه‌اندازی سرور ندارید؛
          کافی است فایل JSON موردنیاز را از طریق اینترنت دریافت کنید.
        </p>
        <p>در این راهنما از سال ۱۴۰۵ به‌عنوان مثال استفاده می‌کنیم.</p>

        <div className="steps relative mb-12 mt-6 [counter-reset:step] md:ms-4 md:border-s md:ps-8 [&>h3]:step">
          <h3 className="font-heading">سال موردنظر را مشخص کنید</h3>
          <p>
            سال تقویم جلالی را انتخاب کنید؛ مثلاً <code>1405</code>. این عدد در
            آدرس فایل‌های همان سال استفاده می‌شود.
          </p>

          <h3 className="font-heading">فایل موردنیاز را انتخاب کنید</h3>
          <p>این سه فایل در دسترس است:</p>
          <ul>
            <li>
              <code>holidays.json</code> — تعطیلات رسمی همان سال (ملی و مذهبی)
            </li>
            <li>
              <code>events.json</code> — مناسبت‌های غیرتعطیل همان سال
            </li>
            <li>
              <code>meta.json</code> — فهرست همهٔ سال‌های منتشرشده (برای کل
              مجموعه، نه فقط یک سال)
            </li>
          </ul>
          <ul>
            <li>
              <a href={urls.holidays} target="_blank" rel="noreferrer">
                دریافت فایل تعطیلات سال ۱۴۰۵
              </a>
            </li>
            <li>
              <a href={urls.events} target="_blank" rel="noreferrer">
                دریافت فایل مناسبت‌های سال ۱۴۰۵
              </a>
            </li>
            <li>
              <a href={urls.meta} target="_blank" rel="noreferrer">
                دریافت meta.json
              </a>
            </li>
          </ul>
          <p>
            می‌توانید لینک هر فایل را در مرورگر باز کنید یا مستقیماً در کد خود
            از آن استفاده کنید.
          </p>

          <h3 className="font-heading">فایل JSON را دریافت کنید</h3>
          <p>
            برای دریافت اطلاعات، از <code>fetch</code> استفاده کنید:
          </p>
          <CodeFigure
            code={guideFetchBasic}
            language="js"
            title="fetch"
            className={codeFigureClass}
          />
          <p>در این مثال، اطلاعات تعطیلات رسمی سال ۱۴۰۵ دریافت می‌شود.</p>

          <h3 className="font-heading">ساختار داده‌ها را بشناسید</h3>
          <p>
            اطلاعات هر فایل در قالب JSON ارائه می‌شود. فهرست روزها داخل ویژگی{" "}
            <code>items</code> قرار دارد.
          </p>
          <p>نمونه‌ای از یک آیتم:</p>
          <CodeFigure
            code={GUIDE_ITEM_SAMPLE}
            language="json"
            title="item"
            className={codeFigureClass}
          />
          <p>معنی فیلدها:</p>
          <ul>
            <li>
              <code>id</code>: شناسه یکتای مناسبت
            </li>
            <li>
              <code>date</code>: تاریخ شمسی به فرمت <code>YYYY-MM-DD</code>
            </li>
            <li>
              <code>title.fa</code>: عنوان فارسی
            </li>
            <li>
              <code>title.en</code>: عنوان انگلیسی
            </li>
            <li>
              <code>isHoliday</code>: مشخص می‌کند این مناسبت تعطیل رسمی است یا
              نه
            </li>
            <li>
              <code>categories</code>: دسته‌بندی مناسبت
            </li>
          </ul>
          <p>
            ممکن است در یک روز چند مناسبت وجود داشته باشد؛ بنابراین برای پیدا
            کردن مناسبت‌های یک روز، تمام آیتم‌های مطابق با تاریخ را بررسی کنید.
          </p>
          <Callout title="نکته" variant="info">
            جمعه‌ها و تعطیلی‌های موردی که بعداً اعلام می‌شوند، لزوماً در این
            داده‌ها وجود ندارند. برای تشخیص جمعه باید روز هفته را جداگانه
            محاسبه کنید.
          </Callout>

          <h3 className="font-heading">تعطیلی یا مناسبت یک روز را پیدا کنید</h3>
          <p>
            اگر تاریخ شمسی روز موردنظر را دارید، آن را با فیلد <code>date</code>{" "}
            مقایسه کنید:
          </p>
          <CodeFigure
            code={guideFindDay}
            language="js"
            title="filter"
            className={codeFigureClass}
          />
          <p>
            اگر برای آن روز چند مناسبت ثبت شده باشد، همهٔ آن‌ها برگردانده
            می‌شوند.
          </p>

          <h3 className="font-heading">
            اگر تاریخ میلادی دارید، ابتدا آن را تبدیل کنید
          </h3>
          <p>
            فایل‌های تقویم FarsiUI از تاریخ شمسی استفاده می‌کنند و وظیفهٔ تبدیل
            تاریخ را بر عهده ندارند.
          </p>
          <p>
            اگر تاریخ شما میلادی است، ابتدا آن را با یک کتابخانهٔ سازگار با
            تقویم جلالی، مانند <code>@internationalized/date</code>، به تاریخ
            شمسی تبدیل کنید. سپس تاریخ را با فرمت <code>YYYY-MM-DD</code> بسازید
            و در فهرست مناسبت‌ها جست‌وجو کنید.
          </p>
        </div>

        <h2>چند نکته مهم</h2>
        <ul>
          <li>
            برای دریافت فایل‌ها به اینترنت نیاز دارید، اما به سرور اختصاصی یا
            API خودتان احتیاجی نیست.
          </li>
          <li>
            فایل‌های هر سال را فقط پس از انتشار و بررسی صحت داده‌ها استفاده
            کنید.
          </li>
          <li>
            این داده‌ها برای تشخیص مناسبت‌ها و تعطیلات هستند؛ تبدیل تاریخ و
            محاسبهٔ روز هفته باید جداگانه انجام شود.
          </li>
        </ul>
        <p>منبع اصلی داده‌ها، سایت رسمی مرکز تقویم دانشگاه تهران است.</p>
      </div>
    </div>
  )
}
