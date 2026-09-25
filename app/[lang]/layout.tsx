import { CartProvider } from "@/component/providers/CartProvider";
import { CurrencyProvider } from "@/component/providers/CurrencyProvider";
import { ThemeProvider } from "@/component/providers/ThemeProvider";
import { ThemeScript } from "@/component/providers/ThemeScript";
import { WishlistProvider } from "@/component/providers/WishlistProvider";
import type { Metadata } from "next";
import { DM_Sans, Inter, Plus_Jakarta_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import { getDictionary } from "../dictionaries";
import "../globals.css";
import { getDirection, locales, type Locale } from "../i18n-config";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.bongoocean.com"
).replace(/\/+$/, "");
const SITE_NAME = "BongoOcean";
const OPEN_GRAPH_LOCALES: Record<Locale, string> = {
  en: "en_US",
  bn: "bn_BD",
  hi: "hi_IN",
  ur: "ur_PK",
  ar: "ar_SA",
  es: "es_ES",
  zh: "zh_CN",
  fr: "fr_FR",
};

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!locales.includes(lang as Locale)) notFound();

  const locale = lang as Locale;
  const dict = await getDictionary(locale);
  const canonicalPath = `/${locale}`;
  const canonicalUrl = new URL(canonicalPath, SITE_URL).toString();
  const socialImageUrl = new URL("/opengraph-image.png", SITE_URL).toString();
  const languageAlternates = Object.fromEntries([
    ...locales.map((supportedLocale) => [
      supportedLocale,
      `/${supportedLocale}`,
    ]),
    ["x-default", "/en"],
  ]);

  return {
    metadataBase: new URL(SITE_URL),
    applicationName: SITE_NAME,
    title: {
      default: dict.meta.title,
      template: `%s | ${SITE_NAME}`,
    },
    description: dict.meta.description,
    alternates: {
      canonical: canonicalPath,
      languages: languageAlternates,
    },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      title: dict.meta.title,
      description: dict.meta.description,
      siteName: SITE_NAME,
      locale: OPEN_GRAPH_LOCALES[locale],
      images: [
        {
          url: socialImageUrl,
          width: 1200,
          height: 630,
          alt: "BongoOcean — A World of Products, All in One Place.",
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
      images: [socialImageUrl],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang: rawLang } = await params;
  if (!locales.includes(rawLang as Locale)) notFound();
  const lang = rawLang as Locale;

  return (
    <html
      lang={lang}
      dir={getDirection(lang)}
      className={`${jakarta.variable} ${inter.variable} ${dmSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider>
          <CurrencyProvider>
            <CartProvider>
              <WishlistProvider>{children}</WishlistProvider>
            </CartProvider>
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
