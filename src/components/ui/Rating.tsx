import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  rating: number;
  reviews?: number;
  size?: number;
  className?: string;
  showValue?: boolean;
}

export function Rating({ rating, reviews, size = 14, className, showValue }: Props) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5" aria-label={`Rated ${rating} out of 5`}>
        {Array.from({ length: 5 }).map((_, i) => {
          if (i < full) return <Star key={i} size={size} className="fill-amber-400 text-amber-400" />;
          if (i === full && hasHalf)
            return <StarHalf key={i} size={size} className="fill-amber-400 text-amber-400" />;
          return <Star key={i} size={size} className="text-slate-200" />;
        })}
      </div>
      {showValue && <span className="text-[13px] font-semibold text-ink">{rating.toFixed(1)}</span>}
      {typeof reviews === "number" && (
        <span className="text-[13px] text-slate-400">({reviews})</span>
      )}
    </div>
  );
}
