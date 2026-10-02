"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useToast } from "./ToastProvider";

interface WishlistContextValue {
  items: string[];
  has: (slug: string) => boolean;
  toggle: (slug: string, name: string) => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);
const STORAGE_KEY = "aquarium-lk-wishlist";

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<string[]>([]);
  const { push } = useToast();

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const toggle = useCallback(
    (slug: string, name: string) => {
      setItems((prev) => {
        const exists = prev.includes(slug);
        push({
          title: exists ? "Removed from wishlist" : "Saved to wishlist",
          description: name,
          variant: "info",
        });
        return exists ? prev.filter((s) => s !== slug) : [...prev, slug];
      });
    },
    [push]
  );

  const has = useCallback((slug: string) => items.includes(slug), [items]);
  const value = useMemo(() => ({ items, has, toggle }), [items, has, toggle]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}
