import type { Metadata } from "next";
import { ContactClient } from "@/components/contact/ContactClient";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with aquarium.lk — visit our Colombo store, call us or send a message about your aquarium.",
};

export default function ContactPage() {
  return <ContactClient />;
}
