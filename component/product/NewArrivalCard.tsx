"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import type { Locale } from "@/app/i18n-config";
import { easeSmooth } from "@/component/motion/variants";
import { useCurrency } from "@/component/providers/CurrencyProvider";

export interface NewArrivalSlide {
  id: string;
  name: string;
  href: string;
  price: number;
  gradient: string;
  /** Pre-rendered on the server — Lucide icon components can't cross the server/client boundary as a prop. */
  icon: ReactNode;
}

interface NewArrivalCardProps {
  slides: NewArrivalSlide[];
  lang: Locale;
  /** Rotation speed for this card, in ms — vary per card so a row of cards doesn't tick in lockstep. */
  intervalMs?: number;
}

export function NewArrivalCard({ slides, lang, intervalMs = 3500 }: NewArrivalCardProps) {
  const { format } = useCurrency();
  const [index, setIndex] = useState(0);

  const goTo = useCallback(
    (i: number) => setIndex(((i % slides.length) + slides.length) % slides.length),
    [slides.length],
  );

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => goTo(index + 1), intervalMs);
    return () => clearInterval(timer);
  }, [index, goTo, slides.length, intervalMs]);

  const slide = slides[index];

  return (
    <Link
      href={`/${lang}/product/${slide.id}`}
      className="group relative block aspect-[3/4] overflow-hidden rounded-(--radius-2xl) transition-shadow hover:shadow-lg"
    >
      {slides.length > 1 && (
        <div className="absolute inset-x-2 top-2 z-20 flex gap-1">
          {slides.map((s, i) => (
            <div key={s.id} className="h-1 flex-1 overflow-hidden rounded-full bg-white/30">
              {i < index && <div className="h-full w-full bg-white" />}
              {i === index && (
                <motion.div
                  key={index}
                  className="h-full bg-white"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: intervalMs / 1000, ease: "linear" }}
                />
              )}
            </div>
          ))}
        </div>
      )}

      <span className="badge badge-success absolute start-2.5 top-6 z-10">new</span>

      <AnimatePresence initial={false}>
        <motion.div
          key={slide.id}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.6, ease: easeSmooth }}
          className={`absolute inset-0 bg-linear-to-br ${slide.gradient}`}
        >
          {slide.icon}
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/75 to-transparent px-3 pt-10 pb-3">
            <p className="line-clamp-2 text-xs font-semibold text-white sm:text-sm">{slide.name}</p>
            <span className="price mt-1 block text-white">{format(slide.price)}</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </Link>
  );
}

export default NewArrivalCard;
