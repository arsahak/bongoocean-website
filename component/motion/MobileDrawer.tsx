"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeIn, getDrawerVariants } from "./variants";

interface MobileDrawerProps {
  show: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Which edge the drawer slides in from. Use "right" for RTL locales. */
  side?: "left" | "right";
}

/** Off-canvas panel with a fade-in backdrop, used for the mobile nav menu. */
export function MobileDrawer({ show, onClose, children, side = "left" }: MobileDrawerProps) {
  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={fadeIn}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            className={`fixed inset-y-0 ${side === "left" ? "left-0" : "right-0"} z-50 flex w-[85%] max-w-sm flex-col overflow-y-auto bg-(--color-surface) shadow-xl lg:hidden`}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={getDrawerVariants(side)}
            role="dialog"
            aria-modal="true"
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
