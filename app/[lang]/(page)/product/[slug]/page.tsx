import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { allProducts, type Product } from "@/app/data/products";
import { navCategories } from "@/app/data/categories";
import { getDictionary } from "@/app/dictionaries";
import { locales, type Locale } from "@/app/i18n-config";
import { ProductCard } from "@/component/product/ProductCard";
import { ProductDetailInfo } from "@/component/product/ProductDetailInfo";

const badgeClass: Record<NonNullable<Product["badge"]>, string> = {
  new: "badge-success",
  hot: "badge-secondary",
  sale: "badge-warning",
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang: rawLang, slug } = await params;
  if (!locales.includes(rawLang as Locale)) notFound();
  const lang = rawLang as Locale;
  const dict = await getDictionary(lang);

  const product = allProducts.find((p) => p.id === slug);
  if (!product) notFound();

  const category = navCategories.find((c) => product.href.startsWith(c.href));
  const related = allProducts
    .filter((p) => p.id !== product.id && category && p.href.startsWith(category.href))
    .slice(0, 4);

  const { icon: Icon, ...productData } = product;

  const description = `${product.name} from a verified seller${
    category ? ` in ${category.label}` : ""
  }. Rated ${product.rating} from ${product.reviews.toLocaleString()} reviews, with ${product.sold} so far.${
    product.color ? ` Available in ${product.color}.` : ""
  }${product.size ? ` Size: ${product.size}.` : ""}`;

  return (
    <div className="container py-8">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-(--color-text-muted)">
        <Link href={`/${lang}`} className="transition-colors hover:text-(--color-primary)">
          {dict.nav.home}
        </Link>
        {category && (
          <>
            <ChevronRight size={14} />
            <Link
              href={`/${lang}${category.href}`}
              className="transition-colors hover:text-(--color-primary)"
            >
              {category.label}
            </Link>
          </>
        )}
        <ChevronRight size={14} />
        <span className="truncate font-medium text-(--color-dark)">{product.name}</span>
      </nav>

      <div className="mt-5 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Image */}
        <div
          className={`relative aspect-square overflow-hidden rounded-(--radius-2xl) bg-linear-to-br ${product.gradient}`}
        >
          {product.badge && (
            <span className={`badge ${badgeClass[product.badge]} absolute start-3 top-3 z-10`}>
              {product.badge}
            </span>
          )}
          <Icon
            aria-hidden="true"
            strokeWidth={1}
            size={180}
            className="absolute inset-0 m-auto text-white/90"
          />
        </div>

        {/* Info */}
        <div>
          {category && (
            <Link
              href={`/${lang}${category.href}`}
              className="text-xs font-semibold tracking-wide text-(--color-primary) uppercase"
            >
              {category.label}
            </Link>
          )}
          <h1 className="mt-1.5">{product.name}</h1>

          <div className="mt-2 flex items-center gap-2 text-sm text-(--color-text-muted)">
            <span className="font-medium text-(--color-dark)">★ {product.rating}</span>
            <span>({product.reviews.toLocaleString()} reviews)</span>
            <span aria-hidden="true">·</span>
            <span>{product.sold}</span>
          </div>

          <ProductDetailInfo
            product={productData}
            addToCartLabel={dict.common.add_to_cart}
            buyNowLabel={dict.common.buy_now}
          />

          <p className="mt-6 border-t border-(--color-border) pt-5 text-sm leading-relaxed text-(--color-text-muted)">
            {description}
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="section-title">Related Products</h2>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {related.map(({ icon: RelatedIcon, ...relatedProduct }) => (
              <ProductCard
                key={relatedProduct.id}
                product={relatedProduct}
                lang={lang}
                icon={
                  <RelatedIcon
                    aria-hidden="true"
                    strokeWidth={1.25}
                    size={64}
                    className="absolute inset-0 m-auto text-white/90 transition-transform duration-300 group-hover:scale-110"
                  />
                }
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
