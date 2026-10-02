import type { Metadata } from "next";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your aquarium.lk order with delivery and payment details.",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
