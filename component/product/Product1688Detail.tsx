"use client";

import { useState } from "react";
import Image from "next/image";
import { ExternalLink, Package } from "lucide-react";
import type { ItemDetail1688 } from "@/app/actions/products";

interface Product1688DetailProps {
  item: ItemDetail1688;
}

export function Product1688Detail({ item }: Product1688DetailProps) {
  const [activeImage, setActiveImage] = useState<string | null>(item.images[0] ?? null);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="relative aspect-square w-full overflow-hidden rounded-(--radius-2xl) bg-(--color-bg)">
            {activeImage ? (
              <Image src={activeImage} alt={item.title} fill unoptimized className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-(--color-text-light)">
                <Package size={64} strokeWidth={1.25} />
              </div>
            )}
          </div>
          {item.images.length > 1 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {item.images.map((img) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setActiveImage(img)}
                  className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-(--radius-md) border transition-colors ${
                    activeImage === img
                      ? "border-(--color-primary)"
                      : "border-(--color-border) hover:border-(--color-primary)"
                  }`}
                >
                  <Image src={img} alt="" fill unoptimized className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="text-xl font-bold text-(--color-dark)">{item.title}</h1>

          <div className="mt-5 rounded-(--radius-lg) bg-(--color-bg) p-4">
            <p className="text-2xl font-bold text-(--color-dark)">
              {item.price ? `¥${item.price}` : "Price unavailable"}
            </p>
            <p className="mt-1 text-xs text-(--color-text-muted)">
              {item.unit && `per ${item.unit}`}
              {item.minOrder && ` · MOQ ${item.minOrder}`}
            </p>
          </div>

          {item.priceTiers.length > 0 && (
            <div className="mt-5">
              <h3 className="text-xs font-semibold tracking-wide text-(--color-text-muted) uppercase">
                Bulk pricing
              </h3>
              <div className="mt-2 divide-y divide-(--color-border) rounded-(--radius-lg) border border-(--color-border)">
                {item.priceTiers.map((tier, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-2 text-sm">
                    <span className="text-(--color-text-muted)">≥ {tier.minQuantity} pcs</span>
                    <span className="font-medium text-(--color-dark)">¥{tier.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {item.specifications.length > 0 && (
            <div className="mt-5 border-t border-(--color-border) pt-4">
              <h3 className="text-xs font-semibold tracking-wide text-(--color-text-muted) uppercase">
                Specifications
              </h3>
              <div className="mt-3 flex flex-col gap-2">
                {item.specifications.map((spec, i) => (
                  <div key={i} className="flex items-start justify-between gap-4 text-sm">
                    <span className="shrink-0 text-(--color-text-muted)">{spec.name}</span>
                    <span className="text-end text-(--color-dark)">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline btn-sm mt-6 inline-flex items-center gap-2"
            >
              <ExternalLink size={14} />
              View on 1688
            </a>
          )}
        </div>
      </div>

      {/* Variants */}
      {item.variants.length > 0 && (
        <div className="rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface) p-5">
          <h2 className="text-sm font-semibold text-(--color-dark)">Variants</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-(--color-border) text-start text-xs font-semibold tracking-wide text-(--color-text-muted) uppercase">
                  <th className="pb-2 pe-4">Options</th>
                  <th className="pb-2 pe-4">Price</th>
                  <th className="pb-2">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-(--color-border)">
                {item.variants.map((variant) => (
                  <tr key={variant.skuId}>
                    <td className="py-2 pe-4 text-(--color-text-muted)">
                      {Object.values(variant.optionValues).join(" / ") || "—"}
                    </td>
                    <td className="py-2 pe-4 font-medium text-(--color-dark)">¥{variant.price}</td>
                    <td className="py-2 text-(--color-text-muted)">{variant.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Description images */}
      {item.descriptionImages.length > 0 && (
        <div className="rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface) p-5">
          <h2 className="text-sm font-semibold text-(--color-dark)">Description</h2>
          <div className="mt-4 flex flex-col gap-2">
            {item.descriptionImages.map((img, i) => (
              <div key={i} className="relative w-full overflow-hidden rounded-(--radius-md) bg-(--color-bg)">
                {/* eslint-disable-next-line @next/next/no-img-element -- variable, unknown aspect ratio per image */}
                <img src={img} alt="" className="w-full" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Product1688Detail;
