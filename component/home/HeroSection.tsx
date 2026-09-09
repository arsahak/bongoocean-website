"use client";

import type { Dictionary } from "@/app/dictionaries";
import { getDirection, type Locale } from "@/app/i18n-config";
import { easeSmooth } from "@/component/motion/variants";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Gift,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Truck,
  Zap,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

interface HeroSectionProps {
  dict: Dictionary;
  lang: Locale;
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

interface HeroSlide {
  id: string;
  badge: string;
  title: string;
  accent: string;
  description: string;
  cta: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  imageMode: "product" | "background";
  gradient: string;
  glow: string;
}

const PANEL_HEIGHT = "h-[390px] sm:h-[430px] lg:h-[460px]";
const HERO_AUTOPLAY_MS = 2000;
const HERO_SLIDE_COUNT = 3;
const OFFER_SLOTS = 2;
const OFFER_BASE_MS = 2000;
const OFFER_STEP_MS = 350;

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
  const dir = getDirection(lang);

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
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -32 }}
          transition={{ duration: 0.55, ease: easeSmooth }}
          className="absolute inset-0"
        >
          <Link
            href={`/${lang}${offer.href}`}
            dir={dir}
            lang={lang}
            className={`group relative flex h-full flex-col justify-between overflow-hidden border border-white/10 bg-linear-to-br ${offer.gradient} p-4 text-white shadow-(--shadow-md) sm:p-5`}
          >
            <div className="relative z-10 flex w-full items-start justify-between gap-3">
              <span className="inline-flex min-w-0 items-start gap-2 text-xs leading-snug font-bold tracking-[0.1em] text-white/75 uppercase sm:tracking-[0.14em]">
                <offer.icon
                  size={16}
                  strokeWidth={2}
                  className="mt-0.5 shrink-0"
                />
                <span className="break-words">{offer.label}</span>
              </span>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                <ArrowRight
                  size={15}
                  className={dir === "rtl" ? "rotate-180" : undefined}
                />
              </span>
            </div>
            <div className="relative z-10 text-start">
              <p className="max-w-[85%] break-words text-base font-bold leading-snug text-white sm:text-lg lg:text-xl">
                {offer.title}
              </p>
              <span className="mt-2 inline-flex max-w-full rounded-full bg-(--color-secondary) px-3 py-1 text-start text-xs leading-snug font-extrabold whitespace-normal text-(--color-secondary-foreground) sm:text-sm">
                {offer.discount}
              </span>
            </div>
            <offer.icon
              aria-hidden="true"
              strokeWidth={1}
              size={124}
              className="pointer-events-none absolute end-[-1.25rem] bottom-[-1.5rem] text-white/10 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
            />
          </Link>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function HeroSection({ dict, lang }: HeroSectionProps) {
  const dir = getDirection(lang);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHeroPaused, setIsHeroPaused] = useState(false);
  const offerCopy = dict.home.offers;
  const slideCopy = dict.home.hero_slides;
  const slides: HeroSlide[] = [
    {
      id: "global-marketplace",
      badge: dict.home.hero_badge,
      title: dict.home.hero_title,
      accent: dict.home.hero_title_accent,
      description: dict.home.hero_subtitle,
      cta: dict.home.hero_cta,
      href: "/product",
      imageSrc: "/assets/hero/bongoocean-marketplace-hero.png",
      imageAlt: dict.home.hero_image_alt,
      imageMode: "product",
      gradient: "from-(--color-primary) via-[#062d75] to-[#051127]",
      glow: "bg-(--color-secondary)/25",
    },
    {
      id: "electronics",
      badge: slideCopy.electronics_badge,
      title: slideCopy.electronics_title,
      accent: slideCopy.electronics_accent,
      description: slideCopy.electronics_description,
      cta: slideCopy.electronics_cta,
      href: "/product",
      imageSrc: "/assets/hero/bongoocean-electronics-hero.png",
      imageAlt: slideCopy.electronics_image_alt,
      imageMode: "background",
      gradient: "from-[#021b4d] via-(--color-primary) to-[#002b80]",
      glow: "bg-[#4fe4ff]/25",
    },
    {
      id: "lifestyle",
      badge: slideCopy.lifestyle_badge,
      title: slideCopy.lifestyle_title,
      accent: slideCopy.lifestyle_accent,
      description: slideCopy.lifestyle_description,
      cta: slideCopy.lifestyle_cta,
      href: "/product",
      imageSrc: "/assets/hero/bongoocean-fashion-hero.png",
      imageAlt: slideCopy.lifestyle_image_alt,
      imageMode: "background",
      gradient: "from-[#061b3e] via-[#005d8a] to-[#013db3]",
      glow: "bg-(--color-secondary)/30",
    },
  ];

  useEffect(() => {
    if (isHeroPaused) return;

    const timer = setInterval(() => {
      setActiveSlide((current) => (current + 1) % HERO_SLIDE_COUNT);
    }, HERO_AUTOPLAY_MS);

    return () => clearInterval(timer);
  }, [activeSlide, isHeroPaused]);

  const goToSlide = useCallback((index: number) => {
    setActiveSlide(
      ((index % HERO_SLIDE_COUNT) + HERO_SLIDE_COUNT) % HERO_SLIDE_COUNT,
    );
  }, []);

  const activeHero = slides[activeSlide];
  const offers: OfferCard[] = [
    {
      id: "flash-sale",
      label: offerCopy.flash_label,
      title: offerCopy.flash_title,
      discount: offerCopy.flash_discount,
      href: "/product",
      gradient: "from-[#07183f] via-(--color-primary) to-[#006f9f]",
      icon: Zap,
    },
    {
      id: "clearance",
      label: offerCopy.clearance_label,
      title: offerCopy.clearance_title,
      discount: offerCopy.clearance_discount,
      href: "/product",
      gradient: "from-[#071d31] via-[#005f86] to-[#00a8d0]",
      icon: Tag,
    },
    {
      id: "bundle-deal",
      label: offerCopy.bundle_label,
      title: offerCopy.bundle_title,
      discount: offerCopy.bundle_discount,
      href: "/product",
      gradient: "from-[#101828] via-[#013db3] to-[#008db8]",
      icon: Gift,
    },
  ];

  return (
    <section className="py-5 sm:py-8 lg:py-10">
      <div className="container">
        <div
          dir="ltr"
          className="grid gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(280px,3fr)] lg:gap-5"
        >
          {/* Localized three-slide campaign carousel */}
          <div
            className={`relative isolate overflow-hidden rounded-(--radius-2xl) bg-[#06143b] shadow-(--shadow-lg) ${PANEL_HEIGHT}`}
            onMouseEnter={() => setIsHeroPaused(true)}
            onMouseLeave={() => setIsHeroPaused(false)}
            onFocusCapture={() => setIsHeroPaused(true)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setIsHeroPaused(false);
              }
            }}
          >
            <AnimatePresence initial={false} mode="sync">
              <motion.div
                key={activeHero.id}
                initial={{ opacity: 0, x: 72 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -72 }}
                transition={{ duration: 0.7, ease: easeSmooth }}
                className="absolute inset-0"
                aria-live="polite"
              >
                <div
                  className={`absolute inset-0 bg-linear-to-br ${activeHero.gradient}`}
                />

                {activeHero.imageMode === "background" && (
                  <>
                    <div className="absolute inset-y-[4%] right-[-3%] w-[62%] sm:right-[-1%] sm:w-[60%] lg:w-[58%] xl:right-[1%] xl:w-[56%]">
                      <Image
                        src={activeHero.imageSrc}
                        alt={activeHero.imageAlt}
                        fill
                        sizes="(min-width: 1280px) 39vw, (min-width: 1024px) 41vw, (min-width: 640px) 60vw, 62vw"
                        className="object-contain object-right [mask-image:linear-gradient(to_right,transparent_0%,black_22%,black_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_22%,black_100%)]"
                      />
                    </div>
                    <div className="absolute inset-y-0 left-0 w-[68%] bg-linear-to-r from-[#020817]/90 via-[#020817]/45 to-transparent" />
                  </>
                )}

                {activeHero.imageMode === "product" && (
                  <>
                    <div
                      className={`absolute -top-32 right-[8%] h-80 w-80 rounded-full ${activeHero.glow} blur-3xl`}
                    />
                    <div className="absolute -bottom-36 left-[18%] h-72 w-72 rounded-full bg-[#356be0]/30 blur-3xl" />
                    <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:42px_42px]" />
                  </>
                )}

                <div className="relative z-10 flex h-full items-center px-6 py-10 sm:px-10 lg:px-12 xl:px-14">
                  <div
                    dir={dir}
                    lang={lang}
                    className="max-w-[82%] text-start sm:max-w-[60%] lg:max-w-[57%] xl:max-w-[56%]"
                  >
                    <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/20 bg-black/15 px-3 py-1.5 text-start text-xs leading-snug font-bold tracking-[0.1em] text-white uppercase backdrop-blur-md sm:tracking-[0.14em]">
                      <ShoppingBag size={14} className="shrink-0" />
                      {activeHero.badge}
                    </span>
                    <h1 className="mt-4 break-words text-[1.75rem] leading-[1.08] font-extrabold tracking-[-0.035em] text-white sm:mt-5 sm:text-[2.25rem] lg:text-[2.7rem] xl:text-[3.05rem]">
                      {activeHero.title}
                      <span className="block text-(--color-secondary)">
                        {activeHero.accent}
                      </span>
                    </h1>
                    <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/80 sm:mt-4 sm:text-base">
                      {activeHero.description}
                    </p>
                    <Link
                      href={`/${lang}${activeHero.href}`}
                      className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-(--color-primary) shadow-lg transition-all hover:-translate-y-0.5 hover:bg-(--color-secondary) hover:text-(--color-secondary-foreground) sm:mt-6"
                    >
                      {activeHero.cta}
                      <ArrowRight
                        size={17}
                        className={dir === "rtl" ? "rotate-180" : undefined}
                      />
                    </Link>
                    <div className="mt-4 hidden flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-white/75 sm:flex lg:mt-5">
                      <span className="inline-flex items-center gap-1.5">
                        <ShieldCheck
                          size={15}
                          className="text-(--color-secondary)"
                        />
                        {dict.home.hero_secure_payment}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Truck
                          size={15}
                          className="text-(--color-secondary)"
                        />
                        {dict.home.hero_worldwide_delivery}
                      </span>
                    </div>
                  </div>
                </div>

                {activeHero.imageMode === "product" && (
                  <div className="absolute right-[-6%] bottom-[-5%] z-10 w-[56%] sm:right-[-2%] sm:w-[46%] lg:right-0 lg:w-[48%] xl:right-[2%] xl:w-[44%]">
                    <div
                      className={`absolute inset-[12%] rounded-full ${activeHero.glow} blur-3xl`}
                    />
                    <Image
                      src={activeHero.imageSrc}
                      alt={activeHero.imageAlt}
                      width={1024}
                      height={1024}
                      priority
                      sizes="(min-width: 1280px) 31vw, (min-width: 1024px) 34vw, (min-width: 640px) 42vw, 56vw"
                      className="relative h-auto w-full object-contain drop-shadow-[0_28px_36px_rgba(0,0,0,0.32)]"
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goToSlide(index)}
                  aria-label={`${dict.common.next} ${index + 1}`}
                  aria-current={activeSlide === index ? "true" : undefined}
                  style={{ height: 4, padding: 0 }}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    activeSlide === index
                      ? "w-7 bg-(--color-secondary)"
                      : "w-2 bg-white/55 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Localized offers — fixed to the right, with RTL-aware copy */}
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
