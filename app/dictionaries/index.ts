import type { Locale } from "../i18n-config";

const dictionaries = {
  en: () => import("./en.json").then((m) => m.default),
  bn: () => import("./bn.json").then((m) => m.default),
  hi: () => import("./hi.json").then((m) => m.default),
  ur: () => import("./ur.json").then((m) => m.default),
  ar: () => import("./ar.json").then((m) => m.default),
  es: () => import("./es.json").then((m) => m.default),
  zh: () => import("./zh.json").then((m) => m.default),
  fr: () => import("./fr.json").then((m) => m.default),
} satisfies Record<Locale, () => Promise<typeof import("./en.json")>>;

export const getDictionary = async (locale: Locale) => dictionaries[locale]();

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
