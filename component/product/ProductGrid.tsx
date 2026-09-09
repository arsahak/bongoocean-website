"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ChevronDown,
  Gem,
  Home,
  Loader2,
  Package,
  Search,
  Shirt,
  ShoppingBag,
  Smartphone,
  Watch as WatchIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { search1688Action, type SourcingItem } from "@/app/actions/products";
import type { Locale } from "@/app/i18n-config";

interface ProductGridProps {
  lang: Locale;
}

// Left-side category shortcuts — the sourcing API is keyword-search only (no
// real category browsing), so every category/subcategory is just a curated
// search term.
const CATEGORIES = [
  {
    id: "cosmetics",
    label: "Cosmetics",
    keyword: "化妆品",
    icon: Gem,
    subcategories: [
      { id: "skincare", label: "Skincare", keyword: "护肤品" },
      { id: "makeup", label: "Makeup", keyword: "彩妆" },
      { id: "haircare", label: "Hair Care", keyword: "洗发水" },
      { id: "fragrance", label: "Fragrance", keyword: "香水" },
    ],
  },
  {
    id: "clothing",
    label: "Clothing",
    keyword: "服装",
    icon: Shirt,
    subcategories: [
      { id: "womens", label: "Women's Wear", keyword: "女装" },
      { id: "mens", label: "Men's Wear", keyword: "男装" },
      { id: "kids", label: "Kids Wear", keyword: "童装" },
      { id: "outerwear", label: "Outerwear", keyword: "外套" },
    ],
  },
  {
    id: "watch",
    label: "Watch",
    keyword: "手表",
    icon: WatchIcon,
    subcategories: [
      { id: "mens-watch", label: "Men's Watch", keyword: "男士手表" },
      { id: "womens-watch", label: "Women's Watch", keyword: "女士手表" },
      { id: "smart-watch", label: "Smart Watch", keyword: "智能手表" },
    ],
  },
  {
    id: "electronics",
    label: "Electronics",
    keyword: "电子产品",
    icon: Smartphone,
    subcategories: [
      { id: "phone-accessories", label: "Phone Accessories", keyword: "手机配件" },
      { id: "earphones", label: "Earphones", keyword: "耳机" },
      { id: "chargers", label: "Chargers & Cables", keyword: "充电器" },
    ],
  },
  {
    id: "bags-shoes",
    label: "Bags & Shoes",
    keyword: "箱包鞋类",
    icon: ShoppingBag,
    subcategories: [
      { id: "womens-shoes", label: "Women's Shoes", keyword: "女鞋" },
      { id: "mens-shoes", label: "Men's Shoes", keyword: "男鞋" },
      { id: "handbags", label: "Handbags", keyword: "手提包" },
    ],
  },
  {
    id: "home-kitchen",
    label: "Home & Kitchen",
    keyword: "家居厨房",
    icon: Home,
    subcategories: [
      { id: "kitchen-gadgets", label: "Kitchen Gadgets", keyword: "厨房用品" },
      { id: "storage", label: "Storage", keyword: "收纳用品" },
      { id: "decor", label: "Home Decor", keyword: "家居装饰" },
    ],
  },
] as const;

const SORT_OPTIONS = [
  { value: "default", label: "Sort: Featured" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];
type Category = (typeof CATEGORIES)[number];

const SKELETON_COUNT = 12;

// The upstream 1688 API accepts a sort param but doesn't reliably honor it
// (confirmed: it echoes the param back but returns unsorted results), so we
// sort client-side using the price data we already have instead of trusting it.
function sortItems(items: SourcingItem[], sortValue: SortValue): SourcingItem[] {
  if (sortValue === "default") return items;
  const withPrice = (item: SourcingItem) => parseFloat(item.price ?? "") || 0;
  const sorted = [...items];
  if (sortValue === "price_asc") sorted.sort((a, b) => withPrice(a) - withPrice(b));
  else if (sortValue === "price_desc") sorted.sort((a, b) => withPrice(b) - withPrice(a));
  return sorted;
}

export function ProductGrid({ lang }: ProductGridProps) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortValue>("default");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [activeKeyword, setActiveKeyword] = useState("");

  const [items, setItems] = useState<SourcingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const runSearch = useCallback(async (q: string, sortValue: SortValue) => {
    setLoading(true);
    const res = await search1688Action({ q, page: 1, sort: sortValue });
    setItems(sortItems(res.data?.items ?? [], sortValue));
    setHasMore(res.data?.hasMore ?? false);
    setPage(1);
    setLoading(false);
  }, []);

  // Load the first category by default on first render.
  useEffect(() => {
    const first = CATEGORIES[0];
    setActiveCategory(first.id);
    setExpandedCategory(first.id);
    setActiveKeyword(first.keyword);
    runSearch(first.keyword, "default");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCategoryClick = (category: Category) => {
    setActiveCategory(category.id);
    setActiveSubcategory(null);
    setExpandedCategory(category.id);
    setActiveKeyword(category.keyword);
    setQuery("");
    runSearch(category.keyword, sort);
  };

  const handleSubcategoryClick = (category: Category, sub: Category["subcategories"][number]) => {
    setActiveCategory(category.id);
    setActiveSubcategory(sub.id);
    setActiveKeyword(sub.keyword);
    setQuery("");
    runSearch(sub.keyword, sort);
  };

  const handleSearchSubmit = () => {
    if (!query.trim()) return;
    setActiveCategory(null);
    setActiveSubcategory(null);
    setActiveKeyword(query.trim());
    runSearch(query.trim(), sort);
  };

  const handleSortChange = (value: SortValue) => {
    setSort(value);
    runSearch(activeKeyword, value);
  };

  const handleLoadMore = async () => {
    setLoadingMore(true);
    const nextPage = page + 1;
    const res = await search1688Action({ q: activeKeyword, page: nextPage, sort });
    setItems((prev) => sortItems([...prev, ...(res.data?.items ?? [])], sort));
    setHasMore(res.data?.hasMore ?? false);
    setPage(nextPage);
    setLoadingMore(false);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_8fr]">
      {/* Categories — left side */}
      <aside className="lg:sticky lg:top-20 lg:h-fit">
        <div className="rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface) p-4">
          <h3 className="px-1 text-base font-bold text-(--color-dark)">Categories</h3>
          <div className="mt-3 flex flex-col gap-0.5">
            {CATEGORIES.map((category) => {
              const isExpanded = expandedCategory === category.id;
              const isActive = activeCategory === category.id && !activeSubcategory;
              const Icon = category.icon;

              return (
                <div key={category.id}>
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
                    <span className="flex-1 truncate">{category.label}</span>
                    <ChevronDown
                      size={14}
                      className={`shrink-0 text-(--color-text-light) transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="mt-0.5 mb-1 flex flex-col gap-0.5">
                      {category.subcategories.map((sub) => (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => handleSubcategoryClick(category, sub)}
                          className={`flex w-full items-center justify-start truncate rounded-(--radius-md) py-1.5 ps-10 pe-2 text-start text-sm transition-colors ${
                            activeSubcategory === sub.id
                              ? "font-semibold text-(--color-primary)"
                              : "text-(--color-text-muted) hover:bg-(--color-bg) hover:text-(--color-dark)"
                          }`}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
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
              <div key={i} className="overflow-hidden rounded-(--radius-lg) border border-(--color-border)">
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

        {!loading && items.length === 0 && (
          <div className="mt-6 flex flex-col items-center gap-3 rounded-(--radius-lg) border border-dashed border-(--color-border) py-16 text-center">
            <p className="text-(--color-text-muted)">No products found.</p>
          </div>
        )}

        {!loading && items.length > 0 && (
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((item, index) => (
              <Link
                key={`${item.id}-${index}`}
                href={`/${lang}/product/1688/${item.id}`}
                className="group block overflow-hidden rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface) transition-shadow hover:shadow-lg"
              >
                <div className="relative aspect-square overflow-hidden bg-(--color-bg)">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.titleEn || "Product"}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-(--color-text-light)">
                      <Package size={48} strokeWidth={1.25} />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="line-clamp-2 text-sm font-semibold text-(--color-dark)">
                    {item.titleEn || "Untitled product"}
                  </h3>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="price">{item.price ? `¥${item.price}` : "—"}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && items.length > 0 && hasMore && (
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
