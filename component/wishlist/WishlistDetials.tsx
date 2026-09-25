"use client";

import type { Dictionary } from "@/app/dictionaries";
import type { Locale } from "@/app/i18n-config";
import { useCart } from "@/component/providers/CartProvider";
import { useCurrency } from "@/component/providers/CurrencyProvider";
import { useWishlist } from "@/component/providers/WishlistProvider";
import { Heart, ShoppingBag, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface WishlistDetialsProps {
  dict: Dictionary;
  lang: Locale;
}

const WishlistDetials = ({ dict, lang }: WishlistDetialsProps) => {
  const { items, count, removeItem } = useWishlist();
  const { addItem } = useCart();
  const { format } = useCurrency();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface) px-6 py-20 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-(--color-primary-faint) text-(--color-primary)">
          <Heart size={36} />
        </span>
        <h3>{dict.wishlist.empty}</h3>
        <Link href={`/${lang}`} className="btn-primary btn-pill mt-2">
          {dict.wishlist.empty_cta}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-(--color-text-muted)">
        {count} {dict.wishlist.items}
      </p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="group overflow-hidden rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface) transition-shadow hover:shadow-lg"
          >
            <div className="relative">
              <Link
                href={`/${lang}/product/${item.id}`}
                className={`relative block aspect-square overflow-hidden ${
                  item.image ? "bg-white" : `bg-linear-to-br ${item.gradient}`
                }`}
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    unoptimized
                    className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-white/90">
                    <ShoppingBag size={32} />
                  </span>
                )}
              </Link>

              <button
                type="button"
                aria-label={dict.wishlist.remove}
                onClick={() => removeItem(item.id)}
                className="absolute end-2 top-2 flex size-8 items-center justify-center rounded-full bg-white/90 text-(--color-text-muted) shadow-sm backdrop-blur transition-colors hover:text-(--color-error)"
              >
                <Trash2 size={15} />
              </button>
            </div>

            <div className="p-3">
              <Link
                href={`/${lang}/product/${item.id}`}
                className="line-clamp-2 text-sm font-semibold text-(--color-dark) hover:text-(--color-primary)"
              >
                {item.name}
              </Link>

              <div className="mt-1.5 flex items-baseline gap-2">
                <span className="price">{format(item.price)}</span>
                {item.originalPrice && (
                  <span className="price-original">{format(item.originalPrice)}</span>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  addItem(item);
                  removeItem(item.id);
                }}
                className="btn-outline btn-sm mt-3 w-full"
              >
                <ShoppingCart size={14} />
                {dict.wishlist.move_to_cart}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistDetials;
