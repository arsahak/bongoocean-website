import type { Locale } from "@/app/i18n-config";

export interface ShippingMethod {
  /** Estimated delivery window, in days. */
  days: string;
  /** Regional transit hub the shipment routes through. */
  hub: string;
}

export interface ShippingDestination {
  name: string;
  flag: string;
  air: ShippingMethod;
  sea: ShippingMethod;
}

export const shippingHub = {
  name: "China",
  flag: "🇨🇳",
};

/** Keyed by ISO-3166 alpha-2 country code — this is what the visitor's real location resolves to. */
export const shippingDestinationByCountry: Record<string, ShippingDestination> = {
  US: {
    name: "United States",
    flag: "🇺🇸",
    air: { days: "3-5", hub: "LAX Air Hub" },
    sea: { days: "18-25", hub: "Long Beach Port" },
  },
  BD: {
    name: "Bangladesh",
    flag: "🇧🇩",
    air: { days: "2-4", hub: "Dhaka Air Hub" },
    sea: { days: "12-18", hub: "Chittagong Port" },
  },
  IN: {
    name: "India",
    flag: "🇮🇳",
    air: { days: "2-4", hub: "Mumbai Air Hub" },
    sea: { days: "10-16", hub: "Mumbai Port" },
  },
  PK: {
    name: "Pakistan",
    flag: "🇵🇰",
    air: { days: "3-5", hub: "Karachi Air Hub" },
    sea: { days: "14-20", hub: "Karachi Port" },
  },
  SA: {
    name: "Saudi Arabia",
    flag: "🇸🇦",
    air: { days: "2-4", hub: "Jeddah Air Hub" },
    sea: { days: "12-18", hub: "Jeddah Port" },
  },
  ES: {
    name: "Spain",
    flag: "🇪🇸",
    air: { days: "3-5", hub: "Madrid Air Hub" },
    sea: { days: "20-28", hub: "Valencia Port" },
  },
  CN: {
    name: "China",
    flag: "🇨🇳",
    air: { days: "1-2", hub: "Domestic Hub" },
    sea: { days: "1-3", hub: "Domestic Hub" },
  },
  FR: {
    name: "France",
    flag: "🇫🇷",
    air: { days: "3-5", hub: "Paris Air Hub" },
    sea: { days: "20-28", hub: "Le Havre Port" },
  },
};

/** Used only when the visitor's real location can't be resolved (e.g. local dev, header missing). */
export const localeToCountryCode: Record<Locale, string> = {
  en: "US",
  bn: "BD",
  hi: "IN",
  ur: "PK",
  ar: "SA",
  es: "ES",
  zh: "CN",
  fr: "FR",
};

/** Generic fallback for visitors from a country outside the curated list above. */
export const defaultShippingDestination: ShippingDestination = {
  name: "Your Country",
  flag: "🌍",
  air: { days: "4-7", hub: "Regional Air Hub" },
  sea: { days: "15-30", hub: "Regional Port" },
};
