import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/app/dictionaries";
import { locales, type Locale } from "@/app/i18n-config";
import { getItem1688DetailAction } from "@/app/actions/products";
import { Product1688Detail } from "@/component/product/Product1688Detail";

export default async function Product1688DetailPage({
  params,
}: {
  params: Promise<{ lang: string; itemId: string }>;
}) {
  const { lang: rawLang, itemId } = await params;
  if (!locales.includes(rawLang as Locale)) notFound();
  const lang = rawLang as Locale;
  const dict = await getDictionary(lang);

  const result = await getItem1688DetailAction(itemId);
  if (!result.ok || !result.data) notFound();
  const item = result.data;

  return (
    <div className="container py-8">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-(--color-text-muted)">
        <Link href={`/${lang}`} className="transition-colors hover:text-(--color-primary)">
          {dict.nav.home}
        </Link>
        <ChevronRight size={14} />
        <Link href={`/${lang}/product`} className="transition-colors hover:text-(--color-primary)">
          All Products
        </Link>
        <ChevronRight size={14} />
        <span className="truncate font-medium text-(--color-dark)">{item.title}</span>
      </nav>

      <div className="mt-5">
        <Product1688Detail item={item} />
      </div>
    </div>
  );
}
