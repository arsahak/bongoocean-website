"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Heart, Minus, Plus, RotateCcw, ShieldCheck, ShoppingCart, Truck, Zap } from "lucide-react";
import { colorSwatches, type Product } from "@/app/data/products";
import type { Locale } from "@/app/i18n-config";
import { useCart } from "@/component/providers/CartProvider";
import { ProductShare } from "@/component/product/ProductShare";
import { useCurrency } from "@/component/providers/CurrencyProvider";
import { useWishlist } from "@/component/providers/WishlistProvider";

interface ProductDetailInfoProps {
  product: Omit<Product, "icon">;
  lang: Locale;
  shortDescription?: string;
  weight?: number;
  unit?: string;
  addToCartLabel: string;
  buyNowLabel: string;
}

export function ProductDetailInfo({
  product,
  lang,
  shortDescription,
  weight,
  unit,
  addToCartLabel,
  buyNowLabel,
}: ProductDetailInfoProps) {
  const { format } = useCurrency();
  const { addItem, updateQty, items } = useCart();
  const router = useRouter();
  const { isWishlisted, toggleItem } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  // Buy Now puts exactly the chosen quantity in the cart (without stacking on
  // top of an earlier add) and goes straight to checkout — which itself sends
  // signed-out visitors to sign-in and back.
  const handleBuyNow = () => {
    if (items.some((item) => item.id === product.id)) {
      updateQty(product.id, quantity);
    } else {
      addItem(product, quantity);
    }
    router.push(`/${lang}/checkout`);
  };

  const discountPercent = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <div>
      <div className="mt-1 flex items-baseline gap-3">
        <span className="price text-3xl">{format(product.price)}</span>
        {product.originalPrice && (
          <>
            <span className="price-original">{format(product.originalPrice)}</span>
            <span className="price-discount">-{discountPercent}%</span>
          </>
        )}
      </div>

      {shortDescription && (
        <div className="mt-2 text-sm leading-snug whitespace-pre-line text-(--color-text-muted)">
          {shortDescription}
        </div>
      )}

      {(product.color || product.size || (weight !== undefined && unit)) && (
        <div className="mt-4 flex flex-wrap gap-5 text-sm">
          {product.color && (
            <span className="inline-flex items-center gap-2 text-(--color-text-muted)">
              Color:
              <span className="inline-flex items-center gap-1.5 font-medium text-(--color-dark)">
                <span
                  aria-hidden="true"
                  className="h-3.5 w-3.5 rounded-full border border-(--color-border)"
                  style={{ background: colorSwatches[product.color] ?? "transparent" }}
                />
                {product.color}
              </span>
            </span>
          )}
          {product.size && (
            <span className="text-(--color-text-muted)">
              Size: <span className="font-medium text-(--color-dark)">{product.size}</span>
            </span>
          )}
          {weight !== undefined && unit && (
            <span className="text-(--color-text-muted)">
              Weight/Volume:{" "}
              <span className="font-medium text-(--color-dark)">
                {weight} {unit}
              </span>
            </span>
          )}
        </div>
      )}

      <div className="mt-5 flex items-center gap-3">
        <div className="inline-flex w-fit items-center gap-1 rounded-(--radius-md) border border-(--color-border) py-1">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3 py-1.5 text-(--color-text-muted) transition-colors hover:text-(--color-primary)"
          >
            <Minus size={14} />
          </button>
          <span className="w-8 text-center text-sm font-medium text-(--color-dark)">{quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => q + 1)}
            className="px-3 py-1.5 text-(--color-text-muted) transition-colors hover:text-(--color-primary)"
          >
            <Plus size={14} />
          </button>
        </div>

        <button
          type="button"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
          onClick={() => toggleItem(product)}
          className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-(--radius-md) border p-0 transition-colors ${
            wishlisted
              ? "border-(--color-primary) bg-(--color-primary-faint) text-(--color-primary)"
              : "border-(--color-border) text-(--color-text-muted) hover:border-(--color-primary) hover:text-(--color-primary)"
          }`}
        >
          <Heart size={16} className={wishlisted ? "fill-current" : ""} />
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
        <button
          type="button"
          onClick={handleAddToCart}
          className="btn-outline inline-flex flex-1 items-center justify-center gap-2"
        >
          {justAdded ? <Check size={16} /> : <ShoppingCart size={16} />}
          {justAdded ? "Added" : addToCartLabel}
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          className="btn-primary inline-flex flex-1 items-center justify-center gap-2"
        >
          <Zap size={16} />
          {buyNowLabel}
        </button>
      </div>

      <ProductShare title={product.name} />

      <div className="mt-6 grid grid-cols-1 gap-2.5 border-t border-(--color-border) pt-5 sm:grid-cols-3">
        <span className="inline-flex items-center gap-1.5 text-xs text-(--color-text-muted)">
          <Truck size={14} className="text-(--color-primary)" />
          Worldwide Shipping
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs text-(--color-text-muted)">
          <ShieldCheck size={14} className="text-(--color-primary)" />
          Buyer Protection
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs text-(--color-text-muted)">
          <RotateCcw size={14} className="text-(--color-primary)" />
          Easy Returns
        </span>
      </div>
    </div>
  );
}

export default ProductDetailInfo;
