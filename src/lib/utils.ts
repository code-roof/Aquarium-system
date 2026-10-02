export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(value: number) {
  return `LKR ${value.toLocaleString("en-LK")}`;
}

export function priceRangeLabel(min: number, max: number) {
  return `${formatPrice(min)} – ${formatPrice(max)}`;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function stockLabelFor(category: string, stock: number) {
  if (stock <= 0) return "Currently Unavailable";
  if (category === "fish") return `${stock} Available`;
  if (stock <= 5) return `Only ${stock} left`;
  return "In Stock";
}

export function stockStateFor(stock: number) {
  if (stock <= 0) return "unavailable" as const;
  if (stock <= 5) return "low-stock" as const;
  return "in-stock" as const;
}

export function discountPercent(price: number, oldPrice?: number) {
  if (!oldPrice || oldPrice <= price) return null;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

export function getOrderTimelineStep(status: string) {
  const steps = ["placed", "confirmed", "processing", "packed", "shipped", "delivered"];
  const idx = steps.indexOf(status);
  return idx === -1 ? 0 : idx;
}
