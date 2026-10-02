import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a free aquarium.lk account to shop fish, tanks and equipment.",
};

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}
