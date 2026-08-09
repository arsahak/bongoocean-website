export const locales = ["en", "bn", "hi", "ur", "ar", "es", "zh", "fr"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const rtlLocales: readonly Locale[] = ["ur", "ar"];

export const localeNames: Record<Locale, string> = {
  en: "English",
  bn: "বাংলা",
  hi: "हिन्दी",
  ur: "اردو",
  ar: "العربية",
  es: "Español",
  zh: "中文",
  fr: "Français",
};

export function getDirection(locale: Locale): "ltr" | "rtl" {
  return rtlLocales.includes(locale) ? "rtl" : "ltr";
}
