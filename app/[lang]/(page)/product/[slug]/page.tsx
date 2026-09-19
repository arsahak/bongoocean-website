import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCatalogProductAction,
  listCatalogProductsAction,
  listProductReviewsAction,
} from "@/app/actions/products";
import { getDictionary } from "@/app/dictionaries";
import { locales, type Locale } from "@/app/i18n-config";
import { ProductCard } from "@/component/product/ProductCard";
import { ProductDetailInfo } from "@/component/product/ProductDetailInfo";
import { ProductTabs } from "@/component/product/ProductTabs";
import {
  CATALOG_CARD_ICONS,
  resolveCatalogFallbackIcon,
  toCatalogCardProduct,
} from "@/component/product/catalogProductCard";

const badgeClass: Record<"new" | "hot" | "sale", string> = {
  new: "badge-success",
  hot: "badge-secondary",
  sale: "badge-warning",
};

const HTML_ENTITIES: Record<string, string> = {
  "&nbsp;": " ",
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
};

// Converts the rich-text editor's HTML into plain text that still previews
// the author's structure — list items become "• " bullet lines and
// paragraphs/line breaks stay on their own line — instead of flattening
// everything into one run-on line.
function stripHtml(html: string): string {
  return html
    .replace(/<li[^>]*>/gi, "\n• ")
    .replace(/<\/li>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h[1-6]|tr|ul|ol|table)>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;|&amp;|&lt;|&gt;|&quot;|&#39;|&apos;/g, (m) => HTML_ENTITIES[m])
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    // No blank lines between blocks — paragraphs and bullets stack tight,
    // one per line, instead of leaving a gap-sized empty line between them.
    .filter((line) => line !== "")
    .join("\n")
    .trim();
}

// Deterministic per-product, so repeat visits to the same product show the
// same fallback gradient/icon instead of it changing on every render.
function hashIndex(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang: rawLang, slug } = await params;
  if (!locales.includes(rawLang as Locale)) notFound();
  const lang = rawLang as Locale;
  const dict = await getDictionary(lang);

  const productRes = await getCatalogProductAction(slug);
  if (!productRes.ok || !productRes.data) notFound();
  const rawProduct = productRes.data;

  const category =
    typeof rawProduct.category === "string" ? null : rawProduct.category;

  const cardIndex = hashIndex(rawProduct._id);
  const product = toCatalogCardProduct(rawProduct, cardIndex);

  const [relatedRes, reviewsRes] = await Promise.all([
    category
      ? listCatalogProductsAction({ category: category._id, limit: 8 })
      : Promise.resolve(null),
    listProductReviewsAction(rawProduct._id, { limit: 10 }),
  ]);

  let relatedPool = (relatedRes?.data?.products ?? []).filter(
    (p) => p._id !== rawProduct._id,
  );

  // Thin categories (or no category at all) shouldn't leave the section
  // empty — top up with other active products from the wider catalog.
  if (relatedPool.length < 4) {
    const fallbackRes = await listCatalogProductsAction({ limit: 8 });
    const fallbackProducts = (fallbackRes.data?.products ?? []).filter(
      (p) =>
        p._id !== rawProduct._id &&
        !relatedPool.some((existing) => existing._id === p._id),
    );
    relatedPool = [...relatedPool, ...fallbackProducts];
  }

  const related = relatedPool.slice(0, 4).map((p, index) => ({
    cardProduct: toCatalogCardProduct(p, index),
    Icon: CATALOG_CARD_ICONS[index % CATALOG_CARD_ICONS.length],
  }));

  const reviews = reviewsRes.ok ? reviewsRes.data?.reviews ?? [] : [];
  const reviewSummary = reviewsRes.ok
    ? reviewsRes.data?.summary ?? { averageRating: 0, totalReviews: 0 }
    : { averageRating: 0, totalReviews: 0 };

  // shortDescription comes from the dashboard's rich-text editor as HTML —
  // strip tags/entities down to plain text for this compact detail-page blurb.
  const shortDescription = stripHtml(rawProduct.shortDescription ?? "");

  return (
    <div className="container py-8">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-sm text-(--color-text-muted)"
      >
        <Link
          href={`/${lang}`}
          className="transition-colors hover:text-(--color-primary)"
        >
          {dict.nav.home}
        </Link>
        {category && (
          <>
            <ChevronRight size={14} />
            <span className="truncate">{category.name}</span>
          </>
        )}
        <ChevronRight size={14} />
        <span className="truncate font-medium text-(--color-dark)">
          {product.name}
        </span>
      </nav>

      <div className="mt-5 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Image */}
        <div
          className={`relative aspect-square overflow-hidden rounded-(--radius-2xl) ${
            product.image ? "bg-white" : `bg-linear-to-br ${product.gradient}`
          }`}
        >
          {product.badge && (
            <span
              className={`badge ${badgeClass[product.badge]} absolute start-3 top-3 z-10`}
            >
              {product.badge}
            </span>
          )}
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              unoptimized
              className="object-contain p-6"
            />
          ) : (
            (() => {
              const FallbackIcon = resolveCatalogFallbackIcon(
                category,
                cardIndex,
              );
              return (
                <FallbackIcon
                  aria-hidden="true"
                  strokeWidth={1}
                  size={180}
                  className="absolute inset-0 m-auto text-white/90"
                />
              );
            })()
          )}
        </div>

        {/* Info */}
        <div>
          {category && (
            <span className="text-xs font-semibold tracking-wide text-(--color-primary) uppercase">
              {category.name}
            </span>
          )}
          <h1 className="mt-1.5 text-xl font-bold text-(--color-dark) sm:text-2xl">
            {product.name}
          </h1>

          <div className="mt-2 flex items-center gap-2 text-sm text-(--color-text-muted)">
            <span className="font-medium text-(--color-dark)">
              ★ {product.rating}
            </span>
            <span>({product.reviews.toLocaleString()} reviews)</span>
            <span aria-hidden="true">·</span>
            <span>{product.sold}</span>
          </div>

          <ProductDetailInfo
            product={product}
            shortDescription={shortDescription}
            weight={product.weight}
            unit={product.unit}
            addToCartLabel={dict.common.add_to_cart}
            buyNowLabel={dict.common.buy_now}
          />
        </div>
      </div>

      <ProductTabs
        lang={lang}
        overviewHtml={rawProduct.overview ?? ""}
        reviews={reviews}
        reviewSummary={reviewSummary}
      />

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="section-title">Related Products</h2>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {related.map(({ cardProduct, Icon: RelatedIcon }) => (
              <ProductCard
                key={cardProduct.id}
                product={cardProduct}
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
