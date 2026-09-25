"use client";

import type { Product } from "@/app/data/products";
import type { Locale } from "@/app/i18n-config";
import { useCurrency } from "@/component/providers/CurrencyProvider";
import { useCart } from "@/component/providers/CartProvider";
import { useWishlist } from "@/component/providers/WishlistProvider";
import { ArrowRight, Check, Heart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type MouseEvent, type ReactNode } from "react";

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
  addToCartLabel: string;
}

export function ProductCard({ product, icon, lang, addToCartLabel }: ProductCardProps) {
  const { format } = useCurrency();
  const { addItem } = useCart();
  const { isWishlisted, toggleItem } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!justAdded) return;
    const timer = setTimeout(() => setJustAdded(false), 1500);
    return () => clearTimeout(timer);
  }, [justAdded]);

  // Buttons sit inside the card's <Link>, so stop them from navigating.
  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setJustAdded(true);
  };

  const discountPercent = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <Link
      href={`/${lang}/product/${product.id}`}
      className="group block overflow-hidden rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface) transition-all duration-300 hover:-translate-y-0.5 hover:border-(--color-primary)/30 hover:shadow-lg"
    >
      <div
        className={`relative aspect-square overflow-hidden ${
          product.image ? "bg-white" : `bg-linear-to-br ${product.gradient}`
        }`}
      >
        {product.badge && (
          <span
            className={`badge ${badgeClass[product.badge]} absolute start-2 top-2 z-10 shadow-sm`}
          >
            {product.badge === "sale" && discountPercent
              ? `-${discountPercent}%`
              : product.badge}
          </span>
        )}
        <button
          type="button"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleItem(product);
          }}
          className="absolute end-2.5 top-2.5 z-10 p-0.5 text-pink-500 drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.25)] transition-transform hover:scale-115 active:scale-90"
        >
          <Heart
            size={22}
            strokeWidth={2}
            className={`transition-colors ${wishlisted ? "fill-pink-500" : "fill-transparent"}`}
          />
        </button>
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            unoptimized
            className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          icon
        )}
      </div>

      <div className="bg-(--color-bg) p-3">
        <div className="flex items-center gap-1 text-xs text-(--color-text-muted)">
          <Star
            size={13}
            className="fill-(--color-accent) text-(--color-accent)"
          />
          <span className="font-medium text-(--color-dark)">
            {product.rating}
          </span>
          <span aria-hidden="true">·</span>
          <span className="truncate">{product.sold}</span>
        </div>

        <h3 className="mt-1.5 line-clamp-2 text-sm font-semibold text-(--color-dark)">
          {product.name}
        </h3>

        <div className="mt-2.5 flex flex-wrap items-end justify-between gap-x-2 gap-y-1">
          <div className="flex min-w-0 flex-col leading-tight">
            {product.originalPrice && (
              <span className="price-original text-xs">
                {format(product.originalPrice)}
              </span>
            )}
            <span className="price truncate">{format(product.price)}</span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            aria-label={`${addToCartLabel}: ${product.name}`}
            className={`group/add inline-flex shrink-0 items-center gap-1 py-1 text-xs font-semibold whitespace-nowrap transition-colors active:scale-95 ${
              justAdded
                ? "text-(--color-success)"
                : "text-(--color-primary) hover:text-(--color-primary-dark)"
            }`}
          >
            {addToCartLabel}
            {justAdded ? (
              <Check size={14} strokeWidth={2.5} />
            ) : (
              <ArrowRight
                size={14}
                strokeWidth={2.5}
                className="transition-transform group-hover/add:translate-x-0.5 rtl:rotate-180 rtl:group-hover/add:-translate-x-0.5"
              />
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
