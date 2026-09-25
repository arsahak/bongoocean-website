"use client";

import { Check, Copy, Home, PackageSearch } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { SuccessConfetti } from "./SuccessConfetti";

interface OrderSuccessModalProps {
  orderId: string;
  title: string;
  message: string;
  orderIdLabel: string;
  totalLabel: string;
  totalValue: string;
  checkOrderLabel: string;
  backToHomeLabel: string;
  /** Contains "{seconds}", replaced with the live countdown. */
  redirectingLabel: string;
  onCheckOrder: () => void;
  /** Also fired automatically when the countdown runs out. */
  onBackHome: () => void;
  autoRedirectSeconds?: number;
}

export function OrderSuccessModal({
  orderId,
  title,
  message,
  orderIdLabel,
  totalLabel,
  totalValue,
  checkOrderLabel,
  backToHomeLabel,
  redirectingLabel,
  onCheckOrder,
  onBackHome,
  autoRedirectSeconds = 5,
}: OrderSuccessModalProps) {
  const [copied, setCopied] = useState(false);
  const [remaining, setRemaining] = useState(autoRedirectSeconds);

  // Ref so a parent re-render (new callback identity) doesn't restart the tick.
  const onBackHomeRef = useRef(onBackHome);
  useEffect(() => {
    onBackHomeRef.current = onBackHome;
  });

  useEffect(() => {
    if (remaining <= 0) {
      onBackHomeRef.current();
      return;
    }
    const tick = setTimeout(() => setRemaining((s) => s - 1), 1000);
    return () => clearTimeout(tick);
  }, [remaining]);

  const copyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard blocked — the id is still visible to copy by hand
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-success-title"
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black/50 px-4 backdrop-blur-sm"
    >
      <SuccessConfetti />

      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="relative z-10 w-full max-w-md rounded-(--radius-2xl) bg-(--color-surface) p-8 text-center shadow-2xl"
      >
        <motion.span
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 14, delay: 0.15 }}
          className="mx-auto flex size-20 items-center justify-center rounded-full bg-(--color-success) text-white"
          style={{ boxShadow: "0 0 0 10px rgb(22 163 74 / 0.15), 0 12px 30px -8px rgb(22 163 74 / 0.6)" }}
        >
          <Check size={40} strokeWidth={3} />
        </motion.span>

        <h2
          id="order-success-title"
          className="mt-6 text-2xl font-extrabold text-(--color-dark)"
        >
          {title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-(--color-text-muted)">{message}</p>

        <div className="mt-5 overflow-hidden rounded-(--radius-md) border border-(--color-border) text-sm">
          <div className="flex items-center justify-between gap-3 bg-(--color-primary-faint) px-4 py-3">
            <span className="text-(--color-text-muted)">{orderIdLabel}</span>
            <button
              type="button"
              onClick={copyOrderId}
              className="inline-flex items-center gap-1.5 font-mono text-base font-bold tracking-wide text-(--color-primary)"
              aria-label={`${orderIdLabel}: ${orderId}`}
            >
              {orderId}
              {copied ? (
                <Check size={15} className="text-(--color-success)" />
              ) : (
                <Copy size={14} className="opacity-60" />
              )}
            </button>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-(--color-text-muted)">{totalLabel}</span>
            <span className="price text-lg">{totalValue}</span>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onCheckOrder}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-(--color-primary) text-sm font-semibold text-white shadow-lg shadow-(--color-primary)/30 transition-all hover:-translate-y-0.5 hover:bg-(--color-primary-dark)"
          >
            <PackageSearch size={17} />
            {checkOrderLabel}
          </button>
          <button
            type="button"
            onClick={onBackHome}
            className="relative flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-full border-2 border-(--color-border) text-sm font-semibold text-(--color-dark) transition-colors hover:border-(--color-primary) hover:text-(--color-primary)"
          >
            {/* Fills over the countdown so the auto-redirect is visible. */}
            <motion.span
              aria-hidden="true"
              className="absolute inset-y-0 start-0 bg-(--color-primary-faint)"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: autoRedirectSeconds, ease: "linear" }}
            />
            <span className="relative inline-flex items-center gap-2">
              <Home size={16} />
              {backToHomeLabel}
            </span>
          </button>
        </div>

        <p className="mt-3 text-xs text-(--color-text-light)" aria-live="polite">
          {redirectingLabel.replace("{seconds}", String(Math.max(remaining, 0)))}
        </p>
      </motion.div>
    </div>
  );
}
