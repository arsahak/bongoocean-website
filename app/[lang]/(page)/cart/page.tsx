import Link from "next/link";
import { notFound } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { getDictionary } from "@/app/dictionaries";
import { locales, type Locale } from "@/app/i18n-config";

export default async function CartPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  if (!locales.includes(rawLang as Locale)) notFound();
  const lang = rawLang as Locale;
  const dict = await getDictionary(lang);

  return (
    <div className="container py-10">
      <h1 className="mb-8">{dict.cart.title}</h1>

      <div className="flex flex-col items-center justify-center gap-4 rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface) px-6 py-20 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-(--color-primary-faint) text-(--color-primary)">
          <ShoppingCart size={36} />
        </span>
        <h3>{dict.cart.empty}</h3>
        <Link href={`/${lang}`} className="btn-primary btn-pill mt-2">
          {dict.cart.empty_cta}
        </Link>
      </div>
    </div>
  );
}
