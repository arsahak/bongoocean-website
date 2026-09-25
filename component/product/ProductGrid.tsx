"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronDown, Loader2, Package, Search } from "lucide-react";
import { listCategoriesAction, type Category } from "@/app/actions/category";
import {
  listCatalogProductsAction,
  type ListProductsParams,
} from "@/app/actions/products";
import type { Locale } from "@/app/i18n-config";
import { getCategoryIcon } from "@/component/category/getCategoryIcon";
import { FadeIn } from "@/component/motion/FadeIn";
import { ProductCard } from "@/component/product/ProductCard";
import {
  CATALOG_CARD_ICONS,
  toCatalogCardProduct,
  type CatalogCardProduct,
} from "@/component/product/catalogProductCard";

interface ProductGridProps {
  lang: Locale;
  addToCartLabel: string;
}

const SORT_OPTIONS = [
  { value: "default", label: "Sort: Featured" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

// The UI keeps its own short sort values; the backend has its own naming.
const SORT_PARAM: Record<SortValue, ListProductsParams["sort"]> = {
  default: "default",
  price_asc: "price-low",
  price_desc: "price-high",
};

const PAGE_SIZE = 20;
const SKELETON_COUNT = 12;

export function ProductGrid({ lang, addToCartLabel }: ProductGridProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(
    null,
  );
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(
    null,
  );

  const [query, setQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [sort, setSort] = useState<SortValue>("default");

  const [products, setProducts] = useState<CatalogCardProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const res = await listCategoriesAction();
      if (!mounted) return;
      setCategories(res.ok && res.data ? res.data : []);
      setCategoriesLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const topCategories = useMemo(
    () => categories.filter((category) => !category.parent),
    [categories],
  );
  const childrenByParent = useMemo(() => {
    const map = new Map<string, Category[]>();
    for (const category of categories) {
      if (!category.parent) continue;
      const parentId = String(category.parent);
      const siblings = map.get(parentId) ?? [];
      siblings.push(category);
      map.set(parentId, siblings);
    }
    return map;
  }, [categories]);

  const runSearch = useCallback(
    async (params: {
      categoryId: string | null;
      search: string;
      sortValue: SortValue;
    }) => {
      setLoading(true);
      const res = await listCatalogProductsAction({
        page: 1,
        limit: PAGE_SIZE,
        sort: SORT_PARAM[params.sortValue],
        category: params.categoryId ?? undefined,
        search: params.search || undefined,
      });

      if (res.ok && res.data?.products) {
        setProducts(
          res.data.products.map((product, index) =>
            toCatalogCardProduct(product, index),
          ),
        );
        setTotalPages(res.data.totalPages);
      } else {
        setProducts([]);
        setTotalPages(1);
      }
      setPage(1);
      setLoading(false);
    },
    [],
  );

  // Load every product on first render — no category selected yet.
  useEffect(() => {
    (async () => {
      await runSearch({ categoryId: null, search: "", sortValue: "default" });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCategoryClick = (category: Category) => {
    setActiveCategoryId(category._id);
    setExpandedCategoryId(category._id);
    setQuery("");
    setActiveSearch("");
    void runSearch({ categoryId: category._id, search: "", sortValue: sort });
  };

  const handleSubcategoryClick = (
    parent: Category,
    sub: Category,
  ) => {
    setActiveCategoryId(sub._id);
    setExpandedCategoryId(parent._id);
    setQuery("");
    setActiveSearch("");
    void runSearch({ categoryId: sub._id, search: "", sortValue: sort });
  };

  const handleAllProductsClick = () => {
    setActiveCategoryId(null);
    setQuery("");
    setActiveSearch("");
    void runSearch({ categoryId: null, search: "", sortValue: sort });
  };

  const handleSearchSubmit = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setActiveCategoryId(null);
    setActiveSearch(trimmed);
    void runSearch({ categoryId: null, search: trimmed, sortValue: sort });
  };

  const handleSortChange = (value: SortValue) => {
    setSort(value);
    void runSearch({
      categoryId: activeCategoryId,
      search: activeSearch,
      sortValue: value,
    });
  };

  const handleLoadMore = async () => {
    setLoadingMore(true);
    const nextPage = page + 1;
    const res = await listCatalogProductsAction({
      page: nextPage,
      limit: PAGE_SIZE,
      sort: SORT_PARAM[sort],
      category: activeCategoryId ?? undefined,
      search: activeSearch || undefined,
    });

    if (res.ok && res.data?.products) {
      setProducts((prev) => [
        ...prev,
        ...res.data!.products.map((product, index) =>
          toCatalogCardProduct(product, prev.length + index),
        ),
      ]);
      setTotalPages(res.data.totalPages);
      setPage(nextPage);
    }
    setLoadingMore(false);
  };

  const hasMore = page < totalPages;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_8fr]">
      {/* Categories — left side */}
      <aside className="lg:sticky lg:top-20 lg:h-fit">
        <div className="rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface) p-4">
          <h3 className="px-1 text-base font-bold text-(--color-dark)">
            Categories
          </h3>
          <div className="mt-3 flex flex-col gap-0.5">
            {categoriesLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={`category-skeleton-${i}`}
                  className="h-9 w-full animate-pulse rounded-(--radius-md) bg-(--color-border)"
                />
              ))
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleAllProductsClick}
                  className={`flex w-full items-center justify-start gap-2 rounded-(--radius-md) border-s-2 py-2.5 ps-2.5 pe-2 text-start text-sm font-medium transition-colors ${
                    activeCategoryId === null
                      ? "border-(--color-primary) bg-(--color-primary-faint) text-(--color-primary)"
                      : "border-transparent text-(--color-dark) hover:bg-(--color-bg)"
                  }`}
                >
                  <Package size={17} className="w-5 shrink-0" />
                  <span className="flex-1 truncate">All Products</span>
                </button>

                {topCategories.map((category) => {
                  const isExpanded = expandedCategoryId === category._id;
                  const isActive = activeCategoryId === category._id;
                  const subcategories = childrenByParent.get(category._id) ?? [];
                  const Icon = getCategoryIcon(category);

                  return (
                    <div key={category._id}>
                      <button
                        type="button"
                        onClick={() => handleCategoryClick(category)}
                        className={`flex w-full items-center justify-start gap-2 rounded-(--radius-md) border-s-2 py-2.5 ps-2.5 pe-2 text-start text-sm font-medium transition-colors ${
                          isActive
                            ? "border-(--color-primary) bg-(--color-primary-faint) text-(--color-primary)"
                            : "border-transparent text-(--color-dark) hover:bg-(--color-bg)"
                        }`}
                      >
                        <Icon size={17} className="w-5 shrink-0" />
                        <span className="flex-1 truncate">{category.name}</span>
                        {subcategories.length > 0 && (
                          <ChevronDown
                            size={14}
                            className={`shrink-0 text-(--color-text-light) transition-transform ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </button>

                      {isExpanded && subcategories.length > 0 && (
                        <div className="mt-0.5 mb-1 flex flex-col gap-0.5">
                          {subcategories.map((sub) => (
                            <button
                              key={sub._id}
                              type="button"
                              onClick={() => handleSubcategoryClick(category, sub)}
                              className={`flex w-full items-center justify-start truncate rounded-(--radius-md) py-1.5 ps-10 pe-2 text-start text-sm transition-colors ${
                                activeCategoryId === sub._id
                                  ? "font-semibold text-(--color-primary)"
                                  : "text-(--color-text-muted) hover:bg-(--color-bg) hover:text-(--color-dark)"
                              }`}
                            >
                              {sub.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {topCategories.length === 0 && (
                  <p className="px-1 py-4 text-sm text-(--color-text-muted)">
                    No categories yet.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Search + results — right side */}
      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <select
            aria-label="Sort by"
            value={sort}
            onChange={(e) => handleSortChange(e.target.value as SortValue)}
            className="!w-auto shrink-0 text-sm"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchSubmit();
            }}
            className="flex h-[46px] items-stretch overflow-hidden rounded-full border border-(--color-border) bg-(--color-bg) shadow-(--shadow-sm) transition-all focus-within:border-(--color-primary) focus-within:bg-(--color-surface) focus-within:shadow-[0_0_0_3px_var(--color-primary-faint)] sm:w-72"
          >
            <label htmlFor="product-search" className="sr-only">
              Search products
            </label>
            <input
              id="product-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full min-w-0 border-0 bg-transparent px-4 text-sm shadow-none outline-none placeholder:text-(--color-text-light)"
            />
            <button
              type="submit"
              aria-label="Search"
              className="btn-primary me-1.5 shrink-0 self-center rounded-full px-4"
            >
              <Search size={16} />
            </button>
          </form>
        </div>

        {loading && (
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-(--radius-lg) border border-(--color-border)"
              >
                <div className="aspect-square animate-pulse bg-(--color-border)" />
                <div className="space-y-2 p-3">
                  <div className="h-3.5 w-full animate-pulse rounded bg-(--color-border)" />
                  <div className="h-3.5 w-2/3 animate-pulse rounded bg-(--color-border)" />
                  <div className="h-4 w-1/3 animate-pulse rounded bg-(--color-border)" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="mt-6 flex flex-col items-center gap-3 rounded-(--radius-lg) border border-dashed border-(--color-border) py-16 text-center">
            <p className="text-(--color-text-muted)">No products found.</p>
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product, i) => {
              const Icon = CATALOG_CARD_ICONS[i % CATALOG_CARD_ICONS.length];

              return (
                <FadeIn key={product.id} delay={Math.min(i, 4) * 0.05}>
                  <ProductCard
                    addToCartLabel={addToCartLabel}
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
            })}
          </div>
        )}

        {!loading && products.length > 0 && hasMore && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="btn-outline inline-flex items-center gap-2 disabled:opacity-60"
            >
              {loadingMore && <Loader2 size={16} className="animate-spin" />}
              {loadingMore ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductGrid;
