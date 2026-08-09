"use client";

import { localeToCountryCode } from "@/app/data/shipping";
import { locales, type Locale } from "@/app/i18n-config";
import { Dropdown } from "@/component/motion/Dropdown";
import { ChevronDown } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const shortLabel: Record<Locale, string> = {
  en: "ENG",
  bn: "BAN",
  hi: "HIN",
  ur: "URD",
  ar: "ARB",
  es: "SPA",
  zh: "CHN",
  fr: "FRA",
};

function flagUrl(locale: Locale) {
  return `https://flagcdn.com/24x18/${localeToCountryCode[locale].toLowerCase()}.png`;
}

function setLocaleCookie(locale: string) {
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`;
}

export function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ lang: Locale }>();
  const currentLang = params?.lang ?? "en";

  const handleSelect = (newLocale: Locale) => {
    setLocaleCookie(newLocale);

    // The homepage is the only route with a visible locale segment to swap.
    // Every other page has a clean URL, so just refresh in place — the
    // updated cookie makes the proxy rewrite to the new locale's content.
    const isLocalePath = locales.some(
      (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
    );
    if (isLocalePath) {
      const segments = pathname.split("/");
      segments[1] = newLocale;
      router.push(segments.join("/") || "/");
    } else {
      router.refresh();
    }

    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Select language"
        onClick={() => setOpen((v) => !v)}
        className="btn-ghost inline-flex items-center gap-1.5 !p-2 text-sm rounded"
      >
        <img
          src={flagUrl(currentLang)}
          alt=""
          width={20}
          height={15}
          className="rounded-[2px]"
        />
        {shortLabel[currentLang]}
        <ChevronDown
          size={12}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <button
          type="button"
          aria-label="Close"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-20 cursor-default"
        />
      )}

      <Dropdown
        show={open}
        className="absolute start-0 top-full z-30 mt-1 min-w-[90px] rounded overflow-hidden  border border-(--color-border) bg-(--color-surface) py-1 shadow-xl "
      >
        {locales.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => handleSelect(l)}
            className={`flex w-full items-center gap-2 px-3 py-2 text-start text-sm transition-colors hover:bg-(--color-bg) ${
              l === currentLang
                ? "font-semibold text-(--color-primary)"
                : "text-(--color-dark)"
            }`}
          >
            <img
              src={flagUrl(l)}
              alt=""
              width={20}
              height={15}
              className="rounded-[2px]"
            />
            {shortLabel[l]}
          </button>
        ))}
      </Dropdown>
    </div>
  );
}
