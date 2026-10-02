"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Check, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { authService } from "@/services/authService";
import { useToast } from "@/providers/ToastProvider";
import { Logo } from "@/components/ui/Logo";
import { Bubbles } from "@/components/effects/Bubbles";

const USER_KEY = "aquarium-lk-user";

interface Props {
  mode: "login" | "register";
}

export function AuthForm({ mode }: Props) {
  const router = useRouter();
  const { push } = useToast();
  const isLogin = mode === "login";

  const [name, setName] = useState("");
  const [email, setEmail] = useState(isLogin ? "sanduni@example.lk" : "");
  const [password, setPassword] = useState(isLogin ? "demo1234" : "");
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string | undefined> = {};

    if (!isLogin && name.trim().length < 3) next.name = "Enter your full name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email address";
    if (password.length < 6) next.password = "Password must be at least 6 characters";
    if (!isLogin && !agree) next.agree = "Please accept the terms to continue";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    try {
      const result = isLogin ? await authService.signIn() : await authService.register(name);
      const user = isLogin ? result.user : { ...result.user, name, email };
      window.localStorage.setItem(USER_KEY, JSON.stringify(user));
      push({
        title: isLogin ? "Welcome back" : "Account created",
        description: user.name,
      });
      router.push("/account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-navy-950 lg:block">
        <Image
          src="/images/banners/underwater-light-rays-16746856.jpg"
          alt="Sun rays through deep blue water"
          fill
          sizes="50vw"
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950/85 via-navy-950/55 to-ocean-900/70" />
        <Bubbles count={18} density="medium" />
        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <Link href="/" aria-label="aquarium.lk home">
            <Logo light />
          </Link>
          <div className="flex flex-col gap-6">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-md text-[40px] font-bold leading-[1.1] tracking-[-0.02em] text-white"
            >
              Nature in Every Drop.
            </motion.h2>
            <p className="max-w-md text-[16px] leading-relaxed text-white/60">
              Save your favourite tanks, track island-wide deliveries and reorder healthy fish in a
              couple of taps.
            </p>
            <ul className="flex flex-col gap-2.5 text-[15px] text-white/70">
              {["Order tracking & history", "Wishlist across devices", "Early access to new livestock"].map(
                (line) => (
                  <li key={line} className="flex items-center gap-2.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-aqua-500/20 text-aqua-400">
                      <Check size={12} />
                    </span>
                    {line}
                  </li>
                )
              )}
            </ul>
          </div>
          <p className="text-[13.5px] text-white/40">
            Prototype — sign-in is simulated and no data is sent anywhere.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-5 py-14 sm:px-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden">
            <Link href="/" aria-label="aquarium.lk home">
              <Logo />
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8"
          >
            <p className="eyebrow">{isLogin ? "Welcome back" : "Join aquarium.lk"}</p>
            <h1 className="mt-2.5 text-[32px] font-bold tracking-[-0.02em] text-navy-950">
              {isLogin ? "Sign in to your account" : "Create your account"}
            </h1>
            <p className="mt-2 text-[15px] text-slate-500">
              {isLogin ? "New here? " : "Already have an account? "}
              <Link
                href={isLogin ? "/register" : "/login"}
                className="font-semibold text-ocean-700 hover:underline"
              >
                {isLogin ? "Create an account" : "Sign in"}
              </Link>
            </p>

            <form onSubmit={submit} className="mt-8 flex flex-col gap-4" noValidate>
              {!isLogin && (
                <Field label="Full name" error={errors.name}>
                  <span className="relative">
                    <User size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      className="field !pl-11"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Sanduni Jayasuriya"
                      autoComplete="name"
                    />
                  </span>
                </Field>
              )}

              <Field label="Email address" error={errors.email}>
                <span className="relative">
                  <Mail size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    className="field !pl-11"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </span>
              </Field>

              <Field label="Password" error={errors.password}>
                <span className="relative">
                  <Lock size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    className="field !pl-11 !pr-11"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    autoComplete={isLogin ? "current-password" : "new-password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-ocean-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </span>
              </Field>

              {isLogin ? (
                <div className="flex items-center justify-between text-[14px]">
                  <label className="flex cursor-pointer items-center gap-2.5 text-slate-500">
                    <input type="checkbox" defaultChecked className="h-4 w-4 rounded accent-ocean-600" />
                    Remember me
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      push({ title: "Password reset", description: "Demo — check your inbox", variant: "info" })
                    }
                    className="font-semibold text-ocean-700 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              ) : (
                <div>
                  <label className="flex cursor-pointer items-start gap-2.5 text-[14px] text-slate-500">
                    <input
                      type="checkbox"
                      checked={agree}
                      onChange={(e) => {
                        setAgree(e.target.checked);
                        setErrors((prev) => ({ ...prev, agree: undefined }));
                      }}
                      className="mt-0.5 h-4 w-4 rounded accent-ocean-600"
                    />
                    <span>
                      I agree to the Terms &amp; Conditions and Privacy Policy of this demo store.
                    </span>
                  </label>
                  {errors.agree && <p className="mt-1.5 text-[13px] text-rose-500">{errors.agree}</p>}
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary mt-2 w-full">
                {loading ? (
                  "Please wait…"
                ) : (
                  <>
                    {isLogin ? "Sign in" : "Create account"} <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-[13.5px] text-slate-400">
              Demo credentials are pre-filled — just press {isLogin ? "Sign in" : "Create account"}.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13.5px] font-semibold text-slate-500">{label}</span>
      {children}
      {error && <span className="text-[13px] font-medium text-rose-500">{error}</span>}
    </label>
  );
}
