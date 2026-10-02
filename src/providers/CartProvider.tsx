"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartItem, Product } from "@/types";
import { cartService } from "@/services/cartService";
import { useToast } from "./ToastProvider";

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  coupon: string | null;
  isOpen: boolean;
  lastAdded: string | null;
  add: (product: Product, quantity?: number) => void;
  remove: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  clear: () => void;
  applyCoupon: (code: string) => boolean;
  setOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "aquarium-lk-cart";

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const { push } = useToast();

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore corrupted storage */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage may be unavailable */
    }
  }, [items]);

  const add = useCallback(
    (product: Product, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.product.slug === product.slug);
        if (existing) {
          return prev.map((i) =>
            i.product.slug === product.slug
              ? { ...i, quantity: Math.min(i.quantity + quantity, Math.max(product.stock, 1)) }
              : i
          );
        }
        return [...prev, { product, quantity: Math.min(quantity, Math.max(product.stock, 1)) }];
      });
      setLastAdded(product.slug);
      push({ title: "Added to cart", description: product.name });
      setTimeout(() => setLastAdded((s) => (s === product.slug ? null : s)), 900);
    },
    [push]
  );

  const remove = useCallback(
    (slug: string) => {
      setItems((prev) => prev.filter((i) => i.product.slug !== slug));
      push({ title: "Removed from cart", variant: "info" });
    },
    [push]
  );

  const setQuantity = useCallback((slug: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.product.slug === slug
            ? { ...i, quantity: Math.max(1, Math.min(quantity, i.product.stock)) }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const applyCoupon = useCallback(
    (code: string) => {
      const ok = code.trim().toUpperCase() === "OCEAN10";
      setCoupon(ok ? code.trim().toUpperCase() : null);
      push(
        ok
          ? { title: "Coupon applied", description: "10% off your order" }
          : { title: "Invalid coupon", description: "Try OCEAN10", variant: "error" }
      );
      return ok;
    },
    [push]
  );

  const subtotal = useMemo(() => cartService.subtotal(items), [items]);
  const deliveryFee = useMemo(() => cartService.deliveryFee(subtotal), [subtotal]);
  const discount = useMemo(() => cartService.discount(subtotal, coupon ?? undefined), [subtotal, coupon]);
  const total = Math.max(0, subtotal + deliveryFee - discount);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  const value = useMemo(
    () => ({
      items,
      count,
      subtotal,
      deliveryFee,
      discount,
      total,
      coupon,
      isOpen,
      lastAdded,
      add,
      remove,
      setQuantity,
      clear,
      applyCoupon,
      setOpen: setIsOpen,
    }),
    [items, count, subtotal, deliveryFee, discount, total, coupon, isOpen, lastAdded, add, remove, setQuantity, clear, applyCoupon]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
