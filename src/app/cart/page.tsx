import type { Metadata } from "next";
import { CartPage } from "@/components/cart/CartPage";

export const metadata: Metadata = {
  title: "Your Cart",
  description: "Review the items in your aquarium.lk cart and continue to secure checkout.",
};

export default function Page() {
  return <CartPage />;
}
