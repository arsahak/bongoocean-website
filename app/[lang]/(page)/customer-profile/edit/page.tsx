import { getDictionary } from "@/app/dictionaries";
import { locales, type Locale } from "@/app/i18n-config";
import { auth } from "@/auth";
import { getMyProfile } from "@/app/actions/user";
import { EditProfileForm } from "@/component/customr_account/EditProfileForm";
import { notFound, redirect } from "next/navigation";

export default async function EditProfilePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  if (!locales.includes(rawLang as Locale)) notFound();
  const lang = rawLang as Locale;
  const dict = await getDictionary(lang);

  const session = await auth();
  if (!session?.user) redirect(`/${lang}/sign-in`);

  const profile = await getMyProfile();
  if (!profile.ok) redirect(`/${lang}/sign-in`);

  return (
    <div className="container max-w-[560px] py-10 sm:py-14">
      <h1 className="mb-8 text-2xl font-bold text-(--color-dark)">
        {dict.nav.profile}
      </h1>
      <EditProfileForm dict={dict} lang={lang} profile={profile.data} />
    </div>
  );
}
