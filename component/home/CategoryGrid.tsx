"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { navCategories } from "@/app/data/categories";
import { allProducts } from "@/app/data/products";
import type { Dictionary } from "@/app/dictionaries";
import type { Locale } from "@/app/i18n-config";
import { FadeIn } from "@/component/motion/FadeIn";
import { easeSmooth } from "@/component/motion/variants";

interface CategoryGridProps {
  dict: Dictionary;
  lang: Locale;
}

const PAGE_SIZE = 8;
const ROTATE_MS = 3000;
const PANEL_HEIGHT = "lg:h-[460px]";

export function CategoryGrid({ dict, lang }: CategoryGridProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [page, setPage] = useState(0);
  const [prevActiveIndex, setPrevActiveIndex] = useState(activeIndex);

  if (activeIndex !== prevActiveIndex) {
    setPrevActiveIndex(activeIndex);
    setPage(0);
  }

  const activeCategory = navCategories[activeIndex];
  const categoryProducts = allProducts.filter((p) => p.href.startsWith(activeCategory.href));
  const pageCount = Math.max(1, Math.ceil(categoryProducts.length / PAGE_SIZE));
  const visibleProducts = categoryProducts.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  useEffect(() => {
    if (pageCount <= 1) return;
    const timer = setInterval(() => setPage((p) => (p + 1) % pageCount), ROTATE_MS);
    return () => clearInterval(timer);
  }, [pageCount]);

  return (
    <section className="py-8 sm:py-10">
      <div className="container">
        <FadeIn>
          <h2 className="section-title">{dict.home.categories}</h2>
        </FadeIn>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_4fr] lg:gap-5">
          {/* Category list — ~20%, scrolls like a dropdown panel */}
          <div
            className={`flex gap-2 overflow-x-auto scroll-smooth pb-2 lg:flex-col lg:gap-1 lg:overflow-x-visible lg:overflow-y-auto lg:rounded-(--radius-lg) lg:border lg:border-(--color-border) lg:bg-(--color-surface) lg:p-2 ${PANEL_HEIGHT}`}
          >
            {navCategories.map((category, i) => (
              <button
                key={category.href}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={`flex shrink-0 items-center gap-2.5 rounded-(--radius-md) px-3 py-2.5 text-start text-sm font-medium transition-colors lg:w-full ${
                  i === activeIndex
                    ? "bg-(--color-primary) text-white"
                    : "text-(--color-dark) hover:bg-(--color-primary-faint)"
                }`}
              >
                <category.icon size={18} strokeWidth={1.75} className="shrink-0" />
                <span className="truncate">{category.label}</span>
                <ChevronRight
                  size={14}
                  className={`ms-auto hidden shrink-0 lg:block ${i === activeIndex ? "opacity-100" : "opacity-30"}`}
                />
              </button>
            ))}
          </div>

          {/* Product showcase — ~80%, height matches the category panel */}
          <div className={PANEL_HEIGHT}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeIndex}-${page}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: easeSmooth }}
                className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:h-full lg:grid-rows-2"
              >
                {visibleProducts.length > 0 ? (
                  visibleProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/${lang}/product/${product.id}`}
                      className="group relative block aspect-square overflow-hidden rounded-(--radius-lg) transition-shadow hover:shadow-lg lg:aspect-auto lg:h-full"
                    >
                      <div className={`absolute inset-0 bg-linear-to-br ${product.gradient}`}>
                        <product.icon
                          aria-hidden="true"
                          strokeWidth={1.25}
                          size={56}
                          className="absolute inset-0 m-auto text-white/90 transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent px-2.5 pt-8 pb-2.5">
                        <p className="line-clamp-2 text-xs font-medium text-white sm:text-sm">
                          {product.name}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="col-span-full flex items-center justify-center py-10 text-center text-sm text-(--color-text-muted) lg:h-full">
                    {activeCategory.label}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>

            {pageCount > 1 && (
              <div className="mt-3 flex justify-center gap-1.5">
                {Array.from({ length: pageCount }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-(--radius-pill) transition-all ${
                      i === page ? "w-6 bg-(--color-primary)" : "w-1.5 bg-(--color-border)"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CategoryGrid;
