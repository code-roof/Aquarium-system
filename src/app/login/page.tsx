import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your aquarium.lk account to track orders and save favourites.",
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
