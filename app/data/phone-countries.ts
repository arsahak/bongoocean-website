// The same 8 countries the storefront already supports for shipping/locale
// (see shippingDestinationByCountry / localeToCountryCode in ./shipping.ts) —
// kept in sync so the phone country selector never offers a country the rest
// of the site doesn't serve.

import {
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js/min";

export interface PhoneCountry {
  /** ISO 3166-1 alpha-2 code, also a libphonenumber-js CountryCode. */
  code: string;
  name: string;
  dialCode: string;
}

export const phoneCountries: PhoneCountry[] = [
  { code: "BD", name: "Bangladesh", dialCode: "+880" },
  { code: "US", name: "United States", dialCode: "+1" },
  { code: "IN", name: "India", dialCode: "+91" },
  { code: "PK", name: "Pakistan", dialCode: "+92" },
  { code: "SA", name: "Saudi Arabia", dialCode: "+966" },
  { code: "ES", name: "Spain", dialCode: "+34" },
  { code: "CN", name: "China", dialCode: "+86" },
  { code: "FR", name: "France", dialCode: "+33" },
];

export function phoneFlagUrl(countryCode: string) {
  return `https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`;
}

// Display-only formatting (e.g. "01792843207" -> "+880 1792-843207"). Numbers
// saved before the country-aware PhoneInput existed may be stored as plain
// local digits with no "+", so this falls back to BD (the site's default
// market) when the string has no country code to parse from.
export function formatPhoneDisplay(
  phone: string,
  defaultCountry: CountryCode = "BD",
): string {
  if (!phone) return phone;

  const parsed = parsePhoneNumberFromString(phone, defaultCountry);
  return parsed ? parsed.formatInternational() : phone;
}
