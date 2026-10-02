import type { OrderStatus } from "@/types";

const labels: Record<OrderStatus, { label: string; className: string }> = {
  placed: { label: "Order placed", className: "bg-slate-100 text-slate-600" },
  confirmed: { label: "Confirmed", className: "bg-ocean-50 text-ocean-700" },
  processing: { label: "Processing", className: "bg-ocean-50 text-ocean-700" },
  packed: { label: "Packed", className: "bg-indigo-50 text-indigo-600" },
  shipped: { label: "On the way", className: "bg-amber-50 text-amber-600" },
  delivered: { label: "Delivered", className: "bg-emerald-50 text-emerald-600" },
};

export function statusLabel(status: OrderStatus) {
  return labels[status] ?? labels.placed;
}
