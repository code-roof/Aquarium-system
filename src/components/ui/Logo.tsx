import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  light?: boolean;
  compact?: boolean;
}

export function Logo({ className, light, compact }: Props) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "relative flex h-9 w-9 items-center justify-center rounded-full",
          light ? "bg-white/12 ring-1 ring-white/25" : "bg-ocean-600 shadow-glow"
        )}
      >
        <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden="true">
          <path
            d="M3 19c3.2 0 3.2-3 6.4-3s3.2 3 6.4 3 3.2-3 6.4-3 3.2 3 6.4 3"
            fill="none"
            stroke={light ? "#7DF3F5" : "#ffffff"}
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M3 24.5c3.2 0 3.2-3 6.4-3s3.2 3 6.4 3 3.2-3 6.4-3 3.2 3 6.4 3"
            fill="none"
            stroke={light ? "#ffffff" : "#7DF3F5"}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.75"
          />
          <path
            d="M11 9.5c2.6-3.4 7.6-4.4 11.4-1.6-1.6 1.1-2.5 2.4-2.7 4.1-3.4.4-6.5-.5-8.7-2.5Z"
            fill={light ? "#7DF3F5" : "#ffffff"}
          />
          <circle cx="19.4" cy="8.7" r="0.9" fill={light ? "#042035" : "#0B76D1"} />
        </svg>
      </span>
      {!compact && (
        <span className="flex min-w-0 flex-col leading-none">
          <span
            className={cn(
              "truncate text-[17px] font-bold tracking-[-0.02em]",
              light ? "text-white" : "text-navy-950"
            )}
          >
            aquarium<span className="text-aqua-500">.lk</span>
          </span>
          <span
            className={cn(
              "mt-0.5 truncate text-[9.5px] font-medium uppercase tracking-[0.22em]",
              light ? "text-white/55" : "text-slate-400"
            )}
          >
            Nature in Every Drop
          </span>
        </span>
      )}
    </span>
  );
}
