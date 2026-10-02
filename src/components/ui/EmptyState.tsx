import Link from "next/link";
import { cn } from "@/lib/utils";
import { Waves } from "lucide-react";

interface Props {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
  dark?: boolean;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
  dark,
}: Props) {
  const body = (
    <div
      className={cn(
        "flex flex-col items-center gap-4 rounded-3xl border border-dashed px-6 py-14 text-center",
        dark ? "border-white/20 bg-white/5" : "border-ocean-100 bg-mist",
        className
      )}
    >
      <span
        className={cn(
          "relative flex h-20 w-20 items-center justify-center rounded-full",
          dark ? "bg-white/10 text-aqua-400" : "bg-white text-ocean-500 shadow-card"
        )}
      >
        <span className="absolute inset-0 animate-pulseRing rounded-full bg-ocean-300/30" />
        {icon ?? <Waves size={30} />}
      </span>
      <div className="max-w-sm">
        <h3 className={cn("text-xl font-bold", dark ? "text-white" : "text-navy-950")}>{title}</h3>
        <p className={cn("mt-2 text-[15px] leading-relaxed", dark ? "text-white/60" : "text-slate-500")}>
          {description}
        </p>
      </div>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn-primary mt-1">
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && !actionHref && (
        <button onClick={onAction} className="btn-primary mt-1">
          {actionLabel}
        </button>
      )}
    </div>
  );
  return body;
}
