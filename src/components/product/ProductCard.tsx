"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Check, Plus } from "lucide-react";
import type { Product } from "@/types";
import { cn, discountPercent, formatPrice } from "@/lib/utils";
import { useCart } from "@/providers/CartProvider";
import { useWishlist } from "@/providers/WishlistProvider";
import { Rating } from "@/components/ui/Rating";

interface Props {
  product: Product;
  className?: string;
  priority?: boolean;
  compact?: boolean;
}

export function ProductCard({ product, className, priority, compact }: Props) {
  const { add, lastAdded } = useCart();
  const { has, toggle } = useWishlist();
  const [state, setState] = useState<"idle" | "loading" | "success">("idle");
  const [fly, setFly] = useState<{ from: DOMRect; to: DOMRect } | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const wished = has(product.slug);
  const saved = discountPercent(product.price, product.oldPrice);

  const handleAdd = () => {
    if (state !== "idle") return;
    setState("loading");

    const img = cardRef.current?.querySelector("img");
    const target = document.getElementById("cart-indicator");
    if (img && target) setFly({ from: img.getBoundingClientRect(), to: target.getBoundingClientRect() });

    window.setTimeout(() => {
      add(product, 1);
      setState("success");
      window.setTimeout(() => setState("idle"), 1100);
    }, 320);
  };

  return (
    <div ref={cardRef} className={cn("group relative", className)}>
      <AnimatePresence>
        {fly && (
          <motion.span
            key="fly"
            initial={{ x: fly.from.left, y: fly.from.top, opacity: 1, scale: 1 }}
            animate={{
              x: fly.to.left + fly.to.width / 2 - fly.from.width / 2,
              y: fly.to.top + fly.to.height / 2 - fly.from.height / 2,
              opacity: 0.25,
              scale: 0.28,
            }}
            transition={{ duration: 0.65, ease: [0.32, 0.72, 0, 1] }}
            onAnimationComplete={() => setFly(null)}
            className="pointer-events-none fixed left-0 top-0 z-[80] hidden h-24 w-24 overflow-hidden rounded-2xl shadow-lift sm:block"
            style={{ width: fly.from.width, height: fly.from.height }}
          >
            <Image src={product.image} alt="" fill sizes="96px" className="object-cover" />
          </motion.span>
        )}
      </AnimatePresence>

      <Link
        href={`/product/${product.slug}`}
        className="block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ocean-500"
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-100 bg-mist shadow-card transition-all duration-500 ease-smooth group-hover:-translate-y-1.5 group-hover:shadow-lift">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-[900ms] ease-smooth group-hover:scale-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/35 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.isLiveFish && (
              <span className="rounded-full bg-aqua-500/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-navy-950 shadow-sm">
                Live Fish
              </span>
            )}
            {product.badge && (
              <span
                className={cn(
                  "w-fit rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] shadow-sm",
                  product.badge === "Sale"
                    ? "bg-rose-500 text-white"
                    : "bg-navy-900/90 text-white"
                )}
              >
                {product.badge}
              </span>
            )}
            {saved && (
              <span className="w-fit rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-ocean-700 shadow-sm">
                -{saved}%
              </span>
            )}
          </div>
        </div>
      </Link>

      <button
        type="button"
        aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        aria-pressed={wished}
        onClick={() => toggle(product.slug, product.name)}
        className={cn(
          "absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/85 shadow-sm backdrop-blur transition-all duration-300 hover:scale-110 focus-visible:outline-2 focus-visible:outline-ocean-500",
          wished
            ? "scale-110 border-rose-200 bg-rose-50 opacity-100"
            : "translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100 md:opacity-0 sm:opacity-100"
        )}
      >
        <Heart size={16} className={cn(wished ? "fill-rose-500 text-rose-500" : "text-slate-500")} />
      </button>

      <div className="mt-4 flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[12px] font-medium uppercase tracking-[0.1em] text-ocean-600/80">
              {product.type}
            </p>
            <h3 className="truncate text-[15px] font-semibold text-navy-950 transition-colors group-hover:text-ocean-700">
              {product.name}
            </h3>
          </div>
          {!compact && (
            <span
              className={cn(
                "mt-0.5 h-2 w-2 shrink-0 rounded-full",
                product.stockState === "in-stock"
                  ? "bg-emerald-400"
                  : product.stockState === "low-stock"
                    ? "bg-amber-400"
                    : "bg-slate-300"
              )}
              title={product.stockLabel}
            />
          )}
        </div>

        <div className="flex flex-col items-start gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
          <div className="flex min-w-0 items-baseline gap-2">
            <span className="text-[16px] font-bold text-navy-950">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="text-[13px] text-slate-400 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
          <Rating rating={product.rating} reviews={product.reviews} size={13} className="shrink-0" />
        </div>

        <div className="mt-1.5 flex items-center justify-between gap-3">
          <span
            className={cn(
              "text-[12px] font-medium",
              product.stockState === "unavailable" ? "text-slate-400" : "text-emerald-600"
            )}
          >
            {product.stockLabel}
          </span>
          <button
            type="button"
            onClick={handleAdd}
            disabled={state === "loading" || product.stockState === "unavailable"}
            aria-label={`Add ${product.name} to cart`}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean-500 disabled:cursor-not-allowed",
              state === "success"
                ? "bg-emerald-500 text-white"
                : "bg-ocean-600 text-white hover:-translate-y-0.5 hover:bg-ocean-500 hover:shadow-glow disabled:bg-slate-300"
            )}
          >
            {state === "success" ? (
              <>
                <Check size={14} /> Added
              </>
            ) : state === "loading" ? (
              <>
                <Plus size={14} className="animate-spin" /> Adding
              </>
            ) : (
              <>
                <ShoppingBag size={14} /> Add
              </>
            )}
          </button>
        </div>
      </div>

      <span
        className={cn(
          "pointer-events-none absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-ocean-500 transition-opacity",
          lastAdded === product.slug ? "animate-pulseRing opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
}
