import type { Metadata } from "next";
import { ShopClient } from "@/components/shop/ShopClient";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse live fish, aquarium tanks, plants, food, filters and accessories from aquarium.lk.",
};

export default function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string; sort?: string };
}) {
  return (
    <ShopClient
      initialCategory={searchParams.category ?? "all"}
      initialSearch={searchParams.search ?? ""}
      initialSort={searchParams.sort ?? "featured"}
    />
  );
}
