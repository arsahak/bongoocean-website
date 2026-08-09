"use client";

import type { Dictionary } from "@/app/dictionaries";
import type { Locale } from "@/app/i18n-config";
import { easeSmooth } from "@/component/motion/variants";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Gift,
  Globe2,
  Shirt,
  Store,
  Tag,
  Zap,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

interface HeroSectionProps {
  dict: Dictionary;
  lang: Locale;
}

interface Slide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  gradient: string;
  icon: LucideIcon;
}

interface OfferCard {
  id: string;
  label: string;
  title: string;
  discount: string;
  href: string;
  gradient: string;
  icon: LucideIcon;
}

const AUTOPLAY_MS = 5000;
const PANEL_HEIGHT = "h-[320px] sm:h-[380px] lg:h-[440px]";
const OFFER_SLOTS = 2;
const OFFER_BASE_MS = 4000;
const OFFER_STEP_MS = 800;

/** Rotates the offer pool so each slot starts its rotation at a different item. */
function rotateOffers(offers: OfferCard[], offset: number): OfferCard[] {
  const o = offset % offers.length;
  return [...offers.slice(o), ...offers.slice(0, o)];
}

interface OfferSlotProps {
  offers: OfferCard[];
  lang: Locale;
  intervalMs: number;
}

function OfferSlot({ offers, lang, intervalMs }: OfferSlotProps) {
  const [index, setIndex] = useState(0);

  const goTo = useCallback(
    (i: number) => setIndex(((i % offers.length) + offers.length) % offers.length),
    [offers.length],
  );

  useEffect(() => {
    if (offers.length <= 1) return;
    const timer = setInterval(() => goTo(index + 1), intervalMs);
    return () => clearInterval(timer);
  }, [index, goTo, offers.length, intervalMs]);

  const offer = offers[index];

  return (
    <div className="relative flex-1 overflow-hidden rounded-(--radius-xl)">
      <AnimatePresence>
        <motion.div
          key={offer.id}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.06 }}
          transition={{ duration: 0.5, ease: easeSmooth }}
          className="absolute inset-0"
        >
          <Link
            href={`/${lang}${offer.href}`}
            className={`group relative flex h-full items-center gap-3 bg-linear-to-br ${offer.gradient} px-4 py-3 text-white`}
          >
            <span className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
              <offer.icon size={20} strokeWidth={1.75} />
            </span>
            <div className="z-10 min-w-0 text-start">
              <p className="truncate text-[0.6875rem] font-bold tracking-wide text-white/80 uppercase">
                {offer.label}
              </p>
              <p className="truncate text-sm font-bold leading-tight sm:text-base">
                {offer.title}
              </p>
              <p className="truncate text-xs text-white/90 sm:text-sm">{offer.discount}</p>
            </div>
            <ArrowRight
              size={16}
              className="z-10 ms-auto shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
            />
            <offer.icon
              aria-hidden="true"
              strokeWidth={1}
              size={100}
              className="pointer-events-none absolute end-[-1rem] bottom-[-1rem] text-white/10"
            />
          </Link>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function HeroSection({ dict, lang }: HeroSectionProps) {
  const slides: Slide[] = [
    {
      id: "global-marketplace",
      badge: "Worldwide Shipping",
      title: dict.home.hero_title,
      subtitle: dict.home.hero_subtitle,
      cta: dict.home.hero_cta,
      href: "/category/electronics",
      gradient: "from-(--color-primary) to-(--color-primary-light)",
      icon: Globe2,
    },
    {
      id: "fashion-sale",
      badge: "Up to 60% Off",
      title: "New Season Fashion",
      subtitle: "Fresh arrivals from top-rated sellers — limited-time prices.",
      cta: "Shop Fashion",
      href: "/category/fashion",
      gradient: "from-(--color-secondary) to-(--color-secondary-light)",
      icon: Shirt,
    },
    {
      id: "become-seller",
      badge: "For Businesses",
      title: "Become a Xindamart Seller",
      subtitle:
        "Reach millions of buyers worldwide and grow your business with us.",
      cta: dict.home.hero_cta_seller,
      href: "/sell",
      gradient: "from-[#10101c] to-(--color-primary)",
      icon: Store,
    },
  ];

  const offers: OfferCard[] = [
    {
      id: "flash-sale",
      label: "Flash Sale",
      title: "Electronics & Gadgets",
      discount: "Up to 45% off",
      href: "/deals/electronics",
      gradient: "from-(--color-accent) to-(--color-secondary)",
      icon: Zap,
    },
    {
      id: "clearance",
      label: "Clearance",
      title: "Home & Living",
      discount: "Up to 30% off",
      href: "/deals/home-living",
      gradient: "from-(--color-success) to-(--color-info)",
      icon: Tag,
    },
    {
      id: "bundle-deal",
      label: "Bundle Deal",
      title: "Beauty & Health",
      discount: "Buy 1 Get 1",
      href: "/deals/beauty-health",
      gradient: "from-(--color-secondary) to-(--color-primary)",
      icon: Gift,
    },
  ];

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback(
    (i: number) =>
      setIndex(((i % slides.length) + slides.length) % slides.length),
    [slides.length],
  );

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => goTo(index + 1), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused, index, goTo]);

  const slide = slides[index];

  return (
    <section className="py-6 sm:py-10">
      <div className="container">
        <div className="grid gap-4 lg:grid-cols-[7fr_3fr] lg:gap-5">
          {/* Banner slider — ~70% */}
          <div
            className={`relative overflow-hidden rounded-(--radius-2xl) ${PANEL_HEIGHT}`}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <AnimatePresence initial={false}>
              <motion.div
                key={slide.id}
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.6, ease: easeSmooth }}
                className={`absolute inset-0 flex items-center bg-linear-to-br ${slide.gradient} px-6 py-8 sm:px-10 lg:px-14`}
              >
                <div className="relative z-10 max-w-md text-start">
                  <span className="badge bg-white/15 text-white backdrop-blur-sm">
                    {slide.badge}
                  </span>
                  <h2 className="mt-4 text-white">{slide.title}</h2>
                  <p className="mt-3 max-w-sm text-sm text-white/85 sm:text-base">
                    {slide.subtitle}
                  </p>
                  <Link
                    href={`/${lang}${slide.href}`}
                    className="btn-secondary btn-pill mt-6 inline-flex w-fit items-center gap-2 px-5 py-2.5"
                  >
                    {slide.cta}
                    <ArrowRight size={16} />
                  </Link>
                </div>
                <slide.icon
                  aria-hidden="true"
                  strokeWidth={1}
                  size={240}
                  className="pointer-events-none absolute end-[-2rem] bottom-[-2rem] text-white/15"
                />
              </motion.div>
            </AnimatePresence>

            <div className="absolute inset-x-0 bottom-3 z-20 flex items-center justify-center gap-1.5">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`h-1 w-1.5 rounded-full transition-colors ${
                    i === index ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Hot offers — ~30%, 2 slots that auto-rotate through the offer pool */}
          <div className={`flex flex-col gap-3 ${PANEL_HEIGHT}`}>
            {Array.from({ length: OFFER_SLOTS }).map((_, slotIndex) => (
              <OfferSlot
                key={slotIndex}
                offers={rotateOffers(offers, slotIndex)}
                lang={lang}
                intervalMs={OFFER_BASE_MS + slotIndex * OFFER_STEP_MS}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
