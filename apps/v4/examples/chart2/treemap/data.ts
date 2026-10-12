/** سلسله‌مراتب نمونه برای دموهای درخت‌نقشه (فروش شعب و کانال‌ها). */

export type TreemapLeaf = { name: string; size: number }
export type TreemapBranch = {
  name: string
  children: Array<TreemapLeaf | TreemapBranch>
}

export const TREEMAP_DATA: TreemapBranch[] = [
  {
    name: "شعب",
    children: [
      { name: "تهران", size: 24593 },
      { name: "اصفهان", size: 6703 },
      { name: "شیراز", size: 1302 },
      { name: "مشهد", size: 652 },
      { name: "تبریز", size: 636 },
    ],
  },
  {
    name: "کانال‌ها",
    children: [
      { name: "فروش حضوری", size: 8435 },
      { name: "فروش آنلاین", size: 7862 },
      { name: "درگاه", size: 5222 },
      { name: "پیک", size: 4896 },
      { name: "تحویل حضوری", size: 4665 },
      { name: "کیف پول", size: 3824 },
      { name: "نقدی", size: 2832 },
      { name: "کارت", size: 2649 },
      { name: "نمایندگی", size: 2138 },
      { name: "باشگاه مشتریان", size: 1353 },
      { name: "سایر", size: 763 },
    ],
  },
  {
    name: "محصولات",
    children: [
      { name: "الکترونیک", size: 20544 },
      { name: "پوشاک", size: 19788 },
      { name: "خوراکی", size: 19382 },
      { name: "خانه", size: 11275 },
      { name: "زیبایی", size: 10349 },
      {
        name: "فرعی",
        children: [
          { name: "لوازم جانبی", size: 5569 },
          { name: "هدیه", size: 2247 },
          { name: "فصلی", size: 698 },
          { name: "سایر فرعی", size: 353 },
        ],
      },
      { name: "ورزش", size: 9930 },
      { name: "کودک", size: 7147 },
      { name: "کتاب", size: 3301 },
    ],
  },
  {
    name: "رویدادها",
    children: [
      { name: "حراج", size: 7313 },
      { name: "جشنواره", size: 6880 },
      { name: "پیشنهاد ویژه", size: 3701 },
      { name: "معرفی محصول", size: 2117 },
    ],
  },
  {
    name: "راهنما",
    children: [
      { name: "دسته‌بندی", size: 20859 },
      { name: "برچسب", size: 10530 },
      { name: "محدوده", size: 4614 },
    ],
  },
  {
    name: "عملیات",
    children: [
      {
        name: "تخفیف",
        children: [
          { name: "درصدی", size: 6314 },
          { name: "مبلغی", size: 4461 },
          { name: "کد تخفیف", size: 3444 },
        ],
      },
      {
        name: "کدگذاری",
        children: [
          { name: "رنگ", size: 4138 },
          { name: "اندازه", size: 4060 },
          { name: "قیمت", size: 3179 },
          { name: "شکل", size: 1830 },
          { name: "وزن", size: 1690 },
        ],
      },
      {
        name: "فیلتر",
        children: [
          { name: "موجودی", size: 5219 },
          { name: "فاصله", size: 3509 },
          { name: "دیده شدن", size: 3165 },
        ],
      },
      { name: "عملگر پایه", size: 1286 },
      {
        name: "برچسب‌گذاری",
        children: [
          { name: "عمومی", size: 9956 },
          { name: "شعاعی", size: 3899 },
          { name: "ناحیه‌ای", size: 3202 },
        ],
      },
      {
        name: "چیدمان",
        children: [
          { name: "درخت‌نقشه", size: 12870 },
          { name: "شعاعی", size: 12348 },
          { name: "دایره‌ای", size: 12003 },
          { name: "پشته‌ای", size: 9317 },
          { name: "دایره", size: 9121 },
          { name: "نیرو", size: 8411 },
          { name: "محور", size: 7881 },
          { name: "محوری", size: 6725 },
          { name: "یخچالی", size: 4864 },
          { name: "دندروگرام", size: 4853 },
          { name: "مسیر", size: 3727 },
          { name: "تورفته", size: 3174 },
          { name: "پای", size: 2728 },
          { name: "تصادفی", size: 870 },
          { name: "سایر چیدمان", size: 9191 },
        ],
      },
      { name: "عملگر", size: 5248 },
      { name: "توالی", size: 4190 },
      { name: "سوییچ", size: 2581 },
      { name: "مرتب‌سازی", size: 2490 },
      { name: "فهرست", size: 2023 },
    ],
  },
]

/** زیرمجموعه برای دموهای کوتاه‌تر (بدون شاخهٔ عملیات). */
export const TREEMAP_DATA_NESTED: TreemapBranch[] = TREEMAP_DATA.filter(
  (b) => b.name !== "عملیات"
)

export const TREEMAP_BUNDLE_DATA: TreemapBranch[] = [
  {
    name: "وابستگی‌ها",
    children: [
      { name: "react-redux", size: 2304 },
      { name: "victory-vendor", size: 1792 },
    ],
  },
  {
    name: "منبع",
    children: [
      {
        name: "نمودار",
        children: [
          { name: "Treemap.tsx", size: 1536 },
          { name: "SunburstChart.tsx", size: 1280 },
        ],
      },
      { name: "Tooltip.tsx", size: 1152 },
      { name: "ChartUtils.ts", size: 640 },
    ],
  },
  {
    name: "خروجی",
    children: [{ name: "مستندات", size: 1024 }],
  },
]
