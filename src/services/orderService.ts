import { demoOrders } from "@/data/orders";
import type { Order } from "@/types";

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

/** Mock order service — replace with Laravel /api/orders when ready. */
export const orderService = {
  async list(): Promise<Order[]> {
    await delay(220);
    return demoOrders;
  },

  async byId(id: string): Promise<Order | undefined> {
    await delay(180);
    return demoOrders.find((o) => o.id.toLowerCase() === id.toLowerCase());
  },

  async create(payload: { items: unknown[]; total: number }) {
    await delay(900);
    const nextNumber = 125 + demoOrders.length;
    return {
      id: `ORD-00${nextNumber}`,
      total: payload.total,
      status: "placed" as const,
      estimate: "We will notify you once it ships",
    };
  },
};
