import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { featuredProducts } from "@/app/data/products";
import type { Dictionary } from "@/app/dictionaries";
import type { Locale } from "@/app/i18n-config";
import { FadeIn } from "@/component/motion/FadeIn";
import { ProductCard } from "@/component/product/ProductCard";

interface FeaturedProductsProps {
  dict: Dictionary;
  lang: Locale;
}

export function FeaturedProducts({ dict, lang }: FeaturedProductsProps) {
  return (
    <section className="py-8 sm:py-10">
      <div className="container">
        <FadeIn className="flex items-end justify-between gap-4">
          <h2 className="section-title">{dict.home.featured}</h2>
          <Link
            href={`/${lang}/deals`}
            className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-(--color-primary) transition-colors hover:text-(--color-primary-dark)"
          >
            {dict.common.view_all}
            <ArrowRight size={15} />
          </Link>
        </FadeIn>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {featuredProducts.map(({ icon: Icon, ...product }, i) => (
            <FadeIn key={product.id} delay={Math.min(i, 4) * 0.05}>
              <ProductCard
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
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;
