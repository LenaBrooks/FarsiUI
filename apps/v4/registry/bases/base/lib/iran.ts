import { normalizeDigits, toPersianDigits } from "@/registry/bases/base/lib/digits"

/** Shared Iranian form helpers: price words, phone, national ID, Sheba, card. */

export function onlyDigits(value: string, max?: number) {
  const digits = normalizeDigits(value).replace(/\D/g, "")
  return max != null ? digits.slice(0, max) : digits
}

// ——— Amount / price ———

const ONES = [
  "",
  "یک",
  "دو",
  "سه",
  "چهار",
  "پنج",
  "شش",
  "هفت",
  "هشت",
  "نه",
]
const TEENS = [
  "ده",
  "یازده",
  "دوازده",
  "سیزده",
  "چهارده",
  "پانزده",
  "شانزده",
  "هفده",
  "هجده",
  "نوزده",
]
const TENS = [
  "",
  "",
  "بیست",
  "سی",
  "چهل",
  "پنجاه",
  "شصت",
  "هفتاد",
  "هشتاد",
  "نود",
]
const HUNDREDS = [
  "",
  "صد",
  "دویست",
  "سیصد",
  "چهارصد",
  "پانصد",
  "ششصد",
  "هفتصد",
  "هشتصد",
  "نهصد",
]
const SCALES = ["", "هزار", "میلیون", "میلیارد", "تریلیون"]

function threeDigitsToWords(n: number): string {
  if (n <= 0) return ""
  const parts: string[] = []
  const h = Math.floor(n / 100)
  const rem = n % 100
  if (h) parts.push(HUNDREDS[h]!)
  if (rem >= 10 && rem < 20) {
    parts.push(TEENS[rem - 10]!)
  } else {
    const t = Math.floor(rem / 10)
    const o = rem % 10
    if (t) parts.push(TENS[t]!)
    if (o) parts.push(ONES[o]!)
  }
  return parts.join(" و ")
}

/** Convert a non-negative integer to Persian words (no currency suffix). */
export function numberToPersianWords(value: number | string): string {
  const raw = typeof value === "string" ? onlyDigits(value) : String(Math.trunc(value))
  if (!raw || /^0+$/.test(raw)) return "صفر"
  // Cap at reasonable length for UI
  const normalized = raw.replace(/^0+/, "") || "0"
  if (normalized.length > 15) return "مبلغ خیلی بزرگ"

  const groups: number[] = []
  for (let i = normalized.length; i > 0; i -= 3) {
    groups.push(Number(normalized.slice(Math.max(0, i - 3), i)))
  }

  const parts: string[] = []
  for (let i = groups.length - 1; i >= 0; i--) {
    const g = groups[i]!
    if (!g) continue
    const scale = SCALES[i] ?? ""
    const words = threeDigitsToWords(g)
    parts.push(scale ? `${words} ${scale}` : words)
  }
  return parts.join(" و ")
}

export type PriceCurrency = "toman" | "rial"

/** 1 تومان = 10 ریال */
export function convertPrice(amount: number, from: PriceCurrency, to: PriceCurrency) {
  if (from === to) return amount
  return from === "rial" ? Math.floor(amount / 10) : amount * 10
}

export function formatPriceDigits(
  amount: number | string,
  options?: { currency?: PriceCurrency; persianDigits?: boolean }
) {
  const digits = onlyDigits(String(amount))
  if (!digits) return ""
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  const shown = options?.persianDigits === false ? grouped : toPersianDigits(grouped)
  const unit = options?.currency === "rial" ? "ریال" : "تومان"
  return `${shown} ${unit}`
}

/** e.g. 10000000 → «ده میلیون تومان» */
export function amountToPersianCurrencyWords(
  amount: number | string,
  currency: PriceCurrency = "toman"
) {
  const digits = onlyDigits(String(amount))
  if (!digits) return ""
  const n = Number(digits)
  if (!Number.isFinite(n)) return ""
  const words = numberToPersianWords(n)
  return `${words} ${currency === "rial" ? "ریال" : "تومان"}`
}

// ——— Phone ———

/** Normalize to 09xxxxxxxxx (11 digits) or empty. */
export function normalizeIranPhone(value: string) {
  let d = onlyDigits(value)
  if (d.startsWith("98") && d.length >= 12) d = `0${d.slice(2)}`
  if (d.startsWith("9") && d.length === 10) d = `0${d}`
  return d.slice(0, 11)
}

export function formatIranPhone(digits: string) {
  const d = normalizeIranPhone(digits)
  if (d.length <= 4) return d
  if (d.length <= 7) return `${d.slice(0, 4)} ${d.slice(4)}`
  return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}`
}

export function isIranMobile(value: string) {
  return /^09\d{9}$/.test(normalizeIranPhone(value))
}

// ——— National ID ———

export function normalizeNationalId(value: string) {
  return onlyDigits(value, 10)
}

export function formatNationalId(digits: string) {
  const d = normalizeNationalId(digits)
  const a = d.slice(0, 3)
  const b = d.slice(3, 9)
  const c = d.slice(9, 10)
  let out = a
  if (b) out += `-${b}`
  if (c) out += `-${c}`
  return out
}

export function isNationalId(value: string) {
  const d = normalizeNationalId(value)
  if (!/^\d{10}$/.test(d)) return false
  if (/^(\d)\1{9}$/.test(d)) return false
  let sum = 0
  for (let i = 0; i < 9; i++) sum += Number(d[i]) * (10 - i)
  const rem = sum % 11
  const check = Number(d[9])
  return rem < 2 ? check === rem : check === 11 - rem
}

// ——— Sheba (IBAN IR) ———

export function normalizeSheba(value: string) {
  const raw = normalizeDigits(value).toUpperCase().replace(/[^A-Z0-9]/g, "")
  let s = raw.startsWith("IR") ? raw : raw ? `IR${raw}` : ""
  return s.slice(0, 26)
}

export function formatSheba(value: string) {
  const s = normalizeSheba(value)
  return s.replace(/(.{4})/g, "$1 ").trim()
}

export function isSheba(value: string) {
  const s = normalizeSheba(value)
  if (!/^IR\d{24}$/.test(s)) return false
  const rearranged = s.slice(4) + "1827" + s.slice(2, 4)
  let remainder = 0
  for (const ch of rearranged) {
    remainder = (remainder * 10 + Number(ch)) % 97
  }
  return remainder === 1
}

// ——— Bank card ———

/** Common Iranian card BIN prefixes → bank name (FA). */
export const IRAN_CARD_BANKS: Array<{ prefixes: string[]; name: string }> = [
  { prefixes: ["603799"], name: "بانک ملی" },
  { prefixes: ["589210"], name: "بانک سپه" },
  { prefixes: ["627648", "207177"], name: "بانک توسعه صادرات" },
  { prefixes: ["627961"], name: "بانک صنعت و معدن" },
  { prefixes: ["603770", "639217"], name: "بانک کشاورزی" },
  { prefixes: ["628023"], name: "بانک مسکن" },
  { prefixes: ["627760"], name: "پست بانک" },
  { prefixes: ["502908"], name: "بانک توسعه تعاون" },
  { prefixes: ["627353", "585983"], name: "بانک تجارت" },
  { prefixes: ["502229", "639599"], name: "بانک پاسارگاد" },
  { prefixes: ["627412"], name: "بانک اقتصاد نوین" },
  { prefixes: ["622106", "639194", "627884"], name: "بانک پارسیان" },
  { prefixes: ["502806", "504172"], name: "بانک شهر" },
  { prefixes: ["502938"], name: "بانک دی" },
  { prefixes: ["603769"], name: "بانک صادرات" },
  { prefixes: ["610433", "991975"], name: "بانک ملت" },
  { prefixes: ["627488", "502910"], name: "بانک کارآفرین" },
  { prefixes: ["621986"], name: "بانک سامان" },
  { prefixes: ["639346"], name: "بانک سینا" },
  { prefixes: ["639607"], name: "بانک سرمایه" },
  { prefixes: ["636214"], name: "بانک آینده" },
  { prefixes: ["505785"], name: "بانک ایران‌زمین" },
  { prefixes: ["636795"], name: "بانک مرکزی" },
  { prefixes: ["628157"], name: "مؤسسه اعتباری توسعه" },
  { prefixes: ["505416"], name: "بانک گردشگری" },
  { prefixes: ["636949"], name: "بانک حکمت ایرانیان" },
  { prefixes: ["627381"], name: "بانک انصار" },
  { prefixes: ["505801"], name: "مؤسسه اعتباری کوثر" },
  { prefixes: ["504706"], name: "بانک رسالت" },
]

export function normalizeCardNumber(value: string) {
  return onlyDigits(value, 16)
}

export function formatCardNumber(digits: string) {
  const d = normalizeCardNumber(digits)
  return d.replace(/(\d{4})(?=\d)/g, "$1 ").trim()
}

export function luhnCheck(digits: string) {
  const d = onlyDigits(digits)
  if (!/^\d{16}$/.test(d)) return false
  let sum = 0
  for (let i = 0; i < 16; i++) {
    let n = Number(d[15 - i])
    if (i % 2 === 1) {
      n *= 2
      if (n > 9) n -= 9
    }
    sum += n
  }
  return sum % 10 === 0
}

export function detectBankFromCard(value: string) {
  const d = normalizeCardNumber(value)
  for (const bank of IRAN_CARD_BANKS) {
    if (bank.prefixes.some((p) => d.startsWith(p))) return bank.name
  }
  return null
}

export function isBankCard(value: string) {
  return luhnCheck(normalizeCardNumber(value))
}

// ——— Address (provinces + major cities) ———

export type IranCity = { name: string }
export type IranProvince = { name: string; cities: IranCity[] }

export const IRAN_PROVINCES: IranProvince[] = [
  { name: "تهران", cities: [{ name: "تهران" }, { name: "شهریار" }, { name: "ری" }, { name: "اسلامشهر" }] },
  { name: "البرز", cities: [{ name: "کرج" }, { name: "فردیس" }, { name: "نظرآباد" }] },
  { name: "اصفهان", cities: [{ name: "اصفهان" }, { name: "کاشان" }, { name: "نجف‌آباد" }] },
  { name: "فارس", cities: [{ name: "شیراز" }, { name: "مرودشت" }, { name: "جهرم" }] },
  { name: "خراسان رضوی", cities: [{ name: "مشهد" }, { name: "نیشابور" }, { name: "سبزوار" }] },
  { name: "آذربایجان شرقی", cities: [{ name: "تبریز" }, { name: "مراغه" }, { name: "مرند" }] },
  { name: "آذربایجان غربی", cities: [{ name: "ارومیه" }, { name: "خوی" }, { name: "مهاباد" }] },
  { name: "خوزستان", cities: [{ name: "اهواز" }, { name: "آبادان" }, { name: "دزفول" }] },
  { name: "مازندران", cities: [{ name: "ساری" }, { name: "بابل" }, { name: "آمل" }] },
  { name: "گیلان", cities: [{ name: "رشت" }, { name: "بندر انزلی" }, { name: "لاهیجان" }] },
  { name: "کرمان", cities: [{ name: "کرمان" }, { name: "رفسنجان" }, { name: "جیرفت" }] },
  { name: "سیستان و بلوچستان", cities: [{ name: "زاهدان" }, { name: "چابهار" }, { name: "ایرانشهر" }] },
  { name: "هرمزگان", cities: [{ name: "بندرعباس" }, { name: "میناب" }, { name: "کیش" }] },
  { name: "یزد", cities: [{ name: "یزد" }, { name: "میبد" }, { name: "اردکان" }] },
  { name: "قم", cities: [{ name: "قم" }] },
  { name: "قزوین", cities: [{ name: "قزوین" }, { name: "تاکستان" }] },
  { name: "همدان", cities: [{ name: "همدان" }, { name: "ملایر" }] },
  { name: "کرمانشاه", cities: [{ name: "کرمانشاه" }, { name: "اسلام‌آباد غرب" }] },
  { name: "لرستان", cities: [{ name: "خرم‌آباد" }, { name: "بروجرد" }] },
  { name: "مرکزی", cities: [{ name: "اراک" }, { name: "ساوه" }] },
  { name: "زنجان", cities: [{ name: "زنجان" }, { name: "ابهر" }] },
  { name: "سمنان", cities: [{ name: "سمنان" }, { name: "شاهرود" }] },
  { name: "گلستان", cities: [{ name: "گرگان" }, { name: "گنبد کاووس" }] },
  { name: "اردبیل", cities: [{ name: "اردبیل" }, { name: "پارس‌آباد" }] },
  { name: "کردستان", cities: [{ name: "سنندج" }, { name: "سقز" }] },
  { name: "ایلام", cities: [{ name: "ایلام" }, { name: "دهلران" }] },
  { name: "بوشهر", cities: [{ name: "بوشهر" }, { name: "کنگان" }] },
  { name: "کهگیلویه و بویراحمد", cities: [{ name: "یاسوج" }, { name: "دوگنبدان" }] },
  { name: "چهارمحال و بختیاری", cities: [{ name: "شهرکرد" }, { name: "بروجن" }] },
  { name: "خراسان شمالی", cities: [{ name: "بجنورد" }, { name: "شیروان" }] },
  { name: "خراسان جنوبی", cities: [{ name: "بیرجند" }, { name: "قائن" }] },
]

export function isPostalCode(value: string) {
  return /^\d{10}$/.test(onlyDigits(value, 10))
}

// ——— Excel-friendly CSV ———

/** Build UTF-8 BOM CSV that opens correctly in Excel (fa). */
export function toExcelCsv(
  rows: Array<Record<string, string | number | boolean | null | undefined>>,
  columns?: Array<{ key: string; header: string }>
) {
  if (!rows.length && !columns?.length) return "\uFEFF"
  const keys =
    columns?.map((c) => c.key) ??
    Object.keys(rows[0] ?? {})
  const headers =
    columns?.map((c) => c.header) ?? keys

  const escape = (v: unknown) => {
    const s = v == null ? "" : String(v)
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`
    return s
  }

  const lines = [
    headers.map(escape).join(","),
    ...rows.map((row) => keys.map((k) => escape(row[k])).join(",")),
  ]
  return `\uFEFF${lines.join("\r\n")}`
}

export function downloadExcelCsv(filename: string, csv: string) {
  if (typeof window === "undefined") return
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
