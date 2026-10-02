import { cn } from "@/lib/utils";

export function ProductSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("card-base overflow-hidden", className)}>
      <div className="skeleton aspect-[4/3] w-full" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-3 w-20 rounded-full" />
        <div className="skeleton h-4 w-3/4 rounded-full" />
        <div className="skeleton h-3 w-1/2 rounded-full" />
        <div className="flex items-center justify-between pt-2">
          <div className="skeleton h-5 w-24 rounded-full" />
          <div className="skeleton h-9 w-9 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
