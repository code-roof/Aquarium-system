"use client";

import { useMemo } from "react";
import { Heart } from "lucide-react";
import { products } from "@/data/products";
import { useWishlist } from "@/providers/WishlistProvider";
import { ProductCard } from "@/components/product/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";

export default function WishlistPage() {
  const { items } = useWishlist();
  const saved = useMemo(
    () => products.filter((product) => items.includes(product.slug)),
    [items]
  );

  if (saved.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <p className="eyebrow">Saved items</p>
          <h1 className="mt-2 text-[30px] font-bold tracking-[-0.02em] text-navy-950">Wishlist</h1>
        </div>
        <EmptyState
          icon={<Heart size={30} />}
          title="Your wishlist is empty."
          description="Tap the heart on any product to save it here for later."
          actionLabel="Find something you love"
          actionHref="/shop"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="eyebrow">Saved items</p>
        <h1 className="mt-2 text-[30px] font-bold tracking-[-0.02em] text-navy-950">Wishlist</h1>
        <p className="mt-2 text-[15.5px] text-slate-500">
          {saved.length} saved product{saved.length === 1 ? "" : "s"} — tap the heart again to remove.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3">
        {saved.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
