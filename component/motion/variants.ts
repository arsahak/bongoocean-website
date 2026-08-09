import type { Variants, Transition } from "framer-motion";

/** Standard "smooth" easing used across the site for consistency. */
export const easeSmooth: Transition["ease"] = [0.22, 1, 0.36, 1];

/** Fade + slide up — used for scroll reveals and general content entrances. */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: easeSmooth },
  },
};

/** Simple fade — used for overlays/backdrops. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2, ease: easeSmooth } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: "easeIn" } },
};

/** Small dropdown panels (language/currency switchers, account menu). */
export const dropdownVariants: Variants = {
  hidden: { opacity: 0, y: -8, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: easeSmooth },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.98,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

/** Full-width mega menu panel that drops down from the navbar. */
export const megaMenuVariants: Variants = {
  hidden: { opacity: 0, y: -12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: easeSmooth },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.18, ease: "easeIn" },
  },
};

/** Mobile drawer that slides in from the given side (use "right" for RTL locales). */
export function getDrawerVariants(side: "left" | "right" = "left"): Variants {
  const offscreen = side === "left" ? "-100%" : "100%";
  return {
    hidden: { x: offscreen },
    visible: { x: 0, transition: { duration: 0.3, ease: easeSmooth } },
    exit: { x: offscreen, transition: { duration: 0.25, ease: "easeIn" } },
  };
}

/** Stagger container — animate a group of children one after another. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
};

/** Single item to be used inside a `staggerContainer`. */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: easeSmooth },
  },
};
