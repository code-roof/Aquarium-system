"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface Props {
  count?: number;
  className?: string;
  density?: "soft" | "medium";
}

function seeded(index: number, salt: number) {
  const x = Math.sin(index * 999 + salt) * 10000;
  return x - Math.floor(x);
}

export function Bubbles({ count = 18, className, density = "soft" }: Props) {
  const bubbles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      left: seeded(i, 1) * 100,
      size: 4 + seeded(i, 2) * (density === "soft" ? 10 : 16),
      duration: 9 + seeded(i, 3) * 12,
      delay: seeded(i, 4) * 10,
      drift: (seeded(i, 5) - 0.5) * 60,
      opacity: 0.2 + seeded(i, 6) * 0.45,
    }));
  }, [count, density]);

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      {bubbles.map((b, i) => (
        <span
          key={i}
          className="absolute bottom-[-8%] rounded-full border border-white/50 bg-white/25 animate-bubble"
          style={{
            left: `${b.left}%`,
            width: b.size,
            height: b.size,
            opacity: b.opacity,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
            ["--drift" as string]: `${b.drift}px`,
          }}
        />
      ))}
    </div>
  );
}
