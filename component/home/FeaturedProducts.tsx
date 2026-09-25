"use client";

import { listCatalogProductsAction } from "@/app/actions/products";
import type { Dictionary } from "@/app/dictionaries";
import type { Locale } from "@/app/i18n-config";
import { FadeIn } from "@/component/motion/FadeIn";
import { ProductCard } from "@/component/product/ProductCard";
import {
  CATALOG_CARD_ICONS,
  toCatalogCardProduct,
  type CatalogCardProduct,
} from "@/component/product/catalogProductCard";
import { ArrowRight, Loader2, Package } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

interface FeaturedProductsProps {
  dict: Dictionary;
  lang: Locale;
}

const PAGE_SIZE = 16;

export function FeaturedProducts({ dict, lang }: FeaturedProductsProps) {
  const [products, setProducts] = useState<CatalogCardProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // Whether the current pagination is scoped to isFeatured=true or fell back
  // to the general catalog — "Load More" must keep using the same scope.
  const [featuredOnly, setFeaturedOnly] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadFirstPage = async () => {
      setIsLoading(true);

      let filterFeatured = true;
      let response = await listCatalogProductsAction({
        page: 1,
        limit: PAGE_SIZE,
        isFeatured: true,
      });

      if (!mounted) return;

      if (response.ok && !response.data?.products?.length) {
        filterFeatured = false;
        response = await listCatalogProductsAction({
          page: 1,
          limit: PAGE_SIZE,
        });
      }

      if (!mounted) return;

      if (response.ok && response.data?.products) {
        setProducts(
          response.data.products.map((product, index) =>
            toCatalogCardProduct(product, index),
          ),
        );
        setTotalPages(response.data.totalPages);
      } else {
        setProducts([]);
        setTotalPages(1);
      }

      setFeaturedOnly(filterFeatured);
      setPage(1);
      setIsLoading(false);
    };

    void loadFirstPage();
    return () => {
      mounted = false;
    };
  }, []);

  const handleLoadMore = useCallback(async () => {
    const nextPage = page + 1;
    setIsLoadingMore(true);

    const response = await listCatalogProductsAction({
      page: nextPage,
      limit: PAGE_SIZE,
      ...(featuredOnly ? { isFeatured: true } : {}),
    });

    if (response.ok && response.data?.products) {
      const { products: newProducts, totalPages: nextTotalPages } =
        response.data;
      setProducts((prev) => [
        ...prev,
        ...newProducts.map((product, index) =>
          toCatalogCardProduct(product, prev.length + index),
        ),
      ]);
      setTotalPages(nextTotalPages);
      setPage(nextPage);
    }

    setIsLoadingMore(false);
  }, [page, featuredOnly]);

  const displayProducts = useMemo(() => products, [products]);
  const hasMore = page < totalPages;

  return (
    <section className="py-8 sm:py-10">
      <div className="container">
        <FadeIn className="flex items-end justify-between gap-4">
          <h2 className="section-title">{dict.home.featured}</h2>
          <Link
            href={`/${lang}/deals`}
            className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-(--color-primary) transition-colors hover:text-(--color-primary-dark)"
          >
            {dict.common.view_all}
            <ArrowRight size={15} />
          </Link>
        </FadeIn>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {isLoading ? (
            Array.from({ length: PAGE_SIZE }).map((_, index) => (
              <div
                key={`featured-skeleton-${index}`}
                className="overflow-hidden rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface)"
              >
                <div className="aspect-square animate-pulse bg-(--color-border)" />
                <div className="space-y-2 p-3">
                  <div className="h-3 w-20 animate-pulse rounded-full bg-(--color-border)" />
                  <div className="h-4 w-full animate-pulse rounded-full bg-(--color-border)" />
                  <div className="h-4 w-2/3 animate-pulse rounded-full bg-(--color-border)" />
                </div>
              </div>
            ))
          ) : displayProducts.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center rounded-(--radius-lg) border border-dashed border-(--color-border) bg-(--color-surface) py-16 text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-(--color-primary-soft) text-(--color-primary)">
                <Package size={26} strokeWidth={1.8} />
              </div>
              <h3 className="text-lg font-semibold text-(--color-dark)">
                No featured products yet
              </h3>
              <p className="mt-1 max-w-md text-sm text-(--color-text-muted)">
                New products will appear here as soon as they are added to the
                catalog.
              </p>
            </div>
          ) : (
            displayProducts.map((product, i) => {
              const Icon = CATALOG_CARD_ICONS[i % CATALOG_CARD_ICONS.length];

              return (
                <FadeIn key={product.id} delay={Math.min(i, 4) * 0.05}>
                  <ProductCard
                    addToCartLabel={dict.common.add_to_cart}
                    product={product}
                    lang={lang}
                    icon={
                      <Icon
                        aria-hidden="true"
                        strokeWidth={1.25}
                        size={64}
                        className="absolute inset-0 m-auto text-white/90 transition-transform duration-300 group-hover:scale-110"
                      />
                    }
                  />
                </FadeIn>
              );
            })
          )}
        </div>

        {hasMore && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="inline-flex items-center gap-2 rounded-(--radius-pill) border border-(--color-border) bg-(--color-surface) px-6 py-2.5 text-sm font-semibold text-(--color-dark) transition-colors hover:border-(--color-primary) hover:text-(--color-primary) disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {dict.common.loading}
                </>
              ) : (
                dict.common.see_more
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedProducts;
