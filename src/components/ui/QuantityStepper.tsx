"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  className?: string;
  ariaLabel?: string;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
  className,
  ariaLabel = "Quantity",
}: Props) {
  const btn =
    "flex items-center justify-center text-slate-500 transition hover:text-ocean-600 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white",
        size === "md" ? "px-2 py-2" : "px-1.5 py-1.5",
        className
      )}
      role="group"
      aria-label={ariaLabel}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className={cn(btn, size === "md" ? "h-8 w-8" : "h-7 w-7")}
      >
        <Minus size={15} />
      </button>
      <span
        className={cn(
          "min-w-[26px] text-center font-semibold text-navy-950",
          size === "md" ? "text-[15px]" : "text-[14px]"
        )}
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className={cn(btn, size === "md" ? "h-8 w-8" : "h-7 w-7")}
      >
        <Plus size={15} />
      </button>
    </div>
  );
}
