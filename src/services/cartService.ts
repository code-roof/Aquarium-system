import type { CartItem, Product } from "@/types";

/**
 * Cart service boundary. Today it only validates data before it reaches the
 * React cart store; later it will persist to the Laravel cart endpoint.
 */

export const cartService = {
  lineTotal(item: CartItem) {
    return item.product.price * item.quantity;
  },

  subtotal(items: CartItem[]) {
    return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  },

  deliveryFee(subtotal: number) {
    if (subtotal === 0) return 0;
    return subtotal >= 25000 ? 0 : 750;
  },

  discount(subtotal: number, coupon?: string) {
    if (!coupon) return 0;
    if (coupon.trim().toUpperCase() === "OCEAN10") return Math.round(subtotal * 0.1);
    return 0;
  },

  total(items: CartItem[], coupon?: string) {
    const sub = this.subtotal(items);
    return sub + this.deliveryFee(sub) - this.discount(sub, coupon);
  },

  canAdd(current: number, incoming: number, product: Product) {
    return current + incoming <= Math.max(product.stock, 0);
  },
};
