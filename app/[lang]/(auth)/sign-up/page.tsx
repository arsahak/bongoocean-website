import { getDictionary } from "@/app/dictionaries";
import { locales, type Locale } from "@/app/i18n-config";
import { AuthForm } from "@/component/auth/AuthForm";
import { notFound } from "next/navigation";
import { safeCallbackUrl } from "@/app/utils/safe-redirect";

export default async function SignUpPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { lang: rawLang } = await params;
  if (!locales.includes(rawLang as Locale)) notFound();

  const lang = rawLang as Locale;
  const dict = await getDictionary(lang);
  const { callbackUrl } = await searchParams;

  return (
    <AuthForm
      mode="sign-up"
      lang={lang}
      dict={dict}
      callbackUrl={safeCallbackUrl(callbackUrl, `/${lang}`)}
    />
  );
}
