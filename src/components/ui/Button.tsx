"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "outline" | "ghost" | "dark" | "aqua";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-ocean-600 text-white shadow-glow hover:bg-ocean-500 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-14px_rgba(30,144,240,0.6)]",
  outline:
    "border border-ocean-200 bg-white text-ocean-700 hover:border-ocean-400 hover:bg-ocean-50 hover:-translate-y-0.5",
  ghost: "bg-transparent text-ocean-700 hover:bg-ocean-50",
  dark: "bg-navy-900 text-white hover:bg-navy-800 hover:-translate-y-0.5",
  aqua: "bg-aqua-500 text-navy-950 hover:bg-aqua-400 hover:-translate-y-0.5 shadow-aquaGlow",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2.5 text-[13px] gap-1.5",
  md: "px-6 py-3 text-[15px] gap-2",
  lg: "px-8 py-4 text-[15px] gap-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", loading, children, disabled, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-300 ease-smooth focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean-500 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
});
