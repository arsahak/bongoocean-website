"use client";

import type { Product } from "@/app/data/products";
import type { Locale } from "@/app/i18n-config";
import { useCurrency } from "@/component/providers/CurrencyProvider";
import { useCart } from "@/component/providers/CartProvider";
import { useWishlist } from "@/component/providers/WishlistProvider";
import { ArrowRight, Heart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type MouseEvent, type ReactNode } from "react";

/** lucide `shopping-cart-minus` (v1.48, ISC) — not in the installed lucide-react yet. */
function ShoppingCartMinus({ filled }: { filled: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-4.5 w-4.5 shrink-0"
    >
      {/* The outline is open lines, so "in cart" adds a solid basket traced along it. */}
      {filled && (
        <path
          d="M4.564 5 6.25 14h12.712a2 2 0 0 0 1.991-1.57L22.18 5Z"
          fill="currentColor"
        />
      )}
      <path d="M16 5h6" />
      <path d="m2.05 2.05 1.099-.028a1 1 0 011.008.815l2.69 14.347A1 1 0 007.83 18H18" />
      <path d="M4.564 5H12" />
      <path d="M6.25 14h12.712a2 2 0 001.991-1.57l.514-3.113" />
      {/* Wheels fill along with the basket. */}
      <circle cx="18" cy="20" r="2" className={`transition-colors ${filled ? "fill-current" : "fill-transparent"}`} />
      <circle cx="8" cy="20" r="2" className={`transition-colors ${filled ? "fill-current" : "fill-transparent"}`} />
    </svg>
  );
}

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

export function ProductCard({
  product,
  icon,
  lang,
  addToCartLabel,
}: ProductCardProps) {
  const { format } = useCurrency();
  const { addItem, removeItem, items } = useCart();
  const { isWishlisted, toggleItem } = useWishlist();
  const router = useRouter();
  const wishlisted = isWishlisted(product.id);
  const isInCart = items.some((item) => item.id === product.id);

  // Buttons sit inside the card's <Link>, so stop them from navigating.
  const handleToggleCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCart) removeItem(product.id);
    else addItem(product);
  };

  const handleBuyNow = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    router.push(`/${lang}/checkout`);
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
            className="fill-amber-400 text-amber-400"
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

        <div className="mt-2.5 flex items-center justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-baseline gap-1.5 overflow-hidden whitespace-nowrap leading-tight">
            <span className="price shrink-0 text-base text-(--color-primary)">{format(product.price)}</span>
            {product.originalPrice && (
              <span className="price-original truncate text-xs text-(--color-error)">
                {format(product.originalPrice)}
              </span>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={handleToggleCart}
              aria-label={`${addToCartLabel}: ${product.name}`}
              title={addToCartLabel}
              aria-pressed={isInCart}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center p-0 text-(--color-dark) transition-transform hover:scale-115 active:scale-90"
            >
              <ShoppingCartMinus filled={isInCart} />
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              className="inline-flex h-8 max-w-20 min-w-0 items-center justify-center gap-1 px-1 text-xs font-semibold text-(--color-dark) transition-colors hover:text-(--color-primary) active:scale-[0.98]"
            >
              <span>Buy</span>
              <ArrowRight
                size={14}
                aria-hidden="true"
                className="shrink-0 rtl:rotate-180"
              />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
