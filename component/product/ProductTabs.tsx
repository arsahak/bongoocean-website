"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import type { ProductReview } from "@/app/actions/products";
import type { Locale } from "@/app/i18n-config";

interface ProductTabsProps {
  lang: Locale;
  overviewHtml: string;
  reviews: ProductReview[];
  reviewSummary: { averageRating: number; totalReviews: number };
}

type Tab = "description" | "reviews";

const tabButtonClass = (active: boolean) =>
  `relative pb-3 text-sm font-semibold transition-colors ${
    active
      ? "text-(--color-dark)"
      : "text-(--color-text-muted) hover:text-(--color-dark)"
  }`;

function StarRating({ rating, size }: { rating: number; size: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < Math.round(rating)
              ? "fill-(--color-accent) text-(--color-accent)"
              : "text-(--color-border)"
          }
        />
      ))}
    </div>
  );
}

export function ProductTabs({
  lang,
  overviewHtml,
  reviews,
  reviewSummary,
}: ProductTabsProps) {
  const hasOverview = Boolean(overviewHtml.trim());
  const [tab, setTab] = useState<Tab>(hasOverview ? "description" : "reviews");

  return (
    <section className="mt-12">
      <div role="tablist" className="flex gap-6 border-b border-(--color-border)">
        {hasOverview && (
          <button
            type="button"
            role="tab"
            aria-selected={tab === "description"}
            onClick={() => setTab("description")}
            className={tabButtonClass(tab === "description")}
          >
            Description
            {tab === "description" && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-(--color-primary)" />
            )}
          </button>
        )}
        <button
          type="button"
          role="tab"
          aria-selected={tab === "reviews"}
          onClick={() => setTab("reviews")}
          className={tabButtonClass(tab === "reviews")}
        >
          Reviews ({reviewSummary.totalReviews})
          {tab === "reviews" && (
            <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-(--color-primary)" />
          )}
        </button>
      </div>

      {tab === "description" && hasOverview && (
        <div role="tabpanel" className="mt-6">
          <div
            className="rich-content"
            dangerouslySetInnerHTML={{ __html: overviewHtml }}
          />
        </div>
      )}

      {tab === "reviews" && (
        <div role="tabpanel" className="mt-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-(--color-dark)">
              {reviewSummary.averageRating || 0}
            </span>
            <div>
              <StarRating rating={reviewSummary.averageRating} size={16} />
              <p className="text-xs text-(--color-text-muted)">
                Based on {reviewSummary.totalReviews.toLocaleString()}{" "}
                {reviewSummary.totalReviews === 1 ? "review" : "reviews"}
              </p>
            </div>
          </div>

          {reviews.length === 0 ? (
            <p className="mt-5 text-sm text-(--color-text-muted)">
              No reviews yet — be the first to review this product.
            </p>
          ) : (
            <div className="mt-5 space-y-4">
              {reviews.map((review) => {
                const customerName =
                  [review.customer?.firstName, review.customer?.lastName]
                    .filter(Boolean)
                    .join(" ") || "Verified Buyer";

                return (
                  <div
                    key={review._id}
                    className="rounded-(--radius-lg) border border-(--color-border) p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-(--color-dark)">
                        {customerName}
                      </span>
                      <span className="text-xs text-(--color-text-muted)">
                        {new Date(review.createdAt).toLocaleDateString(lang, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="mt-1">
                      <StarRating rating={review.rating} size={13} />
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-(--color-text-muted)">
                      {review.comment}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default ProductTabs;
