import { localeToCountryCode } from "@/app/data/shipping";
import { getDictionary } from "@/app/dictionaries";
import { locales, type Locale } from "@/app/i18n-config";
import { CategoryGrid } from "@/component/home/CategoryGrid";
import { FeaturedProducts } from "@/component/home/FeaturedProducts";
import { HeroSection } from "@/component/home/HeroSection";
import { NewArrivals } from "@/component/home/NewArrivals";
import SecureShipping from "@/component/home/SecureShipping";
import { SellerBanner } from "@/component/home/SellerBanner";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  if (!locales.includes(rawLang as Locale)) notFound();
  const lang = rawLang as Locale;
  const dict = await getDictionary(lang);

  // Real visitor location from the hosting edge network, when available (e.g. Vercel).
  // Falls back to a language-based guess in local dev or on hosts that don't set it.
  const requestHeaders = await headers();
  const countryCode =
    requestHeaders.get("x-vercel-ip-country") ?? localeToCountryCode[lang];

  return (
    <>
      <HeroSection dict={dict} lang={lang} />
      <CategoryGrid dict={dict} lang={lang} />
      <FeaturedProducts dict={dict} lang={lang} />
      <NewArrivals dict={dict} lang={lang} />
      <SellerBanner dict={dict} lang={lang} />
      <SecureShipping countryCode={countryCode} />
    </>
  );
}
