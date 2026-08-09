"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { fadeInUp } from "./variants";

interface FadeInProps extends Omit<HTMLMotionProps<"div">, "variants" | "initial" | "whileInView" | "viewport"> {
  delay?: number;
  /** Re-trigger every time the element enters the viewport instead of only once. */
  repeat?: boolean;
}

/**
 * Reveals its children with a smooth fade + slide-up as they scroll into view.
 * Use for hero sections, product grids, footer columns, etc.
 */
export function FadeIn({ children, delay = 0, repeat = false, transition, ...props }: FadeInProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: !repeat, margin: "-80px" }}
      variants={fadeInUp}
      transition={{ delay, ...transition }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
