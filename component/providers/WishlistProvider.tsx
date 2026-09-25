"use client";

import type { Product } from "@/app/data/products";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type WishlistItem = Omit<Product, "icon">;

interface WishlistContextValue {
  items: WishlistItem[];
  count: number;
  isWishlisted: (id: string) => boolean;
  toggleItem: (product: WishlistItem) => void;
  removeItem: (id: string) => void;
}

const STORAGE_KEY = "bongoocean-wishlist";

const WishlistContext = createContext<WishlistContextValue | undefined>(
  undefined,
);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Local-only for now — no backend wishlist yet, so persist to this browser.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      // ignore malformed/blocked storage
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore quota/blocked storage
    }
  }, [items, hydrated]);

  const isWishlisted = useCallback(
    (id: string) => items.some((item) => item.id === id),
    [items],
  );

  const toggleItem = useCallback((product: WishlistItem) => {
    setItems((prev) =>
      prev.some((item) => item.id === product.id)
        ? prev.filter((item) => item.id !== product.id)
        : [...prev, product],
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const count = useMemo(() => items.length, [items]);

  return (
    <WishlistContext.Provider
      value={{ items, count, isWishlisted, toggleItem, removeItem }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
