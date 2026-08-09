"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import type { ReactNode } from "react";
import type { Product } from "@/app/data/products";
import type { Locale } from "@/app/i18n-config";
import { useCurrency } from "@/component/providers/CurrencyProvider";

const badgeClass: Record<NonNullable<Product["badge"]>, string> = {
  new: "badge-success",
  hot: "badge-secondary",
  sale: "badge-warning",
};

interface ProductCardProps {
  product: Omit<Product, "icon">;
  /** Pre-rendered on the server — Lucide icon components can't cross the server/client boundary as a prop. */
  icon: ReactNode;
  lang: Locale;
}

export function ProductCard({ product, icon, lang }: ProductCardProps) {
  const { format } = useCurrency();

  return (
    <Link
      href={`/${lang}/product/${product.id}`}
      className="group block overflow-hidden rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface) transition-shadow hover:shadow-lg"
    >
      <div className={`relative aspect-square overflow-hidden bg-linear-to-br ${product.gradient}`}>
        {product.badge && (
          <span className={`badge ${badgeClass[product.badge]} absolute start-2 top-2 z-10`}>
            {product.badge}
          </span>
        )}
        {icon}
      </div>

      <div className="p-3">
        <div className="flex items-center gap-1 text-xs text-(--color-text-muted)">
          <Star size={13} className="fill-(--color-accent) text-(--color-accent)" />
          <span className="font-medium text-(--color-dark)">{product.rating}</span>
          <span aria-hidden="true">·</span>
          <span className="truncate">{product.sold}</span>
        </div>

        <h3 className="mt-1.5 line-clamp-2 text-sm font-semibold text-(--color-dark)">
          {product.name}
        </h3>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="price">{format(product.price)}</span>
          {product.originalPrice && (
            <span className="price-original">{format(product.originalPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
