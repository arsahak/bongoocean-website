import { notFound } from "next/navigation";
import Topbar from "@/component/layout/Topbar";
import Navbar, { type NavbarUser } from "@/component/layout/Navbar";
import Footer from "@/component/layout/Footer";
import { getDictionary } from "@/app/dictionaries";
import { locales, type Locale } from "@/app/i18n-config";
import { auth } from "@/auth";
import { getMyProfile } from "@/app/actions/user";

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
  const session = await auth();

  // Navbar needs the freshest avatar/name — the session cookie only carries
  // what was true at sign-in, so re-fetch the live profile instead of
  // trusting a token that could be stale (e.g. after an avatar change).
  let navbarUser: NavbarUser | null = null;
  if (session?.user) {
    const profile = await getMyProfile();
    navbarUser = profile.ok
      ? {
          name:
            [profile.data.firstName, profile.data.lastName]
              .filter(Boolean)
              .join(" ") || session.user.name,
          email: profile.data.email ?? session.user.email,
          phone: profile.data.phone ?? null,
          image: profile.data.avatar ?? null,
        }
      : {
          name: session.user.name,
          email: session.user.email,
          phone: null,
          image: null,
        };
  }

  return (
    <>
      <Topbar dict={dict} lang={lang} />
      <Navbar dict={dict} user={navbarUser} />
      {children}
      <Footer dict={dict} lang={lang} />
    </>
  );
}
