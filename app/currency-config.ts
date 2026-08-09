import type { Locale } from "./i18n-config";

export const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "BDT", symbol: "৳", name: "Bangladeshi Taka" },
  { code: "PKR", symbol: "₨", name: "Pakistani Rupee" },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
  { code: "QAR", symbol: "ر.ق", name: "Qatari Riyal" },
  { code: "KWD", symbol: "د.ك", name: "Kuwaiti Dinar" },
  { code: "EGP", symbol: "E£", name: "Egyptian Pound" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah" },
  { code: "THB", symbol: "฿", name: "Thai Baht" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "KRW", symbol: "₩", name: "South Korean Won" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "RUB", symbol: "₽", name: "Russian Ruble" },
  { code: "ZAR", symbol: "R", name: "South African Rand" },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  { code: "MXN", symbol: "MX$", name: "Mexican Peso" },
] as const;

export type CurrencyCode = (typeof currencies)[number]["code"];

/**
 * Store/admin base currency — all product prices in the database are
 * assumed to be entered in this currency. Override via env when the
 * admin dashboard sets a different store currency.
 */
export const baseCurrency: CurrencyCode =
  (process.env.NEXT_PUBLIC_BASE_CURRENCY as CurrencyCode) || "USD";

/** Default currency shown to a visitor based on their selected language. */
export const localeCurrencyMap: Record<Locale, CurrencyCode> = {
  en: "USD",
  bn: "BDT",
  hi: "INR",
  ur: "PKR",
  ar: "SAR",
  es: "EUR",
  zh: "CNY",
  fr: "EUR",
};

export function isCurrencyCode(value: string): value is CurrencyCode {
  return currencies.some((c) => c.code === value);
}

export function getCurrencySymbol(code: CurrencyCode): string {
  return currencies.find((c) => c.code === code)?.symbol ?? code;
}
