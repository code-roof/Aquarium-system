"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Check,
  Gift,
  ShoppingBag,
  Tag,
  Trash2,
  Truck,
} from "lucide-react";
import { useCart } from "@/providers/CartProvider";
import { getFeaturedProducts } from "@/data/products";
import { cn, formatPrice } from "@/lib/utils";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProductCard } from "@/components/product/ProductCard";

const FREE_DELIVERY_AT = 25000;

export function CartPage() {
  const {
    items,
    count,
    subtotal,
    deliveryFee,
    discount,
    total,
    coupon,
    setQuantity,
    remove,
    applyCoupon,
  } = useCart();
  const [code, setCode] = useState("");
  const suggestions = getFeaturedProducts().slice(0, 3);

  if (items.length === 0) {
    return (
      <div className="container-x pb-24 pt-[130px]">
        <h1 className="text-[34px] font-bold tracking-[-0.02em] text-navy-950">Your cart</h1>
        <div className="mt-10">
          <EmptyState
            icon={<ShoppingBag size={30} />}
            title="Your cart is empty."
            description="Browse fish, tanks and equipment to start building your underwater world."
            actionLabel="Start shopping"
            actionHref="/shop"
          />
        </div>
      </div>
    );
  }

  const remaining = Math.max(0, FREE_DELIVERY_AT - subtotal);
  const progress = Math.min(100, (subtotal / FREE_DELIVERY_AT) * 100);

  return (
    <div className="container-x pb-24 pt-[130px]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[34px] font-bold tracking-[-0.02em] text-navy-950">Your cart</h1>
          <p className="mt-1.5 text-[15px] text-slate-500">
            {count} item{count === 1 ? "" : "s"} ready for checkout
          </p>
        </div>
        <Link
          href="/shop"
          className="group inline-flex items-center gap-2 text-[15px] font-semibold text-ocean-700 hover:text-ocean-500"
        >
          Continue shopping
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="mt-9 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col gap-4">
          <div className="card-base p-5">
            <div className="flex items-center gap-3 text-[14.5px]">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ocean-50 text-ocean-600">
                <Truck size={17} />
              </span>
              <p className="text-slate-600">
                {remaining > 0 ? (
                  <>
                    Add <span className="font-semibold text-navy-950">{formatPrice(remaining)}</span>{" "}
                    more to unlock <span className="font-semibold text-ocean-700">free delivery</span>
                  </>
                ) : (
                  <>
                    You&apos;ve unlocked <span className="font-semibold text-ocean-700">free delivery</span>
                  </>
                )}
              </p>
            </div>
            <div className="mt-3.5 h-2 overflow-hidden rounded-full bg-slate-100">
              <motion.div
                className={cn("h-full rounded-full", remaining > 0 ? "bg-ocean-500" : "bg-emerald-400")}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>

          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.article
                key={item.product.slug}
                layout
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -24, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="card-base flex flex-col gap-4 p-5 sm:flex-row sm:items-center"
              >
                <Link
                  href={`/product/${item.product.slug}`}
                  className="relative h-24 w-full shrink-0 overflow-hidden rounded-2xl bg-mist sm:h-20 sm:w-24"
                >
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </Link>

                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-medium uppercase tracking-[0.1em] text-ocean-600/80">
                    {item.product.type}
                  </p>
                  <Link
                    href={`/product/${item.product.slug}`}
                    className="truncate text-[16px] font-semibold text-navy-950 hover:text-ocean-700"
                  >
                    {item.product.name}
                  </Link>
                  <p className="mt-1 text-[13.5px] text-slate-400">{item.product.stockLabel}</p>
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <QuantityStepper
                    size="sm"
                    value={item.quantity}
                    onChange={(value) => setQuantity(item.product.slug, value)}
                    max={item.product.stock}
                    ariaLabel={`Quantity of ${item.product.name}`}
                  />
                  <span className="w-24 text-right text-[16px] font-bold text-navy-950">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                  <button
                    type="button"
                    onClick={() => remove(item.product.slug)}
                    aria-label={`Remove ${item.product.name} from cart`}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-rose-50 hover:text-rose-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>

          <section className="mt-6">
            <h2 className="text-[17px] font-bold text-navy-950">Add before you go</h2>
            <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3">
              {suggestions.map((product) => (
                <ProductCard key={product.id} product={product} compact />
              ))}
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="card-base p-6">
            <h2 className="text-[17px] font-bold text-navy-950">Order summary</h2>

            <div className="mt-5 flex gap-2">
              <div className="relative flex-1">
                <Tag
                  size={15}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Coupon code"
                  aria-label="Coupon code"
                  className="field !py-2.5 !pl-9 !text-[14.5px] uppercase"
                />
              </div>
              <button type="button" onClick={() => applyCoupon(code)} className="btn-primary !px-5 !py-2.5 !text-[14px]">
                Apply
              </button>
            </div>
            {coupon && (
              <p className="mt-2.5 flex items-center gap-1.5 text-[13.5px] font-medium text-emerald-600">
                <Check size={14} /> {coupon} applied — 10% off
              </p>
            )}
            {!coupon && (
              <p className="mt-2.5 text-[13px] text-slate-400">
                Hint: try <span className="font-semibold text-ocean-600">OCEAN10</span>
              </p>
            )}

            <dl className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 text-[15px]">
              <div className="flex justify-between">
                <dt className="text-slate-500">Subtotal</dt>
                <dd className="font-semibold text-navy-950">{formatPrice(subtotal)}</dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <dt className="flex items-center gap-1.5">
                    <Gift size={14} /> Discount
                  </dt>
                  <dd className="font-semibold">−{formatPrice(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-slate-500">Delivery</dt>
                <dd className="font-semibold text-navy-950">
                  {deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}
                </dd>
              </div>
              <div className="mt-1 flex items-baseline justify-between border-t border-slate-100 pt-4">
                <dt className="text-[16px] font-semibold text-navy-950">Total</dt>
                <dd className="text-[24px] font-bold text-navy-950">{formatPrice(total)}</dd>
              </div>
            </dl>

            <Link href="/checkout" className="btn-primary mt-6 w-full">
              Proceed to checkout <ArrowRight size={17} />
            </Link>
            <p className="mt-4 text-center text-[13px] text-slate-400">
              Secure demo checkout — no real payment is taken.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
