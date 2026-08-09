import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale, type Locale } from "./app/i18n-config";

function getLocaleFromHeader(request: NextRequest): Locale {
  const acceptLanguage = request.headers.get("accept-language") ?? "";

  for (const part of acceptLanguage.split(",")) {
    const lang = part.split(";")[0].trim().toLowerCase().split("-")[0];
    if ((locales as readonly string[]).includes(lang)) {
      return lang as Locale;
    }
  }

  return defaultLocale;
}

function resolveLocale(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && (locales as readonly string[]).includes(cookieLocale)) {
    return cookieLocale as Locale;
  }
  return getLocaleFromHeader(request);
}

/** If the path starts with a locale segment, splits it off; otherwise null. */
function splitLocaleSegment(pathname: string): { locale: Locale; rest: string } | null {
  for (const locale of locales) {
    if (pathname === `/${locale}`) return { locale, rest: "/" };
    if (pathname.startsWith(`/${locale}/`)) return { locale, rest: pathname.slice(`/${locale}`.length) };
  }
  return null;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const split = splitLocaleSegment(pathname);

  if (split) {
    // The homepage is the only page that keeps a visible locale prefix —
    // leave "/{locale}" and "/{locale}/" alone.
    if (split.rest === "/") return NextResponse.next();

    // Every other page's canonical URL has no locale prefix — redirect old
    // "/{locale}/path" links to the clean version so there's one indexable URL.
    const url = request.nextUrl.clone();
    url.pathname = split.rest;
    return NextResponse.redirect(url);
  }

  const locale = resolveLocale(request);

  // Root path: redirect to the locale-prefixed homepage.
  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}`;
    return NextResponse.redirect(url);
  }

  // Every other route: rewrite internally to the localized page so it
  // still renders in the visitor's language, but keep the URL clean —
  // no visible locale prefix in the browser.
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|.*\\..*).*)"],
};
