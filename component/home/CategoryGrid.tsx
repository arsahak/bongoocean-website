"use client";

import { listCategoriesAction, type Category } from "@/app/actions/category";
import type { Dictionary } from "@/app/dictionaries";
import type { Locale } from "@/app/i18n-config";
import { getCategoryIcon } from "@/component/category/getCategoryIcon";
import { FadeIn } from "@/component/motion/FadeIn";
import { easeSmooth } from "@/component/motion/variants";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState, type CSSProperties } from "react";

interface CategoryGridProps {
  dict: Dictionary;
  lang: Locale;
}

const PAGE_SIZE = 8;
const ROTATE_MS = 3000;
// Enough skeleton rows to fill the desktop panel like a real category list.
const SKELETON_ROWS = 10;
const SKELETON_LABEL_WIDTHS = [70, 55, 80, 60, 75, 50, 65, 85, 58, 72];
const PANEL_HEIGHT = "lg:h-[460px]";
const FALLBACK_CATEGORY_IMAGE =
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80";

// Each grid slot crossfades old → new on its own (via the `custom` slot
// index below), staggered slightly per slot, instead of the whole grid
// clearing out and refilling together — so there's never a moment where
// the panel looks empty mid-transition.
const panelCardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92, filter: "blur(6px)" },
  visible: (slotIndex: number) => ({
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: easeSmooth, delay: slotIndex * 0.06 },
  }),
  exit: (slotIndex: number) => ({
    opacity: 0,
    scale: 0.94,
    filter: "blur(4px)",
    transition: { duration: 0.3, ease: "easeIn", delay: slotIndex * 0.06 },
  }),
};

export function CategoryGrid({ dict }: CategoryGridProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [page, setPage] = useState(0);
  const [prevActiveIndex, setPrevActiveIndex] = useState(activeIndex);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadCategories = async () => {
      setIsLoading(true);
      const response = await listCategoriesAction();
      if (!mounted) return;

      if (response.ok && response.data) {
        setCategories(response.data);
        setActiveIndex(0);
        setIsLoading(false);
        return;
      }

      setCategories([]);
      setIsLoading(false);
    };

    void loadCategories();
    return () => {
      mounted = false;
    };
  }, []);

  if (activeIndex !== prevActiveIndex) {
    setPrevActiveIndex(activeIndex);
    setPage(0);
  }

  const topCategories = useMemo(
    () => categories.filter((category) => !category.parent),
    [categories],
  );

  const activeCategory = topCategories[activeIndex] ?? null;
  const childCategoriesByParent = useMemo(() => {
    const map = new Map<string, Category[]>();

    for (const category of categories) {
      if (!category.parent) continue;
      const parentId = String(category.parent);
      const parentChildren = map.get(parentId) ?? [];
      parentChildren.push(category);
      map.set(parentId, parentChildren);
    }

    return map;
  }, [categories]);

  const getAllDescendants = (categoryId: string): Category[] => {
    const directChildren = childCategoriesByParent.get(categoryId) ?? [];

    return directChildren.flatMap((child) => [
      child,
      ...getAllDescendants(String(child._id)),
    ]);
  };

  const activeCategoryChildren = activeCategory
    ? getAllDescendants(String(activeCategory._id))
    : [];

  const panelCategories = activeCategory
    ? [activeCategory, ...activeCategoryChildren]
    : [];

  const pageCount = Math.max(1, Math.ceil(panelCategories.length / PAGE_SIZE));
  const visibleCategories = panelCategories.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE,
  );
  const hasCards = !isLoading && visibleCategories.length > 0;

  useEffect(() => {
    if (pageCount <= 1) return;
    const timer = setInterval(
      () => setPage((p) => (p + 1) % pageCount),
      ROTATE_MS,
    );
    return () => clearInterval(timer);
  }, [pageCount]);

  return (
    <section className="py-8 sm:py-10">
      <div className="container">
        <FadeIn>
          <h2 className="section-title">{dict.home.categories}</h2>
        </FadeIn>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_4fr] lg:gap-5">
          <div
            className={`flex gap-2 overflow-x-auto scroll-smooth pb-2 lg:flex-col lg:gap-1 lg:overflow-x-visible lg:overflow-y-auto lg:rounded-(--radius-lg) lg:border lg:border-(--color-border) lg:bg-(--color-surface) lg:p-2 ${PANEL_HEIGHT}`}
          >
            {isLoading ? (
              // Mirrors the real list: pills in a row on mobile, a full-height
              // column of icon + label rows on desktop.
              Array.from({ length: SKELETON_ROWS }).map((_, index) => (
                <div
                  key={`category-skeleton-${index}`}
                  aria-hidden="true"
                  className={`flex shrink-0 items-center gap-2.5 rounded-(--radius-md) px-3 py-2.5 max-lg:border max-lg:border-(--color-border) lg:w-full lg:flex-1 lg:py-0 ${
                    index >= 5 ? "max-lg:hidden" : ""
                  }`}
                >
                  <span className="skeleton h-[18px] w-[18px] shrink-0 rounded-md" />
                  <span
                    className="skeleton h-3 w-20 rounded-full lg:w-(--label-w)"
                    style={
                      {
                        "--label-w": `${SKELETON_LABEL_WIDTHS[index % SKELETON_LABEL_WIDTHS.length]}%`,
                      } as CSSProperties
                    }
                  />
                  <span className="skeleton ms-auto hidden h-2.5 w-1.5 shrink-0 rounded-full lg:block" />
                </div>
              ))
            ) : topCategories.length > 0 ? (
              topCategories.map((category, i) => {
                const CategoryIcon = getCategoryIcon(category);

                return (
                  <button
                    key={category._id}
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    className={`flex shrink-0 items-center gap-2.5 rounded-(--radius-md) px-3 py-2.5 text-start text-sm font-medium transition-colors lg:w-full ${
                      i === activeIndex
                        ? "bg-(--color-primary) text-white"
                        : "text-(--color-dark) hover:bg-(--color-primary-faint)"
                    }`}
                  >
                    <CategoryIcon
                      size={18}
                      strokeWidth={1.75}
                      className="shrink-0"
                    />
                    <span className="truncate">{category.name}</span>
                    <ChevronRight
                      size={14}
                      className={`ms-auto hidden shrink-0 lg:block ${i === activeIndex ? "opacity-100" : "opacity-30"}`}
                    />
                  </button>
                );
              })
            ) : (
              <p className="flex items-center justify-center py-10 text-center text-sm text-(--color-text-muted) lg:h-full">
                No categories available
              </p>
            )}
          </div>

          <div className={PANEL_HEIGHT}>
            {isLoading ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:h-full lg:grid-rows-2">
                {Array.from({ length: PAGE_SIZE }).map((_, index) => (
                  <div
                    key={`card-skeleton-${index}`}
                    aria-hidden="true"
                    className="skeleton relative aspect-square rounded-(--radius-lg) lg:aspect-auto lg:h-full"
                  >
                    {/* Placeholder for the name + product count caption. */}
                    <div className="absolute inset-x-2.5 bottom-2.5 space-y-1.5">
                      <span className="block h-3 w-3/4 rounded-full bg-(--color-surface)/70" />
                      <span className="block h-2.5 w-1/3 rounded-full bg-(--color-surface)/50" />
                    </div>
                  </div>
                ))}
              </div>
            ) : hasCards ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:h-full lg:grid-rows-2">
                {Array.from({ length: PAGE_SIZE }).map((_, slotIndex) => {
                  const category = visibleCategories[slotIndex];
                  return (
                    <div
                      key={`slot-${slotIndex}`}
                      className="group relative aspect-square lg:aspect-auto lg:h-full"
                    >
                      {/* Each slot crossfades its own old→new card independently
                          (mode="sync" lets exit/enter overlap), so replacement
                          cascades across the grid instead of an all-at-once clear. */}
                      <AnimatePresence mode="sync">
                        {category && (
                          <motion.div
                            key={category._id}
                            custom={slotIndex}
                            variants={panelCardVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="absolute inset-0 block overflow-hidden rounded-(--radius-lg) shadow-sm transition-shadow hover:shadow-lg"
                          >
                            <div className="absolute inset-0">
                              <Image
                                src={category.image || FALLBACK_CATEGORY_IMAGE}
                                alt={category.name}
                                fill
                                unoptimized
                                sizes="(max-width: 768px) 50vw, 25vw"
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            </div>
                            <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />
                            <div className="absolute inset-x-0 bottom-0 px-2.5 pt-8 pb-2.5">
                              <p className="line-clamp-2 text-xs font-medium text-white sm:text-sm">
                                {category.name}
                              </p>
                              {typeof category.productCount === "number" && (
                                <p className="mt-1 text-[10px] text-white/80 sm:text-xs">
                                  {category.productCount} products
                                </p>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="flex items-center justify-center py-10 text-center text-sm text-(--color-text-muted) lg:h-full">
                {activeCategory
                  ? activeCategory.name
                  : "No categories available"}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CategoryGrid;
