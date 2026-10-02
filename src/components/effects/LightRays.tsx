import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  variant?: "hero" | "subtle";
}

export function LightRays({ className, variant = "hero" }: Props) {
  const rays =
    variant === "hero"
      ? [
          { left: "8%", width: 180, delay: "0s", duration: "9s", opacity: 0.35 },
          { left: "30%", width: 120, delay: "2.4s", duration: "11s", opacity: 0.25 },
          { left: "58%", width: 220, delay: "1.2s", duration: "13s", opacity: 0.3 },
          { left: "80%", width: 140, delay: "3.6s", duration: "10s", opacity: 0.22 },
        ]
      : [
          { left: "12%", width: 140, delay: "0.5s", duration: "12s", opacity: 0.16 },
          { left: "62%", width: 180, delay: "2s", duration: "14s", opacity: 0.14 },
        ];

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      {rays.map((r, i) => (
        <span
          key={i}
          className="absolute -top-[25%] h-[150%] animate-ray bg-gradient-to-b from-white/70 via-white/25 to-transparent blur-[26px]"
          style={{
            left: r.left,
            width: r.width,
            opacity: r.opacity,
            transform: "skewX(-14deg)",
            animationDelay: r.delay,
            animationDuration: r.duration,
          }}
        />
      ))}
    </div>
  );
}
