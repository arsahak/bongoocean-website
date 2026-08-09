import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { newArrivals, type Product } from "@/app/data/products";
import type { Dictionary } from "@/app/dictionaries";
import type { Locale } from "@/app/i18n-config";
import { FadeIn } from "@/component/motion/FadeIn";
import { NewArrivalCard, type NewArrivalSlide } from "@/component/product/NewArrivalCard";

interface NewArrivalsProps {
  dict: Dictionary;
  lang: Locale;
}

const CARD_COUNT = 5;
const BASE_INTERVAL_MS = 3000;
const INTERVAL_STEP_MS = 700;

/** Rotates the product pool so each card starts its story at a different item. */
function rotate(products: Product[], offset: number): Product[] {
  const o = offset % products.length;
  return [...products.slice(o), ...products.slice(0, o)];
}

export function NewArrivals({ dict, lang }: NewArrivalsProps) {
  return (
    <section className="py-8 sm:py-10">
      <div className="container">
        <FadeIn className="flex items-end justify-between gap-4">
          <h2 className="section-title">{dict.home.new_arrivals}</h2>
          <Link
            href={`/${lang}/deals`}
            className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-(--color-primary) transition-colors hover:text-(--color-primary-dark)"
          >
            {dict.common.view_all}
            <ArrowRight size={15} />
          </Link>
        </FadeIn>

        <FadeIn className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: CARD_COUNT }).map((_, cardIndex) => {
            const slides: NewArrivalSlide[] = rotate(newArrivals, cardIndex).map(
              ({ icon: Icon, ...product }) => ({
                ...product,
                icon: (
                  <Icon
                    aria-hidden="true"
                    strokeWidth={1.25}
                    size={64}
                    className="absolute inset-0 m-auto text-white/90"
                  />
                ),
              }),
            );

            return (
              <NewArrivalCard
                key={cardIndex}
                slides={slides}
                lang={lang}
                intervalMs={BASE_INTERVAL_MS + cardIndex * INTERVAL_STEP_MS}
              />
            );
          })}
        </FadeIn>
      </div>
    </section>
  );
}

export default NewArrivals;
