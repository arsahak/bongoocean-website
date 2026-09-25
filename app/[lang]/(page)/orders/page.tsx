import { ChevronRight, Package } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMyOrdersAction } from "@/app/actions/order";
import { getDictionary } from "@/app/dictionaries";
import { locales, type Locale } from "@/app/i18n-config";
import OrderList from "@/component/customr_account/OrderList";

export default async function OrdersPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ id?: string; page?: string }>;
}) {
  const { lang: rawLang } = await params;
  if (!locales.includes(rawLang as Locale)) notFound();
  const lang = rawLang as Locale;
  const dict = await getDictionary(lang);
  const { id, page } = await searchParams;

  const session = await auth();
  if (!session?.user) {
    const back = id ? `/${lang}/orders?id=${encodeURIComponent(id)}` : `/${lang}/orders`;
    redirect(`/${lang}/sign-in?callbackUrl=${encodeURIComponent(back)}`);
  }

  const result = await getMyOrdersAction(Number(page) || 1);

  return (
    <div className="container py-8">
      {/* Orders page hero */}
      <div className="relative overflow-hidden rounded-(--radius-2xl) bg-linear-to-br from-(--color-primary) to-(--color-primary-light) px-6 py-5 sm:px-8 sm:py-6">
        <div className="relative z-10">
          <h1 className="text-white">{dict.orders.title}</h1>
          <nav
            aria-label="Breadcrumb"
            className="mt-1.5 flex items-center gap-1.5 text-xs text-white/70"
          >
            <Link
              href={`/${lang}`}
              className="text-white/70 transition-colors hover:text-white"
            >
              {dict.nav.home}
            </Link>
            <ChevronRight size={12} />
            <span>{dict.orders.title}</span>
          </nav>
        </div>

        <Package
          aria-hidden="true"
          strokeWidth={1}
          size={110}
          className="pointer-events-none absolute end-[-1rem] bottom-[-1rem] text-white/15"
        />
      </div>

      <div className="mt-6">
        {result.ok ? (
          <OrderList
            dict={dict}
            lang={lang}
            orders={result.orders}
            pagination={result.pagination}
            highlightId={id}
          />
        ) : (
          <p
            role="alert"
            className="rounded-(--radius-lg) border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-(--color-error)"
          >
            {dict.orders.load_error}
          </p>
        )}
      </div>
    </div>
  );
}
