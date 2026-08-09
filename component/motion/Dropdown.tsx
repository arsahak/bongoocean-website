"use client";

import { AnimatePresence, motion, type HTMLMotionProps, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { dropdownVariants } from "./variants";

interface DropdownProps
  extends Omit<HTMLMotionProps<"div">, "variants" | "initial" | "animate" | "exit"> {
  show: boolean;
  children: ReactNode;
  variants?: Variants;
}

/**
 * Generic animated panel for anything that opens/closes — dropdown menus,
 * mega menus (pass `megaMenuVariants`), popovers, etc. Renders nothing while closed.
 */
export function Dropdown({ show, children, variants = dropdownVariants, ...props }: DropdownProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial="hidden" animate="visible" exit="exit" variants={variants} {...props}>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
