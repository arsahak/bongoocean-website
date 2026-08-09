import { localeToCountryCode } from "@/app/data/shipping";
import { locales, type Locale } from "@/app/i18n-config";
import SecureShipping from "@/component/home/SecureShipping";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

export default async function ShippingGuidePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  if (!locales.includes(rawLang as Locale)) notFound();
  const lang = rawLang as Locale;

  const requestHeaders = await headers();
  const countryCode =
    requestHeaders.get("x-vercel-ip-country") ?? localeToCountryCode[lang];

  return (
    <div className="container py-10">
      <SecureShipping countryCode={countryCode} />
    </div>
  );
}
