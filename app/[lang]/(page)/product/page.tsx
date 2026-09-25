import { ChevronRight, Package } from "lucide-react";
import Link from "next/link";
import { getDictionary } from "@/app/dictionaries";
import { locales, type Locale } from "@/app/i18n-config";
import { ProductGrid } from "@/component/product/ProductGrid";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  if (!locales.includes(rawLang as Locale)) notFound();
  const lang = rawLang as Locale;
  const dict = await getDictionary(lang);

  return (
    <div className="container py-8">
      {/* Product page hero */}
      <div className="relative overflow-hidden rounded-(--radius-2xl) bg-linear-to-br from-(--color-primary) to-(--color-primary-light) px-6 py-5 sm:px-8 sm:py-6">
        <div className="relative z-10">
          <h1 className="text-white">All Products</h1>
          <nav aria-label="Breadcrumb" className="mt-1.5 flex items-center gap-1.5 text-xs text-white/70">
            <Link href={`/${lang}`} className="text-white/70 transition-colors hover:text-white">
              {dict.nav.home}
            </Link>
            <ChevronRight size={12} />
            <span>All Products</span>
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
        <ProductGrid lang={lang} addToCartLabel={dict.common.add_to_cart} />
      </div>
    </div>
  );
}
