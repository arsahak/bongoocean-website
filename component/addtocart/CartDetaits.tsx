"use client";

import type { Dictionary } from "@/app/dictionaries";
import { colorSwatches } from "@/app/data/products";
import type { Locale } from "@/app/i18n-config";
import { useCart } from "@/component/providers/CartProvider";
import { useCurrency } from "@/component/providers/CurrencyProvider";
import {
  ArrowLeft,
  ArrowRight,
  LockKeyhole,
  Minus,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CartDetaitsProps {
  dict: Dictionary;
  lang: Locale;
  isSignedIn: boolean;
}

const CartDetaits = ({ dict, lang, isSignedIn }: CartDetaitsProps) => {
  const { items, count, subtotal, removeItem, updateQty } = useCart();
  const { format } = useCurrency();

  // The checkout page also redirects signed-out visitors, but sending them
  // straight to sign-in (with a way back) saves a hop.
  const checkoutHref = isSignedIn
    ? `/${lang}/checkout`
    : `/${lang}/sign-in?callbackUrl=${encodeURIComponent(`/${lang}/checkout`)}`;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface) px-6 py-20 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-(--color-primary-faint) text-(--color-primary)">
          <ShoppingCart size={36} />
        </span>
        <h3>{dict.cart.empty}</h3>
        <Link href={`/${lang}`} className="btn-primary btn-pill mt-2">
          {dict.cart.empty_cta}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_340px]">
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface) p-4"
          >
            <Link
              href={`/${lang}/product/${item.id}`}
              className={`relative size-20 shrink-0 overflow-hidden rounded-(--radius-md) sm:size-24 ${
                item.image ? "bg-white" : `bg-linear-to-br ${item.gradient}`
              }`}
            >
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  unoptimized
                  className="object-contain p-2"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-white/90">
                  <ShoppingBag size={28} />
                </span>
              )}
            </Link>

            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-3">
                <Link
                  href={`/${lang}/product/${item.id}`}
                  className="line-clamp-2 text-sm font-semibold text-(--color-dark) hover:text-(--color-primary)"
                >
                  {item.name}
                </Link>
                <button
                  type="button"
                  aria-label={dict.cart.remove}
                  onClick={() => removeItem(item.id)}
                  className="shrink-0 rounded-(--radius-md) p-1.5 text-(--color-text-light) transition-colors hover:bg-red-50 hover:text-(--color-error)"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {(item.color || item.size) && (
                <div className="mt-1 flex items-center gap-3 text-xs text-(--color-text-muted)">
                  {item.color && (
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        aria-hidden="true"
                        className="size-3 rounded-full border border-(--color-border)"
                        style={{
                          background: colorSwatches[item.color] ?? "transparent",
                        }}
                      />
                      {item.color}
                    </span>
                  )}
                  {item.size && <span>{item.size}</span>}
                </div>
              )}

              <div className="mt-auto flex items-end justify-between gap-3 pt-3">
                <div className="inline-flex items-center gap-1 rounded-(--radius-md) border border-(--color-border) py-1">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => updateQty(item.id, item.qty - 1)}
                    className="px-2.5 py-1 text-(--color-text-muted) transition-colors hover:text-(--color-primary)"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="w-6 text-center text-sm font-medium text-(--color-dark)">
                    {item.qty}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => updateQty(item.id, item.qty + 1)}
                    className="px-2.5 py-1 text-(--color-text-muted) transition-colors hover:text-(--color-primary)"
                  >
                    <Plus size={13} />
                  </button>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="price">{format(item.price * item.qty)}</span>
                  {item.originalPrice && (
                    <span className="price-original">
                      {format(item.originalPrice * item.qty)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        <p className="text-sm text-(--color-text-muted)">
          {count} {dict.cart.items}
        </p>
      </div>

      <div className="sticky top-24 flex flex-col gap-4 rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface) p-5">
        <h3 className="text-base font-semibold text-(--color-dark)">
          {dict.cart.summary}
        </h3>

        <div className="flex flex-col gap-2.5 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-(--color-text-muted)">{dict.cart.subtotal}</span>
            <span className="font-medium text-(--color-dark)">{format(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-(--color-text-muted)">{dict.cart.shipping}</span>
            <span className="font-medium text-(--color-success)">Free</span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-(--color-border) pt-3">
          <span className="font-semibold text-(--color-dark)">{dict.cart.total}</span>
          <span className="price text-lg">{format(subtotal)}</span>
        </div>

        <div className="flex flex-col gap-2.5 pt-1">
          <Link
            href={checkoutHref}
            className="group flex h-12 w-full items-center justify-center gap-2 rounded-full bg-(--color-primary) px-5 text-sm font-semibold text-white shadow-lg shadow-(--color-primary)/30 transition-all hover:-translate-y-0.5 hover:bg-(--color-primary-dark) hover:shadow-xl hover:shadow-(--color-primary)/35"
          >
            <LockKeyhole size={16} />
            {dict.cart.checkout}
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
            />
          </Link>

          <Link
            href={`/${lang}`}
            className="group flex h-11 w-full items-center justify-center gap-2 rounded-full border-2 border-(--color-border) bg-(--color-surface) px-5 text-sm font-semibold text-(--color-dark) transition-colors hover:border-(--color-primary) hover:text-(--color-primary)"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1"
            />
            {dict.cart.empty_cta}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartDetaits;
