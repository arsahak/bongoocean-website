import { notFound } from "next/navigation";
import Topbar from "@/component/layout/Topbar";
import Navbar from "@/component/layout/Navbar";
import Footer from "@/component/layout/Footer";
import { getDictionary } from "@/app/dictionaries";
import { locales, type Locale } from "@/app/i18n-config";

export default async function PageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  if (!locales.includes(rawLang as Locale)) notFound();
  const lang = rawLang as Locale;
  const dict = await getDictionary(lang);

  return (
    <>
      <Topbar dict={dict} lang={lang} />
      <Navbar dict={dict} />
      {children}
      <Footer dict={dict} lang={lang} />
    </>
  );
}
