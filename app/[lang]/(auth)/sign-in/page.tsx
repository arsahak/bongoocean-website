import { getDictionary } from "@/app/dictionaries";
import { locales, type Locale } from "@/app/i18n-config";
import { AuthForm } from "@/component/auth/AuthForm";
import { notFound } from "next/navigation";

export default async function SignInPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  if (!locales.includes(rawLang as Locale)) notFound();

  const lang = rawLang as Locale;
  const dict = await getDictionary(lang);

  return <AuthForm mode="sign-in" lang={lang} dict={dict} />;
}
