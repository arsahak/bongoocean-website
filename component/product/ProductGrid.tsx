"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import { allProducts, colorSwatches, type Product } from "@/app/data/products";
import { navCategories } from "@/app/data/categories";
import type { Locale } from "@/app/i18n-config";
import { useCurrency } from "@/component/providers/CurrencyProvider";
import { ProductCard } from "@/component/product/ProductCard";

interface ProductGridProps {
  lang: Locale;
}

type Badge = NonNullable<Product["badge"]>;

const PRICE_BUCKETS = [
  { id: "under-25", min: undefined, max: 25 },
  { id: "25-50", min: 25, max: 50 },
  { id: "50-100", min: 50, max: 100 },
  { id: "100-plus", min: 100, max: undefined },
] as const;

const RATING_OPTIONS = [4, 3, 2] as const;

const BADGE_OPTIONS: { value: Badge; label: string }[] = [
  { value: "sale", label: "On Sale" },
  { value: "hot", label: "Hot Deals" },
  { value: "new", label: "New Arrivals" },
];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Highest Rated" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

const AVAILABLE_COLORS = Array.from(
  new Set(allProducts.map((p) => p.color).filter((c): c is string => Boolean(c))),
).sort();

const AVAILABLE_SIZES = Array.from(
  new Set(allProducts.map((p) => p.size).filter((s): s is string => Boolean(s))),
).sort();

function toggleSetValue<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

function FilterGroup({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-(--color-border) py-4 first:border-t-0 first:pt-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-sm font-semibold text-(--color-dark)"
      >
        {title}
        <ChevronDown size={15} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="mt-2.5 flex flex-col gap-2">{children}</div>}
    </div>
  );
}

export function ProductGrid({ lang }: ProductGridProps) {
  const { format } = useCurrency();

  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [selectedBadges, setSelectedBadges] = useState<Set<Badge>>(new Set());
  const [selectedColors, setSelectedColors] = useState<Set<string>>(new Set());
  const [selectedSizes, setSelectedSizes] = useState<Set<string>>(new Set());
  const [minRating, setMinRating] = useState(0);
  const [priceBucket, setPriceBucket] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortValue>("featured");

  const hasActiveFilters =
    query !== "" ||
    selectedCategories.size > 0 ||
    selectedBadges.size > 0 ||
    selectedColors.size > 0 ||
    selectedSizes.size > 0 ||
    minRating > 0 ||
    priceBucket !== null;

  const resetFilters = () => {
    setQuery("");
    setSelectedCategories(new Set());
    setSelectedBadges(new Set());
    setSelectedColors(new Set());
    setSelectedSizes(new Set());
    setMinRating(0);
    setPriceBucket(null);
  };

  const filtered = useMemo(() => {
    const bucket = PRICE_BUCKETS.find((b) => b.id === priceBucket);

    const result = allProducts.filter((p) => {
      if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
      if (selectedCategories.size > 0) {
        const inSelected = Array.from(selectedCategories).some((href) => p.href.startsWith(href));
        if (!inSelected) return false;
      }
      if (selectedBadges.size > 0 && (!p.badge || !selectedBadges.has(p.badge))) return false;
      if (selectedColors.size > 0 && (!p.color || !selectedColors.has(p.color))) return false;
      if (selectedSizes.size > 0 && (!p.size || !selectedSizes.has(p.size))) return false;
      if (minRating > 0 && p.rating < minRating) return false;
      if (bucket) {
        if (bucket.min !== undefined && p.price < bucket.min) return false;
        if (bucket.max !== undefined && p.price >= bucket.max) return false;
      }
      return true;
    });

    const sorted = [...result];
    if (sortBy === "price-asc") sorted.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") sorted.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating-desc") sorted.sort((a, b) => b.rating - a.rating);
    return sorted;
  }, [query, selectedCategories, selectedBadges, selectedColors, selectedSizes, minRating, priceBucket, sortBy]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_8fr]">
      {/* Filters — ~20% */}
      <aside className="lg:sticky lg:top-20 lg:h-fit">
        <div className="rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface) p-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="inline-flex items-center gap-1.5 text-base font-bold text-(--color-dark)">
              <SlidersHorizontal size={16} />
              Filters
            </h3>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-medium text-(--color-primary) hover:underline"
              >
                Clear all
              </button>
            )}
          </div>

          <FilterGroup title="Category">
            {navCategories.map((category) => (
              <label
                key={category.href}
                className="flex items-center gap-2 text-sm text-(--color-text-muted)"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.has(category.href)}
                  onChange={() =>
                    setSelectedCategories((prev) => toggleSetValue(prev, category.href))
                  }
                />
                <category.icon size={15} className="shrink-0 text-(--color-text-light)" />
                <span className="truncate">{category.label}</span>
              </label>
            ))}
          </FilterGroup>

          <FilterGroup title="Price">
            {PRICE_BUCKETS.map((bucket) => (
              <label key={bucket.id} className="flex items-center gap-2 text-sm text-(--color-text-muted)">
                <input
                  type="radio"
                  name="price-bucket"
                  checked={priceBucket === bucket.id}
                  onChange={() => setPriceBucket(bucket.id)}
                />
                {bucket.min === undefined && `Under ${format(bucket.max!)}`}
                {bucket.min !== undefined &&
                  bucket.max !== undefined &&
                  `${format(bucket.min)} - ${format(bucket.max)}`}
                {bucket.min !== undefined && bucket.max === undefined && `${format(bucket.min)} & Above`}
              </label>
            ))}
          </FilterGroup>

          <FilterGroup title="Color">
            {AVAILABLE_COLORS.map((color) => (
              <label key={color} className="flex items-center gap-2 text-sm text-(--color-text-muted)">
                <input
                  type="checkbox"
                  checked={selectedColors.has(color)}
                  onChange={() => setSelectedColors((prev) => toggleSetValue(prev, color))}
                />
                <span
                  aria-hidden="true"
                  className="h-3.5 w-3.5 shrink-0 rounded-full border border-(--color-border)"
                  style={{ background: colorSwatches[color] ?? "transparent" }}
                />
                {color}
              </label>
            ))}
          </FilterGroup>

          {AVAILABLE_SIZES.length > 0 && (
            <FilterGroup title="Size" defaultOpen={false}>
              {AVAILABLE_SIZES.map((size) => (
                <label key={size} className="flex items-center gap-2 text-sm text-(--color-text-muted)">
                  <input
                    type="checkbox"
                    checked={selectedSizes.has(size)}
                    onChange={() => setSelectedSizes((prev) => toggleSetValue(prev, size))}
                  />
                  {size}
                </label>
              ))}
            </FilterGroup>
          )}

          <FilterGroup title="Rating" defaultOpen={false}>
            {RATING_OPTIONS.map((r) => (
              <label key={r} className="flex items-center gap-2 text-sm text-(--color-text-muted)">
                <input
                  type="radio"
                  name="min-rating"
                  checked={minRating === r}
                  onChange={() => setMinRating(r)}
                />
                {r}★ &amp; up
              </label>
            ))}
          </FilterGroup>

          <FilterGroup title="Deals" defaultOpen={false}>
            {BADGE_OPTIONS.map((option) => (
              <label key={option.value} className="flex items-center gap-2 text-sm text-(--color-text-muted)">
                <input
                  type="checkbox"
                  checked={selectedBadges.has(option.value)}
                  onChange={() => setSelectedBadges((prev) => toggleSetValue(prev, option.value))}
                />
                {option.label}
              </label>
            ))}
          </FilterGroup>
        </div>
      </aside>

      {/* Search, sort, and results — ~80% */}
      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-sm">
            <Search
              size={16}
              className="absolute start-3 top-1/2 -translate-y-1/2 text-(--color-text-light)"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-(--radius-md) border border-(--color-border) bg-(--color-bg) py-2.5 ps-9 pe-3 text-sm outline-none transition-colors focus:border-(--color-primary)"
            />
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <span className="text-sm text-(--color-text-muted)">
              {filtered.length} {filtered.length === 1 ? "product" : "products"}
            </span>
            <select
              aria-label="Sort by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortValue)}
              className="!w-auto text-sm"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map(({ icon: Icon, ...product }) => (
              <ProductCard
                key={product.id}
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
            ))}
          </div>
        ) : (
          <div className="mt-6 flex flex-col items-center gap-3 rounded-(--radius-lg) border border-dashed border-(--color-border) py-16 text-center">
            <p className="text-(--color-text-muted)">No products match your filters.</p>
            <button type="button" onClick={resetFilters} className="btn-outline btn-sm">
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductGrid;
